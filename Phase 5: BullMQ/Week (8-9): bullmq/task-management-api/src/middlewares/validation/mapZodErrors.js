const mapZodErrors = (issues) => {
  return issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};

export default mapZodErrors;
