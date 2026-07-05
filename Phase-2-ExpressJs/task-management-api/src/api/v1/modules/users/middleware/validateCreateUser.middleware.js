export function validateCreateUser(req, res, next) {
  const { name, email, password, role } = req.body;
  if (name === undefined) {
    return res.status(400).json({
      success: false,
      message: "name is required",
    });
  }

  if (typeof name !== "string") {
    return res.status(400).json({
      success: false,
      message: "name must be a string",
    });
  }

  if (name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "name cannot be empty",
    });
  }
  if (email === undefined) {
    return res.status(400).json({
      success: false,
      message: "email is required",
    });
  }

  if (typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "email must be a string",
    });
  }

  if (email.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "email cannot be empty",
    });
  }
  if (password === undefined) {
    return res.status(400).json({
      success: false,
      message: "password is required",
    });
  }

  if (typeof password !== "string") {
    return res.status(400).json({
      success: false,
      message: "password must be a string",
    });
  }

  if (password.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "password cannot be empty",
    });
  }
  if (role === undefined) {
    req.body.role = "USER";
  }
  if (!["USER", "ADMIN"].includes(role)) {
    req.body.role = "USER";
  }
  next();
}
