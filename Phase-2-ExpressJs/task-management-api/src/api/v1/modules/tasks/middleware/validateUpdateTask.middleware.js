export function validateUpdateTask(req, res, next) {
  const { title, userId } = req.body;

  if (title !== undefined) {
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
  }

  if (userId !== undefined) {
    if (typeof userId !== "number") {
      return res.status(400).json({
        success: false,
        message: "userId must be a number",
      });
    }
  }

  next();
}
