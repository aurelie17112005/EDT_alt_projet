<template>
  <v-card outlined class="mt-4">
    <v-card-title class="secondary white--text">
      Liste des présences
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="attendances"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.present="{ item }">
          <v-chip :color="item.present ? 'success' : 'error'" small>
            {{ item.present ? 'Présent' : 'Absent' }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'AttendanceList',
  props: {
    attendances: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: 'Étudiant', value: 'student_name' },
        { text: 'Statut', value: 'present' },
        { text: 'Méthode', value: 'check_type' },
        { text: 'Validé par', value: 'validated_by_name' }
      ]
    }
  }
}
</script>