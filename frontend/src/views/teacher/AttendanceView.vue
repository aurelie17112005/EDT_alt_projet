<template>
  <v-container>
    <v-card>
      <v-card-title class="primary white--text">
        <v-icon left>mdi-format-list-checks</v-icon>
        Liste des présences
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="attendances"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)">
              {{ item.status }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'AttendanceView',
  data: () => ({
    loading: false,
    attendances: [],
    headers: [
      { text: 'Étudiant', value: 'student.name' },
      { text: 'Date', value: 'date' },
      { text: 'Statut', value: 'status' },
      { text: 'Validé par', value: 'validator.name' }
    ]
  }),
  async created() {
    await this.fetchAttendances()
  },
  methods: {
    async fetchAttendances() {
      this.loading = true
      try {
        const response = await this.$api.get('/attendances')
        this.attendances = response.data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy HH:mm')
    },
    getStatusColor(status) {
      const colors = {
        present: 'success',
        absent: 'error',
        pending: 'warning'
      }
      return colors[status] || 'info'
    }
  }
}
</script>