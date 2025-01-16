const roleBasedAuth = (role) => {
  return (req, res, next) => {
    console.log(req.user.roles);
    // Authorize using user roles
    if (!req.user.roles.includes(role)) {
      return res.status(403).send("Access denied.");
    }

    next();
  };
};

export default roleBasedAuth;