const passport = require('passport');
const { Strategy: CasStrategy } = require('passport-cas');

// Configuration minimale du CAS
passport.use(new CasStrategy({
  version: 'CAS3.0',
  ssoBaseURL: 'https://auth.univ-fcomte.fr/cas',
  serverBaseURL: 'http://localhost:3000',
  serviceURL: 'http://localhost:3000/api/auth/cas/callback',
}, (login, profile, done) => {
  return done(null, login);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
