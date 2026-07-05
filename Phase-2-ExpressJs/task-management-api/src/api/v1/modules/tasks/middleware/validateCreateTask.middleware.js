export function validateCreateTask(req, res, next) {
  const { title, userId } = req.body;

  if (title === undefined) {
    return res.status(400).json({
      success: false,
      message: "title is required",
    });
  }

  if (typeof title !== "string") {
    return res.status(400).json({
      success: false,
      message: "title must be a string",
    });
  }

  if (title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "title cannot be empty",
    });
  }

  if (userId === undefined) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  if (typeof userId !== "number") {
    return res.status(400).json({
      success: false,
      message: "userId must be a number",
    });
  }

  next();
}
