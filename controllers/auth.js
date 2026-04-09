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

const logOut = async (req, res) => {
  req.logout(error => {
    if (error) {
      console.log("Error at logOut:")
      console.log(error)
      res.status(500).json({ error: error.message })
    }
    res.status(200).json({ msg: 'Logged out' })
  })
}

exports.signUp = signUp
exports.logIn = logIn
exports.logOut = logOut
