<script>
  import { RouterView } from 'vue-router'
  import NavBar from './components/NavBar.vue'

  export default {
    name: 'App',
    data: () => ({
      //
    }),
    components: {
      NavBar
    }
  }
</script>

<template>
  <v-app>
    <v-app-bar app color="#574D44" extension-height="56">
      <v-toolbar-title class="ml-0">
        <v-container class="header-text">
          <router-link to="/"><h1>Anno 1800 Expeditions Helper</h1></router-link>
        </v-container>
      </v-toolbar-title>
      <template v-slot:extension>
        <v-container>
          <NavBar />
        </v-container>
      </template>
    </v-app-bar>
    <v-main class="primary-text-color background-color-light">
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
  .header-text a {
    text-decoration: none;
    color: #FFFFFB;
  }

  .header-text h1 {
    font-weight: bold;
    font-size: 1.5rem;
  }
</style>