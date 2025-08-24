<template>
  <v-container fluid>
    <v-row class="mb-4" align="center" justify="space-between">
      <v-col cols="12" md="4">
        <v-text-field
            v-model="selectedDate"
            type="date"
            label="Date"
            outlined dense
            @change="fetchSessions"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
            :items="groups"
            item-text="name"
            item-value="id"
            v-model="selectedGroupId"
            label="Groupe"
            clearable
            outlined dense
            @change="onGroupChange"
        />
      </v-col>

      <v-col cols="12" md="4" class="text-right">
        <v-btn color="primary" @click="clearFilters" outlined>
          Réinitialiser filtres
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <!-- Colonne gauche: séances -->
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
                <v-list-item-title>{{ session.subject }} — {{ session.group?.name || '—' }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(session.startTime) }} • Salle {{ session.room }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="!loadingSessions && !sessions.length">
              <v-list-item-content>
                <span>Aucune séance pour ces critères.</span>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="loadingSessions">
              <v-list-item-content>
                <v-progress-circular indeterminate color="primary" />
                <span class="ml-2">Chargement…</span>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Colonne droite: détails + QR + présences -->
      <v-col cols="12" md="8">
        <div v-if="!selectedSession">
          <v-alert type="info" outlined>
            Sélectionnez une séance dans la colonne de gauche
          </v-alert>
        </div>

        <div v-else>
          <v-card class="mb-4" outlined>
            <v-card-title>Détails de la séance</v-card-title>
            <v-card-text>
              <session-info :session="selectedSession" />
            </v-card-text>
          </v-card>

          <v-card class="mb-4" outlined>
            <v-card-title>QR Code de présence</v-card-title>
            <v-card-text>
              <qr-code-generator
                  :sessionId="selectedSession.id"
                  @qr-generated="handleQrGenerated"
                  @error="handleQrError"
              />
            </v-card-text>
          </v-card>

          <v-btn
              color="primary"
              @click="downloadPdf"
              class="mb-4"
              :loading="pdfLoading"
              :disabled="!selectedSession || pdfLoading"
          >
            <v-icon left>mdi-file-pdf-box</v-icon>
            Télécharger la fiche d'émargement
          </v-btn>

          <v-card outlined>
            <v-card-title>Présences</v-card-title>
            <v-card-text>
              <attendance-list
                  :attendances="attendances"
                  :loading="loadingAttendances"
                  @refresh="refreshAttendances"
                  @toggle="togglePresence"
                  :group-id="selectedGroupId"
                  :group-name="selectedGroupName"
                  :session-id="selectedSession && selectedSession.id ? selectedSession.id : null"
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
      // filtres
      selectedDate: '',          // 'YYYY-MM-DD'
      selectedGroupId: null,

      // données
      groups: [],
      sessions: [],
      selectedSession: null,
      attendances: [],

      // états
      loadingSessions: false,
      loadingAttendances: false,
      pdfLoading: false,
    }
  },
  async created() {
    await this.loadGroups()
    await this.fetchSessions() // au début: toutes les séances du prof
  },
  methods: {
    formatDate(d) {
      return format(new Date(d), 'dd/MM/yyyy HH:mm')
    },

    clearFilters() {
      this.selectedDate = ''
      this.selectedGroupId = null
      this.fetchSessions()
    },

    async loadGroups() {
      try {
        const { data } = await api.get('/api/groups')
        this.groups = data || []
      } catch (e) {
        console.error('Erreur chargement groupes:', e)
      }
    },

    async fetchSessions() {
      this.loadingSessions = true
      try {
        const params = {}
        if (this.selectedDate) params.date = this.selectedDate
        if (this.selectedGroupId) params.groupId = this.selectedGroupId

        // si un filtre est présent, on passe par /daily
        const url = (params.date || params.groupId)
            ? '/api/sessions/daily'
            : '/api/sessions/teacher'

        const { data } = await api.get(url, { params })
        this.sessions = Array.isArray(data) ? data : []

        // si la session sélectionnée ne fait plus partie du résultat, on la reset
        if (this.selectedSession && !this.sessions.find(s => s.id === this.selectedSession.id)) {
          this.selectedSession = null
          this.attendances = []
        }
      } catch (e) {
        console.error('Erreur chargement sessions:', e)
      } finally {
        this.loadingSessions = false
      }
    },

    async onGroupChange() {
      await this.fetchSessions()
      // Optionnel : charger les étudiants du groupe pour un affichage custom
      // await this.loadGroupStudents()
    },

    async selectSession(session) {
      this.selectedSession = session
      await this.refreshAttendances()
    },

    async refreshAttendances() {
      if (!this.selectedSession) return
      this.loadingAttendances = true
      try {
        const {data} = await api.get(`/api/attendances/session/${this.selectedSession.id}`)
        this.attendances = Array.isArray(data) ? data : []
      } catch (e) {
        console.error('Erreur chargement présences:', e)
      } finally {
        this.loadingAttendances = false
      }
    },

    // Exemple d’action locale pour cocher/décocher — corrige l’erreur ; utilise des ;
    togglePresence({studentId, present}) {
      const idx = this.attendances.findIndex(a => a.studentId === studentId)
      if (idx !== -1) {
        // mise à jour locale
        this.attendances[idx].present = !!present;
      }
    },

    async downloadPdf() {
      if (!this.selectedSession) return
      this.pdfLoading = true
      try {
        const response = await api.get(`/api/pdf/generate/${this.selectedSession.id}`, {
          responseType: 'blob',
          headers: {'Cache-Control': 'no-cache'}
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `emargement_${this.selectedSession.subject}_${this.selectedSession.id}.pdf`)
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
          window.URL.revokeObjectURL(url)
          document.body.removeChild(link)
        }, 100)
      } catch (e) {
        console.error('Erreur téléchargement PDF:', e)
      } finally {
        this.pdfLoading = false
      }
    },

    handleQrGenerated() {
      this.refreshAttendances()
    },
    handleQrError(err) {
      console.error('Erreur QR:', err)
    }
  }
}
</script>

<style scoped>
.v-progress-circular {
  margin-right: 12px;
}
</style>
