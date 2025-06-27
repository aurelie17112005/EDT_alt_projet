const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const User = require('./models/User');
const Session = require('./models/Session');
const Attendance = require('./models/Attendance');

async function resetAndSeed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connecté à la base PostgreSQL');

    // Nettoyage des tables
    await sequelize.query('TRUNCATE "Users", "Sessions", "Attendances" RESTART IDENTITY CASCADE');
    console.log('🧹 Tables nettoyées avec CASCADE');

    // Création des utilisateurs avec prénom/nom
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.bulkCreate([
      {
        ldapId: 'admin01',
        email: 'admin01@univ.fr',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Alice',
        lastName: 'Admin'
      },
      {
        ldapId: 'admin02',
        email: 'admin02@univ.fr',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Alex',
        lastName: 'Root'
      },
      {
        ldapId: 'teacher01',
        email: 'teacher01@univ.fr',
        password: hashedPassword,
        role: 'teacher',
        firstName: 'Thomas',
        lastName: 'Durand'
      },
      {
        ldapId: 'teacher02',
        email: 'teacher02@univ.fr',
        password: hashedPassword,
        role: 'teacher',
        firstName: 'Claire',
        lastName: 'Martin'
      },
      {
        ldapId: 'student01',
        email: 'student01@univ.fr',
        password: hashedPassword,
        role: 'student',
        firstName: 'Lucas',
        lastName: 'Moreau'
      }
    ]);
    console.log('✅ Utilisateurs créés');

    // Création des sessions
    const sessions = await Session.bulkCreate([
      {
        subject: 'Mathématiques',
        room: 'B101',
        startTime: new Date('2023-11-10T09:00:00'),
        endTime: new Date('2023-11-10T11:00:00'),
        qrCode: 'MATH-101-20231110',
        teacherId: users[2].id
      },
      {
        subject: 'Physique',
        room: 'B205',
        startTime: new Date('2023-11-11T10:00:00'),
        endTime: new Date('2023-11-11T12:00:00'),
        qrCode: 'PHYS-205-20231111',
        teacherId: users[2].id
      },
      {
        subject: 'Chimie',
        room: 'C104',
        startTime: new Date('2023-11-12T14:00:00'),
        endTime: new Date('2023-11-12T16:00:00'),
        qrCode: 'CHIM-104-20231112',
        teacherId: users[3].id
      },
      {
        subject: 'Informatique',
        room: 'A302',
        startTime: new Date('2023-11-13T13:00:00'),
        endTime: new Date('2023-11-13T15:00:00'),
        qrCode: 'INFO-302-20231113',
        teacherId: users[3].id
      },
      {
        subject: 'Biologie',
        room: 'D201',
        startTime: new Date('2023-11-14T08:00:00'),
        endTime: new Date('2023-11-14T10:00:00'),
        qrCode: 'BIO-201-20231114',
        teacherId: users[3].id
      }
    ]);
    console.log('✅ Sessions créées');

    // Création des présences
    const attendancesData = [
      {
        timestamp: new Date('2023-11-10T09:05:00'),
        validatedByPeer: true,
        SessionId: sessions[0].id,
        studentId: users[4].id
      },
      {
        timestamp: new Date('2023-11-11T10:10:00'),
        validatedByPeer: false,
        SessionId: sessions[1].id,
        studentId: users[4].id
      },
      {
        timestamp: new Date('2023-11-12T14:15:00'),
        validatedByPeer: true,
        SessionId: sessions[2].id,
        studentId: users[4].id
      },
      {
        timestamp: new Date('2023-11-13T13:20:00'),
        validatedByPeer: false,
        SessionId: sessions[3].id,
        studentId: users[4].id
      },
      {
        timestamp: new Date('2023-11-14T08:25:00'),
        validatedByPeer: true,
        SessionId: sessions[4].id,
        studentId: users[4].id
      }
    ];

    for (const data of attendancesData) {
      try {
        await Attendance.create(data);
        console.log(`✅ Présence enregistrée pour session ${data.SessionId}`);
      } catch (err) {
        console.error(`❌ Erreur création présence : ${err.message}`);
      }
    }

    console.log('🎉 Base de données initialisée avec succès');
  } catch (error) {
    console.error('❌ Erreur pendant le script :', error.message);
    console.error('Détails :', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Connexion à la base fermée');
  }
}

resetAndSeed();
