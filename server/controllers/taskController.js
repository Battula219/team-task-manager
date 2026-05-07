const db = require('../db');

// CREATE TASK
const createTask = async (req, res) => {
    // Destructure values and set defaults to avoid 'undefined' errors
    const { title, description, due_date, priority, project_id } = req.body;
    
    // Safety check: Ensure user_id exists from authMiddleware
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "User authentication failed. No ID found." });
    }
    const userId = req.user.id; 

    try {
        const sql = `
            INSERT INTO tasks (title, description, due_date, priority, status, user_id, project_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`;
        
        // Final data cleanup before hitting the DB
        const values = [
            title || 'Untitled Task', // Fallback if title is missing
            description || '', 
            (due_date === "" || !due_date) ? null : due_date, // Converts empty strings to NULL
            priority || 'Medium', 
            'Pending',
            userId, 
            project_id || null // Ensure project_id is a number or null
        ];

        const result = await db.query(sql, values);
        res.status(201).json(result.rows[0]);
        
    } catch (err) {
        // This will print the EXACT error in your server terminal
        console.error("--- CRITICAL DATABASE ERROR ---");
        console.error("Error Message:", err.message);
        console.error("Error Detail:", err.detail);
        console.error("Table involved:", err.table);
        console.error("-------------------------------");

        res.status(500).json({ 
            error: "Database Sync Error", 
            message: err.message,
            hint: "Run the ALTER TABLE commands in your Railway Query tab." 
        });
    }
};

// GET ALL TASKS
const getTasks = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', 
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE STATUS
const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const nextStatus = status === 'Completed' ? 'Pending' : 'Completed';
    try {
        const result = await db.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [nextStatus, id, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE TASK
const deleteTask = async (req, res) => {
    try {
        await db.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// UPDATE TASK DETAILS
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, due_date, priority } = req.body;
    const userId = req.user.id;

    try {
        const sql = `
            UPDATE tasks 
            SET title = $1, description = $2, due_date = $3, priority = $4 
            WHERE id = $5 AND user_id = $6 
            RETURNING *`;
        
        const values = [
            title, 
            description, 
            due_date === "" ? null : due_date, 
            priority, 
            id, 
            userId
        ];

        const result = await db.query(sql, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error("UPDATE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
};

// Add updateTask to your module.exports at the bottom
module.exports = { createTask, getTasks, updateTaskStatus, deleteTask, updateTask };