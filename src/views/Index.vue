<script>
    export default {

    }
</script>

<template>
    <div class="section-intro">
        <v-container class="py-0">
            <div class="intro">
                <div class="intro-text">
                    <h2>Prepare to the expedition <span>with ease!</span></h2>
                    <p>Anno 1800 Expedition Helper is created to&nbsp;simplify the&nbsp;process of&nbsp;combining items and&nbsp;goods and&nbsp;help equip ships in&nbsp;a&nbsp;better&nbsp;way.</p>
                    <v-btn variant="outlined" class="try-btn" @click="$router.push('equip-expedition')">Let's begin</v-btn>
                </div>
            </div>
        </v-container>
    </div>
    <div class="section-steps">
        <v-container class="steps-title py-0">
            <h2>Optimizing your ship: equipping for success</h2>
        </v-container>
                
        <div class="step-row">
            <v-container class="py-0">
                <div class="step-demo">
                    <div>
                        <video autoplay="" crossorigin playsinline="" loop="" muted="" style="width: 100%!important; height: auto!important;display:block">
                            <source src="../assets/pick_ship_v1.mp4" type="video/mp4" />
                            <source src="../assets/pick_ship_v1.webm" type="video/webm" />
                            <!-- img -->
                        </video>
                    </div>
                </div>
                <div></div>
                <div class="step-text-block">
                    <h3>Choose the right ship</h3>
                    <ul>
                        <li>
                            Select a vessel with a&nbsp;lot&nbsp;of&nbsp;cargo space and enough specialist slots to&nbsp;accommodate your crew and supplies.
                        </li>
                        <li>
                            The Great Eastern is the ideal ship for this purpose, as it has a&nbsp;lot&nbsp;of&nbsp;both cargo space and&nbsp;specialist slots, while Extravaganza Steamers come in a&nbsp;close second. 
                        </li>
                        <li>
                            Cargo Ships and Battle Cruisers can handle any expedition if&nbsp;fitted with appropriate specialists, but they may not&nbsp;have enough room to&nbsp;accommodate all the additional items and&nbsp;specialists obtained from&nbsp;events.
                        </li>
                        <li>
                            Military ships offer bonuses for&nbsp;naval&nbsp;power, while trading ships provide benefits for&nbsp;navigation.
                        </li>
                    </ul>
                </div>
            </v-container>
        </div>
        <div class="step-row">
            <v-container class="py-0">
                <div class="step-text-block">
                    <h3>Equip your ship with specialists, items and goods</h3>
                    <ul>
                        <li>
                            Make sure to select specialists and&nbsp;items that are appropriate for&nbsp;the&nbsp;type of&nbsp;expedition you're embarking&nbsp;on.
                        </li>
                        <li>
                            Difficulty level on an expedition directly correlates with the&nbsp;quantity of&nbsp;goods and&nbsp;items required to&nbsp;boost morale.
                        </li>
                        <li>
                            A morale bonus is only obtainable from a&nbsp;full stack of&nbsp;goods&nbsp;(50t).
                        </li>
                        <li>
                            It's a good idea to leave room for&nbsp;unexpected items you may encounter during the&nbsp;expedition.
                        </li>
                    </ul>
                </div>
                <div></div>
                <div class="step-demo">
                    <div>
                        <video autoplay="" crossorigin="" playsinline="" loop="" muted="" style="width: 100%!important; height: auto!important;display:block">
                            <source src="../assets/add_items_v1.mp4" type="video/mp4" />
                            <source src="../assets/add_items_v1.webm" type="video/webm" />
                            <!-- img -->
                        </video>
                    </div>
                </div>
            </v-container>
        </div>
        <div class="step-row">
            <v-container class="py-0">
                <div class="step-demo">
                    <div>
                        <img src="../assets/details.png" style="width: 100%!important; height: auto!important;display:block" />
                    </div>
                </div>
                <div></div>
                <div class="step-text-block">
                    <h3>Enjoy results</h3>
                    <ul>
                        <li>Facilitate a more thorough analysis of&nbsp;your inventory by&nbsp;toggling the&nbsp;display mode of&nbsp;your picked items and&nbsp;supplies.</li>
                        <li>This feature will enable you to carefully consider and&nbsp;experiment with&nbsp;various combinations, ultimately empowering you to&nbsp;make informed decisions when loading your vessel with&nbsp;valuable cargo and&nbsp;specialists.</li>
                        <li>By gaining a more detailed understanding of&nbsp;items were chosen, you can optimize your loadout to&nbsp;maximize expedition bonuses.</li>
                    </ul>
                </div>
            </v-container>
            <v-container class="py-0 d-flex justify-center">
                <v-btn variant="outlined" class="try-btn" @click="$router.push('equip-expedition')">Get ready for the expedition</v-btn>
            </v-container>
        </div>
    </div>
    <div class="section-guidance">
        <v-container class="py-0">
            <h2>Discover valuable information with expedition-focused guidance</h2>
            <div class="guidance">
                <div class="guidance-block items">
                    <div class="guidance-text">
                        The <router-link to="/items">Items</router-link> page provides you with&nbsp;details about specialists and&nbsp;items that offer expedition bonuses, including the&nbsp;traits possessed by&nbsp;a&nbsp;specialist and&nbsp;the&nbsp;required DLC needed to&nbsp;obtain some items.
                    </div>
                    <router-link to="/items" class="guidance-img"></router-link>
                </div>
                <div class="right-column">
                    <div class="guidance-block ships">
                        <div class="guidance-text">
                            With the <router-link to="/ships">Ships</router-link> page, you can effortlessly choose the&nbsp;best vessel for&nbsp;your expedition and&nbsp;stay informed about any other ships that may&nbsp;become available during the&nbsp;game.
                        </div>
                        <router-link to="/ships" class="guidance-img"></router-link>
                    </div>
                    <div class="guidance-block supplies">
                        <div class="guidance-text">
                            The <router-link to="/supplies">Supplies</router-link> page is&nbsp;focused on&nbsp;helping you choose goods that offer the&nbsp;highest morale bonuses, and&nbsp;displays their&nbsp;corresponding expedition bonuses to&nbsp;ensure a&nbsp;successful expedition.
                        </div>
                        <router-link to="/supplies" class="guidance-img"></router-link>
                    </div>
                </div>
            </div>
        </v-container>
    </div>
</template>

<style scoped>
    .section-intro {
        background-color: #FAF3E7;
    }

    .intro {
        padding-top: 9rem;
        padding-bottom: 8rem;
        padding-left: 10%;
        background-image: url("../assets/sailing_ship_57972f3c-6d28-4cc8-a116-53a852eaff56-2.webp");
        background-size: contain;
        background-position-x: 75%;
    }

    .intro h2 {
        font-size: 2rem;
        line-height: 118%;
        color: #574D44;
        width: 23rem;
        margin-bottom: 0.5rem;
    }

    .intro h2 span {
        color: #37A298;
    }

    .intro p {
        font-size: 1rem;
        width: 21.5rem;
    }

    .section-intro .try-btn,
    .section-steps .try-btn {
        font-size: 1rem;
        color: #F0FDF4;
        background-color: #37A298;
        text-transform: none;
        letter-spacing: normal;
        border: none;
        padding: 0.5rem 1.25rem;
        margin-top: 1.5rem;
    }

    .section-steps .try-btn {
        margin-top: 2rem;
    }

    .section-steps {
        padding: 4rem 0 2rem;
    }

    .steps-title h2,
    .section-guidance h2 {
        font-size: 1.75rem;
        line-height: 118%;
        text-align: center;
    }

    .step-row {
        padding: 3rem 2rem;
    }

    .step-row:nth-child(2n+1) {
        background-color: #FCFAF4;
    }

    .step-row > div {
        display: grid;
        grid-template-columns: 11fr 6rem 8fr;
    }

    .step-row:nth-child(2n+1) > div {
        grid-template-columns: 8fr 6rem 11fr;
    }

    .step-demo {
        justify-self: start;
    }

    .step-demo > div {
        background-color: #FFFEFB;
        box-shadow: 0 0 0.5rem #E8DED8;
        border-radius: 0.25rem;
        padding: 0.25rem;
    }

    .step-text-block {
        align-self: center;
        justify-self: end;
        width: 100%;
    }

    .step-text-block h3 {
        font-size: 1.25rem;
        line-height: 130%;
        padding-bottom: 0.5rem;
        color: #574D44;
    }

    .step-text-block ul {
        list-style: none;
	    padding: 0;
    }

    .step-text-block ul li {
        color: #968878;
        font-size: 1rem;
        line-height: 135%;
        padding: 0.4rem 0;
        display: flex;
	    align-items: center;
	    gap: 1rem;
    }

    .section-guidance .guidance {
        padding: 3rem 0 4rem;
        display: flex;
        flex-direction: row;
        column-gap: 1.5rem;
    }

    .section-guidance .guidance > .guidance-block > .guidance-img {
        align-self: stretch;
    }

    .section-guidance .guidance .right-column {
        display: flex;
        flex-direction: column;
        row-gap: 1.5rem;
    }

    .section-guidance .guidance-block {
        background-color: #FCFAF4;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: end;
        padding:1.25rem;
        gap: 1.25rem;
        border-radius: 0.25rem;
    }

    .section-guidance .guidance-block .guidance-img {
        width: 100%;
        height: 100%;
        background-color: #FAF3E7;
        overflow: hidden;
        cursor: pointer;
    }

    .section-guidance .guidance-block .guidance-img::before {
        content: "";
        position: absolute;
        transform: rotate(15deg) scale(0.5);
        transition: all 1s;
        background-position: center;
        width: 300%;
    }

    .section-guidance .guidance-block .guidance-img:hover::before {
        transform: rotate(15deg) scale(0.6);
    }

    .section-guidance .guidance .right-column .guidance-img {
        height: 140px;
    }

    .section-guidance .guidance-block.items .guidance-img::before {
        height: 300%;
        top: -100%;
        left: -95%;
        background-image: url("../assets/items_block.png");
    }

    .section-guidance .guidance-block.ships .guidance-img::before {
        height: 600%;
        top: -240%;
        left: -95%;
        background-image: url("../assets/ships_block.png");
    }

    .section-guidance .guidance-block.supplies .guidance-img::before {
        height: 600%;
        top: -245%;
        left: -82%;
        background-image: url("../assets/supplies_block.png");
    }
    .section-guidance .guidance-block .guidance-text {
        color: #968878;
    }

    .section-guidance .guidance-block .guidance-text a {
        color: #37A298;
    }

    @media only screen 
        and (min-device-width: 320px) 
        and (max-device-width: 480px)
        and (orientation: portrait) {
        .v-container {
            padding: 0;
        }
        .intro2 {
            padding: 14rem 2rem 8rem 2rem;
            background-image: url("../assets/sailing_ship_57972f3c-6d28-4cc8-a116-53a852eaff56-2.webp");
            background-size: cover;
            background-position-x: 5%;
        }

        .intro {
            padding: 10rem 2rem 12rem 2rem;
            background-image: url(/src/assets/sailing_ship_57972f3c-6d28-4cc8-a116-53a852eaff56-2.webp);
            background-size: cover;
            background-position-x: 11%;
            -webkit-transform: scaleX(-1);
            transform: scaleX(-1);
        }

        .intro .intro-text {
            -webkit-transform: scaleX(-1);
            transform: scaleX(-1);
            text-align: right;
        }

        .intro h2 {
            width: 100%;
        }

        .intro p {
            width: 100%;
            font-size: 1.1rem;
        }

        .section-intro .try-btn,
        .section-steps .try-btn {
            font-size: 1.1rem;
        }

        .section-intro .try-btn {
            margin-top: 2rem;
        }
    }

    @media only screen 
        and (min-device-width: 320px) 
        and (max-device-width: 960px) {
        .step-row > div {
            display: flex;
            flex-direction: column;
        }

        .step-row:nth-child(2n+1) > div {
            flex-direction: column-reverse;
        }

        .steps-title h2,
        .section-guidance h2 {
            padding: 0 1rem;
        }

        .step-text-block {
            padding-top: 1rem;
        }

        .step-text-block h3 {
            text-align: center;
        }

        .section-steps .try-btn {
            max-width: 20rem;
            margin: 2rem auto 0;
        }

        .section-guidance .guidance {
            padding: 3rem 1rem 4rem;
            display: flex;
            flex-direction: column;
        }

        .section-guidance .guidance,
        .section-guidance .guidance .right-column {
            row-gap: 2rem;
        }

        .section-guidance .guidance .guidance-img {
            height: 220px;
        }
    }
</style>