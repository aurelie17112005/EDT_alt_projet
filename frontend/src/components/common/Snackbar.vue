<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="3000"
    top
  >
    {{ snackbar.message }}
    <v-btn text @click="snackbar.show = false">
      Fermer
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'Snackbar',
  computed: {
    snackbar() {
      return this.$store.state.snackbar
    }
  },
  watch: {
    'snackbar.show'(newVal) {
      if (!newVal) {
        this.$store.commit('SET_SNACKBAR', { show: false })
      }
    }
  }
}
</script>