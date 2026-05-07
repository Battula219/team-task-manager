const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createProject);
router.get('/', auth, getProjects);

module.exports = router;