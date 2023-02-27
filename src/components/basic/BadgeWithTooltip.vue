<script>
    import Badge from "./Badge.vue";
    import Popper from "vue3-popper";
    
    export default {
        name: "BageWithTooltip",
        props: [ "image_src", "class", "width", "height", "clearable", "isdraggable" ],
        components: {
            Badge,
            Popper,
        }
    }
</script>

<template>
    <Popper
        v-bind="$attrs"
        placement="right"
        offsetDistance="3"
        hover
    >
        <Badge :class="class" :image_src="image_src" :width="width" :height="height" :clearable="clearable" :draggable="isdraggable" />
        <template #content="props">
            <slot name="content" v-bind="props" />
        </template>
    </Popper>
</template>

<style scoped>
    
</style>