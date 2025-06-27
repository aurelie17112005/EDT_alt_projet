<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" class="text-center">
        <v-card>
          <v-card-title class="primary white--text">
            <v-icon left>mdi-home</v-icon>
            Tableau de bord
          </v-card-title>
          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6" v-if="userRole === 'teacher'">
                <v-btn 
                  to="/teacher/session" 
                  color="primary" 
                  x-large 
                  block
                  class="mb-4"
                >
                  <v-icon left>mdi-account-group</v-icon>
                  Gérer les sessions
                </v-btn>
              </v-col>
              <v-col cols="12" md="6" v-if="userRole === 'student'">
                <v-btn 
                  to="/student/scan" 
                  color="primary" 
                  x-large 
                  block
                  class="mb-4"
                >
                  <v-icon left>mdi-qrcode-scan</v-icon>
                  Scanner QR Code
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn 
                  to="/profile" 
                  color="secondary" 
                  x-large 
                  block
                >
                  <v-icon left>mdi-account</v-icon>
                  Mon profil
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'HomeView',
  computed: {
    userRole() {
      return this.$store.getters['auth/userRole']
    }
  }
}
</script>