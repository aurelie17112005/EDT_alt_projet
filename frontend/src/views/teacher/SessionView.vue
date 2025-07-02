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
              :class="{ 'grey lighten-4': selectedSession?.id === session.id }"
            >
              <v-list-item-content>
                <v-list-item-title>{{ session.subject }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(session.startTime) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="!sessions.length">
              <v-list-item-content>Aucune séance trouvée.</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Colonne de droite : détails de la séance sélectionnée -->
      <v-col cols="12" md="8">
        <div v-if="!selectedSession">
          <v-alert type="info" outlined>
            Sélectionnez une séance dans la colonne de gauche
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
              <qr-code-generator 
                :sessionId="selectedSession.id" 
                @qr-generated="handleQrGenerated"
              />
            </v-card-text>
          </v-card>

          <!-- Bouton PDF -->
          <v-btn 
            color="primary" 
            @click="downloadPdf" 
            class="mb-4"
            :loading="pdfLoading"
            :disabled="!selectedSession"
          >
            <v-icon left>mdi-file-pdf-box</v-icon>
            Télécharger la fiche d'émargement
          </v-btn>

          <!-- 3) Liste des présences -->
          <v-card outlined>
            <v-card-title>Présences</v-card-title>
            <v-card-text>
              <attendance-list 
                :attendances="attendances" 
                @refresh="refreshAttendances"
              />
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
import { format } from 'date-fns'

export default {
  name: 'SessionView',
  components: { SessionInfo, QrCodeGenerator, AttendanceList },
  data() {
    return {
      sessions: [],
      selectedSession: null,
      attendances: [],
      pdfLoading: false,
      qrData: null
    }
  },
  async created() {
    await this.loadSessions()
  },
  methods: {
    formatDate(date) {
      return format(new Date(date), 'dd/MM/yyyy HH:mm')
    },
    
    async loadSessions() {
      try {
        const response = await api.get('/api/sessions/teacher', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.sessions = response.data
      } catch (error) {
        console.error('Erreur chargement sessions:', error)
        this.$toast.error('Erreur lors du chargement des sessions')
      }
    },
    
    async selectSession(session) {
      this.selectedSession = session
      await this.refreshAttendances()
    },
    
    async refreshAttendances() {
      if (!this.selectedSession) return
      
      try {
        const response = await api.get(`/api/attendances/session/${this.selectedSession.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.attendances = response.data
      } catch (error) {
        console.error('Erreur chargement présences:', error)
        this.$toast.error('Erreur lors du chargement des présences')
      }
    },
    
    async downloadPdf() {
      if (!this.selectedSession) return
      
      this.pdfLoading = true
      try {
        // Solution 1: Utilisation de window.open (simple)
        window.open(
          `${process.env.VUE_APP_API_URL}/api/pdf/generate/${this.selectedSession.id}?token=${localStorage.getItem('token')}`,
          '_blank'
        )
        
        // Solution alternative avec fetch (si besoin de plus de contrôle)
        /*
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/api/pdf/generate/${this.selectedSession.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        if (!response.ok) throw new Error('Erreur de téléchargement')
        
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `emargement_${this.selectedSession.id}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        */
        
        this.$toast.success('PDF généré avec succès')
      } catch (err) {
        console.error('Erreur téléchargement PDF:', err)
        this.$toast.error('Erreur lors de la génération du PDF')
      } finally {
        this.pdfLoading = false
      }
    },
    
    handleQrGenerated(data) {
      this.qrData = data
      this.$toast.success('QR Code généré avec succès')
    }
  }
}
</script>