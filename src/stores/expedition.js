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
            return itemsStore.items.filter(item => item.picked);
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
            let traits = [];
            const pickedItems = this.pickedItems;
            pickedItems.forEach((item) => {
                Object.keys(bonuses).forEach(bonus => bonuses[bonus] += item.bonuses[bonus]);
                if (item.traits.length > 0) {
                    traits = traits.concat(item.traits);
                }
            });
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
        }
    },
});