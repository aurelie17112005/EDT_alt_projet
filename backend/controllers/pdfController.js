const PDFDocument = require('pdfkit');
const { Session, Attendance, User, Sequelize } = require('../models');
const Op = Sequelize.Op;

exports.generateDailyPdf = async (req, res) => {
  try {
    const { date: dateParam, groupId } = req.query;
    if (!dateParam || !groupId) {
      return res.status(400).json({ message: 'Paramètres "date" et "groupId" requis' });
    }

    // calcul des bornes de la journée
    const date = new Date(dateParam);
    const startOfDay = new Date(date.setHours(0,0,0,0));
    const endOfDay   = new Date(date.setHours(23,59,59,999));

    // charge le groupe
    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ message: 'Groupe non trouvé' });

    // récupère les séances de ce groupe ce jour-là
    const sessions = await Session.findAll({
      where: {
        groupId,
        startTime: { [Op.between]: [startOfDay, endOfDay] }
      },
      include: [{ model: User, as: 'teacher', attributes: ['firstname','lastname'] }],
      order: [['startTime','ASC']]
    });

    // liste des étudiants du groupe
    const students = await User.findAll({
      where: { groupId, role: 'student' },
      order: [['lastname','ASC'], ['firstname','ASC']]
    });

    // récupère toutes les présences enregistrées pour ces séances
    const sessionIds = sessions.map(s => s.id);
    const attendances = await Attendance.findAll({
      where: { sessionId: sessionIds.length ? sessionIds : [0] }
    });

    // map de présence par ldapId
    const presentMap = {};
    attendances.forEach(a => { presentMap[a.studentId] = true; });

    // --- génération PDF ---
    const doc = new PDFDocument({ size:'A4', margin:40 });
    const now = new Date();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=emargement_${group.name}_${dateParam}.pdf`
    );
    doc.pipe(res);

    // Titre
    doc.fontSize(18)
        .text(`Fiche d'émargement`, { align:'center', underline:true });
    doc.moveDown();

    // Sous-titre
    doc.fontSize(12)
        .text(`Année universitaire 2024-2025 - Fiche d'émargement du ${dateParam} - Groupe : ${group.name}`);
    doc.moveDown();

    // Section étudiants
    doc.font('Helvetica-Bold').text('Etudiants', { underline:true });
    doc.moveDown(0.5);
    doc.font('Helvetica');
    students.forEach((stu, i) => {
      const statut = presentMap[stu.ldapId] ? 'validé' : 'absent';
      doc.text(`${i+1}. ${stu.lastname} ${stu.firstname} — ${statut}`);
    });
    doc.moveDown();

    // Séparateur
    doc.text('--- --- ---', { align:'center' });
    doc.moveDown();

    // Détail des séances
    sessions.forEach(sess => {
      const startT = sess.startTime.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
      const endT   = sess.endTime  .toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
      doc.text(`${sess.subject}   ${startT} - ${endT}`);
    });
    doc.moveDown();

    // Pied de page & signature
    doc.text(
        `Page ${doc.page.number} / ${doc.pageCount} - Généré le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}`,
        { align:'right' }
    ).moveDown();

    const teacher = sessions[0]?.teacher;
    if (teacher) {
      doc.text(
          `Signature numérique : ${teacher.firstname} ${teacher.lastname}`,
          { align:'right' }
      );
    }

    doc.end();
  } catch (err) {
    console.error('Erreur génération fiche journalière :', err);
    res.status(500).json({ message: 'Erreur serveur lors de la génération du PDF' });
  }
};