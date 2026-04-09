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

const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto"
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    uploadStream.end(fileBuffer)
  })
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
  const result = await uploadToCloudinary(mainImageFile.buffer, 'mi_app/singles')
  body.imageUrl = result.secure_url

  const extraImagesFiles = req.files['images']
  const extraPromises = extraImagesFiles.map(file => 
    uploadToCloudinary(file.buffer, 'mi_app/gallery')
  )
  const extraResults = await Promise.all(extraPromises)
  body.images = extraResults.map(r => {
    if (r.resource_type === "video") {
      const thumbnail = cloudinary.url(r.public_id, {
        resource_type: "video",
        format: "jpg",
        transformation: [{ start_offset: "2" }]
      })
  
      return {
        type: "video",
        url: r.secure_url,
        thumbnail
      }
    }
  
    return {
      type: "image",
      url: r.secure_url
    }
  })

  const createdProduct = await Project.create(body)
  res.status(201).json(createdProduct)
}

const toArray = (value) => {
  if (!value) return []
  return (Array.isArray(value) ? value : [value])
    .map(v => v?.trim?.() ?? v)
    .filter(Boolean)
}

const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    const body = { ...req.body }

    // Eliminar imagenes borradas desde front
    const filesToDelete = toArray(body.filesToDelete)
    if (filesToDelete.length > 0) {
      console.log(filesToDelete)
      const results = await Promise.allSettled(
        filesToDelete.map(async (url) => {
          const publicId = getPublicIdFromUrl(url)
          const result = await cloudinary.uploader.destroy(publicId)
          return { url, result }
        })
      )
      const deletedUrls = results.filter(r => r.status === 'fulfilled' && ['ok', 'not found'].includes(r.value.result.result)).map(r => r.value.url)
      project.images = project.images || []
      project.images = project.images.filter(file => !deletedUrls.includes(file.url))
    }

    // Si hay nueva imagen principal, cargarla
    const mainImageFile = req.files?.['mainImage']?.[0]
    if (mainImageFile) {
      const result = await uploadToCloudinary(mainImageFile.buffer, 'mi_app/singles')
      project.imageUrl = result.secure_url
    }

    // Si hay nuevas imágenes secundarias, cargarlas
    const extraImagesFiles = req.files?.['images']
    console.log(req.files)
    if (extraImagesFiles && extraImagesFiles.length > 0) {
      const extraPromises = extraImagesFiles.map(file => 
        uploadToCloudinary(file.buffer, 'mi_app/gallery')
      )
      const extraResults = await Promise.all(extraPromises)
      const newImages = extraResults.map(r => {
        if (r.resource_type === "video") {
          const thumbnail = cloudinary.url(r.public_id, {
            resource_type: "video",
            format: "jpg",
            transformation: [{ start_offset: "2" }]
          })
      
          return {
            type: "video",
            url: r.secure_url,
            thumbnail
          }
        }
      
        return {
          type: "image",
          url: r.secure_url
        }
      })
      project.images = [ ...project.images, ...newImages]
    }

    // Hacer actualización de campos (url y campos de pre rellenados)
    project.title = body.title
    project.place = body.place
    project.year = body.year
    project.relatedProjects = body.relatedProjects ? body.relatedProjects.split(",") : []
    project.categories = Array.isArray(body.categories) ? body.categories : body.categories?.split(",") || []
    await project.save()
    res.status(200).json(project)
  } catch(error) {
    res.status(500).json({ error: error.message })
  }
}

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

    if (project.images.length > 0) {
      const promises = project.images.map(file => {
        const publicId = getPublicIdFromUrl(file.url)
        return cloudinary.uploader.destroy(publicId)
      })
      await Promise.all(promises)
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
