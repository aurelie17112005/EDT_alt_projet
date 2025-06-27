const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ]
})
// vue.config.js (Vue CLI)
module.exports = {
  devServer: {
    host: '0.0.0.0', // important
    port: 8081,
    allowedHosts: 'all',
    client: {
      webSocketURL: 'ws://localhost:8081/ws',
    }
  }
};