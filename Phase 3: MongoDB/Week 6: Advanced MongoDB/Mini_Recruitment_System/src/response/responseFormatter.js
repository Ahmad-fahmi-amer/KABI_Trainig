import HTTP_STATUS from "../constants/http-status.js";

export function responseFormatter(req, res, next) {
  res.success = (data) => {
    return res.status(HTTP_STATUS.OK).json({ success: true, data });
  };

  res.created = (data) => {
    return res.status(HTTP_STATUS.CREATED).json({ success: true, data });
  };

  res.list = (data, pagination) => {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
      pagination,
    });
  };

  res.noContent = () => res.status(HTTP_STATUS.NO_CONTENT).send();

  next();
}
