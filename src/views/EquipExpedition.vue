<script>
    import { computed, defineComponent, onBeforeMount } from "vue";
    import { storeToRefs } from "pinia";
    import { useItemsStore } from "../stores/items";
    import { useShipsStore } from "../stores/ships";
    import { useSuppliesStore } from "../stores/supplies";
    import { useExpeditionStore } from "../stores/expedition";

    import { Splide, SplideSlide } from '@splidejs/vue-splide';
    import { BONUSES_MAPPING } from "../constants";
    import Badge from "../components/basic/Badge.vue";
    import BadgeWithTooltip from "../components/basic/BadgeWithTooltip.vue";
    import ColumnsBlock from "../components/basic/ColumnsBlock.vue";
    import ItemTooltip from "../components/ItemTooltip.vue";
    import ShipCardVertical from "../components/ShipCardVertical.vue";
    import SupplyTooltip from "../components/SupplyTooltip.vue";

    export default defineComponent ({
        data: () => ({
            items: [],
            ships: [],
            supplies: []
        }),
        components: {
            Badge,
            BadgeWithTooltip,
            ColumnsBlock,
            ItemTooltip,
            ShipCardVertical,
            Splide,
            SplideSlide,
            SupplyTooltip,
        },
        setup() {
            const itemsStore = useItemsStore();
            const shipsStore = useShipsStore();
            const suppliesStore = useSuppliesStore();
            const expeditionStore = useExpeditionStore();

            const { items } = storeToRefs(itemsStore);
            const ships = storeToRefs(shipsStore).items;
            const supplies = storeToRefs(suppliesStore).items;
            const { ship, traits } = storeToRefs(expeditionStore);

            onBeforeMount(async () => {
                if (itemsStore.items.length === 0) {
                    await itemsStore.fetchItems();
                }
                if (shipsStore.items.length === 0) {
                    await shipsStore.fetchItems();
                }
                if (suppliesStore.items.length === 0) {
                    await suppliesStore.fetchItems();
                }
            });

            return {
                items,
                itemsByChunks: itemsStore.chunkedList,
                ships,
                supplies,
                ship,
                expeditionBonuses: computed(() => expeditionStore.expeditionBonuses),
                traits,
                pickShip: (ship) => expeditionStore.pickShip(ship),
                removeItem: (item) => expeditionStore.removeItem(item),
                pickedItems: computed(() => expeditionStore.pickedItems),
                expeditionStore,
                itemsStore,
            }
        },
        computed: {
            bonusesColumnsConfig() {
                return {
                    labels: Object.values(BONUSES_MAPPING),
                    values: Object.values(this.expeditionBonuses),
                    columns: 2
                }
            },
            AdditionalBonusesConfig() {
                return {
                    labels: [ "Ration", "Morale", "Traits" ],
                    values: [ "No", 0, this.traits.join(", ") ],
                    columns: 2
                }
            }
        },
        methods: {
            startDrag(evt, item, itemType) {
                evt.dataTransfer.dropEffect = "move";
                evt.dataTransfer.effectAllowed = "move";
                evt.dataTransfer.setData("itemId", item._id);
                evt.dataTransfer.setData("itemType", itemType);
            },
            onDrop(evt) {
                const dropedItem = this.itemsStore.itemById(evt.dataTransfer.getData("itemId"));
                if (dropedItem) {
                    this.expeditionStore.pickItem(dropedItem);
                }
            }
        }
    })
</script>

<template>
    <v-container class="fluid mt-3 mb-5">
        <v-row justify="start" class="control-panel font-italic">
            <v-col cols="4" class="pa-0">
                <ColumnsBlock :columnsConfig="bonusesColumnsConfig" />
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
                        <ShipCardVertical
                            :item="ship"
                            :class="[`${pickedItems.length > 0 ? 'locked': ''}`]"
                            @click="pickShip(ship)" />
                    </SplideSlide>
                </Splide>
            </div>
        </v-row>

        <template v-if="ship">
            <v-row justify="start" class="text-h6 secondary-text-color pt-8 pb-3">Add items & supplies</v-row>
            <v-row justify="start" class="goods-picker-drop-zone-container">
                <div
                    class="goods-picker-drop-zone mb-3"
                    @drop="onDrop($event)"
                    @dragover.prevent
                    @dragenter.prevent
                >
                <Badge
                    v-for="item in pickedItems"
                    :class="[`item-rarity-${item.rarity_order}`]"
                    :image_src="item.image_src"
                    height="4.375rem"
                    width="4.375rem"
                    clearable
                    @remove="removeItem(item)" />
                </div>
            </v-row>
            <v-row class="goods-picker-drag-zone-container">
                <div class="items-container">
                    <div class="items-drag-zone">
                        <DynamicScroller
                            :items="itemsByChunks(7, false)"
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
                                    <div class="item-in-row" v-for="it in item.rowData" >
                                        <BadgeWithTooltip
                                            :class="[`item-rarity-${it.rarity_order}`]"
                                            :image_src="it.image_src"
                                            height="4.375rem"
                                            width="4.375rem"
                                            draggable="true"
                                            @dragstart="startDrag($event, it, 'items')"
                                        >
                                            <template #content>
                                                <ItemTooltip :item="it" />
                                            </template>
                                        </BadgeWithTooltip>
                                    </div>
                                </div>
                                </DynamicScrollerItem>
                            </template>
                        </DynamicScroller>
                    </div>
                </div>
                <div></div>
                <div class="supplies-container">
                    <div class="supplies-drag-zone">
                        <BadgeWithTooltip
                            v-for="supply in supplies"
                            class="item-rarity--1"
                            :image_src="supply.image_src"
                            height="4.375rem"
                            width="4.375rem"
                        >
                            <template #content>
                                <SupplyTooltip :item="supply" />
                            </template>
                        </BadgeWithTooltip>
                    </div>
                </div>
            </v-row>
        </template>
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

    .goods-picker-drop-zone {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        width: 100%;
        min-height: 6.35rem;
        background: rgba(228, 218, 200, 0.32);
        border: 1px solid #E4DAC8;
        border-radius: 0.25rem;
        padding: 0.5rem;
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

    .scroller {
        height: 480px;
    }

    .items-row {
        display: grid;
        grid-gap: 0.25rem;
        grid-template-columns: repeat(7, 1fr);
        padding-bottom: 0.25rem;
    }
</style>