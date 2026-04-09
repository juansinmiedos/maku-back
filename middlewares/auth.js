exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    next()
  } else {
    res.status(403).json({ msg: 'You must be logged in' })
  }
}
