const Session = require('../models/Session');
const User = require('../models/User');
exports.getTeacherSessions = async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id);

    const sessions = await Session.findAll({
      where: { teacherId: req.user.id },
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['startTime', 'DESC']]
    });

    console.log(`Found ${sessions.length} sessions for teacher ${req.user.id}`);
    res.json(sessions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
};
