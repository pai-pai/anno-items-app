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
            return (itemsPerRow, filtered) => {
                let itemsList = lodash.cloneDeep(state.items);
                if (filtered) {
                    if (state.searchPhrase && state.searchPhrase.trim()) {
                        const phrase = state.searchPhrase.trim().toLowerCase();
                        itemsList.filter(item => item.name.toLowerCase().includes(phrase));
                    }
                    if (state.rarity) {
                        itemsList = itemsList.filter(item => item.rarity === state.rarity.toLowerCase());
                    }
                    if (state.dlc) {
                        itemsList = itemsList.filter(item => item.dlc.includes(state.dlc));
                    }
                    if (state.trait) {
                        itemsList = itemsList.filter(item => item.traits.includes(state.trait));
                    }
                    if (state.orderBy) {
                        itemsList = lodash.orderBy(itemsList, state.orderBy.field, state.orderBy.order);
                    }
                }
                const chunked = lodash.chunk(Object.values(itemsList), itemsPerRow);
                return chunked.map((el, index) => ({ id: `row-${index}`, rowData: el }) );
            }
        },
        itemById(state) {
            return (itemId) => {
                return state.items.find((item) => item._id == itemId);
            }
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