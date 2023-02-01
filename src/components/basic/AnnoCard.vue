<script> 
    export default {
        name: "AnnoCard",
        props: {
            class: String,
            dense: {
                type: Boolean,
                default: false,
            },
            orientation: {
                type: String,
                default: "horizontal",
                validator: function(value) {
                    return [
                        "horizontal",
                        "vertical",
                    ].includes(value);
                },
            },
        },
        computed: {
            cardClasses() {
                let classes = `anno-card ${this.orientation} fill-height`;
                if (this.dense) classes = `${classes} dense`;
                if (this.class) classes = `${classes} ${this.class}`;
                return classes;
            },
        }
    }
</script>

<template>
    <div :class="cardClasses">
        <slot></slot>
    </div>
</template>

<style scoped>
    .anno-card {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        padding: 0.625rem;
        border: 1px solid #E4DAC8;
        border-radius: 0.25rem;
        box-sizing: border-box;
        background: #FFFEFB;
    }

    .anno-card.dense {
        padding: 0.5rem;
    }
</style>