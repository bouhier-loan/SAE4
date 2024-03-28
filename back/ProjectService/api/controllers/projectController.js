const Task = require('../models/task');
const Project = require('../models/project');
const { v4: uuidv4 } = require('uuid');
const {matchedData} = require("express-validator");

/* Create a new project */
async function createProject(req, res) {
    try {
        const data = matchedData(req);

        /* Create a new project */
        const newProject = new Project({
            id: uuidv4(undefined, undefined, undefined),
            name: data.name,
            conversation: data.conversation,
            participants: data.participants,
            tasks: [],
        });

        /* Save the project */
        await newProject.save()

        /* Send a response */
        res.status(201).send(newProject);
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}

/* Get all projects */
async function getProjects(req, res) {
    try {
        const projects = await Project.find({}, {_id: 0, __v: 0}, undefined);

        res.status(200).send(projects);
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}

/* Update a project */
async function updateProject(req, res) {
    try {
        const data = matchedData(req);

        /* Find the project */
        const project = await Project.findOne({id: req.params.projectId});

        if (!project) {
            return res.status(404).send({message: "Project not found"});
        }

        /* Update the project */
        project.name = data.name;
        project.conversation = data.conversation;
        project.participants = data.participants;
        await project.save();

        /* Send a response */
        res.status(200).send(project);
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}

/* Delete a project */
async function deleteProject(req, res) {
    try {
        /* Find the project */
        const project = await Project.findOne({id: req.params.projectId});

        if (!project) {
            return res.status(404).send({message: "Project not found"});
        }

        /* Delete the tasks */
        for (const task of project.tasks) {
            await Task.findOneAndDelete({id: task.id});
        }

        /* Delete the project */
        await project.delete();

        /* Send a response */
        res.status(204).send();
    } catch (error) {
        res.status(400).send({message: error.message});
    }
}

module.exports = {
    createProject,
    getProjects,
    updateProject,
    deleteProject
}