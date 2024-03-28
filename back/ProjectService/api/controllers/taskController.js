const Task = require('../models/task');
const Project = require('../models/project');
const { v4: uuidv4 } = require('uuid');
const {matchedData} = require("express-validator");

/* Create a new task */
async function createTask(req, res) {
    try {
        const data = matchedData(req);

        /* Create a new task */
        const newTask = new Task({
            id: uuidv4(undefined, undefined, undefined),
            title: data.title,
            description: data.description,
            assignees: data.assignees,
            deadline: data.deadline,
            priority: data.priority,
        });

        /* Save the task */
        await newTask.save()

        /* Save the task in the project */
        const project = await Project.findOne({id: data.projectId});

        if (!project) {
            return res.status(404).send({message: "Project not found"});
        }
        project.tasks.push(newTask);
        await project.save();

        /* Send a response */
        res.status(201).send(newTask);
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}

/* Get all tasks */
async function getTasks(req, res) {
    try {
        const data = matchedData(req);
        const tasks = await Task.find({id: data.taskId}, {_id: 0, __v: 0}, undefined);

        res.status(200).send(tasks);
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}

/* Update a task */
async function updateTask(req, res) {
    try {
        const data = matchedData(req);

        /* Find the task */
        const task = await Task.findOne({id: req.params.taskId});

        if (!task) {
            return res.status(404).send({message: "Task not found"});
        }

        /* Update the task */
        task.title = data.title;
        task.description = data.description;
        task.assignees = data.assignees;
        task.deadline = data.deadline;
        task.priority = data.priority;

        /* Save the task */
        await task.save();

        res.status(200).send(task);
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}

/* Delete a task */
async function deleteTask(req, res) {
    try {
        /* Find the task */
        const task = await Task.findOne({id: req.params.taskId}, {_id: 0, __v: 0}, undefined);

        if (!task) {
            return res.status(404).send({message: "Task not found"});
        }

        /* Find the project and remove the task */
        const project = await Project.findOne({tasks: {$in: [task.id]}});
        project.tasks = project.tasks.filter(t => t.id !== task.id);
        await project.save();

        /* Delete the task */
        await task.delete();

        res.status(204).send();
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
}