exports.requireAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  } else if (req.user) {
    res.redirect("/register");
  } else {
    res.redirect("/");
  }
};

exports.requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};
