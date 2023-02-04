<script>
    import { defineComponent, onBeforeMount } from "vue";
    import { storeToRefs } from "pinia";
    import { useItemsStore } from "../stores/items";
    import ItemCard from "../components/ItemCard.vue";

    export default defineComponent({
        data: () => ({
            sortByOptions: [
                { title: "Name: A-Z", value: { field: ["name"], order: ["asc"] } },
                { title: "Name: Z-A", value: { field: ["name"], order: ["desc"] } },
                { title: "Rarity: Common to legendary", value: { field: ["rarity_order", "name"], order: ["asc", "asc"] } },
                { title: "Rarity: Legendary to common", value: { field: ["rarity_order", "name"], order: ["desc", "asc"] } },
            ],
            itemsPerRow: 4
        }),
        components: {
            ItemCard
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
            } = storeToRefs(itemsStore);

            onBeforeMount(async () => {
                await itemsStore.fetchItems();
            });

            return {
                items,
                itemsByChunks: itemsStore.chunkedList,
                filters,
                orderBy,
                rarity,
                dlc,
                trait,
            }
        }
    })
</script>

<template>
    <template v-if="items.length === 0">
        <v-progress-circular indeterminate :size="50" />
    </template>
    <template v-else>
        <v-container class="pa-0">
            <v-row justify="start" class="control-panel mt-5 mb-3">
                <v-col cols="3">
                    <v-select
                        :items="sortByOptions"
                        clearable
                        clear-icon="close"
                        variant="underlined"
                        density="compact"
                        label="Sort by"
                        item-value="value"
                        v-model="orderBy" />
                </v-col>
                <v-col cols="3">
                    <v-select
                        :items="filters.rarity"
                        clearable
                        clear-icon="close"
                        variant="underlined"
                        density="compact"
                        label="Rarity"
                        v-model="rarity" />
                </v-col>
                <v-col cols="3">
                    <v-select
                        :items="filters.dlc"
                        clearable
                        clear-icon="close"
                        variant="underlined"
                        density="compact"
                        label="DLC"
                        v-model="dlc" />
                </v-col>
                <v-col cols="3">
                    <v-select
                        :items="filters.traits"
                        clearable
                        clear-icon="close"
                        variant="underlined"
                        density="compact"
                        label="Traits"
                        v-model="trait" />
                </v-col>
            </v-row>
        
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
</template>

<style scoped>
    .control-panel .v-col {
        align-self: flex-end;
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
</style>