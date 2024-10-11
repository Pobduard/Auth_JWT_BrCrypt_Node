import { User } from "../models/user.interface";
import { env } from "node:process";
import jwt from "jsonwebtoken";
const JWT_SECRET = env.JWT_SECRET || "Default-Secret";

export const generateToken = (user: User): string => {
	return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
		expiresIn: "1h", //& Se pueden hacer cosas como "Refresh Token" pa que cuando falte poco tiempo se vuelva a poner mas y asi, pero eso a futuro
	});
};
