<script>
    import { BONUSES_MAPPING } from '../constants';
    import ColumnsBlock from './ColumnsBlock.vue';
    
    export default {
        name: "ItemCard",
        props: [ "item" ],
        components: {
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
        <v-card class="item-card fill-height" variant="outlined">
            <v-card-item class="card-header">
                <template v-slot:prepend>
                    <div :class="[`item-bage item-rarity-` + item.rarity_order]">
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
                <v-card-subtitle class="item-traits font-italic">
                    <ul>
                        <li v-for="trait in item.traits">{{ trait }}</li>
                    </ul>
                </v-card-subtitle>
            </v-card-item>
            
            <v-card-text>
                <ColumnsBlock :columnsConfig="BonusesColumnsConfig" />            
                <template v-if="item.dlc">
                    <div class="dlc font-italic font-weight-bold text-end">{{ item.dlc }} DLC</div>
                </template>
            </v-card-text>
        </v-card>
    </v-lazy>
  </template>


<style scoped>
    .item-card {
        padding: 0.625rem;
    }

    .card-header {
        padding: 0 0 0.5rem 0;
        border-bottom: 1px solid #E4DAC8;
    }

    .item-bage {
        padding: 0.3125rem;
        border-radius: 0.25rem;
        border-width: 2px;
        border-style: solid;
    }

    .item-bage.item-rarity-0 {
        border-color: #968878;
        background-color: #F6F3EF;
    }

    .item-bage.item-rarity-1 {
        border-color: #8BA679;
        background-color: #E6F0DF;
    }

    .item-bage.item-rarity-2 {
        border-color: #729AC6;
        background-color: #CEE2EC;
    }

    .item-bage.item-rarity-3 {
        border-color: #AB81BF;
        background-color: #DFCFE7;
    }

    .item-bage.item-rarity-4 {
        border-color: #D8AC35;
        background-color: #FCECC2;
    }

    .item-bage.item-rarity--1 {
        border-color: #E4DAC8;
        background-color: #FFFEFB;
    }

    .item-card .item-name {
        font-size: 1rem;
        line-height: 130%;
        white-space: normal;
    }

    .item-card .item-traits {
        font-size: 0.75rem;
        letter-spacing: -0.02rem;
    }

    .item-card .item-traits ul {
        list-style-type: none;
    }

    .item-card .item-traits ul li {
        display: inline;
    }

    .item-card .item-traits ul li:not(:last-child):after {
        content: ' · ';
    }

    .item-card .v-card-text {
        padding: 0;
    }

    .item-card .bonuses {
        padding: 0.5rem 0 0 0;
    }

    .item-card .dlc {
        padding-top: 0.75rem; 
    }
</style>