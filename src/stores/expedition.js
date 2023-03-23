import lodash from "lodash";
import { defineStore } from "pinia";
import { useItemsStore } from "../stores/items";
import { useSuppliesStore } from "../stores/supplies";

export const useExpeditionStore = defineStore("expedition", {
    state: () => ({
        ship: null,
        pickedItems: [],
        rationBonus: false,
        moraleBonus: 0,
        traits: [],
        searchItem: null,
        itemsBonusesFilter: [],
        searchSupply: null,
        suppliesBonusesFilter: [],
        suppliesRationFilter: false,
    }),
    getters: {
        expeditionBonuses(state) {
            const bonuses = {
                crafting: 0,
                diplomacy: 0,
                faith: 0,
                force: 0,
                hunting: 0,
                medicine: 0,
                naval_power: 0,
                navigation: 0,
            };
            let ration = false;
            let morale = 0;
            let traits = [];
            const pickedItems = this.pickedItems;
            pickedItems.forEach((item) => {
                Object.keys(bonuses).forEach(bonus => bonuses[bonus] += item.bonuses[bonus]);
                if (item.extra_rations) {
                    ration = true;
                }
                if (item.combined_morale_per_50t) {
                    morale += item.combined_morale_per_50t;
                }
                if (item.traits && item.traits.length > 0) {
                    traits = traits.concat(item.traits);
                }
            });
            state.rationBonus = ration;
            state.moraleBonus = morale;
            state.traits = lodash.uniq(traits);
            if (state.ship) {
                bonuses.naval_power += state.ship.bonuses.naval_power;
                bonuses.navigation += state.ship.bonuses.navigation;
            }
            return bonuses;
        },
        pickedShipItems(state) {
            if (!state.ship) return;
            if (state.pickedItems.length === 0) return [];
            return state.pickedItems.filter(item => {
                return item.equipped_in && state.ship.equipped_in.includes(item.equipped_in);
            });
        },
        getItems(state) {
            const itemsStore = useItemsStore();
            return (itemsPerRow) => {
                let itemsList = lodash.cloneDeep(itemsStore.items);
                if (state.searchItem && state.searchItem.trim()) {
                    const phrase = state.searchItem.trim().toLowerCase();
                    itemsList = itemsList.filter(item => item.name.toLowerCase().includes(phrase));
                }
                if (state.itemsBonusesFilter.length > 0) {
                    itemsList = itemsList.filter((item) => state.itemsBonusesFilter.every(
                        (bonus) => item.bonuses[bonus] > 0
                    ));
                    itemsList = lodash.orderBy(
                        itemsList,
                        state.itemsBonusesFilter.map(bonus => `bonuses.${bonus}`).concat("name"),
                        Array(state.itemsBonusesFilter.length).fill("desc").concat("asc")
                    );
                }
                const chunked = lodash.chunk(Object.values(itemsList), itemsPerRow);
                return chunked.map((el, index) => ({ id: `row-${index}`, rowData: el }) );
            }
        },
        getSupplies(state) {
            const suppliesStore = useSuppliesStore();
            let itemsList = lodash.cloneDeep(suppliesStore.items);
            if (state.suppliesRationFilter) {
                itemsList = itemsList.filter(item => item.extra_rations);
            }
            if (state.searchSupply && state.searchSupply.trim()) {
                const phrase = state.searchSupply.trim().toLowerCase();
                itemsList = itemsList.filter(item => item.name.toLowerCase().includes(phrase));
            }
            if (state.suppliesBonusesFilter.length > 0) {
                itemsList = itemsList.filter((item) => state.suppliesBonusesFilter.every(
                    (bonus) => item.bonuses[bonus] > 0
                ));
                itemsList = lodash.orderBy(
                    itemsList,
                    state.suppliesBonusesFilter.map(bonus => `bonuses.${bonus}`).concat("combined_morale_per_50t"),
                    Array(state.suppliesBonusesFilter.length).fill("desc").concat("desc")
                );
            }
            return itemsList;
        },
        itemsFiltered(state) {
            return state.searchItem || state.itemsBonusesFilter.length > 0;
        },
        suppliesFiltered(state) {
            return state.searchSupply || state.suppliesBonusesFilter.length > 0 || state.suppliesRationFilter;
        },
    },
    actions: {
        pickShip(ship) {
            if (this.pickedItems.length > 0) return;
            if (this.ship && this.ship._id == ship._id) {
                this.ship = null;
                return;
            }
            this.ship = ship;
        },
        pickItem(item) {
            if (this.pickedItems.length === this.ship.total_slots) return;
            const isNotShipItem = !this.ship.equipped_in.includes(item.equipped_in);
            const notShipItemsCount = this.pickedItems.length - this.pickedShipItems.length;
            if (isNotShipItem && notShipItemsCount === this.ship.cargo_slots) return;
            this.pickedItems.push(item);
        },
        removeItem(item, index) {
            this.pickedItems.splice(index, 1);
        },
        reset() {
            this.$reset();
        },
        changeItemsFilter(value) {
            const index = this.itemsBonusesFilter.indexOf(value);
            if (index > -1) {
                this.itemsBonusesFilter.splice(index, 1);
            }
        },
        changeSuppliesFilter(value) {
            const index = this.suppliesBonusesFilter.indexOf(value);
            if (index > -1) {
                this.suppliesBonusesFilter.splice(index, 1);
            }
        },
        clearFilters(itemType) {
            let filters = itemType === "item" ?
                { searchItem: null, itemsBonusesFilter: [] } :
                { searchSupply: null, suppliesBonusesFilter: [], suppliesRationFilter: false };
            this.$patch(filters);
        },
        clearSuppliesFilters() {
            this.$patch({
                searchSupply: null,
                suppliesBonusesFilter: [],
                suppliesRationFilter: false,
            })
        },
    },
});