# API de génération d'images

Ce document décrit les endpoints permettant de générer des images et des documents dans l'application EDT Alt.

## 🎨 Génération de QR Codes

### Endpoint
```
POST /api/qrcode/generate
```

### Description
Génère un QR code dynamique pour une séance de cours. Le QR code contient un token JWT qui permet aux étudiants de s'émarger.

### Authentification
✅ Requise (JWT Bearer Token)

### Permissions
Seul l'enseignant associé à la séance peut générer le QR code.

### Corps de la requête
```json
{
  "sessionId": 123
}
```

### Réponse réussie (200)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "expiry": "2025-10-15T12:06:53.112Z",
  "sessionInfo": {
    "id": 123,
    "subject": "Mathématiques",
    "room": "A101",
    "startTime": "2025-10-15T08:00:00.000Z",
    "teacher": {
      "ldapId": "teacher01",
      "firstname": "Jean",
      "lastname": "Dupont",
      "email": "jean.dupont@example.com"
    }
  }
}
```

### Format de l'image
- **Type**: PNG
- **Encodage**: Base64 Data URL
- **Affichage**: Peut être utilisé directement dans un attribut `src` d'une balise `<img>`
- **Validité**: 10 minutes

### Erreurs possibles
- `400 ValidationError`: ID de session manquant
- `403 AuthorizationError`: Seul le professeur peut générer un QR Code
- `404 NotFoundError`: Session introuvable

### Exemple d'utilisation (Vue.js)
```vue
<template>
  <div>
    <button @click="generateQR">Générer QR Code</button>
    <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      qrCodeUrl: null
    }
  },
  methods: {
    async generateQR() {
      const response = await this.$api.post('/api/qrcode/generate', {
        sessionId: this.sessionId
      });
      this.qrCodeUrl = response.data.qrCodeUrl;
    }
  }
}
</script>
```

---

## 📄 Génération de PDF d'émargement

### Endpoint
```
GET /api/pdf/generate-daily/:date/:groupId
```

### Description
Génère une fiche d'émargement au format PDF pour un groupe et une date donnés. Le document inclut la liste des étudiants, leur statut de présence, et les détails des séances.

### Authentification
✅ Requise (JWT Bearer Token)

### Paramètres de route
- `date`: Date au format ISO (ex: `2025-10-15`)
- `groupId`: ID du groupe (ex: `1`)

### Exemple d'URL
```
GET /api/pdf/generate-daily/2025-10-15/1
```

### Réponse
Le serveur renvoie un fichier PDF directement dans la réponse avec les headers appropriés :
```
Content-Type: application/pdf
Content-Disposition: attachment; filename=emargement_BUT_2_A_2025-10-15.pdf
```

### Contenu du PDF
Le document PDF généré contient :
1. **En-tête**
   - Titre : "Fiche d'émargement"
   - Année universitaire
   - Date
   - Nom du groupe

2. **Liste des étudiants**
   - Numéro
   - Nom et prénom
   - Statut (validé/absent)

3. **Détails des séances**
   - Matière
   - Horaires (début - fin)

4. **Pied de page**
   - Numéro de page
   - Date et heure de génération
   - Signature numérique du professeur

### Erreurs possibles
- `400 Bad Request`: Paramètres manquants
- `404 Not Found`: Groupe non trouvé

### Exemple d'utilisation (JavaScript)
```javascript
// Télécharger le PDF
async function downloadPDF(date, groupId) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(
    `/api/pdf/generate-daily/${date}/${groupId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `emargement_${date}.pdf`;
  a.click();
}
```

---

## 📚 Bibliothèques utilisées

### QR Codes
- **Bibliothèque**: [qrcode](https://www.npmjs.com/package/qrcode)
- **Version**: 1.5.4
- **Formats supportés**: PNG (base64), SVG, Terminal

### PDF
- **Bibliothèque**: [pdfkit](https://www.npmjs.com/package/pdfkit)
- **Version**: 0.17.1
- **Fonctionnalités**: Génération de PDF avec texte, images, mise en page

---

## 🔒 Sécurité

### QR Codes
- Les tokens JWT sont signés avec une clé secrète
- Expiration automatique après 10 minutes
- Les QR codes sont marqués comme "utilisés" après un scan
- Vérification que l'étudiant appartient au bon groupe

### PDF
- Authentification requise
- Signature numérique du professeur incluse
- Horodatage de génération

---

## 💡 Exemples d'intégration

### Frontend Vue.js complet
```vue
<template>
  <v-card>
    <v-card-title>Génération QR Code</v-card-title>
    <v-card-text>
      <v-btn @click="generateAndDownloadPDF" color="primary">
        Télécharger PDF
      </v-btn>
      <v-btn @click="generateQR" color="secondary">
        Générer QR
      </v-btn>
      <div v-if="qrCode" class="mt-4">
        <img :src="qrCode" alt="QR Code" style="max-width: 300px;" />
        <p class="caption">Valable 10 minutes</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      qrCode: null
    }
  },
  methods: {
    async generateQR() {
      try {
        const response = await api.post('/api/qrcode/generate', {
          sessionId: this.sessionId
        });
        this.qrCode = response.data.qrCodeUrl;
      } catch (error) {
        console.error('Erreur génération QR:', error);
      }
    },
    
    async generateAndDownloadPDF() {
      try {
        const date = new Date().toISOString().split('T')[0];
        const response = await api.get(
          `/api/pdf/generate-daily/${date}/${this.groupId}`,
          { responseType: 'blob' }
        );
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `emargement_${date}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Erreur génération PDF:', error);
      }
    }
  }
}
</script>
```
