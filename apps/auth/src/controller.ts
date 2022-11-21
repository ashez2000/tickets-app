import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const register: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }

  const { email, password } = req.body;
  res.status(201).json({ email, password });
};

export const login: RequestHandler = (req, res, next) => {
  res.send("Login User");
};

export const logout: RequestHandler = (req, res, next) => {
  res.send("Logout User");
};

export const user: RequestHandler = (req, res, next) => {
  res.send("Get User");
};
