<script> 
    export default {
        name: "Badge",
        props: {
            class: String,
            image_src: String,
            width: {
                type: String,
                default: "4.375rem"
            },
            height: {
                type: String,
                default: "4.375rem"
            },
            clearable: {
                type: Boolean,
                default: false,
            }
        }
    }
</script>

<template>
    <div :class="[`item-bage ${this.class ? this.class : ''}`]">
        <v-img
            aspect-ratio="1"
            :height="height"
            :width="width"
            :src="image_src"
            draggable="false"
        />
        <div class="remove-btn" v-if="clearable">
            <v-icon icon="md:cancel" @click="$emit('remove')" />
        </div>
    </div>
</template>

<style scoped>
    .item-bage {
        padding: 0.3125rem;
        border-radius: 0.25rem;
    }

    .item-bage[draggable="true"] {
        cursor: grab;
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

    .item-bage.ship-item::before {
        font-family: "anno-icons";
        content: '\e908';
        font-size: 1.2rem;
        color: rgba(87, 77, 68, 0.75);
        line-height: 1.2rem;
        position: absolute;
        left: 0.15rem;
        top: 0.15rem;
        z-index: 1;
    }

    .item-bage img {
        pointer-events: none;
    }

    .remove-btn {
        position: absolute;
        top: -0.2rem;
        right: 0rem;
        width: auto;
        color: rgba(87, 77, 68, 0.25)
    }

    .remove-btn:hover {
        color: rgba(87, 77, 68, 0.75)
    }

    .remove-btn i {
        font-size: 1.2rem;
    }
</style>