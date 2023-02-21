import axios from "axios";
import lodash from "lodash";
import { defineStore } from "pinia";
import { APIURL } from "../constants";

export const useSuppliesStore = defineStore("supplies", {
    state: () => ({
        items: [],
        filters: {},
        orderBy: null,
        isRation: null,
        bonus: null,
        searchPhrase: null
    }),
    getters: {
        isFiltered(state) {
            return state.orderBy || state.isRation || state.bonus || state.searchPhrase;
        },
        getItems(state) {
            let itemsList = lodash.cloneDeep(state.items);
            if (state.searchPhrase && state.searchPhrase.trim()) {
                const phrase = state.searchPhrase.trim().toLowerCase();
                itemsList = lodash.filter(itemsList, function(o) {
                    return o.name.toLowerCase().includes(phrase);
                });
            }
            if (state.isRation !== null) {
                itemsList = lodash.filter(itemsList, { "extra_rations": state.isRation });
            }
            if (state.bonus) {
                itemsList = lodash.filter(itemsList, function(o) {
                    return o.bonuses[state.bonus] > 0;
                });
            }
            if (state.orderBy) {
                itemsList = lodash.orderBy(itemsList, state.orderBy.field, state.orderBy.order);
            }
            return itemsList;
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
                isRation: null,
                bonus: null,
                searchPhrase: null
            })
        },
        async fetchItems() {
            try {
                const { data } = await axios.get(`${APIURL}/api/supplies`);
                this.items = data.objects;
                this.filters = data._filters;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
    },
})