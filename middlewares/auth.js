exports.auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(403).json({ msg: 'You must be logged in' })
  }
}
