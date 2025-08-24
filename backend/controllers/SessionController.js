const { Session, User, Group } = require('../models');
const { Op, fn, col, where: sqWhere } = require('sequelize');

exports.getTeacherSessions = async (req, res) => {
  try {
    const teacherId = req.user?.ldapId;
    if (!teacherId) return res.status(401).json({ message: 'Unauthorized' });

    const sessions = await Session.findAll({
      where: { teacherId },
      include: [
        { model: User, as: 'teacher', attributes: ['ldapId', 'firstname', 'lastname'] },
        { model: Group, as: 'group', attributes: ['id', 'name'] },
      ],
      order: [['startTime', 'ASC']],
    });

    res.json(sessions);
  } catch (err) {
    console.error('getTeacherSessions error', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Séances du prof filtrées par date (YYYY-MM-DD) et groupe optionnel
exports.getDailySessions = async (req, res) => {
  try {
    const teacherId = req.user?.ldapId;
    if (!teacherId) return res.status(401).json({ message: 'Unauthorized' });

    const { date, groupId } = req.query;

    const where = { teacherId };

    // borne de date en UTC pour coller à tes seeds "…Z"
    if (date) {
      // ex: '2025-09-08' -> UTC 00:00:00 à 23:59:59.999
      const start = new Date(`${date}T00:00:00.000Z`);
      const end   = new Date(`${date}T23:59:59.999Z`);
      where.startTime = { [Op.between]: [start, end] };
    }

    // filtre groupe optionnel
    const gid = Number(groupId);
    if (!Number.isNaN(gid) && gid > 0) {
      where.groupId = gid;
    }

    const sessions = await Session.findAll({
      where,
      include: [
        { model: User, as: 'teacher', attributes: ['ldapId', 'firstname', 'lastname'] },
        { model: Group, as: 'group', attributes: ['id', 'name'] },
      ],
      order: [['startTime', 'ASC']],
    });

    res.json(sessions);
  } catch (err) {
    console.error('getDailySessions error', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};