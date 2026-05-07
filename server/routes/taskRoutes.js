const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// 1. GET ALL TASKS: Fetch tasks belonging to the logged-in user
router.get('/', authMiddleware, taskController.getTasks);

// 2. CREATE TASK: Add a new task linked to the user
router.post('/', authMiddleware, taskController.createTask);

// 3. EDIT TASK DETAILS: Update title, description, date, or priority
// Added this route to support the "Edit" functionality
router.put('/:id', authMiddleware, taskController.updateTask);

// 4. UPDATE STATUS ONLY: Specific route for toggling 'Pending' vs 'Completed'
router.put('/:id/status', authMiddleware, taskController.updateTaskStatus);

// 5. DELETE TASK: Remove a specific task
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;