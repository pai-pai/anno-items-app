import lodash from "lodash";
import { defineStore } from "pinia";
import { useItemsStore } from "../stores/items";
import { useShipsStore } from "../stores/ships";
import { useSuppliesStore } from "../stores/supplies";

export const useExpeditionStore = defineStore("expedition", {
    state: () => ({
        ship: null,
        pickedItems: [],
        rationBonus: false,
        moraleBonus: 0,
        traits: [],
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
        }
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
        }
    },
});