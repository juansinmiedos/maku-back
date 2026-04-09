const express = require("express")
const router = express.Router()
const multer = require('multer')
const passport = require("../config/passport.js")
const { isAuthenticated } = require("../middlewares/auth.js")

const storage = multer.memoryStorage()
const upload = multer(storage)

const {
  signUp,
  logIn,
  pingUser,
  logOut,
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
router.post("/signup", signUp)
router.post("/login", passport.authenticate('local'), logIn)
router.get("/projects", getProjects)
router.get("/projects/:name", getProjectByName)
router.post("/send-form", sendForm)

// ADMIN ROUTES
router.get("/me", pingUser)
router.post("/logout", isAuthenticated, logOut)
router.post(
  "/projects",
  isAuthenticated,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images' } 
  ]),
  createProject
)
router.put(
  "/projects/:id",
  isAuthenticated,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images' } 
  ]),
  updateProject
)
router.delete("/projects/:id", isAuthenticated, deleteProjectById)

module.exports = router