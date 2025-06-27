<template>
  <div class="qr-generator">
    <v-btn @click="generateQr" color="primary" :loading="loading">
      Générer QR Code
    </v-btn>

    <div v-if="qrUrl" class="mt-4">
      <img :src="qrUrl" alt="QR Code" style="max-width: 200px;" />
      <p class="mt-2">Valide jusqu'à: {{ expiryTime }}</p>
    </div>

    <v-alert v-if="error" type="error" class="mt-3">
      {{ error }}
    </v-alert>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'QrCodeGenerator',
  props: {
    sessionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      qrUrl: '',
      expiryTime: '',
      loading: false,
      error: null
    }
  },
  methods: {
    async generateQr() {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('token')

        const res = await axios.post(
          'http://localhost:3000/api/qrcode/generate',
          { sessionId: this.sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        this.qrUrl = res.data.qrCodeUrl
        this.expiryTime = new Date(Date.now() + 5 * 60 * 1000).toLocaleString() // 5 min
      } catch (err) {
        console.error('Erreur lors de la génération du QR Code:', err)
        this.error = err.response?.data?.message || 'Erreur inconnue'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
