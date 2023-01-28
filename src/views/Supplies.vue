<script>
    import lodash from "lodash";
    import axios from "axios";
    import { APIURL } from "../constants";
    import SupplyCard from '../components/SupplyCard.vue';

    export default {
        data: () => ({
            sortByOptions: [
                { title: "Name: A-Z", value: "name" },
                { title: "Name: Z-A", value: "-name" },
                { title: "Morale: Low to high", value: "combined_morale_per_50t" },
                { title: "Morale: High to low", value: "-combined_morale_per_50t" },
            ],
            rationOptions: [ "Yes", "No" ],
            bonusOptions: [
                { title: "Crafting", value: "bonuses.crafting" },
                { title: "Diplomacy", value: "bonuses.diplomacy" },
                { title: "Faith", value: "bonuses.faith" },
                { title: "Force", value: "bonuses.force" },
                { title: "Hunting", value: "bonuses.hunting" },
                { title: "Medicine", value: "bonuses.medicine" },
                { title: "Naval Power", value: "bonuses.naval_power" },
                { title: "Navigation", value: "bonuses.navigation" },
            ],
            supplies: [],
            goodsPerRow: 4
        }),
        components: {
            SupplyCard
        },
        computed: {
            SuppliesChunks() {
                return lodash.chunk(Object.values(this.supplies), this.goodsPerRow);;
            }
        },
        methods: {
            async getSupplies() {
                const { data } = await axios.get(`${APIURL}/api/supplies`);
                this.supplies = data;
            }
        },
        beforeMount() {
            this.getSupplies();
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
                    :items="rationOptions"
                    variant="underlined"
                    density="compact"
                    label="Ration"
                    item-value="value" />
            </v-col>
            <v-col cols="3">
                <v-select
                    :items="bonusOptions"
                    variant="underlined"
                    density="compact"
                    label="Expedition Bonus"
                    item-value="value" />
            </v-col>
        </v-row>
    </v-container>
    <v-container class="content items pa-0">
        <template v-if="supplies.length === 0">
            <v-progress-circular indeterminate :size="50" />
        </template>
        <template v-else>
            <v-row justify="start" v-for="itemsForRow in SuppliesChunks">
                <v-col cols="3" class="pa-2" align-self="stretch" v-for="item in itemsForRow">
                    <SupplyCard :item="item" class="fill-height" />
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>