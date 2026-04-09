const express = require("express")
const router = express.Router()
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer(storage)

const {
  getProjects,
  getProjectByName,
  createProject,
  updateProject,
  deleteProjectById,
} = require("../controllers/projects")
const { sendForm } = require("../controllers/form")

// PUBLIC ROUTES
// POST login
router.get("/projects", getProjects)
router.get("/projects/:name", getProjectByName)
router.post("/send-form", sendForm)

// ADMIN ROUTES
router.post(
  "/projects",
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 3 } 
  ]),
  createProject
)
router.put(
  "/projects/:id",
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 3 } 
  ]),
  updateProject
)
router.delete("/projects/:id", deleteProjectById)

module.exports = router