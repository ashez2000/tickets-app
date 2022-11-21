import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

/**
 * @desc   Register user
 * @route  POST /api/v1/auth/register
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

  const hashedPassword = await hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  res.status(201).json({ user });
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
