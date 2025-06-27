<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="primary white--text">
            <v-icon left>mdi-information</v-icon>
            À propos
          </v-card-title>
          
          <v-card-text class="pa-6">
            <h2 class="mb-4">Gestion de présence</h2>
            <p class="mb-4">
              Application développée pour la gestion des présences étudiantes via QR Code.
            </p>
            <p class="mb-4">
              <strong>Version :</strong> 1.0.0
            </p>
            <p>
              <strong>Technologies :</strong> Vue.js, Vuetify, Node.js
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>