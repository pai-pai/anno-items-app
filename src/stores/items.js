import axios from "axios";
import lodash from "lodash";
import { defineStore } from "pinia";
import { APIURL } from "../constants";

export const useItemsStore = defineStore("items", {
    state: () => ({
        rawItems: [],
        items: [],
        filters: {},
        orderBy: null,
        rarity: null,
        dlc: null,
        trait: null,
    }),
    getters: {
        chunkedList(state) {
            return (itemsPerRow) => {
                let itemsList = state.items;
                if (state.orderBy) {
                    itemsList = lodash.orderBy(itemsList, state.orderBy.field, state.orderBy.order);
                }
                if (state.rarity) {
                    itemsList = lodash.filter(itemsList, { "rarity": state.rarity.toLowerCase() });
                }
                if (state.dlc) {
                    itemsList = lodash.filter(itemsList, function(o) {
                        return lodash.indexOf(o.dlc, state.dlc) >= 0;
                    });
                }
                if (state.trait) {
                    itemsList = lodash.filter(itemsList, function(o) {
                        return lodash.indexOf(o.traits, state.trait) >= 0;
                    });
                }
                const chunked = lodash.chunk(Object.values(itemsList), itemsPerRow);
                return chunked.map((el, index) => ({ id: `row-${index}`, rowData: el }) );
            };   
        }
    },
    actions: {
        async fetchItems() {
            try {
                const { data } = await axios.get(`${APIURL}/api/items`);
                this.rawItems = data.objects;
                this.items = data.objects;
                this.filters = data._filters;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
    },
})