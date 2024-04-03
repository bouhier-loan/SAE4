const express = require('express');
const {body, query} = require("express-validator");
const taskController = require('../controllers/taskController');
const Task = require('../models/task');

const router = express.Router();

router.post('/tasks',
    body('title').isString().notEmpty(),
    body('description').isString(),
    body('assignees').isArray(),
    body('assignees.*').isString().notEmpty(),
    body('deadline').isDate(),
    body('priority').isIn([Task.PRIORITY_LOW, Task.PRIORITY_MEDIUM, Task.PRIORITY_HIGH]),
    body('projectId').isString().notEmpty(),
    taskController.createTask
);

router.get('/tasks',
    query('taskId').isString().optional(),
    taskController.getTasks
);

router.put('/tasks/:taskId',
    body('title').isString().notEmpty(),
    body('description').isString(),
    body('assignees').isArray(),
    body('assignees.*').isString().notEmpty(),
    body('deadline').isDate(),
    body('priority').isIn([Task.PRIORITY_LOW, Task.PRIORITY_MEDIUM, Task.PRIORITY_HIGH]),

    taskController.updateTask
);

router.delete('/tasks/:taskId',
    taskController.deleteTask
);

module.exports = router;