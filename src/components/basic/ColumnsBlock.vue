<script>
    import lodash from "lodash";
    import ColumnRow from "./ColumnRow.vue";

    export default {
        name: "Bonuses",
        props: {
            columnsConfig: Object,
        },
        components: {
            ColumnRow
        },
        computed: {
            configuration() {
                const config = this.columnsConfig;
                const columns = config.columns;
                const minArray = Math.min(config.labels.length, config.values.length);
                const numberOfRows = Math.ceil(minArray * 1.0 / columns);
                return {
                    cols: columns,
                    rows: numberOfRows,
                    titles: config.titles,
                    labels: lodash.chunk(config.labels, numberOfRows),
                    values: lodash.chunk(config.values, numberOfRows),
                };
            }
        }
    }
</script>

<template>
    <v-container :class="[`bonuses small-text columns-${configuration.cols} pa-0`]">
        <template v-if="configuration.titles">
            <v-row no-gutters class="secondary-text-color justify-space-between font-italic">
                <v-col
                    v-for="c in configuration.cols"
                    :class="[`columns-block-column-` + c]"
                    :cols="12/configuration.cols"
                >
                    {{ configuration.titles[c-1] }}
                </v-col>
            </v-row>
        </template>
        <v-row no-gutters class="justify-space-between" v-for="r in configuration.rows">
            <ColumnRow
                v-for="c in configuration.cols"
                :class="[`columns-block-column-` + c]"
                :cols="12/configuration.cols"
                :label="configuration.labels[c-1][r-1]"
                :value="configuration.values[c-1][r-1]"
            />
        </v-row>
    </v-container>
</template>

<style scoped>
    .bonuses.columns-2 .columns-block-column-1 {
        padding-right: 1rem;
    }

    .bonuses.columns-2 .columns-block-column-2 {
        padding-left: 1rem;
    }
</style>