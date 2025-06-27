<template>
  <div class="qr-scanner">
    <video ref="video" width="100%" autoplay playsinline></video>
    <canvas ref="canvas" style="display: none;"></canvas>
  </div>
</template>

<script>
export default {
  name: 'QrCodeScanner',
  emits: ['scan-success', 'scan-error'],
  data: () => ({
    scanner: null
  }),
  mounted() {
    this.initScanner()
  },
  beforeUnmount() {
    this.stopScanner()
  },
  methods: {
    async initScanner() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        this.$refs.video.srcObject = stream
        this.scanner = setInterval(this.scanQrCode, 500)
      } catch (error) {
        this.$emit('scan-error', error)
      }
    },
    scanQrCode() {
      const video = this.$refs.video
      const canvas = this.$refs.canvas
      const context = canvas.getContext('2d')

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      try {
        const qrData = this.decodeQrFromCanvas(canvas)
        if (qrData) {
          this.$emit('scan-success', qrData)
          this.stopScanner()
        }
      } catch (error) {
        this.$emit('scan-error', error)
      }
    },
    stopScanner() {
      if (this.scanner) {
        clearInterval(this.scanner)
        this.scanner = null
      }
      if (this.$refs.video.srcObject) {
        this.$refs.video.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }
}
</script>