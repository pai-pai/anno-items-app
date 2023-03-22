<script>
    import { computed, defineComponent, onBeforeMount } from "vue";
    import { useDisplay } from "vuetify";
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
            showFilters: false,
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
            const { mdAndDown } = useDisplay();

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
                mdAndDown,
                isFiltered: computed(() => shipsStore.isFiltered),
                clear: computed(() => shipsStore.clearFilters),
            }
        }
    })
</script>

<template>
    <v-container class="d-flex justify-center align-center h-100" v-if="items.length === 0">
        <v-progress-circular bg-color="rgba(55, 162, 152, 0.2)" color="#37A298" indeterminate :size="50" />
    </v-container>

    <v-container class="h-100" v-else>
        <template v-if="mdAndDown">
            <v-navigation-drawer
                v-model="showFilters"
                color="#FFFEFB"
                temporary
            >
                <v-container class="filters-drawer">
                    <v-row>
                        <v-col cols="12" class="py-1">
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
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-1">
                            <ClearableSelectInput
                                :options="filters.types"
                                label="Type"
                                v-model="shipType" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-1">
                            <v-btn
                                v-if="isFiltered"
                                variant="outlined"
                                class="clear-btn"
                                @click="clear"
                            >Clear all</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-navigation-drawer>

            <v-row class="control-panel mt-5">
                <v-spacer></v-spacer>
                <v-col cols="2" class="pl-0 pr-3 py-0 text-right">
                    <v-btn
                        color="#FFFEFB"
                        icon="md:filter_alt"
                        class="filters-icon-btn"
                        @click.stop="showFilters = !showFilters"
                    ></v-btn>
                </v-col>
            </v-row>

            <Transition name="slidedown">
                <v-row v-if="isFiltered" justify="start" class="filters-panel pt-0">
                    <v-col cols="12" class="pt-0 mt-0">
                        <v-chip class="mr-2 mb-2" v-if=orderBy closable @click:close="orderBy = null">
                            <v-icon icon="md:sort" class="mr-1"></v-icon>{{ sortByOptions.find(item => item.value === orderBy).title }}
                        </v-chip>
                        <v-chip class="mr-2 mb-2" v-if=shipType closable @click:close="shipType = null">
                            Type: {{ shipType }}
                        </v-chip>
                    </v-col>                 
                </v-row>
            </Transition>
        </template>
        <template v-else>
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
        </template>

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
        and (min-device-width: 320px) 
        and (max-device-width: 960px) {

        .filters-icon-btn {
            height: 3rem;
            width: 3rem;
        }

        .filters-icon-btn {
            color: #968878;
        }

        .filters-drawer {
            padding-top: 2.7rem;
        }

        .filters-panel {
            margin-bottom: 0;
        }

        .filters-panel .v-chip {
            text-transform: capitalize;
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