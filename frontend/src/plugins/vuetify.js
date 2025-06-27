import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#B80C09',    // Rouge
        secondary: '#0B4F6C',  // Bleu foncé
        accent: '#01BAEF',     // Bleu clair
        background: '#FBFBFF', // Fond blanc
        success: '#040F16',    // Noir
        error: '#B80C09',      // Rouge
        info: '#01BAEF',       // Bleu clair
        warning: '#0B4F6C'     // Bleu foncé
      }
    }
  }
})