<script> 
    export default {
        name: "Bage",
        props: [ "image_src", "class", "width", "height" ]
    }
</script>

<template>
    <div :class="[`item-bage ${this.class ? this.class : ''}`]">
        <v-img
            aspect-ratio="1"
            :height="height"
            :width="width"
            :src="image_src"
        />
    </div>
</template>

<style scoped>
    .item-bage {
        padding: 0.3125rem;
        border-radius: 0.25rem;
    }

    [class*="item-rarity-"] {
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
</style>