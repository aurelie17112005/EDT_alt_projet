const PDFDocument = require('pdfkit');
const Session = require('../models/Session');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.generatePdf = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    const session = await Session.findByPk(sessionId, {
      include: [{ model: User, as: 'teacher' }]
    });

    if (!session) {
      return res.status(404).json({ message: 'Séance non trouvée' });
    }

    const attendances = await Attendance.findAll({
      where: { SessionId: sessionId }, // Vérifie que la colonne est bien `SessionId` dans ton modèle
      include: [{ model: User, as: 'student' }]
    });

    // Création du PDF
    const doc = new PDFDocument({ size: 'A4', margin: 40 });

    // Headers HTTP
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=emargement_session_${sessionId}.pdf`);
    doc.pipe(res);

    // Titre
    doc.fontSize(18).text(`Fiche d’émargement`, { align: 'center', underline: true });
    doc.moveDown();

    // Infos session
    doc.fontSize(12);
    doc.text(`Sujet : ${session.subject}`);
    doc.text(`Salle : ${session.room}`);
    doc.text(`Début : ${new Date(session.startTime).toLocaleString()}`);
    doc.text(`Fin : ${new Date(session.endTime).toLocaleString()}`);
    doc.text(`Enseignant : ${session.teacher.firstName} ${session.teacher.lastName}`);
    doc.moveDown();

    // Entête du tableau
    doc.font('Helvetica-Bold').text('N°', 40, doc.y, { continued: true });
    doc.text('Nom Prénom', 80, doc.y, { continued: true });
    doc.text('Email', 250, doc.y, { continued: true });
    doc.text('Signature', 420, doc.y);
    doc.moveDown(0.5);
    doc.font('Helvetica');

    // Liste des étudiants
    attendances.forEach((att, index) => {
      const student = att.student;
      doc.text(`${index + 1}`, 40, doc.y, { continued: true });
      doc.text(`${student.lastName} ${student.firstName}`, 80, doc.y, { continued: true });
      doc.text(`${student.email}`, 250, doc.y, { continued: true });
      doc.text('................................', 420, doc.y);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (err) {
    console.error('Erreur génération PDF :', err);
    res.status(500).json({ message: 'Erreur serveur lors de la génération du PDF' });
  }
};
