<template>
  <v-container>
    <v-card>
      <v-card-title>Scanner QR Code</v-card-title>
      <v-card-text>
        <qr-code-scanner
          v-if="isScanning"
          @scan-success="handleScanSuccess"
          @scan-error="handleScanError"
        />
        <v-btn v-else @click="startScanner" color="primary">
          Démarrer le scan
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import QrCodeScanner from '@/components/student/QrCodeScanner'

export default {
  name: 'ScanView',
  components: { QrCodeScanner },
  data: () => ({
    isScanning: false
  }),
  methods: {
    startScanner() {
      this.isScanning = true
    },
    async handleScanSuccess(qrData) {
      try {
        await this.$api.post('/attendance/scan', {
          token: qrData,
          studentId: this.$store.getters['auth/currentUser'].id
        })
        this.$store.dispatch('showSnackbar', {
          message: 'Présence enregistrée!',
          color: 'success'
        })
      } catch (error) {
        this.handleScanError(error)
      } finally {
        this.isScanning = false
      }
    },
    handleScanError(error) {
      this.$store.dispatch('showSnackbar', {
        message: error.response?.data?.message || 'Erreur de scan',
        color: 'error'
      })
    }
  }
}
</script>