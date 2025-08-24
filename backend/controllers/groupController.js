const { Group, User } = require('../models');

exports.listGroups = async (req, res) => {
    try {
        const groups = await Group.findAll({ order: [['name', 'ASC']] });
        res.json(groups);
    } catch (e) {
        console.error('listGroups error', e);
        res.status(500).json({ message: 'Erreur lors du chargement des groupes' });
    }
};

exports.getStudentsByGroup = async (req, res) => {
    try {
        const groupId = parseInt(req.params.id, 10);
        if (!groupId) return res.status(400).json({ message: 'groupId invalide' });

        const students = await User.findAll({
            where: { role: 'student', groupId },
            attributes: ['ldapId', 'firstname', 'lastname', 'email'],
            order: [['lastname', 'ASC'], ['firstname', 'ASC']]
        });

        res.json(students);
    } catch (e) {
        console.error('getStudentsByGroup error', e);
        res.status(500).json({ message: 'Erreur lors du chargement des étudiants' });
    }
};
// controllers/GroupController.js
exports.list = async (req, res) => {
    try {
        const groups = await Group.findAll({
            attributes: ['id','name'],
            order: [['name','ASC']]
        });
        res.json(groups);
    } catch (e) {
        console.error('groups.list', e);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.students = async (req, res) => {
    try {
        const { id } = req.params;
        const students = await User.findAll({
            where: { groupId: Number(id), role: 'student' },
            attributes: ['ldapId','firstname','lastname','email'],
            order: [['lastname','ASC'], ['firstname','ASC']]
        });
        res.json(students);
    } catch (e) {
        console.error('groups.students', e);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
