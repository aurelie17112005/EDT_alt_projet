const express = require('express');
const session = require('express-session');
const passport = require('./middlewares/passport');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// CORS
const corsOptions = {
  origin: 'http://localhost:8081',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Sessions & Passport
app.use(session({
  secret: 'ma_clé_super_secrète',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routeurs
const authRoutes = require('./routes/authRoutes');
const qrRoutes = require('./routes/qrRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

app.use('/auth', authRoutes);

// **IMPORTANT** : on monte les QR sous /api/qrcode
app.use('/api/qrcode', qrRoutes);

// Sessions prof sous /api/sessions
app.use('/api/sessions', sessionRoutes);

// **NOUVEAU** : présences sous /api/attendances
app.use('/api/attendances', attendanceRoutes);

module.exports = app;
