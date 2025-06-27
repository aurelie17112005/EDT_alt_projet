<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Inscription</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form @submit.prevent="registerUser">
              <v-text-field
                v-model="credentials.ldapId"
                label="LDAP ID"
                required
              ></v-text-field>

              <v-text-field
                v-model="credentials.email"
                label="Email"
                required
                type="email"
              ></v-text-field>

              <v-text-field
                v-model="credentials.password"
                label="Mot de passe"
                required
                type="password"
                autocomplete="new-password"
              ></v-text-field>

              <v-text-field
                v-model="credentials.confirmPassword"
                label="Confirmer le mot de passe"
                required
                type="password"
                autocomplete="new-password"
              ></v-text-field>

              <v-select
                v-model="credentials.role"
                :items="['student', 'teacher', 'admin']"
                label="Rôle"
                required
              ></v-select>

              <v-btn type="submit" color="primary" :loading="loading" block>
                S'inscrire
              </v-btn>
            </v-form>

            <v-btn
              @click="registerWithCAS"
              color="secondary"
              class="mt-3"
              block
            >
              Inscription via CAS
            </v-btn>

            <v-alert v-if="error" type="error" class="mt-3">
              {{ error }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterView',
  data() {
    return {
      credentials: {
        ldapId: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student', // valeur par défaut
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    async registerUser() {
      if (this.credentials.password !== this.credentials.confirmPassword) {
        this.error = "Les mots de passe ne correspondent pas.";
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        await axios.post('http://localhost:3000/auth/register', {
          ldapId: this.credentials.ldapId,
          email: this.credentials.email,
          password: this.credentials.password,
          role: this.credentials.role,
        });

        this.$router.push({ name: 'Login' }); 
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur inconnue';
      } finally {
        this.loading = false;
      }
    },
    registerWithCAS() {
      window.location.href = 'http://localhost:3000/auth/cas/register';
    },
  },
};
</script>
