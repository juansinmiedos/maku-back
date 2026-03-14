const express = require("express")
const router = express.Router()

const { getProjects } = require("../controllers/projects")

// PUBLIC ROUTES
// POST login
// GET projects
router.get("/projects", getProjects)

// GET projects/:id
// POST form

// ADMIN ROUTES
// POST projects
// PUT projects/:id
// DELETE projects/:id

module.exports = router