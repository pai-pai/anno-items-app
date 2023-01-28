<script>
    import { BONUSES_MAPPING } from '../constants';
    import ColumnsBlock from './ColumnsBlock.vue';
    
    export default {
        name: "ShipCard",
        props: [ "item" ],
        components: {
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
        <v-card class="ship-card fill-height" variant="outlined">
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
                <v-card-subtitle class="item-traits font-italic">
                    <ul>
                        <li v-for="ship_type in item.types">{{ ship_type }}</li>
                    </ul>
                </v-card-subtitle>
            </v-card-item>
            
            <v-card-text>
                <ColumnsBlock :columnsConfig="ShipsColumnsConfig" />  
            </v-card-text>
        </v-card>
    </v-lazy>
  </template>


<style scoped>
    .ship-card {
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

    .ship-card .item-name {
        font-size: 1rem;
        line-height: 130%;
        white-space: normal;
    }

    .ship-card .item-traits {
        font-size: 0.75rem;
        letter-spacing: -0.02rem;
    }

    .ship-card .item-traits ul {
        list-style-type: none;
    }

    .ship-card .item-traits ul li {
        display: inline;
    }

    .ship-card .item-traits ul li:not(:last-child):after {
        content: ' · ';
    }

    .ship-card .v-card-text {
        padding: 0;
    }

    .ship-card .bonuses {
        padding: 0.5rem 0 0 0;
    }

    .ship-card .dlc {
        padding-top: 0.75rem; 
    }
</style>