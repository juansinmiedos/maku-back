const express = require("express")
const router = express.Router()
const multer = require('multer')
const passport = require("../config/passport.js")

const storage = multer.memoryStorage()
const upload = multer(storage)

const {
  signUp,
} = require("../controllers/auth.js")
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
router.post("/signup", signUp)
// router.post("/login", passport.authenticate('local'), logIn)
router.get("/projects", getProjects)
router.get("/projects/:name", getProjectByName)
router.post("/send-form", sendForm)

// ADMIN ROUTES
router.post(
  "/projects",
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images' } 
  ]),
  createProject
)
router.put(
  "/projects/:id",
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images' } 
  ]),
  updateProject
)
router.delete("/projects/:id", deleteProjectById)

module.exports = router