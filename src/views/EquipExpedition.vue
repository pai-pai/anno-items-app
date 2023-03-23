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
            showDetails: false,
            showItemsFilters: false,
            showSuppliesFilters: false,
            dragDropZoneCount: 0,
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
            showItemsFilters: {
                handler() {
                    this.resizePickerContainer("items");
                },
                flush: "post"
            },
            itemsBonusesFilter: {
                handler() {
                    this.resizePickerContainer("items");
                },
                flush: "post"
            },
            searchItem: {
                handler() {
                    this.resizePickerContainer("items");
                },
                flush: "post"
            },
            showSuppliesFilters: {
                handler() {
                    this.resizePickerContainer("supplies");
                },
                flush: "post"
            },
            suppliesBonusesFilter: {
                handler() {
                    this.resizePickerContainer("supplies");
                },
                flush: "post"
            },
            suppliesRationFilter: {
                handler() {
                    this.resizePickerContainer("supplies");
                },
                flush: "post"
            },
            searchSupply: {
                handler() {
                    this.resizePickerContainer("supplies");
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
                pickedShipItems, searchItem, itemsBonusesFilter,
                searchSupply, suppliesBonusesFilter, suppliesRationFilter
            } = storeToRefs(expeditionStore);
            const { name, mdAndDown, width } = useDisplay();
            const narrowScreen = computed(() => {
                return width.value <= 960;
            }); 
            const itemsPerRow = computed(() => {
                const widthValue = width.value;
                if (widthValue < 320) return 2;
                if (widthValue < 410) return 3;
                if (widthValue < 498) return 4;
                if (widthValue < 586) return 5;
                if (widthValue < 675) return 6;
                if (widthValue < 764) return 7;
                if (widthValue < 853) return 8;
                if (widthValue < 942) return 9;
                switch (name.value) {
                    case "xs": return 4;
                    case "sm": return 5;
                    case "md": return 5;
                    case "lg": return 7;
                    case "xl": return 10;
                    case "xxl": return 10;
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
                pickedShipItems,
                expeditionStore,
                itemsStore,
                suppliesStore,
                itemsPerRow,
                mdAndDown,
                narrowScreen,
                BONUSES_MAPPING,
                searchItem,
                itemsBonusesFilter,
                searchSupply,
                suppliesBonusesFilter,
                suppliesRationFilter,
                itemsFiltered: computed(() => expeditionStore.itemsFiltered),
                suppliesFiltered: computed(() => expeditionStore.suppliesFiltered),
                changeItemsFilter: (value) => expeditionStore.changeItemsFilter(value),
                changeSuppliesFilter: (value) => expeditionStore.changeSuppliesFilter(value),
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
            },
            availableShipItemSlots() {
                if (!this.pickedShip) return;
                return Math.max(this.pickedShip.item_slots - this.pickedShipItems.length, 0);
            },
            availableRegularSlots() {
                if (!this.pickedShip) return;
                return this.pickedShip.total_slots - this.pickedItems.length - this.availableShipItemSlots;
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
                const dropZone = document.querySelector(".goods-picker-drop-zone");
                if (dropZone) {
                    dropZone.classList.add("dragover");
                }
                const crt = evt.target.cloneNode(true);
                crt.setAttribute("id", `${item._id}-clone`);
                crt.style.position = "absolute";
                crt.style.top = "-1000px";
                crt.style.right = "-1000px";
                crt.style.zIndex = "10000";
                crt.style.cursor = "grabbing";
                document.body.appendChild(crt);
                evt.dataTransfer.setDragImage(crt, 10, 10);
                evt.dataTransfer.dropEffect = "move";
                evt.dataTransfer.effectAllowed = "move";
                evt.dataTransfer.setData("itemId", item._id);
                evt.dataTransfer.setData("itemType", itemType);
            },
            dragMovingItem(evt) {
                evt.target.style.cursor = "grabbing";
            },
            resetDropzone() {
                this.dragDropZoneCount = 0;
                const dropZone = document.querySelector(".goods-picker-drop-zone");
                if (dropZone) {
                    dropZone.classList.remove("dragover");
                }
            },
            dragItemEnd(evt, item) {
                this.resetDropzone();
                evt.target.style.removeProperty("cursor");
                const crt = document.getElementById(`${item._id}-clone`);
                if (!crt) { return; }
                crt.remove();
            },
            dropItem(evt) {
                this.resetDropzone();
                const itemType = evt.dataTransfer.getData("itemType");
                const store = itemType == "item" ? this.itemsStore : this.suppliesStore;
                const dropedItem = store.itemById(evt.dataTransfer.getData("itemId"));
                if (dropedItem) {
                    this.expeditionStore.pickItem(dropedItem);
                }
            },
            toggleDetails() {
                this.showDetails = !this.showDetails;
            },
            toggleFiltersItems() {
                this.showItemsFilters = !this.showItemsFilters;
            },
            toggleFiltersSupplies() {
                this.showSuppliesFilters = !this.showSuppliesFilters;
            },
            resizePickerContainer(itemsType) {
                if (!document.querySelector(".goods-picker-drag-zone-container")) { return; }
                const sectionHeight = document.querySelector(".goods-picker-drag-zone-container").offsetHeight;
                const controlPanelHeight = document.querySelector(`.${itemsType}-control-panel`).offsetHeight;
                const container = document.querySelector(`.${itemsType}-container`);
                const scroller = document.querySelector(`.${itemsType}-drag-zone`);
                const innerScroller = document.querySelector(`.${itemsType}-drag-zone .scroller`);
                const containerScrollerDiff = container.offsetHeight - scroller.offsetHeight;
                const blockHeight = sectionHeight - controlPanelHeight;

                container.style.maxHeight = blockHeight + "px";
                scroller.style.maxHeight = blockHeight - containerScrollerDiff + "px";
                if (innerScroller) { innerScroller.style.maxHeight = scroller.style.maxHeight; }
            },
            toggleSection(evt) {
                if (evt.target.classList.contains("folded")) {
                    evt.target.parentNode.childNodes[1].classList.remove("d-none");
                    evt.target.parentNode.childNodes[2].classList.remove("d-none");
                    evt.target.classList.remove("folded");
                } else {
                    evt.target.classList.add("folded");
                    evt.target.parentNode.childNodes[1].classList.add("d-none");
                    evt.target.parentNode.childNodes[2].classList.add("d-none");
                }
            }
        }
    })
</script>

<template>
    <v-container class="mb-5 pt-0">
        <div class="stats-panel font-italic">
                <v-container class="pa-0 w-100">
                    <v-row :class="[`${ narrowScreen ? 'pt-3' : '' } ma-0`]">
                        <v-col cols="11" :class="[`${ narrowScreen ? 'py-0' : 'pa-0' }`]">
                            <div class="bonuses-row">
                                <div style="grid-area: crafting-l">Crafting</div>
                                <div style="grid-area: crafting-v" class="font-weight-bold">{{ expeditionBonuses.crafting || "-" }}</div>
                                <div style="grid-area: hunting-l">Hunting</div>
                                <div style="grid-area: hunting-v" class="font-weight-bold">{{ expeditionBonuses.hunting || "-" }}</div>

                                <div style="grid-area: diplomacy-l">Diplomacy</div>
                                <div style="grid-area: diplomacy-v" class="font-weight-bold">{{ expeditionBonuses.diplomacy || "-" }}</div>
                                <div style="grid-area: medicine-l">Medicine</div>
                                <div style="grid-area: medicine-v" class="font-weight-bold">{{ expeditionBonuses.medicine || "-" }}</div>

                                <div style="grid-area: faith-l">Faith</div>
                                <div style="grid-area: faith-v" class="font-weight-bold">{{ expeditionBonuses.faith || "-" }}</div>
                                <div style="grid-area: naval-power-l">Naval Power</div>
                                <div style="grid-area: naval-power-v" class="font-weight-bold">{{ expeditionBonuses.naval_power || "-" }}</div>

                                <div style="grid-area: force-l">Force</div>
                                <div style="grid-area: force-v" class="font-weight-bold">{{ expeditionBonuses.force || "-" }}</div>
                                <div style="grid-area: navigation-l">Navigation</div>
                                <div style="grid-area: navigation-v" class="font-weight-bold">{{ expeditionBonuses.navigation || "-" }}</div>

                                <div style="grid-area: ration-l" :class="[`${narrowScreen ? 'py-2' : ''}`]">Ration</div>
                                <div style="grid-area: ration-v" :class="[`${narrowScreen ? 'py-2' : ''} font-weight-bold`]">{{ rationBonus ? "Yes": "No" }}</div>
                                <div style="grid-area: morale-l" :class="[`${narrowScreen ? 'py-2' : ''}`]">Morale</div>
                                <div style="grid-area: morale-v" :class="[`${narrowScreen ? 'py-2' : ''} font-weight-bold`]">{{ moraleBonus || "-" }}</div>

                                <div style="grid-area: traits-l">Traits</div>
                                <div style="grid-area: traits-v" class="font-weight-bold">{{ traits.join(", ") || "-" }}</div>
                            </div>
                        </v-col>
                        <v-col cols="1" class="pa-0 text-right">
                            <v-btn
                                :disabled="!pickedShip"
                                variant="plain"
                                class="reset-expedition action-btn-icon pa-0"
                                @click="reset()"
                            ><v-icon icon="md:refresh"></v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            <div class="divider"></div>
        </div>

        <v-row justify="start" class="ships-picker">
            <div class="text-h6 secondary-text-color pt-8 pb-1">
                Pick a ship
            </div>
            <div class="ships-picker-container">
                <v-container class="d-flex justify-center align-center" v-if="ships.length === 0">
                    <v-progress-circular bg-color="rgba(55, 162, 152, 0.2)" color="#37A298" indeterminate :size="50" />
                </v-container>
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
                <div class="text-h6 secondary-text-color pt-8 pb-1">
                    Add specialists, items and supplies
                    <v-btn
                        v-if="narrowScreen" 
                        :disabled="pickedItems.length === 0 && !showDetails"
                        variant="plain"
                        class="action-btn-icon pa-0"
                        @click="toggleDetails"
                    ><v-icon :icon="`${ showDetails ? 'md:expand_less': 'md:expand_more' }`"></v-icon></v-btn>
                    <v-btn
                        v-else
                        :disabled="pickedItems.length === 0 && !showDetails"
                        variant="outlined"
                        class="filters-btn"
                        @click="toggleDetails"
                        :append-icon="`${ showDetails ? 'expand_less': 'expand_more' }`"
                    >{{ showDetails ? 'Hide details' : 'Show details' }}</v-btn>
                </div>
                <div
                    class="goods-picker-drop-zone"
                    :style="[`grid-template-columns: repeat(${ pickedShip.total_slots }, 5.25rem) auto;`]"
                    @drop="dropItem($event)"
                    @dragover.prevent
                    @dragenter.prevent
                >
                    <div
                        v-for="(item, index) in pickedItems"
                        class="tabular-column"
                        :style="[`grid-column: ${ index + 1 } / ${ index + 2 };`]"
                    >
                        <Badge
                            :class="[`item-rarity-${item.rarity_order === undefined ? '-1': item.rarity_order } ${ isShipItem(item) ? 'ship-item' : '' }`]"
                            :image_src="item.image_src"
                            height="4.375rem"
                            width="4.375rem"
                            clearable
                            @remove="removeItem(item, index)"
                        />
                        <template v-if="showDetails">
                            <div
                                v-for="(value, bonus) in item.bonuses"
                                :class="[`bonus ${ bonus } value-${ !!value }`]"
                                :title="[`${BONUSES_MAPPING[bonus]}`]"
                            >
                                {{ value ? value : '' }}
                            </div>
                            <div :class="[`bonus morale value-${ !!item.combined_morale_per_50t }`]" title="Morale">
                                {{ item.combined_morale_per_50t ? item.combined_morale_per_50t : '' }}
                            </div>
                            <div class="bonus ration">{{ item.extra_rations ? 'Ration' : '' }}</div>
                            <div class="bonus traits">{{ item.traits ? item.traits.join(' ') : '' }}</div>
                        </template>
                    </div>
                    <div
                        v-for="index in availableRegularSlots"
                        class="tabular-column"
                        :style="[`grid-column: ${ index + pickedItems.length } / ${ index + 1 + pickedItems.length };`]"
                    >
                        <div class="empty-badge regular"></div>
                    </div>
                    <div
                        v-for="index in availableShipItemSlots"
                        class="tabular-column"
                        :style="[`grid-column: ${ availableRegularSlots + index + pickedItems.length } / ${ availableRegularSlots + index + 1 + pickedItems.length };`]"
                    >
                        <div class="empty-badge ship"></div>
                    </div>
                </div>
            </v-row>

            <v-row class="goods-picker-drag-zone-container">
                <div>
                    <div v-if="narrowScreen" class="text-h6 secondary-text-color pt-4 pb-0 toggler" @click="toggleSection($event)">
                        Specialists & Items
                    </div>
                    <div class="items-control-panel">
                        <template v-if="narrowScreen">
                            <v-container class="controls pa-0">
                                <v-row class="control-panel mt-5">
                                    <v-col cols="9" class="px-3 py-0">
                                        <v-text-field
                                            clearable
                                            clear-icon="close"
                                            label="Find item by name"
                                            variant="underlined"
                                            density="compact"
                                            class="search-field"
                                            v-model="searchItem" />
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col cols="2" class="pl-0 pr-3 py-0 text-right">
                                        <v-btn
                                            color="#FFFEFB"
                                            icon="md:filter_alt"
                                            class="filters-icon-btn"
                                            @click.stop="showItemsFilters = !showItemsFilters"
                                        ></v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <div class="filters-panel" v-if="itemsBonusesFilter.length > 0">
                                <div class="bonuses-filter">
                                    <template v-for="(value, key) in BONUSES_MAPPING">
                                        <v-chip
                                            class="mr-2 mb-2"
                                            v-if="itemsBonusesFilter.includes(key)"
                                            closable
                                            @click:close="changeItemsFilter(key)"
                                        >
                                            {{ value }}
                                        </v-chip>
                                    </template>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="controls">
                                <v-text-field
                                    clearable
                                    clear-icon="close"
                                    label="Find item by name"
                                    variant="underlined"
                                    density="compact"
                                    hide-details
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
                        </template>
                    </div>
                    <div class="items-container">
                        <div :class="[`items-drag-zone ${getItems(itemsPerRow).length === 0 ? 'd-flex' : ''}`]">
                            <div v-if="getItems(itemsPerRow).length === 0" class="no-data-placeholder pa-3 w-100 text-subtitle-1 text-center">
                                No items found
                            </div>
                            <DynamicScroller
                                v-else
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
                                                :isdraggable="pickedItems.length < pickedShip.total_slots"
                                                @dragstart="dragItem($event, it, 'item')"
                                                @drag="dragMovingItem($event)"
                                                @dragend="dragItemEnd($event, it)"
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
                    <div v-if="narrowScreen" class="text-h6 secondary-text-color pt-7 pb-0 toggler" @click="toggleSection($event)">
                        Supplies
                    </div>
                    <div class="supplies-control-panel">
                        <template v-if="narrowScreen">
                            <v-container class="controls pa-0">
                                <v-row class="control-panel mt-5">
                                    <v-col cols="9" class="px-3 py-0">
                                        <v-text-field
                                            clearable
                                            clear-icon="close"
                                            label="Find goods by name"
                                            variant="underlined"
                                            density="compact"
                                            class="search-field"
                                            v-model="searchSupply" />
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col cols="2" class="pl-0 pr-3 py-0 text-right">
                                        <v-btn
                                            color="#FFFEFB"
                                            icon="md:filter_alt"
                                            class="filters-icon-btn"
                                            @click.stop="showSuppliesFilters = !showSuppliesFilters"
                                        ></v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <div class="filters-panel" v-if="suppliesBonusesFilter.length > 0 || suppliesRationFilter">
                                <div class="bonuses-filter">
                                    <template v-for="(value, key) in BONUSES_MAPPING">
                                        <v-chip
                                            class="mr-2 mb-2"
                                            v-if="suppliesBonusesFilter.includes(key)"
                                            closable
                                            @click:close="changeSuppliesFilter(key)"
                                        >
                                            {{ value }}
                                        </v-chip>
                                    </template>
                                    <v-chip
                                        class="mr-2 mb-2"
                                        v-if="suppliesRationFilter"
                                        closable
                                        @click:close="suppliesRationFilter = false"
                                    >
                                        Ration
                                    </v-chip>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="controls">
                                <v-text-field
                                    clearable
                                    clear-icon="close"
                                    label="Find goods by name"
                                    variant="underlined"
                                    density="compact"
                                    hide-details
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
                        </template>
                    </div>
                    <div class="supplies-container">
                        <div class="supplies-drag-zone">
                            <div v-if="getSupplies.length === 0" class="no-data-placeholder pa-3 w-100 text-subtitle-1 text-center">
                                No supplies found
                            </div>
                            <BadgeWithTooltip
                                v-else
                                v-for="supply in getSupplies"
                                class="item-rarity--1"
                                :image_src="supply.image_src"
                                height="4.375rem"
                                width="4.375rem"
                                :isdraggable="pickedItems.length < pickedShip.total_slots"
                                @dragstart="dragItem($event, supply, 'supply')"
                                @drag="dragMovingItem($event)"
                                @dragend="dragItemEnd($event, supply)"
                            >
                                <template #content>
                                    <SupplyTooltip :item="supply" />
                                </template>
                            </BadgeWithTooltip>
                        </div>
                    </div>
                </div>
            </v-row>
        </template>

        <v-navigation-drawer
            v-if="narrowScreen"
            v-model="showItemsFilters"
            color="#FFFEFB"
            temporary
        >
            <v-container class="filters-drawer">
                <v-row>
                    <v-col cols="12" class="text-h6 secondary-text-color pt-0">
                        Filter specialists & items
                    </v-col>
                </v-row>
                <v-row v-for="(value, key) in BONUSES_MAPPING">
                    <v-col cols="12" class="py-1">
                        <v-checkbox
                            v-model="itemsBonusesFilter"
                            :label="value"
                            :value="key"
                            density="compact"
                            hide-details
                        ></v-checkbox>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="py-1">
                        <v-btn
                            v-if="itemsFiltered"
                            variant="outlined"
                            class="clear-btn mt-2 mx-0"
                            @click="clearFilters('item')"
                        >Clear all</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-navigation-drawer>

        <v-navigation-drawer
            v-if="narrowScreen"
            v-model="showSuppliesFilters"
            color="#FFFEFB"
            temporary
        >
            <v-container class="filters-drawer">
                <v-row>
                    <v-col cols="12" class="text-h6 secondary-text-color pt-0">
                        Filter supplies
                    </v-col>
                </v-row>
                <v-row v-for="(value, key) in BONUSES_MAPPING">
                    <v-col cols="12" class="py-1">
                        <v-checkbox
                            v-model="suppliesBonusesFilter"
                            :label="value"
                            :value="key"
                            density="compact"
                            hide-details
                        ></v-checkbox>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="py-1">
                        <v-checkbox
                            v-model="suppliesRationFilter"
                            label="Ration"
                            density="compact"
                            hide-details
                        ></v-checkbox>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="py-1">
                        <v-btn
                            v-if="suppliesFiltered"
                            variant="outlined"
                            class="clear-btn mt-2 mx-0"
                            @click="clearFilters('supply')"
                        >Clear all</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-navigation-drawer>
    </v-container>
</template>

<style scoped>
    .stats-panel {
        display: flex;
        flex-direction: column;
        background: #FFFEFB;
        position: fixed;
        max-width: 1200px;
        width: 100%;
        z-index: 1003;
        margin-top: 0.75rem;
        padding: 1rem 1rem 0 1rem;
        left: 50%;
        transform: translateX(-50%);
    }

    .bonuses-row {
        display: grid;
        grid-template-columns: 12% 2% 5% 12% 2% 5% 8% 2% 5% 8% auto;
        grid-template-rows: auto;
        grid-template-areas:
            "crafting-l crafting-v . hunting-l hunting-v . ration-l ration-v . traits-l traits-v"
            "diplomacy-l diplomacy-v . medicine-l medicine-v . morale-l morale-v . . ."
            "faith-l faith-v . naval-power-l naval-power-v . . . . . ."
            "force-l force-v . navigation-l navigation-v . . . . . ."
    }

    .action-btn-icon {
        min-width: 2.5rem;
    }

    .stats-panel .divider {
        width: 100%;
        border-bottom: 1px solid #E4DAC8;
        grid-column-start: 1;
        grid-column-end: 5;
        padding-bottom: 1rem;
    }

    .ships-picker {
        padding: 9rem 1rem 0 1rem;
    }

    .ships-picker-container {
        width: 100%;
    }

    .ships-picker-container .v-lazy {
        height: 100%;
    }

    .goods-picker-drop-zone-container {
        padding: 0 1rem 1rem 1rem;
    }

    .goods-picker-drop-zone-container > div:first-child {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding-bottom: 0.5rem;
    }

    .goods-picker-drop-zone {
        display: grid;
        width: 100%;
        min-height: 6.35rem;
        background: rgba(228, 218, 200, 0.32);
        border: 1px solid #E4DAC8;
        border-radius: 0.25rem;
        padding: 0.5rem;
    }

    .goods-picker-drop-zone.dragover {
        background: rgba(244, 233, 220, 0.32);
    }

    .goods-picker-drop-zone .tabular-column .bonus {
        min-height: 1.5rem;
        text-align: right;
        font-style: italic;
        font-weight: bold;
        line-height: 1.5rem;
        padding: 0 0.25rem;
    }

    .goods-picker-drop-zone .tabular-column .bonus:nth-child(2n+1) {
        background-color: #fcfbf9;
    }

    .goods-picker-drop-zone .tabular-column .bonus::before {
        font-family: "anno-icons";
        font-size: 1.25rem;
        font-style: normal;
        line-height: 1.5rem;
        position: absolute;
        left: 0.25rem;
        color: rgba(150, 136, 120, 0.3);
    }

    .goods-picker-drop-zone .tabular-column .bonus:hover::before {
        color: rgba(150, 136, 120, 0.8);
    }

    .goods-picker-drop-zone .tabular-column .bonus.value-true.crafting::before {
        content: "\e900";
    }

    .goods-picker-drop-zone .tabular-column .bonus.value-true.faith::before {
        content: "\e901";
    }

    .goods-picker-drop-zone .tabular-column .bonus.value-true.diplomacy::before {
        content: "\e902";
    }

    .goods-picker-drop-zone .tabular-column .bonus.value-true.force::before {
        content: "\e903";
    }

    .goods-picker-drop-zone .tabular-column .bonus.value-true.hunting::before {
        content: "\e904";
    }

    .goods-picker-drop-zone .tabular-column .bonus.value-true.medicine::before {
        content: "\e905";
    }

    .goods-picker-drop-zone .tabular-column .bonus.value-true.naval_power::before {
        content: "\e906";
    }

    .goods-picker-drop-zone .tabular-column .bonus.value-true.navigation::before {
        content: "\e907";
    }

    .goods-picker-drop-zone .tabular-column .bonus.value-true.morale::before {
        font-family: "Material Icons";
        content: "\e87d";
        color: rgba(150, 136, 120, 0.2);
    }

    .goods-picker-drop-zone .tabular-column .bonus.value-true.morale:hover::before {
        color: rgba(150, 136, 120, 0.7);
    }

    .goods-picker-drop-zone .tabular-column .bonus.ration,
    .goods-picker-drop-zone .tabular-column .bonus.traits
     {
        font-size: 0.75rem;
        font-weight: normal;
    }

    .goods-picker-drop-zone .tabular-column .bonus.traits
     {
        line-height: 1.25rem;
        text-align: left;
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

    .empty-badge.ship::after {
        font-family: "anno-icons";
        content: '\e908';
        font-size: 4.375rem;
        color: rgba(228, 218, 200, 0.3);
        line-height: 5rem;
        position: absolute;
        left: 0.35rem;
        z-index: 1;
    }

    .goods-picker-drop-zone {
        overflow-x: scroll;
    }

    .goods-picker-drop-zone {
        -ms-overflow-style: none; /* Hide scrollbar for Internet Explorer, Edge */
        scrollbar-width: none; /* Hide scrollbar for Firefox */
    }

    .goods-picker-drop-zone::-webkit-scrollbar {
        display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
    }

    .goods-picker-drag-zone-container {
        display: grid;
        grid-template-columns: 7.1fr 0.7fr 5.1fr;
        justify-items: stretch;
        height: 35rem;
        padding: 0 1rem;
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

    .controls  {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding-bottom: 0.5rem;
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

    .filters-panel {
        display: grid;
        padding-top: 0.5rem;
        padding-bottom: 1rem;
        grid-template-columns: 3fr 2fr;
    }

    .filters-panel .bonuses-filter {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .items-container,
    .supplies-container {
        border: 1px solid #E4DAC8;
        border-radius: 0.25rem;
        padding: 0.5rem;
        max-height: 31.125rem;
    }

    .supplies-drag-zone {
        display: flex;
        flex-wrap: wrap;
        overflow-y: scroll;
    }

    .items-drag-zone,
    .supplies-drag-zone,
    .scroller {
        max-height: 30rem;
        min-height: 11rem;
    }

    .supplies-drag-zone,
    .scroller {
        -ms-overflow-style: none; /* Hide scrollbar for Internet Explorer, Edge */
        scrollbar-width: none; /* Hide scrollbar for Firefox */
    }

    .scroller {
        height: 100%;
    }

    .items-drag-zone::-webkit-scrollbar,
    .supplies-drag-zone::-webkit-scrollbar,
    .scroller::-webkit-scrollbar {
        display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
    }

    .items-row {
        display: flex;
        padding-bottom: 0.25rem;
    }

    .goods-picker-drop-zone,
    .items-row,
    .supplies-drag-zone {
        column-gap: 0.3rem;
        row-gap: 0.25rem;
    }

    .no-data-placeholder {
        margin: auto;
    }

    @media screen and (min-width: 320px) and (max-width: 960px) {
        .stats-panel {
            padding-top: 0;
        }

        .bonuses-row {
            grid-template-columns: 35% 12% auto 35% 12%;
            grid-template-areas: 
                "crafting-l crafting-v . hunting-l hunting-v"
                "diplomacy-l diplomacy-v . medicine-l medicine-v"
                "faith-l faith-v . naval-power-l naval-power-v"
                "force-l force-v . navigation-l navigation-v"
                "ration-l ration-v . morale-l morale-v"
                "traits-l traits-v traits-v traits-v traits-v";
        }

        .supplies-container {
            max-height: 31.125rem !important;
        }

        .items-drag-zone,
        .supplies-drag-zone,
        .scroller {
            max-height: 30rem !important;
        }

        .toggler {
            vertical-align: bottom;
        }

        .toggler::before {
            font-family: "Material Icons";
            content: "\e5d6";
            font-size: 1.4rem;
            color: rgba(150,136,120, 0.5);
        }

        .toggler.folded::before {
            content: "\e5d7";
        }

        .filters-icon-btn {
            height: 3rem;
            width: 3rem;
            color: #968878;
        }

        .filters-panel,
        .filters-panel .bonuses-filter {
            display: flex;
        }

        .filters-drawer {
            padding-top: 2.7rem;
        }

        .clear-btn {
            width: 45%;
        }

        .controls .control-panel {
            margin: 0;
        }

        .supplies-control-panel .v-text-field {
            max-width: none;
        }

        .ships-picker {
            padding-top: 13rem;
        }

        .goods-picker-drop-zone-container > div.toggler {
            display: block;
        }

        .goods-picker-drag-zone-container {
            display: flex;
            flex-direction: column;
            height: auto;
        }
    }

    @media screen and (min-width: 960px) and (max-width: 1280px) {
        .stats-panel {
            max-width: 900px;
        }

        .goods-picker-drag-zone-container {
            grid-template-columns: 6.2fr 1.3fr 4.7fr;
        }

        .supplies-control-panel .filters-panel {
            display: flex;
            flex-direction: column;
            row-gap: 1rem;
        }
    }

    @media screen and (min-width: 1280px) and (max-width: 1904px) {
        .stats-panel {
            max-width: 1200px;
        }
    }

    @media (min-width: 1904px) {
        .stats-panel {
            max-width: 1800px;
        }

        .goods-picker-drag-zone-container {
            grid-template-columns: 9.5fr 1.4fr 7.65fr;
        }
    }
</style>