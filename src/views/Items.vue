<script>
    import { computed, defineComponent, onBeforeMount } from "vue";
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
            itemsPerRow: 4,
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
            

            onBeforeMount(async () => {
                if (itemsStore.items.length === 0) {
                    await itemsStore.fetchItems();
                }
            });

            return {
                items,
                itemsByChunks: itemsStore.chunkedList,
                filters,
                orderBy,
                rarity,
                dlc,
                trait,
                searchPhrase,
                isFiltered: computed(() => itemsStore.isFiltered),
                clear: computed(() => itemsStore.clearFilters),
            }
        }
    })
</script>

<template>
    <v-progress-circular v-if="items.length === 0" indeterminate :size="50" />

    <v-container v-else class="px-0">
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
                        label="Traits"
                        v-model="trait" />
                </v-col>
            </v-row>
        </Transition>

        <DynamicScroller
            :items="itemsByChunks(itemsPerRow, true)"
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
</style>