// vue.config.js
const { defineConfig } = require('@vue/cli-service')

const isProd = process.env.NODE_ENV === 'production'

module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  publicPath: '/', // Vercel serves at root
  devServer: {
    host: '0.0.0.0',
    port: 8081,
    allowedHosts: 'all',
    ...(isProd ? {} : {
      client: { webSocketURL: 'ws://localhost:8081/ws' }
    })
  }
})
