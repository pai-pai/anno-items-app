import axios from "axios";
import lodash from "lodash";
import { defineStore } from "pinia";
import { APIURL } from "../constants";

export const useItemsStore = defineStore("items", {
    state: () => ({
        items: [],
        filters: {},
        orderBy: null,
        rarity: null,
        dlc: null,
        trait: null,
        searchPhrase: null
    }),
    getters: {
        isFiltered(state) {
            return state.orderBy || state.rarity || state.dlc || state.trait || state.searchPhrase;
        },
        chunkedList(state) {
            return (itemsPerRow) => {
                let itemsList = lodash.cloneDeep(state.items);
                if (state.searchPhrase && state.searchPhrase.trim()) {
                    const phrase = state.searchPhrase.trim().toLowerCase();
                    itemsList = lodash.filter(itemsList, function(o) {
                        return o.name.toLowerCase().includes(phrase);
                    });
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
                if (state.orderBy) {
                    itemsList = lodash.orderBy(itemsList, state.orderBy.field, state.orderBy.order);
                }
                const chunked = lodash.chunk(Object.values(itemsList), itemsPerRow);
                return chunked.map((el, index) => ({ id: `row-${index}`, rowData: el }) );
            };   
        }
    },
    actions: {
        clearFilters() {
            this.$patch({
                orderBy: null,
                rarity: null,
                dlc: null,
                trait: null,
                searchPhrase: null
            })
        },
        async fetchItems() {
            try {
                const { data } = await axios.get(`${APIURL}/api/items`);
                this.items = data.objects;
                this.filters = data._filters;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
    },
})