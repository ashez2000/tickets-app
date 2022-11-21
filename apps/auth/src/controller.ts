import { RequestHandler } from "express";

export const register: RequestHandler = (req, res, next) => {
  res.send("Register User");
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
