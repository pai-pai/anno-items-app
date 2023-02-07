<script>
    import { computed, defineComponent, onBeforeMount } from "vue";
    import { storeToRefs } from "pinia";
    import { useShipsStore } from "../stores/ships";
    import ClearableSelectInput from "../components/basic/ClearableSelectInput.vue";
    import ShipCard from '../components/ShipCard.vue';

    export default defineComponent({
        data: () => ({
            sortByOptions: [
                { title: "Name: A-Z", value: { field: ["name"], order: ["asc"] } },
                { title: "Name: Z-A", value: { field: ["name"], order: ["desc"] } },
                { title: "Number of slots: Low to high", value: { field: ["total_slots", "name"], order: ["asc", "asc"] } },
                { title: "Number of slots: High to low", value: { field: ["total_slots", "name"], order: ["desc", "asc"] } },
            ],
            items: [],
            itemsPerRow: 4
        }),
        components: {
            ClearableSelectInput,
            ShipCard
        },
        setup() {
            const shipsStore = useShipsStore();
            const {
                items,
                filters,
                orderBy,
                shipType,
            } = storeToRefs(shipsStore);
            

            onBeforeMount(async () => {
                if (shipsStore.items.length === 0) {
                    await shipsStore.fetchItems();
                }
            });

            return {
                items,
                itemsByChunks: shipsStore.chunkedList,
                filters,
                orderBy,
                shipType,
                isFiltered: computed(() => shipsStore.isFiltered),
                clear: computed(() => shipsStore.clearFilters),
            }
        }
    })
</script>

<template>
    <v-progress-circular v-if="items.length === 0" indeterminate :size="50" />

    <v-container v-else class="px-0">
        <v-row justify="start" class="control-panel mt-5">
            <v-col cols="3" class="px-3 py-0">
                <v-select
                    :items="sortByOptions"
                    clearable
                    clear-icon="close"
                    variant="underlined"
                    density="compact"
                    label="Sort by"
                    item-value="value"
                    class="order-field"
                    v-model="orderBy" />
            </v-col>
            <v-col cols="3" class="px-3 py-0">
                <ClearableSelectInput
                    :options="filters.types"
                    label="Type"
                    v-model="shipType" />
            </v-col>
            <v-spacer />
            <v-col cols="3" class="px-3 pt-2 pb-0 justify-end d-flex">
                <v-btn
                    v-if="isFiltered"
                    variant="outlined"
                    class="clear-btn"
                    @click="clear"
                >Clear all</v-btn>
            </v-col>
        </v-row>

        <v-row justify="start" v-for="itemsForRow in itemsByChunks(itemsPerRow)">
            <v-col cols="3" class="pa-2" align-self="stretch" v-for="item in itemsForRow.rowData">
                <ShipCard :item="item" class="fill-height" />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
    .clear-btn {
        font-size: 1rem;
        color: #968878;
        text-transform: none;
        letter-spacing: normal;
        width: 45%;
        border-color: #E4DAC8;
    }
</style>