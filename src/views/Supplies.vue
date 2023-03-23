<script>
    import { computed, defineComponent, onBeforeMount } from "vue";
    import { useDisplay } from "vuetify";
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
            showFilters: false,
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
            const { mdAndDown } = useDisplay();

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
                mdAndDown,
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
                                :options="rationOptions"
                                label="Ration"
                                v-model="isRation" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-1">
                            <ClearableSelectInput
                                :options="bonusOptions"
                                label="Expedition Bonus"
                                v-model="bonus" />
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
                        <v-chip class="mr-2 mb-2" v-if="isRation !== null" closable @click:close="isRation = null">
                            Ration: {{ isRation ? "Yes" : "No" }}
                        </v-chip>
                        <v-chip class="mr-2 mb-2" v-if=bonus closable @click:close="bonus = null">
                            Expedition Bonus: {{ bonusOptions.find(item => item.value === bonus).title }}
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
        </template>

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
        and (max-device-width: 960px) {

        .filters-icon-btn {
            height: 3rem;
            width: 3rem;
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