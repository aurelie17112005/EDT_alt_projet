<template>
  <div class="text-center">
    <v-btn color="primary" @click="generateQrCode" :loading="loading" :disabled="loading">
      <v-icon left>mdi-qrcode</v-icon>
      Générer le QR Code
    </v-btn>

    <div class="mt-4">
      <p class="text-red" v-if="!qr">Aucun QR généré</p>
      <div v-else>
        <p class="text-green">QR généré :</p>
        <img :src="qr" alt="QR Code" style="max-width: 200px; margin-top: 10px;" />
        <div class="caption grey--text">Valable 5 minutes</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

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
      qr: '',
      loading: false
    };
  },
  methods: {
    async generateQrCode() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await api.post(`/api/qrcode/generate`, {sessionId: this.sessionId}, {
          headers: {Authorization: `Bearer ${token}`}
        });
        console.log('QR reçu du backend :', response.data.qrCode);
        this.qr = response.data.qrCodeUrl;
        this.$emit('qr-generated', this.qr);
      } catch (error) {
        console.error('Erreur génération QR:', error);
        this.$emit('error', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
img {
  display: block;
  margin: 0 auto;
  border: 1px solid #ccc;
  padding: 5px;
  background-color: #fff;
}
</style>
