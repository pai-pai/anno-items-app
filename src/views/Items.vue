<script>
    import lodash from "lodash";
    import axios from "axios";
    import ItemCard from "../components/ItemCard.vue";

    export default {
        data: () => ({
            sortByOptions: [
                { title: "Name: A-Z", value: "name" },
                { title: "Name: Z-A", value: "-name" },
                { title: "Rarity: Common to legendary", value: "rarity_order" },
                { title: "Rarity: Legendary to common", value: "-rarity_order" },
            ],
            rarityOptions: [
                { title: "Common", value: "common" },
                { title: "Uncommon", value: "uncommon" },
                { title: "Rare", value: "rare" },
                { title: "Epic", value: "epic" },
                { title: "Legendary", value: "legendary" },
                { title: "Character item", value: "character item" },
            ],
            dlcOptions: [ "Land of Lions", "The Anarchist" ],
            traitsOptions: [ "Diver", "Entertainer", "Pirate" ],
            items: [],
            itemsPerRow: 4
        }),
        components: {
            ItemCard
        },
        computed: {
            ItemsChunksWithId() {
                const arr = lodash.chunk(Object.values(this.items), this.itemsPerRow);
                return arr.map((el, index) => ({ id: `row-${index}`, rowData: el }) );
            }
        },
        methods: {
            async getItems() {
                const { data } = await axios.get("http://127.0.0.1:5000/api/items");
                this.items = data;
            }
        },
        beforeMount() {
            this.getItems();
        },
    }
</script>

<template>
    <v-container class="control-panel pa-0 pt-3 pb-5">
        <v-row justify="start">
            <v-col cols="3">
                <v-select
                    :items="sortByOptions"
                    variant="underlined"
                    density="compact"
                    label="Sort by"
                    item-value="value" />
            </v-col>
            <v-col cols="3">
                <v-select
                    :items="rarityOptions"
                    variant="underlined"
                    density="compact"
                    label="Rarity"
                    item-value="value" />
            </v-col>
            <v-col cols="3">
                <v-select
                    :items="dlcOptions"
                    variant="underlined"
                    density="compact"
                    label="DLC" />
            </v-col>
            <v-col cols="3">
                <v-select
                    :items="traitsOptions"
                    variant="underlined"
                    density="compact"
                    label="Traits" />
            </v-col>
        </v-row>
    </v-container>

    <v-container class="content items pa-0">
        <template v-if="items.length === 0">
            <v-progress-circular indeterminate :size="50" />
        </template>
        <template v-else>
            <DynamicScroller
                :items="ItemsChunksWithId"
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
        </template>
    </v-container>
</template>

<style scoped>
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