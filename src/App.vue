<script>
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import NavBarMobile from "./components/NavBarMobile.vue";
import { useDisplay } from "vuetify";

export default {
  name: "App",
  components: {
    NavBar,
    NavBarMobile,
  },
  setup () {
    const { mdAndDown } = useDisplay()

    return { mdAndDown }
  },
  data: () => ({
    overlay: false,
  })
};
</script>

<template>
  <v-app>

    <v-app-bar v-if="mdAndDown" app color="#574D44">
      <v-app-bar-nav-icon
        color="#FFFEFB"
        variant="text"
        @click="overlay = !overlay"
        icon="$close"
        v-if="overlay"
      ></v-app-bar-nav-icon>
      <v-app-bar-nav-icon
        color="#FFFEFB"
        variant="text"
        @click="overlay = !overlay"
        icon="$menu"
        v-else
      ></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-container class="header-text pa-0">
          <router-link to="/"
            ><h1>Anno 1800 Expeditions Helper</h1></router-link
          >
        </v-container>
      </v-toolbar-title>

      <v-overlay
        v-model="overlay"
        close-on-content-click
        scroll-strategy="none"
        scrim="false"
        class="menu-overlay"
        
        location-strategy="connected"
      >
        <NavBarMobile />
      </v-overlay>
    </v-app-bar>

    <v-app-bar v-else app color="#574D44" extension-height="56">
      <v-toolbar-title class="ml-0">
        <v-container class="header-text">
          <router-link to="/"
            ><h1>Anno 1800 Expeditions Helper</h1></router-link
          >
        </v-container>
      </v-toolbar-title>
      <template v-slot:extension>
        <v-container>
          <NavBar />
        </v-container>
      </template>
    </v-app-bar>

    <v-main class="primary-text-color background-color-light" id="app-box">
      <RouterView />
    </v-main>

    <v-footer app absolute class="d-flex flex-column pa-0" color="#FCFAF4">
      <v-container>
        <div class="pt-1 pb-4 d-flex secondary-text-color text-body-2 w-100 justify-space-between align-center">
          <div class="d-flex align-center">
            <p>To report an issue or request a new feature, please create a ticket <a href="https://github.com/pai-pai/anno-items-app/issues" target="_blank">here</a>.</p>
          </div>
          <div>
            <a class="github-link pr-2" href="https://github.com/pai-pai/anno-items-app" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
        <div class="text-center secondary-text-color text-body-2 w-100">
          {{ new Date().getFullYear() }} — Anno 1800 Expeditions Helper
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped>
.header-text a {
  text-decoration: none;
  color: #fffffb;
  display: inline-block;
}

.header-text h1 {
  font-weight: bold;
  font-size: 1.5rem;
}

.menu-overlay {
  top: 63px;
  background-color: #574D44;
}

.v-footer a {
  color: #37A298;
}

@media only screen 
        and (min-device-width: 320px) 
        and (max-device-width: 480px)
        and (orientation: portrait) {
  .header-text h1 {
    font-size: 1.4rem;
  }
}
</style>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");
</style>
