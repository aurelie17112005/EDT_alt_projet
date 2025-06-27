<template>
  <v-container>
    <v-card>
      <v-card-title class="primary white--text">
        <v-icon left>mdi-account-check</v-icon>
        Validation des pairs
      </v-card-title>
      <v-card-text>
        <v-alert
          v-if="validations.length === 0"
          type="info"
        >
          Aucune validation en attente
        </v-alert>
        
        <v-list v-else>
          <v-list-item
            v-for="validation in validations"
            :key="validation.id"
          >
            <v-list-item-content>
              <v-list-item-title>{{ validation.student.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(validation.date) }}
              </v-list-item-subtitle>
            </v-list-item-content>
            
            <v-list-item-action>
              <v-btn
                color="success"
                @click="validate(validation.id, true)"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn
                color="error"
                @click="validate(validation.id, false)"
                class="ml-2"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'ValidationView',
  data: () => ({
    validations: []
  }),
  async created() {
    await this.fetchValidations()
  },
  methods: {
    async fetchValidations() {
      try {
        const response = await this.$api.get('/validations/pending')
        this.validations = response.data
      } catch (error) {
        console.error(error)
      }
    },
    async validate(id, isValid) {
      try {
        await this.$api.post(`/validations/${id}`, { isValid })
        this.$store.dispatch('showSnackbar', {
          message: 'Validation enregistrée',
          color: 'success'
        })
        await this.fetchValidations()
      } catch (error) {
        this.$store.dispatch('showSnackbar', {
          message: 'Erreur lors de la validation',
          color: 'error'
        })
      }
    },
    formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy HH:mm')
    }
  }
}
</script>