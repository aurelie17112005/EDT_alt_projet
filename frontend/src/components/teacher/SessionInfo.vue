<template>
  <div>
    <p><strong>Sujet :</strong> {{ session.subject }}</p>
    <p><strong>Salle :</strong> {{ session.room }}</p>

    <!-- Groupe -->
    <p v-if="session.group">
      <strong>Groupe :</strong> {{ session.group.name }}
    </p>
    <p v-else>
      <strong>Groupe :</strong> —
    </p>

    <p>
      <strong>Horaire :</strong>
      {{ formatDate(session.startTime) }} – {{ formatDate(session.endTime) }}
    </p>

    <!-- Enseignant -->
    <p v-if="session.teacher">
      <strong>Enseignant :</strong>
      {{ session.teacher.firstname }} {{ session.teacher.lastname }}
    </p>
    <p v-else>
      <strong>Enseignant :</strong> —
    </p>
  </div>
</template>

<script>
import { format } from 'date-fns';

export default {
  name: 'SessionInfo',
  props: {
    session: { type: Object, required: true }
  },
  methods: {
    formatDate(dt) {
      return format(new Date(dt), 'dd/MM/yyyy HH:mm');
    }
  }
};
</script>

<style scoped>
strong {
  width: 100px;
  display: inline-block;
}
</style>
