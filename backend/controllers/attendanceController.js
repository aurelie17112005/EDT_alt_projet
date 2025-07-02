const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Session = require('../models/Session');

// ✅ Récupérer la liste des présences pour une session
exports.getAttendanceForSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId; // utiliser camelCase côté backend et frontend

    // Vérifier que la séance existe
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Séance introuvable' });
    }

    // Récupérer toutes les présences liées à cette session
    const attendances = await Attendance.findAll({
      where: { SessionId: sessionId }, // Sequelize a généré `SessionId` en PascalCase
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'ldapId', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['timestamp', 'ASC']]
    });

    res.status(200).json(attendances);
  } catch (err) {
    console.error('Erreur getAttendanceForSession :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ✅ Valider la présence d’un pair
exports.validatePeer = async (req, res) => {
  try {
    const { attendanceId } = req.body;
    const validatorId = req.user?.id; // récupérer depuis le token (auth middleware)

    if (!attendanceId) {
      return res.status(400).json({ error: 'attendanceId requis' });
    }

    const attendance = await Attendance.findByPk(attendanceId);
    if (!attendance) {
      return res.status(404).json({ error: 'Présence introuvable' });
    }

    // Empêcher qu'un étudiant valide sa propre présence
    if (attendance.studentId === validatorId) {
      return res.status(403).json({ error: 'Auto-validation interdite' });
    }

    attendance.validatedByPeer = true;
    await attendance.save();

    res.status(200).json({ message: 'Présence validée par un pair', attendance });
  } catch (err) {
    console.error('Erreur validatePeer :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
