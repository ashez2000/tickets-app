import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "./config";

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

  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) {
    return res.status(400).json({ errors: ["User already exists"] });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  const token = jwt.sign({ id: user.id }, config.jwtSecret);
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

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ errors: ["Invalid credentials"] });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(400).json({ errors: ["Invalid credentials"] });
  }

  const token = jwt.sign({ id: user.id }, config.jwtSecret);
  req.session = { jwt: token };

  res.status(200).json({ user });
};

/**
 * @desc   Logout user
 * @route  POST /api/auth/logout
 */
export const logout: RequestHandler = (req, res, next) => {
  res.send("Logout User");
};

/**
 * @desc   Get user
 * @route  GET /api/auth/user
 */
export const user: RequestHandler = async (req, res, next) => {
  if (!req.session?.jwt) {
    return res.status(401).json({ errors: ["Unauthorized"] });
  }

  const payload = jwt.verify(req.session.jwt, config.jwtSecret) as {
    id: string;
  };

  const user = await prisma.user.findUnique({ where: { id: payload.id } });

  res.status(200).json({ user });
};
