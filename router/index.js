const express = require("express")
const router = express.Router()

const {
  getProjects,
  getProjectByName,
  deleteProjectById,
} = require("../controllers/projects")
const { sendForm } = require("../controllers/form")

// PUBLIC ROUTES
// POST login
router.get("/projects", getProjects)
router.get("/projects/:name", getProjectByName)
router.post("/send-form", sendForm)

// ADMIN ROUTES
// POST projects
// PUT projects/:id
router.delete("/projects/:id", deleteProjectById)

module.exports = router