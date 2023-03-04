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
                getItems: computed(() => suppliesStore.getItems),
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
    <v-container class="d-flex justify-center align-center h-100" v-if="items.length === 0">
        <v-progress-circular bg-color="rgba(55, 162, 152, 0.2)" color="#37A298" indeterminate :size="50" />
    </v-container>

    <v-container v-else>
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

        <div class="supplies-container">
            <SupplyCard v-for="item in getItems" :item="item" />
        </div>
    </v-container>
</template>

<style scoped>
    .control-panel {
        margin-bottom: 1.25rem;
    }
    
    .clear-btn {
        font-size: 1rem;
        color: #968878;
        text-transform: none;
        letter-spacing: normal;
        width: 45%;
        border-color: #E4DAC8;
    }

    .supplies-container {
        display: grid;
        grid-gap: 1.25rem;
        grid-template-columns: repeat(4, 1fr);
        padding-bottom: 1.25rem;
    }

    @media only screen 
        and (min-device-width: 320px) 
        and (max-device-width: 480px)
        and (-webkit-min-device-pixel-ratio: 2) {
        .supplies-container {
            grid-template-columns: 1fr;
        }
    }

    @media only screen 
        and (min-device-width: 768px) 
        and (max-device-width: 1024px) 
        and (orientation: portrait) {
        .supplies-container {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media only screen 
        and (min-device-width: 768px) 
        and (max-device-width: 1024px) 
        and (orientation: landscape) {
        .supplies-container {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media screen and (min-width: 1904px) {
        .supplies-container {
            grid-template-columns: repeat(6, 1fr);
        }
    }
</style>