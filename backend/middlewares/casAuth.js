const { Strategy: CustomStrategy } = require('passport-custom');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const config = require('../config/auth');

const parser = new XMLParser();

module.exports = new CustomStrategy(async (req, done) => {
  const ticket = req.query.ticket;

  if (!ticket) {
    return done(null, false, { message: 'Aucun ticket CAS fourni' });
  }

  try {
    const response = await axios.get(`${config.cas.casUrl}/serviceValidate`, {
      params: {
        ticket,
        service: `${config.cas.serviceUrl}/auth/cas/callback`,
      },
    });

    const result = parser.parse(response.data);
    const success = result['cas:serviceResponse']?.['cas:authenticationSuccess'];

    if (success) {
      const login = success['cas:user'];
      return done(null, login); // login = nom d'utilisateur CAS
    }

    return done(null, false, { message: 'Échec de l\'authentification CAS' });
  } catch (err) {
    return done(err);
  }
});
