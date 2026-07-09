import HTTP_STATUS from "../constants/http-status.js";

export const responseFormatter = (req, res, next) => {
  res.success = (data, message = "Success") => {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data,
    });
  };

  res.created = (data, message = "Resource created successfully") => {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message,
      data,
    });
  };

  res.noContent = () => {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  };

  next();
};
