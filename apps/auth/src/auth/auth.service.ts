import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async ({ email, password }: any) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};

export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
};

export const generateJWT = (payload: any) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
};

export const verifyJWT = (token: string) => {
  return jwt.verify(token, config.jwtSecret) as { id: string };
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
