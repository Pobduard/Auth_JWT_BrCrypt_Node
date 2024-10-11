import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
	createUser,
	deleteUser,
	getAllUsers,
	getUserById,
	updateUser,
} from "../controllers/usersController";

export const userRoutes = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

// Middleware de JWT para ver si estamos autenticados
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"]; //& La Token la mandamos a traves de los headers
	const token = authHeader && authHeader.split(" ")[1]; //& Si existe el Auth, tons agarramos lo que venga despues de un espacio en el header
	if (!token) {
		return res.status(401).json({ error: "No Autorizado" });
	}

	//& Si se tiene Token
	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		console.log(token, JWT_SECRET);

		if (err) {
			console.error("Error en la Autenticacion: ", err);
			return res
				.status(403)
				.json({ error: "No Tienes Acceso a este Recurso, Forbidden" });
		}

		//& Si no hay error
		next();
	});
};

userRoutes.post(
	"/",
	(req: Request, res: Response, next: NextFunction) => {
		authenticateToken(req, res, next);
	},
	createUser
);
userRoutes.get(
	"/",
	(req: Request, res: Response, next: NextFunction) => {
		authenticateToken(req, res, next);
	},
	getAllUsers
);
userRoutes.get(
	"/:id",
	(req: Request, res: Response, next: NextFunction) => {
		authenticateToken(req, res, next);
	},
	getUserById
);
userRoutes.put(
	"/:id",
	(req: Request, res: Response, next: NextFunction) => {
		authenticateToken(req, res, next);
	},
	updateUser
);
userRoutes.delete(
	"/:id",
	(req: Request, res: Response, next: NextFunction) => {
		authenticateToken(req, res, next);
	},
	deleteUser
);
