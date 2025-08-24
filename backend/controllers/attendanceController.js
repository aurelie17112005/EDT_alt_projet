const { Attendance, Session, User } = require('../models');

exports.getAttendanceForSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Séance introuvable' });
    }

    const attendances = await Attendance.findAll({
      where: { sessionId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['ldapId', 'firstname', 'lastname', 'email']
        },
        {
          model: User,
          as: 'validator',
          attributes: ['ldapId', 'firstname', 'lastname'],
          required: false
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

exports.validatePeer = async (req, res) => {
  try {
    const { attendanceId } = req.body;
    const validatorId = req.user?.ldapId;

    if (!attendanceId) {
      return res.status(400).json({ error: 'attendanceId requis' });
    }

    const attendance = await Attendance.findByPk(attendanceId);
    if (!attendance) {
      return res.status(404).json({ error: 'Présence introuvable' });
    }

    if (attendance.studentId === validatorId) {
      return res.status(403).json({ error: 'Auto-validation interdite' });
    }

    attendance.validatedByPeer = true;
    attendance.validatedBy = validatorId;
    await attendance.save();

    res.status(200).json({
      message: 'Présence validée par un pair',
      attendance: {
        id: attendance.id,
        sessionId: attendance.sessionId,
        studentId: attendance.studentId,
        validatedBy: attendance.validatedBy,
        timestamp: attendance.timestamp
      }
    });
  } catch (err) {
    console.error('Erreur validatePeer :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
exports.updateAttendanceStatus = async (req, res) => {
  try {
    const attendanceId = req.params.attendanceId;
    const { validatedBy, validatedByPeer } = req.body;

    const attendance = await Attendance.findByPk(attendanceId);
    if (!attendance) {
      return res.status(404).json({ error: 'Présence introuvable' });
    }

    if (validatedBy !== undefined) attendance.validatedBy = validatedBy;
    if (validatedByPeer !== undefined) attendance.validatedByPeer = validatedByPeer;

    await attendance.save();

    res.status(200).json({ message: 'Présence mise à jour', attendance });
  } catch (err) {
    console.error('Erreur updateAttendanceStatus :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
exports.getBySession = async (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId, 10);
    if (!sessionId) return res.status(400).json({ message: 'sessionId invalide' });

    const list = await Attendance.findAll({
      where: { sessionId },
      include: [{ model: User, as: 'student', attributes: ['ldapId', 'firstname', 'lastname', 'email'] }],
      order: [['createdAt', 'ASC']]
    });

    res.json(list);
  } catch (e) {
    console.error('getBySession error', e);
    res.status(500).json({ message: 'Erreur lors du chargement des présences' });
  }
};

exports.manualToggle = async (req, res) => {
  try {
    const { sessionId, studentId, present } = req.body;
    if (!sessionId || !studentId || typeof present !== 'boolean') {
      return res.status(400).json({ message: 'sessionId, studentId et present sont requis' });
    }

    if (present) {
      // Crée (si pas déjà) l’enregistrement de présence
      const [att] = await Attendance.findOrCreate({
        where: { sessionId, studentId },
        defaults: {
          mode: 'MANUAL',
          timestamp: new Date(),
          validatedByPeer: false,
          validatedBy: req.user?.ldapId || null
        }
      });
      // Si existant, on peut mettre à jour quelques champs
      if (att) {
        await att.update({
          mode: 'MANUAL',
          timestamp: new Date(),
          validatedByPeer: false,
          validatedBy: req.user?.ldapId || null
        });
      }
      return res.json({ ok: true, present: true });
    } else {
      // Absent -> supprime la présence existante (simple et efficace)
      await Attendance.destroy({ where: { sessionId, studentId } });
      return res.json({ ok: true, present: false });
    }
  } catch (e) {
    console.error('manualToggle error', e);
    res.status(500).json({ message: 'Impossible de modifier la présence' });
  }
};