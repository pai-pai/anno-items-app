<script>
    import axios from "axios";
    import { APIURL, BONUSES_MAPPING } from "../constants";
    import ColumnsBlock from "../components/ColumnsBlock.vue";

    export default {
        data: () => ({
            items: [],
            ships: [],
            supplies: []
        }),
        components: {
            ColumnsBlock,
        },
        computed: {
            BonusesColumnsConfig() {
                return {
                    labels: Object.values(BONUSES_MAPPING),
                    values: [ 0, 0, 0, 0, 0, 0, 0, 0 ],
                    columns: 2
                }
            },
            AdditionalBonusesConfig() {
                return {
                    labels: [ "Ration", "Morale", "Traits" ],
                    values: [ "No", 0, [] ],
                    columns: 2
                }
            }
        },
        methods: {
            async getItems() {
                const { data } = await axios.get(`${APIURL}/api/items`);
                this.items = data;
            },
            async getShips() {
                const { data } = await axios.get(`${APIURL}/api/ships`);
                this.ships = data;
            },
            async getSupplies() {
                const { data } = await axios.get(`${APIURL}/api/supplies`);
                this.supplies = data;
            }
        },
        beforeMount() {
            this.getItems();
            this.getShips();
            this.getSupplies();
        },
    }
</script>

<template>
    <v-container class="control-panel fluid mt-3 mb-5">
        <v-row justify="start" class="font-italic">
            <v-col cols="4" class="pa-0">
                <ColumnsBlock :columnsConfig="BonusesColumnsConfig" />
            </v-col>
            <v-col cols="4" class="pa-0">
                <ColumnsBlock :columnsConfig="AdditionalBonusesConfig" />
            </v-col>
            <v-spacer />
            <v-col cols="1">
                <v-icon icon="md:refresh"></v-icon>
            </v-col>
        </v-row>

        <v-row justify="start" class="text-h6">Pick a ship</v-row>
    </v-container>
</template>

<style scoped>
    .control-panel .bonuses {
        padding: 0;
    }
</style>