<script>
    import { computed, defineComponent, onBeforeMount } from "vue";
    import { storeToRefs } from "pinia";
    import { useSuppliesStore } from "../stores/supplies";
    import ClearableSelectInput from "../components/basic/ClearableSelectInput.vue";
    import SupplyCard from '../components/SupplyCard.vue';

    export default defineComponent({
        data: () => ({
            sortByOptions: [
                { title: "Name: A-Z", value: { field: ["name"], order: ["asc"] } },
                { title: "Name: Z-A", value: { field: ["name"], order: ["desc"] } },
                { title: "Morale: Low to high", value: { field: ["combined_morale_per_50t", "name"], order: ["asc", "asc"] } },
                { title: "Morale: High to low", value: { field: ["combined_morale_per_50t", "name"], order: ["desc", "asc"] } },
            ],
            rationOptions: [
                { title: "Yes", value: true },
                { title: "No", value: false },
            ],
            bonusOptions: [
                { title: "Crafting", value: "crafting" },
                { title: "Diplomacy", value: "diplomacy" },
                { title: "Faith", value: "faith" },
                { title: "Force", value: "force" },
                { title: "Hunting", value: "hunting" },
                { title: "Medicine", value: "medicine" },
                { title: "Naval Power", value: "naval_power" },
                { title: "Navigation", value: "navigation" },
            ],
            supplies: [],
            itemsPerRow: 4
        }),
        components: {
            ClearableSelectInput,
            SupplyCard
        },
        setup() {
            const suppliesStore = useSuppliesStore();
            const {
                items,
                filters,
                orderBy,
                isRation,
                bonus,
                searchPhrase,
            } = storeToRefs(suppliesStore);
            

            onBeforeMount(async () => {
                if (suppliesStore.items.length === 0) {
                    await suppliesStore.fetchItems();
                }
            });

            return {
                items,
                itemsByChunks: suppliesStore.chunkedList,
                filters,
                orderBy,
                isRation,
                bonus,
                searchPhrase,
                isFiltered: computed(() => suppliesStore.isFiltered),
                clear: computed(() => suppliesStore.clearFilters),
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
                    :options="rationOptions"
                    label="Ration"
                    v-model="isRation" />
            </v-col>
            <v-col cols="3" class="px-3 py-0">
                <ClearableSelectInput
                    :options="bonusOptions"
                    label="Expedition Bonus"
                    v-model="bonus" />
            </v-col>
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
                <SupplyCard :item="item" class="fill-height" />
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