<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Connexion</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form @submit.prevent="loginUser">
              <v-text-field
                v-model="username"
                label="LDAP ID"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Mot de passe"
                required
                type="password"
              ></v-text-field>

              <v-btn type="submit" color="primary" :loading="loading">
                Se connecter
              </v-btn>
            </v-form>

            <v-btn @click="loginWithCAS" color="secondary" class="mt-3" block>
              Connexion via CAS
            </v-btn>

            <v-alert v-if="error" type="error" class="mt-3">{{ error }}</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      error: null
    }
  },
  computed: {
    ...mapGetters('auth', ['userRole'])
  },
  methods: {
    async loginUser() {
      this.loading = true
      this.error = null
      try {
        // Envoie au store : il doit stocker user + token
        const payload = { ldapId: this.username, password: this.password }
        const res = await this.$store.dispatch('auth/login', payload)

        // Le rôle peut venir du store (recommandé) ou de la réponse
        const role = this.$store.getters['auth/userRole'] || res?.user?.role

        // Redirection explicite par rôle (on ignore ?redirect=... pour éviter les mauvaises surprises)
        const target =
            role === 'admin' ? '/admin'
                : role === 'teacher' ? '/teacher/session'
                    : '/student/scan'

        // replace pour ne pas revenir sur /login au "back"
        this.$router.replace(target)
      } catch (error) {
        this.error = error?.error || error?.message || 'Erreur lors de la connexion'
        console.error('Login error:', error)
      } finally {
        this.loading = false
      }
    },

    loginWithCAS() {
      // Ajustez si vous utilisez un domaine public ou ngrok
      window.location.href = `${process.env.VUE_APP_API_URL || 'http://localhost:3000'}/auth/cas`
    }
  }
}
</script>
