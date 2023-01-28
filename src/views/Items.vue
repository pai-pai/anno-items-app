<script>
    import lodash from 'lodash';
    import axios from "axios";
    import ItemCard from '../components/ItemCard.vue';

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
            ItemsChunks() {
                return lodash.chunk(Object.values(this.items), this.itemsPerRow);
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
            <v-row justify="start" v-for="itemsForRow in ItemsChunks">
                <v-col cols="3" class="pa-2" align-self="stretch" v-for="item in itemsForRow">
                    <ItemCard :item="item" class="fill-height" />
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>