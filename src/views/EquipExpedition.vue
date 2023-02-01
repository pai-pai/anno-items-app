<script>
    import axios from "axios";
    import { Splide, SplideSlide } from '@splidejs/vue-splide';
    import { APIURL, BONUSES_MAPPING } from "../constants";
    import Bage from "../components/basic/Bage.vue";
    import BageWithTooltip from "../components/basic/BageWithTooltip.vue";
    import ColumnsBlock from "../components/basic/ColumnsBlock.vue";
    import ItemTooltip from "../components/ItemTooltip.vue";
    import ShipCardVertical from "../components/ShipCardVertical.vue";
    import SupplyTooltip from "../components/SupplyTooltip.vue";

    export default {
        data: () => ({
            items: [],
            ships: [],
            supplies: []
        }),
        components: {
            Bage,
            BageWithTooltip,
            ColumnsBlock,
            ItemTooltip,
            ShipCardVertical,
            Splide,
            SplideSlide,
            SupplyTooltip,
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
                const { data } = await axios.get(`${APIURL}/api/ships?sort_by=-total_slots`);
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
    <v-container class="fluid mt-3 mb-5">
        <v-row justify="start" class="control-panel font-italic">
            <v-col cols="4" class="pa-0">
                <ColumnsBlock :columnsConfig="BonusesColumnsConfig" />
            </v-col>
            <v-col cols="4" class="pa-0">
                <ColumnsBlock :columnsConfig="AdditionalBonusesConfig" />
            </v-col>
            <v-spacer />
            <v-col cols="1" class="pa-0 text-right">
                <v-icon icon="md:refresh"></v-icon>
            </v-col>
        </v-row>

        <v-row justify="start" class="text-h6 secondary-text-color pt-8 pb-3">Pick a ship</v-row>
        <v-row justify="start" class="ships-picker">
            <div class="ships-picker-container">
                <Splide :options="{ rewind: true, gap: '0.625rem', autoWidth: true, arrows: false, pagination: false }">
                    <SplideSlide v-for="ship in ships">
                        <ShipCardVertical :item="ship" />
                    </SplideSlide>
                </Splide>
            </div>
        </v-row>

        <v-row justify="start" class="text-h6 secondary-text-color pt-8 pb-3">Add items & supplies</v-row>
        <v-row justify="start" class="goods-picker-drop-zone-container">
            <div class="goods-picker-drop-zone">
                <span class="drop-zone-placeholder">Drag items and supplies here</span>
            </div>
        </v-row>
        <v-row class="goods-picker-drag-zone-container">
            <div class="items-container">
                <div class="items-drag-zone">
                    <BageWithTooltip
                        v-for="item in items"
                        :class="[`item-rarity-` + item.rarity_order]"
                        :image_src="item.image_src"
                        height="4.375rem"
                        width="4.375rem"
                    ><ItemTooltip :item="item" /></BageWithTooltip>
                </div>
            </div>
            <div></div>
            <div class="supplies-container">
                <div class="supplies-drag-zone">
                    <BageWithTooltip
                        v-for="supply in supplies"
                        class="item-rarity--1"
                        :image_src="supply.image_src"
                        height="4.375rem"
                        width="4.375rem"
                    ><SupplyTooltip :item="supply" /></BageWithTooltip>
                </div>
            </div>
        </v-row>
    </v-container>
</template>

<style scoped>
    .control-panel .bonuses {
        padding: 0;
        font-size: 1rem;
    }

    .ships-picker-container {
        width: 100%;
    }

    .ships-picker-container .v-lazy {
        height: 100%;
    }

    .goods-picker-drag-zone-container {
        display: grid;
        grid-template-columns: 7fr 1fr 5fr;
    }

    .items-container,
    .supplies-container {
        border: 1px solid #E4DAC8;
        border-radius: 0.25rem;
        padding: 0.5rem;
    }

    .items-drag-zone,
    .supplies-drag-zone {
        display: flex;
        flex-wrap: wrap;
        row-gap: 0.25rem;
        justify-content: space-between;
        height: 480px;
        overflow-y: scroll;
        -ms-overflow-style: none; /* Hide scrollbar for Internet Explorer, Edge */
        scrollbar-width: none; /* Hide scrollbar for Firefox */
    }

    .items-drag-zone::-webkit-scrollbar,
    .supplies-drag-zone::-webkit-scrollbar {
        display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
    }
</style>