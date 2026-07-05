export function validateUpdateUser(req, res, next) {
  const { name, email, password, role } = req.body;

  if (name !== undefined) {
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
  }
  if (email !== undefined) {
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
  }
  if (password !== undefined) {
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
  }
  if (role !== undefined) {
    if ((!role) in ["USER", "ADMIN"]) {
      return res.status(400).json({
        success: false,
        message: "role must be USER or ADMIN",
      });
    }
  }

  next();
}
