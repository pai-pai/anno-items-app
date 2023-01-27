<script>
    export default {
        name: "ColumnRow",
        props: [ "label", "value" ],
    }
</script>

<template>
    <v-col cols="6">
        <v-row no-gutters>
            <v-col cols="10" class="label">{{ label }}</v-col>
            <v-col cols="2" class="value text-right">{{ value ? value : "-" }}</v-col>
        </v-row>
    </v-col>
</template>