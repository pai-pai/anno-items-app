<script>
    import lodash from 'lodash';
    import axios from "axios";
    import ShipCard from '../components/ShipCard.vue';

    export default {
        data: () => ({
            sortByOptions: [
                { title: "Name: A-Z", value: "name" },
                { title: "Name: Z-A", value: "-name" },
                { title: "Number of slots: Low to high", value: "total_slots" },
                { title: "Number of slots: High to low", value: "-total_slots" },
            ],
            typesOptions: [ "Hybrid", "Military ship", "Sailing ship" ],
            ships: [],
            shipsPerRow: 4
        }),
        components: {
            ShipCard
        },
        computed: {
            ShipsChunks() {
                return lodash.chunk(Object.values(this.ships), this.shipsPerRow);;
            }
        },
        methods: {
            async getShips() {
                const { data } = await axios.get("http://127.0.0.1:5000/api/ships");
                this.ships = data;
            }
        },
        beforeMount() {
            this.getShips();
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
                    :items="typesOptions"
                    variant="underlined"
                    density="compact"
                    label="Type"
                    item-value="value" />
            </v-col>
        </v-row>
    </v-container>
    <v-container class="content items pa-0">
        <template v-if="ships.length === 0">
            <v-progress-circular indeterminate :size="50" />
        </template>
        <template v-else>
            <v-row justify="start" v-for="itemsForRow in ShipsChunks">
                <v-col cols="3" class="pa-2" align-self="stretch" v-for="item in itemsForRow">
                    <ShipCard :item="item" class="fill-height" />
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>