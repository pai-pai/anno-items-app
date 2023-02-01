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
        <v-container class="pa-0 header-text">
          <router-link to="/">Anno 1800 Expeditions</router-link>
        </v-container>
      </v-toolbar-title>
      <template v-slot:extension>
        <v-container class="pa-0">
          <NavBar />
        </v-container>
      </template>
    </v-app-bar>
    <v-main fluid class="primary-text-color background-color-light">
      <RouterView />
    </v-main>
  </v-app>
</template>

<style scoped>
  .header-text a {
    font-weight: bold;
    text-decoration: none;
    color: #FFFFFB;
  }
</style>