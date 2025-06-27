<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>Émargement IUT NFC</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text @click="logout">
      <v-icon left>mdi-logout</v-icon>
      Déconnexion
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppNavbar',
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>