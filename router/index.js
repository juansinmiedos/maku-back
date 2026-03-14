const express = require("express")
const router = express.Router()

const {
  getProjects,
  getProjectByName,
} = require("../controllers/projects")

// PUBLIC ROUTES
// POST login
router.get("/projects", getProjects)
router.get("/projects/:name", getProjectByName)
// POST form

// ADMIN ROUTES
// POST projects
// PUT projects/:id
// DELETE projects/:id

module.exports = router