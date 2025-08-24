// database.js
const sequelize = require('./config/database');
const { Group, User, Session, QrCode, Attendance } = require('./models');
const bcrypt = require('bcrypt');

// Petit helper pour créer des dates UTC (évite les surprises de timezone)
const dt = (y, m, d, hh, mm) => new Date(Date.UTC(y, m - 1, d, hh, mm, 0));

// Génère un code QR lisible/déterministe
const qr = (abbr, idx) => `QR-${abbr}-${String(idx).padStart(2, '0')}`;

// Abréviations simples pour les sujets
const subjectAbbr = (s) => {
  const map = {
    'Mathématiques': 'MATH',
    'Physique': 'PHYS',
    'Informatique': 'INFO',
    'Chimie': 'CHIM',
    'Électronique': 'ELEC',
    'Algorithmique': 'ALGO',
    'Statistiques': 'STAT',
    'Réseaux': 'RESEAUX',
    'Économie': 'ECO',
    'Projet': 'PROJET'
  };
  return map[s] || s.toUpperCase().slice(0, 6);
};

async function resetAndSeed() {
  try {
    await sequelize.sync(); // associations + structure OK
    console.log('✅ Base synchronisée');

    // --- Reset dur : vide toutes les tables et réinitialise les IDs ---
    await sequelize.query(`
      TRUNCATE TABLE "attendances", "qrcodes", "sessions", "users", "groups"
      RESTART IDENTITY CASCADE;
    `);
    console.log('🧹 Tables vidées (TRUNCATE) + ID réinitialisés');

    // --- Groupes ---
    const groups = await Group.bulkCreate([
      { name: 'BUT 2 A' }, // id 1
      { name: 'BUT 2 B' }, // id 2
      { name: 'BUT 2 C' }  // id 3
    ], { returning: true });
    const [gA, gB, gC] = groups;
    console.log('✅ Groupes insérés');

    // --- Utilisateurs ---
    const passwordHash = await bcrypt.hash('test1234', 10);

    // 1 admin
    const admin = {
      ldapId: 'admin01',
      firstname: 'Admin',
      lastname: 'Root',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'admin',
      groupId: null
    };

    // 4 enseignants
    const teachers = [
      { ldapId: 'teacher01', firstname: 'Marie',  lastname: 'Dupont',   email: 'marie@example.com',  password: passwordHash, role: 'teacher' },
      { ldapId: 'teacher02', firstname: 'Jean',   lastname: 'Martin',   email: 'jean@example.com',   password: passwordHash, role: 'teacher' },
      { ldapId: 'teacher03', firstname: 'Emma',   lastname: 'Leroy',    email: 'emma@example.com',   password: passwordHash, role: 'teacher' },
      { ldapId: 'teacher04', firstname: 'Luc',    lastname: 'Chevalier',email: 'luc@example.com',    password: passwordHash, role: 'teacher' }
    ].map(t => ({ ...t, groupId: null }));

    // 30 étudiants (10 par groupe)
    const studentsA = Array.from({ length: 10 }).map((_, i) => ({
      ldapId: `studentA${String(i + 1).padStart(2, '0')}`,
      firstname: `A_Etu${i + 1}`,
      lastname: `GroupeA`,
      email: `a_etu${i + 1}@example.com`,
      password: passwordHash,
      role: 'student',
      groupId: gA.id
    }));

    const studentsB = Array.from({ length: 10 }).map((_, i) => ({
      ldapId: `studentB${String(i + 1).padStart(2, '0')}`,
      firstname: `B_Etu${i + 1}`,
      lastname: `GroupeB`,
      email: `b_etu${i + 1}@example.com`,
      password: passwordHash,
      role: 'student',
      groupId: gB.id
    }));

    const studentsC = Array.from({ length: 10 }).map((_, i) => ({
      ldapId: `studentC${String(i + 1).padStart(2, '0')}`,
      firstname: `C_Etu${i + 1}`,
      lastname: `GroupeC`,
      email: `c_etu${i + 1}@example.com`,
      password: passwordHash,
      role: 'student',
      groupId: gC.id
    }));

    await User.bulkCreate([admin, ...teachers, ...studentsA, ...studentsB, ...studentsC]);
    console.log('✅ Utilisateurs (admin, enseignants, étudiants) insérés');

    // --- Sessions sur une semaine (2 par jour, lun → ven) ---
    // Semaine de référence : 2025-09-08 (lundi)
    const plan = [
      // Lundi (BUT 2 A, BUT 2 B)
      { date: [2025, 9, 8],  subject: 'Mathématiques', room: 'B101', start: [8,  0], end: [10, 0], groupId: gA.id, teacherId: 'teacher01' },
      { date: [2025, 9, 8],  subject: 'Physique',      room: 'B205', start: [10,15], end: [12,15], groupId: gB.id, teacherId: 'teacher02' },

      // Mardi (BUT 2 C, BUT 2 A)
      { date: [2025, 9, 9],  subject: 'Informatique',  room: 'A301', start: [8,  0], end: [10, 0], groupId: gC.id, teacherId: 'teacher03' },
      { date: [2025, 9, 9],  subject: 'Chimie',        room: 'C104', start: [10,15], end: [12,15], groupId: gA.id, teacherId: 'teacher04' },

      // Mercredi (BUT 2 B, BUT 2 C)
      { date: [2025, 9, 10], subject: 'Électronique',  room: 'E210', start: [8,  0], end: [10, 0], groupId: gB.id, teacherId: 'teacher01' },
      { date: [2025, 9, 10], subject: 'Algorithmique', room: 'A102', start: [10,15], end: [12,15], groupId: gC.id, teacherId: 'teacher02' },

      // Jeudi (BUT 2 A, BUT 2 B)
      { date: [2025, 9, 11], subject: 'Statistiques',  room: 'D110', start: [8,  0], end: [10, 0], groupId: gA.id, teacherId: 'teacher03' },
      { date: [2025, 9, 11], subject: 'Réseaux',       room: 'R005', start: [10,15], end: [12,15], groupId: gB.id, teacherId: 'teacher04' },

      // Vendredi (BUT 2 C, BUT 2 A)
      { date: [2025, 9, 12], subject: 'Économie',      room: 'F201', start: [8,  0], end: [10, 0], groupId: gC.id, teacherId: 'teacher01' },
      { date: [2025, 9, 12], subject: 'Projet',        room: 'P001', start: [10,15], end: [12,15], groupId: gA.id, teacherId: 'teacher02' }
    ];

    // On fabrique les objets Session avec qrCode non nul
    const sessionsPayload = plan.map((p, i) => {
      const [Y, M, D] = p.date;
      const [sh, sm]  = p.start;
      const [eh, em]  = p.end;
      const subject   = p.subject;
      const code      = qr(subjectAbbr(subject), i + 1);

      return {
        subject,
        room: p.room,
        startTime: dt(Y, M, D, sh, sm),
        endTime:   dt(Y, M, D, eh, em),
        qrCode: code,
        groupId: p.groupId,
        teacherId: p.teacherId
      };
    });

    const sessions = await Session.bulkCreate(sessionsPayload, { returning: true });
    console.log(`✅ Sessions insérées : ${sessions.length}`);

    // --- QR Codes (liés aux sessions) ---
    const qrPayload = sessions.map(s => ({
      code: s.qrCode,
      sessionId: s.id,
      used: false,
      expiresAt: new Date(s.endTime.getTime() + 30 * 60 * 1000) // +30 min après la fin
    }));

    await QrCode.bulkCreate(qrPayload);
    console.log(`✅ QR Codes insérés : ${qrPayload.length}`);

    // --- Présences (on marque 6 étudiants présents par séance, via QR) ---
    // Prépare des listes d'IDs étudiants par groupe :
    const listA = studentsA.map(s => s.ldapId);
    const listB = studentsB.map(s => s.ldapId);
    const listC = studentsC.map(s => s.ldapId);

    const byGroupId = {
      [gA.id]: listA,
      [gB.id]: listB,
      [gC.id]: listC
    };

    const attendancePayload = [];
    sessions.forEach((s) => {
      const list = byGroupId[s.groupId] || [];
      // Marquer les 6 premiers présents
      list.slice(0, 6).forEach((ldap) => {
        attendancePayload.push({
          sessionId: s.id,
          studentId: ldap,
          mode: 'QR',
          validatedByPeer: false,
          timestamp: new Date(s.startTime.getTime() + 5 * 60 * 1000) // +5 min
        });
      });
    });

    if (attendancePayload.length) {
      await Attendance.bulkCreate(attendancePayload);
      console.log(`✅ Présences initiales insérées : ${attendancePayload.length}`);
    } else {
      console.log('ℹ️ Aucune présence insérée (aucun étudiant trouvé ?)');
    }

    console.log('🎉 Seed terminé avec succès');
  } catch (err) {
    console.error('❌ Erreur seed :', err);
  } finally {
    await sequelize.close();
    console.log('🔒 Connexion fermée');
  }
}

resetAndSeed();
