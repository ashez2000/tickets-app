import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Error handler", err);
  res.status(500).json({ msg: "Something went wrong!" });
};

export default errorHandler;
