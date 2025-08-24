const express = require('express');
const session = require('express-session');
const passport = require('./middlewares/passport');
const cors = require('cors');
const dotenv = require('dotenv');
const pdfRoutes = require('./routes/pdfRoutes');
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);

dotenv.config();
const app = express();

// CORS
const corsOptions = {
  origin: ['http://localhost:8081','https://0b510d3490a5.ngrok-free.app','edt-alt.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'cache-control'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Connexion PostgreSQL pour les sessions
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/emargement'
});

// Sessions & Passport
app.use(session({
  store: new pgSession({
    pool: pgPool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'ma_clé_super_secrète',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    httpOnly: true,
    secure: false, // passe à true en production si HTTPS
    sameSite: 'lax'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require('./routes/authRoutes');
const qrRoutes = require('./routes/qrRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const groupsRoutes = require('./routes/groupsRoutes');

app.get('/', (req, res) => {
  res.send('Backend opérationnel ✔️');
});

app.use('/auth', authRoutes);
app.use('/api/qrcode', qrRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/groups', groupsRoutes);

module.exports = app;
