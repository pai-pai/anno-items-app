<script>
    export default {

    }
</script>

<template>
    <div class="section-intro">
        <v-container class="py-0">
            <div class="intro">
                <h2>Prepare to the expedition <span>with ease!</span></h2>
                <p>Anno 1800 Expedition Helper was created to help all game fans by making it easy to combine items and goods, and equip ships in a better way.</p>
                <v-btn variant="outlined" class="try-btn">Equip a ship</v-btn>
            </div>
        </v-container>
    </div>
    <v-container class="pt-0">
        <div class="section-steps">
            <div class="steps-title">
                <h2>How to prepare a ship</h2>
            </div>
            <div class="step-row">
                <div class="step-demo">
                    <video autoplay="" crossorigin="" playsinline="" loop="" muted="" style="width: 100%!important; height: auto!important;display:block">
 	                    <source src="../assets/ships_picker_720v2.webm" type="video/webm">
                        <img src="https://uploads-ssl.webflow.com/6214efb2d4b5d94158f2ff03/624c511b92a43724cdff6a43_dynamic-image-showcase%402x.png">
                    </video>
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
            </div>
            <div class="step-row">
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
                    <video autoplay="" crossorigin="" playsinline="" loop="" muted="" style="width: 100%!important; height: auto!important;display:block">
 	                    <source src="../assets/ships_picker_720v2.webm" type="video/webm">
                        <img src="https://uploads-ssl.webflow.com/6214efb2d4b5d94158f2ff03/624c511b92a43724cdff6a43_dynamic-image-showcase%402x.png">
                    </video>
                </div>
            </div>
            <div class="final-step">
                <h3>See calculated bonuses and other valuable data in one place</h3>
                <div class="result">
                    <img src="../assets/Screenshot 2023-02-20 at 23.10.39.png"/>
                </div>
            </div>
            <div class="steps-title">
                <h2>Good luck!</h2>
            </div>
        </div>
    </v-container>
</template>

<style scoped>
    .section-intro {
        background-color: #FAF4F0;
        background-image: url("https://anno-1800-expeditions-helper.s3.amazonaws.com/ship_sailing_l_172a5c25-d87e-4ffc-9451-dad2ec07963f.webp");
        background-size: 528px;
        background-position: 65% -1rem;
    }

    .intro {
        padding-top: 8.125rem;
        padding-bottom: 9.25rem;
        padding-left: 6.5rem;
    }

    .intro h2 {
        font-size: 1.75rem;
        line-height: 120%;
        color: #968878;
        width: 23rem;
        margin-bottom: 0.5rem;
    }

    .intro h2 span {
        color: #81ACB1;
    }

    .intro p {
        font-size: 1rem;
        width: 21.5rem;
        margin-bottom: 1.5rem;
    }

    .intro .try-btn {
        font-size: 1rem;
        color: #F4F9FA;
        background-color: #81ACB1;
        text-transform: none;
        letter-spacing: normal;
        border: none;
        padding: 0.5rem 1.5rem;
    }

    .section-steps {
        padding: 3.125rem 0;
    }

    .steps-title h2 {
        font-size: 1.75rem;
        line-height: 1.75rem;
        text-align: center;
    }

    .step-row {
        display: grid;
        padding: 4rem 2rem;
        grid-template-columns: 13fr 6rem 7fr;
    }

    .step-row:nth-child(2n+1) {
        background-color: #FDFAF7;
        grid-template-columns: 7fr 6rem 13fr;
    }

    .step-demo {
        justify-self: start;
    }

    .step-demo video {
        background-color: #FFFEFB;
        box-shadow: 0 0 0.5rem #E8DED8;
        border-radius: 0.25rem;
    }

    .step-text-block {
        align-self: center;
        justify-self: end;
    }

    .step-text-block h3 {
        font-size: 1.25rem;
        line-height: 130%;
        padding-bottom: 0.25rem;
    }

    .step-text-block ul li {
        color: #968878;
        font-size: 0.875rem;
        list-style: none;
        padding: 0.4rem 0;
    }

    .final-step {
        padding: 4rem 2rem;
        text-align: center;
    }

    .final-step img {
        max-width: 80%;
    }
</style>