const pool = require('../db');

const createProject = async (req, res) => {
    const { name, description } = req.body;
    const adminId = req.user.id; // From JWT

    try {
        const result = await pool.query(
            'INSERT INTO projects (name, description, admin_id) VALUES ($1, $2, $3) RETURNING *',
            [name, description, adminId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProjects = async (req, res) => {
    try {
        // Fetch projects where user is either the admin or a member
        const result = await pool.query('SELECT * FROM projects WHERE admin_id = $1', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createProject, getProjects };