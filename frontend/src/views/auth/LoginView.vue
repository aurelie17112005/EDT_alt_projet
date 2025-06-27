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
import axios from 'axios';

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',   // changée de email en username
      password: '',
      loading: false,
      error: null,
    };
  },
  methods: {
   async loginUser() {
  this.loading = true;
  this.error = null;

  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      ldapId: this.username,
      password: this.password,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.token) {
  this.$store.commit('auth/SET_USER', {
    user: response.data.user,
    token: response.data.token
  });

  const redirect = this.$route.query.redirect || { name: 'Home' };
  this.$router.push(redirect);
}
  } catch (error) {
    this.error = error.response?.data?.error || 
                error.message || 
                'Erreur lors de la connexion';
    console.error('Login error:', error);
  } finally {
    this.loading = false;
  }
},
    loginWithCAS() {
      window.location.href = 'http://localhost:3000/auth/cas';
    },
  },
};
</script>
