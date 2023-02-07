<script> 
    export default {
        name: "ClearableSelectInput",
        props: [ "options", "label" ]
    }
</script>

<template>
    <v-select
        :items="options"
        clearable
        clear-icon="close"
        variant="underlined"
        density="compact"
        :label="label" />
</template>