<template>
  <v-container>
    <!-- Gestion des utilisateurs -->
    <v-card class="mb-6">
      <v-card-title>Gestion des utilisateurs</v-card-title>
      <v-card-text>
        <v-alert
            v-if="error"
            type="error"
            dense
            text
            class="mb-4"
        >{{ error }}</v-alert>
        <v-alert
            v-if="success"
            type="success"
            dense
            text
            class="mb-4"
        >{{ success }}</v-alert>

        <v-data-table
            :headers="headers"
            :items="users"
            item-key="ldapId"
            class="elevation-1"
        >
          <template #item.actions="{ item }">
            <v-btn icon small @click="openEditDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="error" @click="removeUser(item.ldapId)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Dialog d'édition -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Modifier l'utilisateur</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field
                v-model="edited.firstname"
                label="Prénom"
                required
            />
            <v-text-field
                v-model="edited.lastname"
                label="Nom"
                required
            />
            <v-text-field
                v-model="edited.email"
                label="Email"
                type="email"
                required
            />
            <v-select
                v-model="edited.role"
                :items="roles"
                label="Rôle"
                required
            />
            <v-select
                v-model="edited.groupId"
                :items="groupItems"
                item-text="name"
                item-value="id"
                label="Groupe"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="closeDialog()">Annuler</v-btn>
          <v-btn color="primary" @click="saveEdit()">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Génération des fiches d'émargement journalières -->
    <v-card>
      <v-card-title>Export quotidien des fiches d’émargement</v-card-title>
      <v-card-text class="d-flex align-center">
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
                v-model="date"
                label="Sélectionner la date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                class="mr-4"
            />
          </template>
          <v-date-picker v-model="date" @input="menu = false" />
        </v-menu>

        <v-btn
            color="primary"
            :loading="pdfLoading"
            @click="downloadDailyPdf"
            :disabled="!date || pdfLoading"
        >
          <v-icon left>mdi-file-pdf-box</v-icon>
          Télécharger la fiche du {{ formattedDate }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import api from '@/services/api'
import { format } from 'date-fns'

export default {
  name: 'AdminView',
  data() {
    return {
      // pour users CRUD
      users: [],
      groups: [],
      headers: [
        { text: 'LDAP ID', value: 'ldapId' },
        { text: 'Prénom', value: 'firstname' },
        { text: 'Nom', value: 'lastname' },
        { text: 'Email', value: 'email' },
        { text: 'Rôle', value: 'role' },
        { text: 'Groupe', value: 'group.name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      roles: ['student', 'teacher', 'admin'],
      dialog: false,
      edited: {},
      error: null,
      success: null,

      // pour la génération PDF quotidienne
      date: null,
      menu: false,
      pdfLoading: false,
    }
  },
  computed: {
    groupItems() {
      return this.groups
    },
    formattedDate() {
      return this.date
          ? format(new Date(this.date), 'dd/MM/yyyy')
          : ''
    }
  },
  async created() {
    await this.loadGroups()
    await this.loadUsers()
  },
  methods: {
    // --- CRUD Users / Groups ---
    async loadGroups() {
      try {
        const token = localStorage.getItem('token')
        const res = await api.get('/api/admin/groups', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.groups = res.data
      } catch (err) {
        console.error('Chargement groupes :', err)
      }
    },
    async loadUsers() {
      this.error = this.success = null
      try {
        const token = localStorage.getItem('token')
        const res = await api.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.users = res.data
      } catch (err) {
        this.error = err.response?.data?.error || err.message
      }
    },
    openEditDialog(item) {
      this.error = this.success = null
      this.edited = {
        ...item,
        groupId: item.group?.id || null
      }
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
      this.edited = {}
    },
    async saveEdit() {
      this.error = this.success = null
      try {
        const token = localStorage.getItem('token')
        const payload = {
          firstname: this.edited.firstname,
          lastname:  this.edited.lastname,
          email:     this.edited.email,
          role:      this.edited.role,
          groupId:   this.edited.groupId
        }
        await api.put(
            `/api/admin/users/${this.edited.ldapId}`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        this.success = 'Utilisateur mis à jour'
        this.closeDialog()
        await this.loadUsers()
      } catch (err) {
        this.error = err.response?.data?.error || err.message
      }
    },
    async removeUser(ldapId) {
      if (!confirm('Supprimer cet utilisateur ?')) return
      this.error = this.success = null
      try {
        const token = localStorage.getItem('token')
        await api.delete(`/api/admin/users/${ldapId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.success = 'Utilisateur supprimé'
        await this.loadUsers()
      } catch (err) {
        this.error = err.response?.data?.error || err.message
      }
    },

    // --- Génération PDF quotidienne ---
    async downloadDailyPdf() {
      if (!this.date) return
      this.pdfLoading = true
      this.error = this.success = null
      try {
        const token = localStorage.getItem('token')
        const res = await api.get(
            `/api/pdf/daily?date=${this.date}`,
            {
              responseType: 'blob',
              headers: { Authorization: `Bearer ${token}` }
            }
        )
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute(
            'download',
            `Emargement_${this.date}.pdf`
        )
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        this.success = `Fiche du ${this.formattedDate} générée`
      } catch (err) {
        this.error = err.response?.data?.message || err.message
      } finally {
        this.pdfLoading = false
      }
    }
  }
}
</script>

<style scoped>
.headline {
  font-weight: 500;
}
.v-card {
  padding: 16px;
}
.mb-6 {
  margin-bottom: 24px;
}
</style>
