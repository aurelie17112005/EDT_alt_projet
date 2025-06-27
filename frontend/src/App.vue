<template>
  <v-app>
    <app-navbar v-if="isAuthenticated" />
    <v-main>
      <router-view></router-view>
    </v-main>
    <snackbar />
  </v-app>
</template>

<script>
import AppNavbar from '@/components/common/AppNavbar';
import Snackbar from '@/components/common/Snackbar';

export default {
  name: 'App',
  components: {
    AppNavbar,
    Snackbar
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated']
    }
  }
}
</script>

<style>
.v-application {
  background-color: var(--v-background-base) !important;
}
</style>