// controllers/attendanceController.js

const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Session = require('../models/Session');

// Récupérer la liste des présences pour une session
exports.getAttendanceForSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    // Vérifier que la séance existe
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Séance introuvable' });
    }

    // Récupérer toutes les présences pour cette séance
    const attendances = await Attendance.findAll({
      where: { sessionId },    // <-- clé correcte
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'ldapId', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['timestamp', 'ASC']]
    });

    res.json(attendances);
  } catch (err) {
    console.error('Erreur getAttendanceForSession :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Valider la présence d’un pair
exports.validatePeer = async (req, res) => {
  try {
    const { attendanceId } = req.body;
    const validatorId = req.user.id; // récupéré par le middleware auth

    if (!attendanceId) {
      return res.status(400).json({ error: 'attendanceId requis' });
    }

    // Vérifier que la présence existe
    const attendance = await Attendance.findByPk(attendanceId);
    if (!attendance) {
      return res.status(404).json({ error: 'Présence introuvable' });
    }

    // Empêcher l’auto-validation
    if (attendance.studentId === validatorId) {
      return res.status(403).json({ error: 'Vous ne pouvez pas valider votre propre présence' });
    }

    // Marquer la validation croisée
    attendance.validatedByPeer = true;
    await attendance.save();

    res.json({ message: 'Présence validée par un pair', attendance });
  } catch (err) {
    console.error('Erreur validatePeer :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
