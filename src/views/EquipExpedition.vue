<script>
    import { computed, defineComponent, onBeforeMount } from "vue";
    import { useDisplay } from "vuetify";
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
            supplies: [],
            showItemsFilters: false,
            showSuppliesFilters: false,
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
        watch: {
            showSuppliesFilters: {
                handler() {
                    this.resizeSupplies();
                },
                flush: "post"
            },
            suppliesFiltered: {
                handler() {
                    this.resizeSupplies();
                },
                flush: "post"
            },
        },
        setup() {
            const itemsStore = useItemsStore();
            const shipsStore = useShipsStore();
            const suppliesStore = useSuppliesStore();
            const expeditionStore = useExpeditionStore();

            const { items } = storeToRefs(itemsStore);
            const ships = storeToRefs(shipsStore).items;
            const supplies = storeToRefs(suppliesStore).items;
            const {
                ship, pickedItems, rationBonus, moraleBonus, traits,
                searchItem, itemsBonusesFilter,
                searchSupply, suppliesBonusesFilter, suppliesRationFilter
            } = storeToRefs(expeditionStore);
            const { name } = useDisplay();
            const itemsPerRow = computed(() => {
                switch (name.value) {
                    case "xs": return 4
                    case "sm": return 5
                    case "md": return 5
                    case "lg": return 7
                    case "xl": return 10
                    case "xxl": return 10
                }
            });

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
                ships,
                supplies,
                getItems: computed((itemsPerRow) => expeditionStore.getItems),
                getSupplies: computed(() => expeditionStore.getSupplies),
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
                itemsPerRow,
                BONUSES_MAPPING,
                searchItem,
                itemsBonusesFilter,
                searchSupply,
                suppliesBonusesFilter,
                suppliesRationFilter,
                itemsFiltered: computed(() => expeditionStore.itemsFiltered),
                suppliesFiltered: computed(() => expeditionStore.suppliesFiltered),
                clearFilters: (itemType) => expeditionStore.clearFilters(itemType),
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
            additionalBonusesConfig() {
                return {
                    labels: [ "Ration", "Morale" ],
                    values: [ this.rationBonus ? "Yes": "No", this.moraleBonus ],
                    columns: 1
                }
            }
        },
        methods: {
            isShipActive(ship) {
                return this.pickedShip && this.pickedShip._id === ship._id;
            },
            isShipLocked(ship) {
                return this.isShipActive(ship) && this.pickedItems.length > 0;
            },
            isShipItem(item) {
                if (!this.pickedShip || !item.equipped_in) return;
                return this.pickedShip.equipped_in.includes(item.equipped_in);
            },
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
            toggleFiltersItems() {
                this.showItemsFilters = !this.showItemsFilters;
            },
            toggleFiltersSupplies() {
                this.showSuppliesFilters = !this.showSuppliesFilters;
            },
            resizeSupplies() {
                const container = document.querySelector(".supplies-container");
                const containerMaxHeight = parseInt(getComputedStyle(container).maxHeight);
                const scroller = document.querySelector(".supplies-drag-zone");
                const filters = document.querySelector(".filters-panel");
                const filtersHeight = filters ? filters.offsetHeight : 0;
                const blockHeight = container.offsetHeight + filtersHeight;

                if (blockHeight > containerMaxHeight) {
                    container.style.height = container.offsetHeight - filtersHeight + "px";
                    scroller.style.height = scroller.offsetHeight - filtersHeight + "px";
                } else {
                    container.style.removeProperty("height");
                    scroller.style.removeProperty("height");
                }
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
                <ColumnsBlock :columnsConfig="additionalBonusesConfig" />
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
                        @remove="removeItem(item, index)"
                    />
                    <div class="empty-badge" v-for="index in (pickedShip.total_slots - pickedItems.length)"></div>
                </div>
            </v-row>
            <v-row class="goods-picker-drag-zone-container">
                <div>
                    <div class="controls">
                        <div class="items-control-panel">
                            <v-text-field
                                clearable
                                clear-icon="close"
                                label="Find item by name"
                                variant="underlined"
                                density="compact"
                                class="search-field"
                                v-model="searchItem"
                            />
                            <div class="btns">
                                <v-btn
                                    v-if="itemsFiltered"
                                    variant="outlined"
                                    class="clear-btn"
                                    @click="clearFilters('item')"
                                >Clear all</v-btn>
                                <v-btn
                                    v-if="showItemsFilters"
                                    append-icon="expand_less"
                                    variant="outlined"
                                    class="filters-btn"
                                    @click="toggleFiltersItems"
                                >Hide filters</v-btn>
                                <v-btn
                                    v-else
                                    append-icon="expand_more"
                                    variant="outlined"
                                    class="filters-btn"
                                    @click="toggleFiltersItems"
                                >Show filters</v-btn>
                            </div>
                        </div>
                        <div class="filters-panel" v-if="showItemsFilters">
                            <div class="bonuses-filter">
                                <div class="column" v-for="part in [Object.entries(BONUSES_MAPPING).slice(0, 4), Object.entries(BONUSES_MAPPING).slice(4)]">
                                    <v-checkbox
                                        v-for="entry in part"
                                        v-model="itemsBonusesFilter"
                                        :label="entry[1]"
                                        :value="entry[0]"
                                        density="compact"
                                        hide-details
                                    ></v-checkbox>
                                </div>
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div class="items-container">
                        <div class="items-drag-zone">
                            <DynamicScroller
                                :items="getItems(itemsPerRow)"
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
                <div>
                    <div class="supplies-control-panel">
                        <div class="controls">
                            <v-text-field
                                clearable
                                clear-icon="close"
                                label="Find goods by name"
                                variant="underlined"
                                density="compact"
                                class="search-field"
                                v-model="searchSupply"
                            />
                            <div class="btns">
                                <v-btn
                                    v-if="suppliesFiltered"
                                    variant="outlined"
                                    class="clear-btn"
                                    @click="clearFilters('supply')"
                                >Clear all</v-btn>
                                <v-btn
                                    v-if="showSuppliesFilters"
                                    append-icon="expand_less"
                                    variant="outlined"
                                    class="filters-btn"
                                    @click="toggleFiltersSupplies"
                                >Hide filters</v-btn>
                                <v-btn
                                    v-else
                                    append-icon="expand_more"
                                    variant="outlined"
                                    class="filters-btn"
                                    @click="toggleFiltersSupplies"
                                >Show filters</v-btn>
                            </div>
                        </div>
                        <div class="filters-panel" v-if="showSuppliesFilters">
                            <div class="bonuses-filter">
                                <div class="column" v-for="part in [Object.entries(BONUSES_MAPPING).slice(0, 4), Object.entries(BONUSES_MAPPING).slice(4)]">
                                    <v-checkbox
                                        v-for="entry in part"
                                        v-model="suppliesBonusesFilter"
                                        :label="entry[1]"
                                        :value="entry[0]"
                                        density="compact"
                                        hide-details
                                    ></v-checkbox>
                                </div>
                            </div>
                            <div class="ration-filter">
                                <v-checkbox
                                    v-model="suppliesRationFilter"
                                    label="Ration"
                                    density="compact"
                                    hide-details
                                ></v-checkbox>
                            </div>
                        </div>
                    </div>
                    <div class="supplies-container">
                        <div class="supplies-drag-zone">
                            <BadgeWithTooltip
                                v-for="supply in getSupplies"
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
                            <div v-if="getSupplies.length === 0" class="pa-3 w-100 text-subtitle-1 text-center">
                                No supplies found
                            </div>
                        </div>
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
        width: 100%;
        min-height: 6.35rem;
        background: rgba(228, 218, 200, 0.32);
        border: 1px solid #E4DAC8;
        border-radius: 0.25rem;
        padding: 0.5rem;
    }

    .empty-badge {
        width: 5.25rem;
        height: 5.25rem;
        border: 2px dashed #E4DAC8;
        border-radius: 0.25rem;
    }

    .empty-badge::before {
        font-family: "Material Icons";
        content: "\e145";
        font-size: 2rem;
        line-height: 5.1rem;
        position: absolute;
        left: 1.5rem;
        color: #E4DAC8;
    }

    .goods-picker-drag-zone-container {
        display: grid;
        grid-template-columns: 7fr 1fr 5fr;
        justify-items: stretch;
    }

    .goods-picker-drag-zone-container > div {
        height: auto;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-items: stretch;
    }

    .items-control-panel .v-text-field {
        max-width: 17rem;
    }

    .supplies-control-panel .v-text-field {
        max-width: 11.25rem;
    }

    .supplies-control-panel .controls  {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .filters-btn,
    .clear-btn {
        font-size: 1rem;
        color: #968878;
        text-transform: none;
        letter-spacing: normal;
        max-width: 8rem;
        border-color: #E4DAC8;
        margin-left: 0.5rem;
        margin-top: 0.6rem;
        padding: 0 0.5rem;
    }

    .supplies-control-panel .filters-panel {
        display: grid;
        grid-template-columns: 3fr 2fr;
        padding-bottom: 1rem;
    }
    .supplies-control-panel .filters-panel .bonuses-filter {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .items-container,
    .supplies-container {
        border: 1px solid #E4DAC8;
        border-radius: 0.25rem;
        padding: 0.5rem;
        max-height: 31.25rem;
    }

    .supplies-drag-zone {
        display: flex;
        flex-wrap: wrap;
        overflow-y: scroll;
    }

    .supplies-drag-zone,
    .scroller {
        max-height: 30rem;
        -ms-overflow-style: none; /* Hide scrollbar for Internet Explorer, Edge */
        scrollbar-width: none; /* Hide scrollbar for Firefox */
    }

    .items-drag-zone::-webkit-scrollbar,
    .supplies-drag-zone::-webkit-scrollbar,
    .scroller::-webkit-scrollbar {
        display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
    }

    .items-row {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        padding-bottom: 0.25rem;
    }

    .goods-picker-drop-zone,
    .items-row,
    .supplies-drag-zone {
        column-gap: 0.3rem;
        row-gap: 0.25rem;
    }

    @media only screen 
        and (min-device-width: 768px) 
        and (max-device-width: 1024px) 
        and (orientation: landscape) {
        .items-row {
            grid-template-columns: repeat(5, 1fr);
        }

        .goods-picker-drag-zone-container {
            grid-template-columns: 7fr 1fr 5.65fr;
        }
    }

    @media only screen 
        and (min-device-width: 768px) 
        and (max-device-width: 1024px) 
        and (orientation: portrait) {
        .stats-panel {
            max-width: 100%;
        }

        .items-row {
            grid-template-columns: repeat(5, 1fr);
        }

        .goods-picker-drag-zone-container {
            grid-template-columns: 8fr 0.3fr 4.9fr;
        }
    }

    @media screen and (min-width: 1904px) {
        .stats-panel {
            max-width: 1800px;
        }

        .items-row {
            grid-template-columns: repeat(10, 1fr);
        }

        .goods-picker-drag-zone-container {
            grid-template-columns: 9.5fr 1.5fr 7.5fr;
        }
    }
</style>