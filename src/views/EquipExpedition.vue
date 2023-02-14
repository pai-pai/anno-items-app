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
            const { ship, pickedItems, rationBonus, moraleBonus, traits } = storeToRefs(expeditionStore);

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
                expeditionBonuses: computed(() => expeditionStore.expeditionBonuses),
                rationBonus,
                moraleBonus,
                traits,
                pickShip: (ship) => expeditionStore.pickShip(ship),
                removeItem: (item, index) => expeditionStore.removeItem(item, index),
                reset: () => expeditionStore.reset(),
                pickedShip: ship,
                pickedItems,
                expeditionStore,
                itemsStore,
                suppliesStore,
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
                    labels: [ "Ration", "Morale" ],
                    values: [ this.rationBonus ? "Yes": "No", this.moraleBonus ],
                    columns: 1
                }
            }
        },
        methods: {
            dragItem(evt, item, itemType) {
                if (this.pickedShip.total_slots === this.pickedItems.length) {
                    return;
                }
                evt.dataTransfer.dropEffect = "move";
                evt.dataTransfer.effectAllowed = "move";
                evt.dataTransfer.setData("itemId", item._id);
                evt.dataTransfer.setData("itemType", itemType);
            },
            dropItem(evt) {
                const itemType = evt.dataTransfer.getData("itemType");
                const store = itemType == "item" ? this.itemsStore : this.suppliesStore;
                const dropedItem = store.itemById(evt.dataTransfer.getData("itemId"));
                if (dropedItem) {
                    this.expeditionStore.pickItem(dropedItem);
                }
            },
            isShipActive(ship) {
                return this.pickedShip && this.pickedShip._id === ship._id;
            },
            isShipLocked(ship) {
                return this.isShipActive(ship) && this.pickedItems.length > 0;
            },
            isShipItem(item) {
                if (!this.pickedShip || !item.equipped_in) return;
                return this.pickedShip.equipped_in.includes(item.equipped_in);
            }
        }
    })
</script>

<template>
    <v-container class="fluid mb-5 pt-0">
        <div class="stats-panel font-italic">
            <div class="bonuses-section">
                <ColumnsBlock :columnsConfig="bonusesColumnsConfig" />
            </div>
            <div class="ration-morale-section">
                <ColumnsBlock :columnsConfig="AdditionalBonusesConfig" />
            </div>
            <div class="traits-section">
                <div class="label">Traits</div>
                <div class="value font-weight-bold">{{ traits.join(", ") || "-" }}</div>
            </div>
            <div class="text-right">
                <v-icon icon="md:refresh" @click="reset()"></v-icon>
            </div>
        </div>

        <v-row justify="start" class="ships-picker">
            <div class="text-h6 secondary-text-color pt-8 pb-1">Pick a ship</div>
            <div class="ships-picker-container">
                <Splide :options="{ rewind: true, gap: '0.625rem', autoWidth: true, arrows: false, pagination: false }">
                    <SplideSlide v-for="sh in ships">
                        <ShipCardVertical
                            :item="sh"
                            :class="[`${ isShipActive(sh) ? 'active' : '' } ${ isShipLocked(sh) ? 'locked': '' }`]"
                            @click="pickShip(sh)" />
                    </SplideSlide>
                </Splide>
            </div>
        </v-row>

        <template v-if="pickedShip">
            <v-row justify="start" class="goods-picker-drop-zone-container">
                <div class="text-h6 secondary-text-color pt-8 pb-1">Add items & supplies</div>
                <div
                    class="goods-picker-drop-zone mb-3"
                    @drop="dropItem($event)"
                    @dragover.prevent
                    @dragenter.prevent
                >
                <Badge
                    v-for="(item, index) in pickedItems"
                    :class="[`item-rarity-${item.rarity_order} ${ isShipItem(item) ? 'ship-item' : '' }`]"
                    :image_src="item.image_src"
                    height="4.375rem"
                    width="4.375rem"
                    clearable
                    @remove="removeItem(item, index)" />
                </div>
            </v-row>
            <v-row class="goods-picker-drag-zone-container">
                <div>
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
                                                :class="[`item-rarity-${it.rarity_order} ${ isShipItem(it) ? 'ship-item' : '' }`]"
                                                :image_src="it.image_src"
                                                height="4.375rem"
                                                width="4.375rem"
                                                :draggable="pickedItems.length < pickedShip.total_slots"
                                                @dragstart="dragItem($event, it, 'item')"
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
                            :draggable="pickedItems.length < pickedShip.total_slots"
                            @dragstart="dragItem($event, supply, 'supply')"
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
    .stats-panel {
        display: grid;
        grid-template-columns: 3fr 1.25fr 3fr 1.75fr;
        border-bottom: 1px solid #E4DAC8;
        background: #FFFEFB;
        position: fixed;
        max-width: 1200px;
        width: 100%;
        z-index: 1003;
        margin: 0 -1rem;
        margin-top: 0.75rem;
        padding: 1rem 0;
    }

    .stats-panel .bonuses {
        padding: 0;
        font-size: 1rem;
    }

    .bonuses-section,
    .ration-morale-section {
        padding-right: 5rem;
    }

    .traits-section {
        display: flex;
        gap: 2rem;
        font-size: 1rem;
    }

    .ships-picker {
        padding-top: 9rem;
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
        -ms-overflow-style: none; /* Hide scrollbar for Internet Explorer, Edge */
        scrollbar-width: none; /* Hide scrollbar for Firefox */
    }

    .scroller::-webkit-scrollbar {
        display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
    }

    .items-row {
        display: grid;
        grid-gap: 0.25rem;
        grid-template-columns: repeat(7, 1fr);
        padding-bottom: 0.25rem;
    }
</style>