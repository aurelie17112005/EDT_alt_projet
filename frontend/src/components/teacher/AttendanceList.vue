<template>
  <div>
    <!-- État : aucun groupe -->
    <v-alert
        v-if="!groupId"
        type="info"
        outlined
        class="mb-4"
    >
      Sélectionnez d’abord un groupe pour afficher les étudiants.
    </v-alert>

    <!-- Liste étudiants du groupe -->
    <v-card outlined v-else>
      <v-card-title class="justify-space-between">
        <div>
          Étudiants du groupe
          <span v-if="students.length"> ({{ presentCount }}/{{ students.length }} présents)</span>
        </div>

        <v-progress-circular
            v-if="loadingStudents || loading"
            indeterminate
            color="primary"
            size="22"
        />
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-simple-table v-if="students.length">
          <thead>
          <tr>
            <th style="width:56px"></th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Identifiant</th>
            <th style="width:160px">Présence</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="s in students" :key="s.ldapId">
            <td>
              <v-icon :color="isPresent(s.ldapId) ? 'green' : 'red'">
                {{ isPresent(s.ldapId) ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
            </td>
            <td>{{ s.lastname }}</td>
            <td>{{ s.firstname || s.firstname || s.firstName }}</td>
            <td>{{ s.ldapId }}</td>
            <td>
              <v-switch
                  :input-value="isPresent(s.ldapId)"
                  :disabled="!sessionId || toggling.has(s.ldapId)"
                  @change="onToggle(s.ldapId, $event)"
                  inset
                  hide-details
              />
            </td>
          </tr>
          </tbody>
        </v-simple-table>

        <div v-else-if="!loadingStudents" class="text-subtitle-2 grey--text">
          Aucun étudiant dans ce groupe.
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'AttendanceList',

  props: {
    // présences actuelles (de la séance sélectionnée)
    attendances: {
      type: Array,
      default: () => []
    },
    // spinner externe optionnel (chargement des présences)
    loading: {
      type: Boolean,
      default: false
    },
    // nouveau : identifiant du groupe sélectionné
    groupId: {
      type: [Number, String],
      default: null
    },
    // nouveau : identifiant de la séance sélectionnée (pour activer le switch)
    sessionId: {
      type: [Number, String],
      default: null
    }
  },

  data () {
    return {
      students: [],
      loadingStudents: false,
      presentSet: new Set(), // vue locale des présents
      toggling: new Set()    // ids en cours de MAJ
    }
  },

  computed: {
    presentCount () {
      return this.students.reduce((acc, s) => acc + (this.presentSet.has(s.ldapId) ? 1 : 0), 0)
    }
  },

  watch: {
    // recharge les étudiants à chaque changement de groupe
    groupId: {
      immediate: true,
      handler () {
        this.fetchStudents()
      }
    },
    // recalcule la vue locale quand les présences changent
    attendances: {
      immediate: true,
      deep: true,
      handler () {
        this.presentSet = new Set((this.attendances || []).map(a => a.studentId))
      }
    }
  },

  methods: {
    async fetchStudents () {
      this.students = []
      if (!this.groupId) return
      this.loadingStudents = true
      try {
        const token = localStorage.getItem('token')
        const { data } = await api.get(`/api/groups/${this.groupId}/students`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        // sécurise le shape
        this.students = (data || []).map(s => ({
          ldapId: s.ldapId,
          firstname: s.firstname || s.firstName || s.prenom,
          lastname: s.lastname || s.lastName || s.nom
        }))
      } catch (e) {
        this.toastError(e.response?.data?.message || "Erreur lors du chargement des étudiants du groupe")
      } finally {
        this.loadingStudents = false
      }
    },

    isPresent (studentId) {
      return this.presentSet.has(studentId)
    },

    async onToggle (studentId, present) {
      if (!this.sessionId) {
        this.toastError("Sélectionnez d'abord une séance.")
        return
      }

      // Optimiste
      const prev = new Set(this.presentSet)
      if (present) this.presentSet.add(studentId); else this.presentSet.delete(studentId)
      this.toggling.add(studentId)

      try {
        const token = localStorage.getItem('token')
        await api.post('/api/attendances/toggle', {
          sessionId: this.sessionId,
          studentId,
          present
        }, { headers: { Authorization: `Bearer ${token}` } })

        // notifie le parent pour rafraîchir les présences serveur si besoin
        this.$emit('refresh')
      } catch (e) {
        // rollback
        this.presentSet = prev
        this.toastError(e.response?.data?.message || "Échec de la mise à jour de la présence")
      } finally {
        this.toggling.delete(studentId)
      }
    },

    toastError (message) {
      if (this.$toast?.error) {
        this.$toast.error(message, { position: 'top-right', timeout: 3000 })
      } else {
        // fallback console
        console.error(message)
      }
    }
  }
}
</script>

<style scoped>
.v-simple-table thead th {
  white-space: nowrap;
}
</style>
