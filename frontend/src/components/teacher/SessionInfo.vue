<template>
  <div>
    <p><strong>Sujet :</strong> {{ session.subject }}</p>
    <p><strong>Salle :</strong> {{ session.room }}</p>
    <p>
      <strong>Début :</strong>
      {{ new Date(session.startTime).toLocaleString() }}
    </p>
    <p>
      <strong>Fin :</strong>
      {{ new Date(session.endTime).toLocaleString() }}
    </p>
    <p v-if="session.teacher">
      <strong>Enseignant :</strong>
      {{ session.teacher.firstName }} {{ session.teacher.lastName }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'SessionInfo',
  props: {
    session: {
      type: Object,
      required: true
    }
  }
};
</script>
