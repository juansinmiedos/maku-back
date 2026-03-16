const express = require("express")
const router = express.Router()

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
router.post("/projects", createProject)
router.put("/projects/:id", updateProject)
router.delete("/projects/:id", deleteProjectById)

module.exports = router