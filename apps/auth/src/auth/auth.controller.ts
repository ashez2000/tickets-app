import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import config from "../config";
import * as authService from "./auth.service";

const prisma = new PrismaClient();

/**
 * @desc   Register user
 * @route  POST /api/auth/register
 */
export const register: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }

  const { email, password } = req.body;

  const exist = await authService.findUserByEmail(email);
  if (exist) {
    return res.status(400).json({ errors: ["User already exists"] });
  }

  const user = await authService.createUser({ email, password });
  const token = authService.generateJWT({ id: user.id });

  req.session = { jwt: token };
  res.status(201).json({ user });
};

/**
 * @desc   Login user
 * @route  POST /api/auth/login
 */
export const login: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }

  const { email, password } = req.body;

  const user = await authService.findUserByEmail(email);
  if (!user) {
    return res.status(400).json({ errors: ["Invalid credentials"] });
  }

  const valid = await authService.comparePassword(password, user.password);
  if (!valid) {
    return res.status(400).json({ errors: ["Invalid credentials"] });
  }

  const token = authService.generateJWT({ id: user.id });

  req.session = { jwt: token };
  res.status(200).json({ user });
};

/**
 * @desc   Logout user
 * @route  POST /api/auth/logout
 */
export const logout: RequestHandler = (req, res, next) => {
  req.session = null;
  res.status(200).json({ msg: "Logged out" });
};

/**
 * @desc   Get user
 * @route  GET /api/auth/user
 */
export const user: RequestHandler = async (req, res, next) => {
  if (!req.session?.jwt) {
    return res.status(401).json({ errors: ["Unauthorized"] });
  }

  const payload = authService.verifyJWT(req.session.jwt);
  const user = await authService.findUserById(payload.id);

  res.status(200).json({ user });
};
