<script>
    import { BONUSES_MAPPING } from '../constants';
    import AnnoCard from './basic/AnnoCard.vue';
    import Badge from './basic/Badge.vue';
    import ColumnsBlock from './basic/ColumnsBlock.vue';
    
    export default {
        name: "ItemCard",
        props: [ "item" ],
        components: {
            AnnoCard,
            Badge,
            ColumnsBlock,
        },
        computed: {
            BonusesColumnsConfig() {
                let labels = [];
                Object.keys(this.item.bonuses).forEach((bonus) => { labels.push(BONUSES_MAPPING[bonus]); });
                return {
                    labels: labels,
                    values: Object.values(this.item.bonuses),
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
                    :class="[`item-rarity-${item.rarity_order}`]"
                    :image_src="item.image_src"
                    height="3.125rem"
                    width="3.125rem"
                />
                <div>
                    <p class="regular-text font-weight-bold">{{ item.name }}</p>
                    <template v-if="item.traits.length > 0">
                        <ul class="traits smallest-text flat-list font-italic">
                            <li v-for="trait in item.traits">{{ trait }}</li>
                        </ul>
                    </template>
                </div>
            </div>
            
            <ColumnsBlock :columnsConfig="BonusesColumnsConfig" />            
            <template v-if="item.dlc.length > 0">
                <div class="dlc secondary-text-color smallest-text font-italic text-end">
                    <ul>
                        <li class="font-weight-bold" v-for="dlc in item.dlc">{{ dlc }} DLC</li>
                    </ul>
                </div>
            </template>
        </AnnoCard>
    </v-lazy>
  </template>


<style scoped>
    .traits {
        padding-top: 0.25rem;
        letter-spacing: -0.02rem;
    }

    .traits li:not(:last-child):after {
        content: ' · ';
    }

    .dlc {
        margin-top: auto;
        padding-top: 0.5rem;
    }
</style>