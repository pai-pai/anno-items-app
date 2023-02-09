import lodash from "lodash";
import { defineStore } from "pinia";
import { useItemsStore } from "../stores/items";
import { useShipsStore } from "../stores/ships";
import { useSuppliesStore } from "../stores/supplies";

export const useExpeditionStore = defineStore("expedition", {
    state: () => ({
        ship: undefined,
        rationBonus: false,
        moraleBonus: 0,
        traits: [],
    }),
    getters: {
        pickedItems(state) {
            const itemsStore = useItemsStore();
            const suppliesStore = useSuppliesStore();
            const items = itemsStore.items.filter(item => item.picked);
            const supplies = suppliesStore.items.filter(item => item.picked);
            return items.concat(supplies);
        },
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
    },
    actions: {
        pickShip(ship) {
            if (this.pickedItems.length > 0) {
                return;
            }
            const shipsStore = useShipsStore();
            shipsStore.activateShip(ship);
            this.ship = shipsStore.activeShip;
        },
        pickItem(item) {
            item.picked = true;
        },
        removeItem(item) {
            item.picked = false;
        },
        reset() {
            if (this.ship) {
                this.ship.active = false;
            }
            const pickedItems = this.pickedItems;
            pickedItems.forEach((item) => item.picked = false);
            this.$reset();
        }
    },
});