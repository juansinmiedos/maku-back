const passport = require("passport")

const User = require("../models/User")

const signUp = async (req, res) => {
  try {
    const { username, password } = req.body
    const newUser = await User.register(new User({ username }), password);
    console.log({newUser})
    res.status(201).json({ data: "User created" })
  } catch(error) {
    console.log("Error at signUp:")
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

const logIn = async (req, res, next) => {
  passport.authenticate("local", (error, user) => {
    if (error || !user) {
      console.log("Error at logIn: authenticate")
      console.log(error)
      res.status(401).json({ error: error.message })
    }

    req.logIn(user, error => {
      if (error) {
        console.log("Error at logIn: logIn")
        console.log(error)
        res.status(401).json({ error: error.message })
      }
      res.status(200).json({
        name: user.name,
        lastname: user.lastname,
        type: user.type,
        email: user.email,
      })
    })
  })(req, res, next)
}

const pingUser = async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ user: null })
  }

  res.json({
    user: req.user,
  })
}

const logOut = async (req, res) => {
  req.logout(error => {
    if (error) {
      console.log("Error at logOut:")
      console.log(error)
      res.status(500).json({ error: error.message })
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid")
      res.status(200).json({ message: "Logged out" })
    })
  })
}

exports.signUp = signUp
exports.logIn = logIn
exports.pingUser = pingUser
exports.logOut = logOut
