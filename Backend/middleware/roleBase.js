
const roleBase = (allowroles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; //extract role

    if (!userRole) {
      return res.status(403).json({ message: "User Not Found" });
    }
    if (allowroles.includes(userRole)) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden " })

  }
};

module.exports = roleBase;
