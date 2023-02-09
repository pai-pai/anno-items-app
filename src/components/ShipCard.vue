<script>
    import { BONUSES_MAPPING } from '../constants';
    import AnnoCard from './basic/AnnoCard.vue';
    import Badge from './basic/Badge.vue';
    import ColumnsBlock from './basic/ColumnsBlock.vue';
    
    export default {
        name: "ShipCard",
        props: [ "item" ],
        components: {
            AnnoCard,
            Badge,
            ColumnsBlock,
        },
        computed: {
            ShipsColumnsConfig() {
                const values = [ this.item.cargo_slots, this.item.item_slots ].concat(
                    Object.values(this.item.bonuses));
                let labels = [ "Cargo Slots", "Item Slots" ];
                Object.keys(this.item.bonuses).forEach((bonus) => { labels.push(BONUSES_MAPPING[bonus]); });
                return {
                    titles: [ "Slots", "Expedition Bonuses" ],
                    labels: labels,
                    values: values,
                    columns: 2
                }
            }
        }
    }
</script>

<template>
    <v-lazy :options="{ threshold: .5 }" transition="fade-transition">
        <AnnoCard>
            <div class="header underlined-bottom">
                <Badge
                    :image_src="item.image_src"
                    height="3.125rem"
                    width="3.125rem"
                />
                <div>
                    <p class="regular-text font-weight-bold">{{ item.name }}</p>
                    <ul class="ship-types smallest-text flat-list font-italic">
                        <li v-for="shipType in item.types">{{ shipType }}</li>
                    </ul>
                </div>
            </div>
            
            <ColumnsBlock :columnsConfig="ShipsColumnsConfig" />
        </AnnoCard>
    </v-lazy>
  </template>


<style scoped>
    .ship-types {
        padding-top: 0.1rem;
        letter-spacing: -0.02rem;
    }

    .ship-types li:not(:last-child):after {
        content: ' · ';
    }
</style>