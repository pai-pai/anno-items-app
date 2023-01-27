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
    <v-app-bar app extended>
      <v-toolbar-title class="ml-0">
        <v-container class="pa-0">
          <router-link to="/">Anno 1800 Expeditions</router-link>
        </v-container>
      </v-toolbar-title>
      <template v-slot:extension>
        <v-container class="pa-0">
          <NavBar />
        </v-container>
      </template>
    </v-app-bar>
    <v-main fluid>
      <RouterView />
    </v-main>
  </v-app>
</template>