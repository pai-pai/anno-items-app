import axios from "axios";
import lodash from "lodash";
import { defineStore } from "pinia";
import { APIURL } from "../constants";

export const useShipsStore = defineStore("ships", {
    state: () => ({
        items: [],
        filters: {},
        orderBy: null,
        shipType: null,
    }),
    getters: {
        isFiltered(state) {
            return state.orderBy || state.shipType;
        },
        chunkedList(state) {
            return (itemsPerRow) => {
                let itemsList = lodash.cloneDeep(state.items);
                if (state.shipType) {
                    itemsList = lodash.filter(itemsList, function(o) {
                        return o.types.includes(state.shipType);
                    });
                }
                if (state.orderBy) {
                    itemsList = lodash.orderBy(itemsList, state.orderBy.field, state.orderBy.order);
                }
                const chunked = lodash.chunk(Object.values(itemsList), itemsPerRow);
                return chunked.map((el, index) => ({ id: `row-${index}`, rowData: el }) );
            }
        },
        activeShip(state) {
            return state.items.find(item => item.active);
        }
    },
    actions: {
        clearFilters() {
            this.$patch({
                orderBy: null,
                shipType: null,
            })
        },
        activateShip(ship) {
            if (ship === this.activeShip) {
                ship.active = false;
                return;
            }
            if (this.activeShip) {
                this.activeShip.active = false;
            }
            ship.active = true;
        },
        async fetchItems() {
            try {
                const { data } = await axios.get(`${APIURL}/api/ships`);
                this.items = data.objects;
                this.filters = data._filters;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
    },
})