<template>
  <v-container fluid>
    <v-row>
      <!-- Colonne de gauche : liste des séances -->
      <v-col cols="12" md="4">
        <v-card outlined>
          <v-card-title>Mes séances</v-card-title>
          <v-divider />
          <v-list two-line>
            <v-list-item
              v-for="session in sessions"
              :key="session.id"
              @click="selectSession(session)"
              :class="{ 'grey lighten-4': selectedSession && selectedSession.id === session.id }"
            >
              <v-list-item-content>
                <v-list-item-title>{{ session.subject }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ new Date(session.startTime).toLocaleString() }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="sessions.length === 0">
              <v-list-item-content>Aucune séance trouvée.</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Colonne de droite : détails de la séance sélectionnée -->
      <v-col cols="12" md="8">
        <div v-if="!selectedSession">
          <v-alert type="info" outlined>
            Merci de sélectionner une séance dans la colonne de gauche.
          </v-alert>
        </div>

        <div v-else>
          <!-- 1) Informations de la séance -->
          <v-card class="mb-4" outlined>
            <v-card-title>Détails de la séance</v-card-title>
            <v-card-text>
              <session-info :session="selectedSession" />
            </v-card-text>
          </v-card>

          <!-- 2) Génération du QR Code -->
          <v-card class="mb-4" outlined>
            <v-card-title>QR Code de présence</v-card-title>
            <v-card-text>
              <qr-code-generator :sessionId="selectedSession.id" />
            </v-card-text>
          </v-card>

          <!-- 3) Liste des présences -->
          <v-card outlined>
            <v-card-title>Présences</v-card-title>
            <v-card-text>
              <attendance-list :attendances="attendances" />
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AttendanceList from '@/components/teacher/AttendanceList'
import QrCodeGenerator from '@/components/teacher/QrCodeGenerator'
import SessionInfo from '@/components/teacher/SessionInfo'
import api from '@/services/api'

export default {
  name: 'SessionView',
  components: { SessionInfo, QrCodeGenerator, AttendanceList },
  data() {
    return {
      sessions: [],
      selectedSession: null,
      attendances: []
    }
  },
  async mounted() {
    console.log('Chargement des sessions...')
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Aucun token trouvé')
        return
      }

      // URL corrigée pour matcher la route backend
      const response = await api.get('/api/sessions/teacher', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log('Réponse reçue:', response.data)
      this.sessions = response.data

      if (this.sessions.length === 0) {
        console.warn('Aucune session reçue malgré un appel réussi')
      }
    } catch (error) {
      console.error('Erreur complète:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
    }
  },
  methods: {
    async selectSession(session) {
      this.selectedSession = session
      try {
        const token = localStorage.getItem('token')
        const response = await api.get(`/api/attendances/session/${session.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.attendances = response.data
      } catch (error) {
        console.error('Erreur chargement présences:', error)
      }
    }
  }
}
</script>