const Project = require("../models/Project")
const cloudinary = require("../config/cloudinary")
const fs = require('fs')

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

  if (body.relatedProjects) {
    body.relatedProjects = body.relatedProjects.split(",")
  }

  const mainImageFile = req.files['mainImage'][0]
  const result = await cloudinary.uploader.upload(mainImageFile.path, {
    folder: 'mi_app/singles'
  })
  fs.unlinkSync(mainImageFile.path)
  body.imageUrl = result.url

  const extraImagesFiles = req.files['images']
  const extraPromises = extraImagesFiles.map(file => 
    cloudinary.uploader.upload(file.path, { folder: 'mi_app/gallery' })
  )
  const extraResults = await Promise.all(extraPromises)
  extraImagesFiles.forEach(file => fs.unlinkSync(file.path))
  body.images = extraResults.map(r => r.url)

  const createdProduct = await Project.create(body)
  res.status(201).json(createdProduct)
}

const updateProject = async (req, res) => {}

const getPublicIdFromUrl = (url) => {
  const parts = url.split('/')
  const lastPart = parts.pop()
  const publicId = lastPart.split('.')[0]
  const folderIndex = parts.indexOf('upload') + 2
  const folderPath = parts.slice(folderIndex).join('/')
  return folderPath ? `${folderPath}/${publicId}` : publicId
}

const deleteProjectById = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id)

    if (project.imageUrl) {
      const publicId = getPublicIdFromUrl(project.imageUrl)
      await cloudinary.uploader.destroy(publicId)
    }

    project = await Project.findByIdAndDelete(req.params.id)
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
