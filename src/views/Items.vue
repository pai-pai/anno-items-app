<script>
    import { computed, defineComponent, onBeforeMount } from "vue";
    import { useDisplay } from "vuetify";
    import { storeToRefs } from "pinia";
    import { useItemsStore } from "../stores/items";
    import ClearableSelectInput from "../components/basic/ClearableSelectInput.vue";
    import ItemCard from "../components/ItemCard.vue";

    export default defineComponent({
        data: () => ({
            sortByOptions: [
                { title: "Name: A-Z", value: { field: ["name"], order: ["asc"] } },
                { title: "Name: Z-A", value: { field: ["name"], order: ["desc"] } },
                { title: "Rarity: Common to legendary", value: { field: ["rarity_order", "name"], order: ["asc", "asc"] } },
                { title: "Rarity: Legendary to common", value: { field: ["rarity_order", "name"], order: ["desc", "asc"] } },
            ],
            showFilters: false,
        }),
        components: {
            ClearableSelectInput,
            ItemCard
        },
        methods: {
            toggleFiltersPanel() {
                this.showFilters = !this.showFilters;
            }
        },
        setup() {
            const itemsStore = useItemsStore();
            const {
                items,
                filters,
                orderBy,
                rarity,
                dlc,
                trait,
                searchPhrase,
            } = storeToRefs(itemsStore);
            const { name } = useDisplay();
            const itemsPerRow = computed(() => {
                switch (name.value) {
                    case "xs": return 2
                    case "sm": return 3
                    case "md": return 3
                    case "lg": return 4
                    case "xl": return 6
                    case "xxl": return 6
                }
            });
            const { mdAndDown } = useDisplay();

            onBeforeMount(async () => {
                if (itemsStore.items.length === 0) {
                    await itemsStore.fetchItems();
                }
            });

            return {
                items,
                itemsPerRow,
                itemsByChunks: computed((itemsPerRow) => itemsStore.chunkedList),
                filters,
                orderBy,
                rarity,
                dlc,
                trait,
                searchPhrase,
                mdAndDown,
                isFiltered: computed(() => itemsStore.isFiltered),
                clear: computed(() => itemsStore.clearFilters),
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
                                :options="filters.rarity"
                                label="Rarity"
                                v-model="rarity" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-1">
                            <ClearableSelectInput
                                :options="filters.dlc"
                                label="DLC"
                                v-model="dlc" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="py-1">
                            <ClearableSelectInput
                                :options="filters.traits"
                                label="Trait"
                                v-model="trait" />
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
                <v-col cols="9" class="px-3 py-0">
                    <v-text-field
                        clearable
                        clear-icon="close"
                        label="Search"
                        variant="underlined"
                        density="compact"
                        class="search-field"
                        v-model="searchPhrase" />
                </v-col>
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
                <v-row v-if="isFiltered" justify="start" class="filters-panel pt-2">
                    <v-col cols="12">
                        <v-chip class="mr-2 mb-2" v-if=orderBy closable @click:close="orderBy = null">
                            <v-icon icon="md:sort" class="mr-1"></v-icon>{{ sortByOptions.find(item => item.value === orderBy).title }}
                        </v-chip>
                        <v-chip class="mr-2 mb-2" v-if=rarity closable @click:close="rarity = null">
                            Rarity: {{ rarity }}
                        </v-chip>
                        <v-chip class="mr-2 mb-2" v-if=dlc closable @click:close="dlc = null">
                            DLC: {{ dlc }}
                        </v-chip>
                        <v-chip class="mr-2 mb-2" v-if=trait closable @click:close="trait = null">
                            Trait: {{ trait }}
                        </v-chip>
                    </v-col>                 
                </v-row>
            </Transition>

        </template>
        <template v-else>
            <v-row justify="start" class="control-panel mt-5">
                <v-col cols="3" class="px-3 py-0">
                    <v-text-field
                        clearable
                        clear-icon="close"
                        label="Search"
                        variant="underlined"
                        density="compact"
                        class="search-field"
                        v-model="searchPhrase" />
                </v-col>
                <v-spacer />
                <v-col cols="3" class="px-3 pt-2 pb-0 justify-end d-flex">
                    <v-btn
                        v-if="isFiltered"
                        variant="outlined"
                        class="clear-btn"
                        @click="clear"
                    >Clear all</v-btn>
                    <v-btn
                        v-if="showFilters"
                        append-icon="expand_less"
                        variant="outlined"
                        class="filters-btn"
                        @click="toggleFiltersPanel"
                    >Hide filters</v-btn>
                    <v-btn
                        v-else
                        append-icon="expand_more"
                        variant="outlined"
                        class="filters-btn"
                        @click="toggleFiltersPanel"
                    >Show filters</v-btn>
                </v-col>
            </v-row>
            <Transition name="slidedown">
                <v-row v-if="showFilters" justify="start" class="filters-panel pt-2">
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
                            :options="filters.rarity"
                            label="Rarity"
                            v-model="rarity" />
                    </v-col>
                    <v-col cols="3" class="px-3 py-0">
                        <ClearableSelectInput
                            :options="filters.dlc"
                            label="DLC"
                            v-model="dlc" />
                    </v-col>
                    <v-col cols="3" class="px-3 py-0">
                        <ClearableSelectInput
                            :options="filters.traits"
                            label="Trait"
                            v-model="trait" />
                    </v-col>
                </v-row>
            </Transition>
        </template>

        <DynamicScroller
            :items="itemsByChunks(itemsPerRow)"
            keyField="id"
            :min-item-size="54"
            class="scroller"
        >
            <template v-slot="{ item, index, active }">
                <DynamicScrollerItem
                    :item="item"
                    :active="active"
                    :data-index="index"
                >
                <div class="items-row">
                    <div class="item-in-row" v-for="it in item.rowData">
                        <ItemCard :item="it" class="fill-height" />
                    </div>
                </div>
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </v-container>
</template>

<style scoped>
    .control-panel {
        margin-bottom: 1.25rem;
    }

    .control-panel + .filters-panel {
        margin-top: -2rem;
    }

    .filters-panel {
        margin-bottom: 1.5rem;
    }

    .filters-panel .v-col {
        align-self: flex-end;
    }

    .filters-btn,
    .clear-btn {
        font-size: 1rem;
        color: #968878;
        text-transform: none;
        letter-spacing: normal;
        width: 45%;
        border-color: #E4DAC8;
    }

    .filters-btn {
        margin-left: 0.5rem;
    }

    .scroller {
        height: 100%;
    }

    .items-row {
        display: grid;
        grid-gap: 1.25rem;
        grid-template-columns: repeat(4, 1fr);
        padding-bottom: 1.25rem;
    }

    .slidedown-enter-active,
    .slidedown-leave-active {
        transition: max-height 0.8s ease-in-out;
    }

    .slidedown-enter-to,
    .slidedown-leave-from {
        overflow: hidden;
        max-height: 20rem;
    }

    .slidedown-enter-from,
    .slidedown-leave-to {
        overflow: hidden;
        max-height: 0.25rem;
    }

    @media only screen 
        and (min-device-width: 320px) 
        and (max-device-width: 768px) {
        .items-row {
            grid-template-columns: 1fr;
        }
    }

    @media only screen 
        and (min-device-width: 480px) 
        and (max-device-width: 960px) {
        .search-field {
            width: 42.5%;
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
        .items-row {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media only screen 
        and (min-device-width: 768px) 
        and (max-device-width: 1024px) 
        and (orientation: landscape) {
        .items-row {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media screen and (min-width: 1904px) {
        .items-row {
            grid-template-columns: repeat(6, 1fr);
        }
    }
</style>