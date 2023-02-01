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
    <Popper placement="right" offsetDistance="3" hover>
        <Bage :class="class" :image_src="image_src" :width="width" :height="height" />
        <template #content>
            <slot></slot>
        </template>
    </Popper>
</template>

<style scoped>
    
</style>