const { User, Session, Attendance } = require('../models'); // ← ../models
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: [
                'ldapId',    // ← clé primaire
                'firstname',
                'lastname',
                'email',
                'role',
                'groupId'
            ]
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { ldapId, firstname, lastname, email, password, role, groupId } = req.body;
        const user = await User.create({ ldapId, firstname, lastname, email, password, role, groupId });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { ldapId } = req.params;               // ← on récupère ldapId
        const { firstname, lastname, email, role, groupId } = req.body;
        const user = await User.findByPk(ldapId);
        if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

        user.firstname = firstname ?? user.firstname;
        user.lastname  = lastname  ?? user.lastname;
        user.email     = email     ?? user.email;
        user.role      = role      ?? user.role;
        user.groupId   = groupId   ?? user.groupId;
        await user.save();

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { ldapId } = req.params;               // ← on récupère ldapId
        await User.destroy({ where: { ldapId } });
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getDailyExport = async (req, res) => {
    try {
        const date = req.params.date; // ex: "2025-07-14"
        const start = new Date(`${date}T00:00:00`);
        const end = new Date(`${date}T23:59:59`);

        const sessions = await Session.findAll({
            where: { startTime: { [Op.between]: [start, end] } },
            include: [
                { model: User, as: 'teacher' },
                {
                    model: Attendance,
                    include: [{ model: User, as: 'student' }]
                }
            ],
            order: [['startTime', 'ASC']]
        });

        if (!sessions.length) {
            return res.status(404).json({ message: 'Aucune séance pour ce jour.' });
        }

        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=emargement_${date}.pdf`);
        doc.pipe(res);

        doc.fontSize(18).text(`Feuilles d'émargement du ${date}`, { align: 'center', underline: true });
        doc.moveDown();

        for (const session of sessions) {
            doc.fontSize(14).text(`Matière : ${session.subject}`);
            doc.text(`Professeur : ${session.teacher?.firstname} ${session.teacher?.lastname}`);
            doc.text(`Salle : ${session.room}`);
            doc.text(`Heure : ${new Date(session.startTime).toLocaleTimeString()} - ${new Date(session.endTime).toLocaleTimeString()}`);
            doc.moveDown(0.5);

            // Entête
            doc.font('Helvetica-Bold').text('N°', 40, doc.y, { continued: true });
            doc.text('Nom Prénom', 80, doc.y, { continued: true });
            doc.text('Email', 250, doc.y, { continued: true });
            doc.text('Signature', 420, doc.y);
            doc.moveDown(0.5);
            doc.font('Helvetica');

            session.Attendances.forEach((att, i) => {
                const s = att.student;
                doc.text(`${i + 1}`, 40, doc.y, { continued: true });
                doc.text(`${s.lastname} ${s.firstname}`, 80, doc.y, { continued: true });
                doc.text(s.email, 250, doc.y, { continued: true });
                doc.text('................................', 420, doc.y);
                doc.moveDown(0.4);
            });

            doc.addPage(); // Saut de page entre chaque séance
        }

        doc.end();
    } catch (err) {
        console.error('❌ Erreur génération PDF du jour :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
