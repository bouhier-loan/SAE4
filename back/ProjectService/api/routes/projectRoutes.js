const express = require('express');
const {body, param} = require("express-validator");
const projectController = require('../controllers/projectController');

const router = express.Router();

router.post('/projects',
    body('name').isString().isLength({min: 1}),
    body('participants').isArray().isLength({min: 1}),
    projectController.createProject
);

router.get('/projects',
    projectController.getProjects
);

router.put('/projects/:projectId',
    param('projectId').isString().isLength({min: 1}),
    body('name').isString().isLength({min: 1}),
    body('conversation').isString().isLength({min: 1}),
    body('participants').isArray().isLength({min: 1}),
    projectController.updateProject
);

router.delete('/projects/:projectId',
    projectController.deleteProject
);

module.exports = router;