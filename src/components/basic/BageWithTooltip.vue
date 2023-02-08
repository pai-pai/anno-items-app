<script>
    import Bage from "./Bage.vue";
    import Popper from "vue3-popper";
    
    export default {
        name: "BageWithTooltip",
        props: [ "image_src", "class", "width", "height" ],
        components: {
            Bage,
            Popper,
        }
    }
</script>

<template>
    <Popper v-bind="$attrs" placement="right" offsetDistance="3">
        <Bage :class="class" :image_src="image_src" :width="width" :height="height" />
        <template #content="props">
            <slot name="content" v-bind="props" />
        </template>
    </Popper>
</template>

<style scoped>
    
</style>