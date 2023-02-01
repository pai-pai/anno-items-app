<script>
    export default {
        name: "ColumnRow",
        props: [ "cols", "label", "value" ],
    }
</script>

<template>
    <v-col :cols="cols">
        <template v-if="label || value">
            <v-row no-gutters>
                <v-col cols="10" class="label">{{ label }}</v-col>
                <v-col cols="2" class="value text-right">
                    {{ (!Array.isArray(value) && value) || (Array.isArray(value) && value.length) ? value : "-" }}
                </v-col>
            </v-row>
        </template>
    </v-col>
</template>