module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  cas: {
    serviceUrl: process.env.CAS_SERVICE_URL || 'http://localhost:3000/api/auth/login-cas',
    casUrl: process.env.CAS_URL || 'https://auth.univ-fcomte.fr'
  }
};