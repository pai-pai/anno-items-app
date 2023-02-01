<script>
    import { BONUSES_MAPPING } from '../constants';
    import AnnoCard from './basic/AnnoCard.vue';
    import Bage from './basic/Bage.vue';
    import ColumnsBlock from './basic/ColumnsBlock.vue';
    
    export default {
        name: "SupplyCard",
        props: [ "item" ],
        components: {
            AnnoCard,
            Bage,
            ColumnsBlock,
        },
        computed: {
            SupplyColumnsConfig() {
                const bonuses = Object.fromEntries(
                    Object.entries(this.item.bonuses).filter(([key, value]) => value));
                const values = [ this.item.base_morale, this.item.combined_morale_per_50t ].concat(
                    Object.values(bonuses));
                let labels = [ "Base", "Per 50t" ];
                Object.keys(bonuses).forEach((bonus) => { labels.push(BONUSES_MAPPING[bonus]); });
                return {
                    titles: [ "Morale", "Expedition Bonuses" ],
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
                <Bage
                    :image_src="item.image_src"
                    height="3.125rem"
                    width="3.125rem"
                />
                <div>
                    <p class="regular-text font-weight-bold">{{ item.name }}</p>
                    <template v-if="item.extra_rations">
                        <p class="smallest-text font-italic">Ration</p>
                    </template>
                </div>
            </div>
            
            <ColumnsBlock :columnsConfig="SupplyColumnsConfig" />
        </AnnoCard>
    </v-lazy>
  </template>