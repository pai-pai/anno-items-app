<script>
    import AnnoCard from './basic/AnnoCard.vue';

    export default {
        name: "SupplyTooltip",
        props: [ "item" ],
        components: {
            AnnoCard,
        }
    }
</script>

<template>
    <AnnoCard dense class="item-tooltip-container">
        <div class="item-tooltip-container-name">{{ item.name }}</div>
        <div class="item-tooltip-container-bonuses">
            <template v-for="(value, key) in item.bonuses">
                <p
                    v-if="value"
                    :class="[`bonus bonus-${key}`]"
                >
                    <i :class="[`ic icon-${key}`]"></i>{{ value }}
                </p>
            </template>
            <p v-if="item.combined_morale_per_50t">
                <v-icon icon="md:favorite" />{{ item.combined_morale_per_50t }}
            </p>
        </div>
        <div v-if="item.extra_rations" class="item-tooltip-container-traits">
            <p class="smallest-text font-italic">Ration</p>
        </div>
    </AnnoCard>
</template>

<style scoped>
    .item-tooltip-container {
        width: 10rem;
        box-shadow: 0.25rem 0.25rem 0.5rem rgba(87, 77, 68, 0.25);
    }

    .item-tooltip-container-name {
        font-weight: 700;
        font-size: 0.875rem;
        line-height: 1rem;
        color: #574D44;
    }

    .item-tooltip-container-bonuses {
        padding-top: 0.25rem;
    }

    .item-tooltip-container-bonuses p {
        line-height: 1.4rem;
    }

    .item-tooltip-container-bonuses i {
        font-size: 1.25rem;
        vertical-align: bottom;
        margin-right: 0.5rem;
        color: #B0A599;
    }

    .item-tooltip-container-traits {
        font-size: 0.75rem;
        font-style: italic;
        line-height: 0.75rem;
    }

    .item-tooltip-container-traits ul {
        list-style-type: none;
    }

    .item-tooltip-container-traits ul li {
        display: inline;
    }

    .item-tooltip-container-traits ul li:not(:last-child):after {
        content: ' · ';
    }

    .item-tooltip-container-traits,
    .item-tooltip-container-dlc  {
        width: 100%;
        padding-top: 0.25rem;
        border-top: 1px solid #E4DAC8;
    }

    .item-tooltip-container-dlc {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-style: italic;
        font-size: 0.75rem;
        line-height: 125%;
        color: #968878;
    }

    .item-tooltip-container-dlc div {
        font-weight: bold;
    }
</style>