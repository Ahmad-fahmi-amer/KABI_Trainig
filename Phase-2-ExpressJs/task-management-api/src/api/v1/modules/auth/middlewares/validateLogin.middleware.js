export function validateLogin(req, res, next) {
  const { email, password } = req.body;

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
  next();
}
