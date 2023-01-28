<script>
    import { BONUSES_MAPPING } from '../constants';
    import ColumnsBlock from './ColumnsBlock.vue';
    
    export default {
        name: "SupplyCard",
        props: [ "item" ],
        components: {
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
        <v-card class="supply-card fill-height" variant="outlined">
            <v-card-item class="card-header">
                <template v-slot:prepend>
                    <div class="item-bage">
                        <v-img
                            aspect-ratio="1"
                            height="3.125rem"
                            width="3.125rem"
                            :src="item.image_url"
                        />
                    </div>
                </template>
                <v-card-title class="item-name font-weight-bold align-self-stretch">
                    {{ item.name }}
                </v-card-title>
                <template v-if="item.extra_rations">
                    <v-card-subtitle class="item-traits font-italic">Ration</v-card-subtitle>
                </template>
            </v-card-item>
            
            <v-card-text>
                <ColumnsBlock :columnsConfig="SupplyColumnsConfig" />  
            </v-card-text>
        </v-card>
    </v-lazy>
  </template>


<style scoped>
    .supply-card {
        padding: 0.625rem;
    }

    .card-header {
        padding: 0 0 0.5rem 0;
        border-bottom: 1px solid #E4DAC8;
    }

    .item-bage {
        padding: 0.3125rem;
        border-radius: 0.25rem;
    }

    .supply-card .item-name {
        font-size: 1rem;
        line-height: 130%;
        white-space: normal;
    }

    .supply-card .item-traits {
        font-size: 0.75rem;
        letter-spacing: -0.02rem;
    }

    .supply-card .item-traits ul {
        list-style-type: none;
    }

    .supply-card .item-traits ul li {
        display: inline;
    }

    .supply-card .item-traits ul li:not(:last-child):after {
        content: ' · ';
    }

    .supply-card .v-card-text {
        padding: 0;
    }

    .supply-card .bonuses {
        padding: 0.5rem 0 0 0;
    }

    .supply-card .dlc {
        padding-top: 0.75rem; 
    }
</style>