const jwt = require('jsonwebtoken');
const qrcode = require('qrcode');
const { Sequelize, sequelize, Session, Attendance, User, QrCode } = require('../models');
const SECRET_KEY = process.env.SECRET_KEY || 'default_secret';
const QR_CODE_EXPIRATION = 10 * 60; // 10 minutes

// Logger d'erreurs
const logError = (context, error) => {
  console.error(`[QR][${context}]`, {
    error: error.message,
    stack: error.stack?.split('\n')[0],
    type: error.name
  });
};

exports.generateQRCode = async (req, res) => {
  const { sessionId } = req.body;

  console.log(`[QR] Génération demandée par l'utilisateur ${req.user?.ldapId} pour la session ${sessionId}`);

  // Vérifie que le modèle QrCode est bien chargé
  if (!QrCode || typeof QrCode.create !== 'function') {
    console.error("[QR][GENERATION] ❌ Modèle QrCode non disponible ou mal importé.");
    return res.status(500).json({
      success: false,
      message: "Le modèle QrCode est mal configuré.",
    });
  }

  try {
    if (!sessionId) {
      throw {
        name: 'ValidationError',
        message: 'ID de session requis',
        status: 400
      };
    }

    const session = await Session.findByPk(sessionId, {
      include: [{
        model: User,
        as: 'teacher',
        attributes: ['ldapId', 'firstname', 'lastname','email']
      }]
    });

    if (!session) {
      throw {
        name: 'NotFoundError',
        message: 'Session introuvable',
        status: 404
      };
    }

    if (session.teacher.ldapId !== req.user.ldapId) {
      throw {
        name: 'AuthorizationError',
        message: 'Seul le professeur peut générer un QR Code',
        status: 403
      };
    }

    const token = jwt.sign({
      sessionId,
      generatedBy: req.user.ldapId,
      used: false
    }, SECRET_KEY, { expiresIn: QR_CODE_EXPIRATION });

    const qrCodeUrl = await qrcode.toDataURL(token);
    const expiry = new Date(Date.now() + QR_CODE_EXPIRATION * 1000);

    await QrCode.create({
      code: token,
      expiresAt: expiry,
      sessionId: sessionId,  // <-- ici correction de la casse
      generatedBy: req.user.ldapId
    });

    console.log(`[QR] QR Code généré avec succès pour la session ${sessionId}`);

    res.json({
      success: true,
      token,
      qrCodeUrl,
      expiry,
      sessionInfo: {
        id: session.id,
        subject: session.subject,
        room: session.room,
        startTime: session.startTime,
        teacher: session.teacher
      }
    });

  } catch (error) {
    logError('GENERATION', error);

    const status = error.status || 500;
    const response = {
      success: false,
      message: error.message || 'Erreur lors de la génération',
      code: error.name || 'QR_GENERATION_ERROR'
    };

    if (process.env.NODE_ENV === 'development') {
      response.error = error.stack;
    }

    res.status(status).json(response);
  }
};

exports.scanQRCode = async (req, res) => {
  const { token, studentId } = req.body;

  try {
    if (!token || !studentId) {
      throw {
        name: 'ValidationError',
        message: 'Token et ID étudiant requis',
        status: 400
      };
    }

    const student = await User.findOne({
      where: {
        ldapId: studentId,
        role: 'student'
      }
    });

    if (!student) {
      throw {
        name: 'NotFoundError',
        message: 'Étudiant non trouvé ou non autorisé',
        status: 404
      };
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    const session = await Session.findByPk(decoded.sessionId);
    if (!session) {
      throw {
        name: 'NotFoundError',
        message: 'Session introuvable',
        status: 404
      };
    }

    const qrRecord = await QrCode.findOne({
      where: {
        code: token,
        used: false
      }
    });

    if (!qrRecord) {
      throw {
        name: 'InvalidQR',
        message: 'QR Code invalide ou déjà utilisé',
        status: 400
      };
    }

    if (new Date(qrRecord.expiresAt) < new Date()) {
      throw {
        name: 'ExpiredQR',
        message: 'QR Code expiré',
        status: 400
      };
    }

    const existingAttendance = await Attendance.findOne({
      where: {
        sessionId: decoded.sessionId,
        studentId
      }
    });

    if (existingAttendance) {
      throw {
        name: 'DuplicateAttendance',
        message: 'Présence déjà enregistrée',
        status: 409
      };
    }

    const result = await sequelize.transaction(async (t) => {
      const attendance = await Attendance.create({
        sessionId: decoded.sessionId,
        studentId,
        timestamp: new Date(),
        mode: 'QR',
        qrCodeId: qrRecord.id
      }, { transaction: t });

      await qrRecord.update({ used: true }, { transaction: t });

      return attendance;
    });

    res.json({
      success: true,
      message: 'Présence enregistrée avec succès',
      attendance: {
        id: result.id,
        sessionId: result.sessionId,
        studentId: result.studentId,
        timestamp: result.timestamp
      },
      session: {
        id: session.id,
        subject: session.subject
      }
    });

  } catch (error) {
    logError('SCAN', error);
    const status = error.status || 400;
    res.status(status).json({
      success: false,
      message: error.message || 'Erreur lors du scan',
      code: error.name || 'QR_SCAN_ERROR'
    });
  }
};

exports.testQRCode = async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'Disponible uniquement en mode développement'
    });
  }

  const { sessionId, studentId } = req.body;

  try {
    const testToken = jwt.sign({ sessionId }, SECRET_KEY, { expiresIn: '5m' });

    const scanResponse = await this.scanQRCode({
      body: { token: testToken, studentId }
    }, {
      status: (code) => ({
        json: (data) => ({ statusCode: code, data })
      })
    });

    res.json({
      success: scanResponse.statusCode === 200,
      testToken,
      result: scanResponse.data
    });

  } catch (error) {
    logError('TEST', error);
    res.status(500).json({
      success: false,
      message: 'Échec du test',
      error: error.message
    });
  }
};
