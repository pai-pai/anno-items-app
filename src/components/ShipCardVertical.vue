<script>
    import { BONUSES_MAPPING } from '../constants';
    import AnnoCard from './basic/AnnoCard.vue';
    import Badge from './basic/Badge.vue';
    import ColumnsBlock from './basic/ColumnsBlock.vue';
    
    export default {
        name: "ShipCardVertical",
        props: [ "item" ],
        components: {
            AnnoCard,
            Badge,
            ColumnsBlock,
        },
        computed: {
            SlotsColumnsConfig() {
                const values = [ this.item.cargo_slots, this.item.item_slots ].concat(
                    Object.values(this.item.bonuses));
                let labels = [ "Cargo Slots", "Item Slots" ];
                Object.keys(this.item.bonuses).forEach((bonus) => { labels.push(BONUSES_MAPPING[bonus]); });
                return {
                    labels: labels,
                    values: values,
                    columns: 1
                }
            }
        }
    }
</script>

<template>
    <v-lazy :options="{ threshold: .5 }" transition="fade-transition">
        <AnnoCard class="ship-card-vertical">
            <Badge
                :image_src="item.image_src"
                height="5.625rem"
                width="5.625rem"
            />
            <ColumnsBlock :columnsConfig="SlotsColumnsConfig" />
            <div class="ship-types">
                <ul>
                    <li v-for="ship_type in item.types">{{ ship_type }}</li>
                </ul>
            </div>
        </AnnoCard>
    </v-lazy>
</template>

<style scoped>
    .ship-card-vertical {
        width: 8.25rem;
        padding: 0.375rem;
        gap: 0.25rem;
        font-size: 0.75rem;
    }

    .active .ship-card-vertical {
        padding: calc(0.375rem - 1px);
        border: 2px solid #968878;
    }

    .locked .ship-card-vertical::before {
        font-family: "Material Icons";
        content: '\e897';
        font-size: 1.75rem;
        color: rgba(87, 77, 68, 0.75);
        line-height: 1.75rem;
        position: absolute;
        left: 0;
        top: 0.15rem;
        z-index: 1;
    }

    .ship-card-vertical .bonuses {
        padding: 0;
        font-size: 0.875rem;
    }

    .ship-card-vertical .bonuses > :nth-child(2n) {
        border-bottom: 1px solid #E4DAC8;
        padding-bottom: 0.5rem;
    }

    .ship-card-vertical .ship-types {
        width: 100%;
        font-size: 0.875rem;
        color: #968878;
    }

    .ship-card-vertical .ship-types ul {
        list-style-type: none;
    }
</style>