const Project = require("../models/Project")

const getProjects = async(req, res) => {
  try {
    const projects = await Project.find()
    res.status(200).json(projects)
  } catch(error) {
    res.status(500).json({error})
  }
}

const getProjectByName = async(req, res) => {
  try {
    const project = await Project.findOne({
      name: req.params.name
    }).populate("relatedProjects")
    res.status(200).json(project)
  } catch(error) {
    res.status(500).json({error})
  }
}

const createProject = async (req, res) => {
  const body = { ...req.body }
  body.name = body.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-")

  // store images
  body.imageUrl = "sample.com"

  // save to mongo db
  const createdProduct = await Project.create(body)
  res.status(201).json(createdProduct)
}

const updateProject = async (req, res) => {}

const deleteProjectById = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    res.status(200).json(project)
  } catch(error) {
    res.status(500).json({error})
  }
}

exports.getProjects = getProjects
exports.getProjectByName = getProjectByName
exports.createProject = createProject
exports.updateProject = updateProject
exports.deleteProjectById = deleteProjectById
