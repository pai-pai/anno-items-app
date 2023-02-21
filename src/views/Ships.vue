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
                getItems: computed(() => shipsStore.getItems),
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

        <div class="ships-container">
            <ShipCard v-for="item in getItems" :item="item" />
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

    .ships-container {
        display: grid;
        grid-gap: 1.25rem;
        grid-template-columns: repeat(4, 1fr);
        padding-bottom: 1.25rem;
    }

    @media only screen 
        and (min-device-width: 320px) 
        and (max-device-width: 480px)
        and (-webkit-min-device-pixel-ratio: 2) {
        .ships-container {
            grid-template-columns: 1fr;
        }
    }

    @media only screen 
        and (min-device-width: 768px) 
        and (max-device-width: 1024px) 
        and (orientation: portrait) {
        .ships-container {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media only screen 
        and (min-device-width: 768px) 
        and (max-device-width: 1024px) 
        and (orientation: landscape) {
        .ships-container {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media screen and (min-width: 1904px) {
        .ships-container {
            grid-template-columns: repeat(6, 1fr);
        }
    }
</style>