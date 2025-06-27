<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="primary white--text">
            <v-icon left>mdi-account</v-icon>
            Mon profil
          </v-card-title>
          
          <v-card-text class="pa-6">
            <v-form>
              <v-text-field
                v-model="user.username"
                label="Nom d'utilisateur"
                readonly
                outlined
              ></v-text-field>
              
              <v-text-field
                v-model="user.email"
                label="Email"
                readonly
                outlined
              ></v-text-field>
              
              <v-text-field
                v-model="user.role"
                label="Rôle"
                readonly
                outlined
              ></v-text-field>
              
              <v-btn
                color="error"
                @click="logout"
                class="mt-4"
              >
                <v-icon left>mdi-logout</v-icon>
                Déconnexion
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ProfileView',
  computed: {
    user() {
      return this.$store.getters['auth/currentUser'] || {}
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script>