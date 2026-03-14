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
    const project = await Project.find({
      name: req.params.name
    })
    res.status(200).json(project)
  } catch(error) {
    res.status(500).json({error})
  }
}

exports.getProjects = getProjects
exports.getProjectByName = getProjectByName
