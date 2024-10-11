import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.service";
import { prismaUser } from "../models/user"; //& Nos reemplaza tener que escribir todos los Scripts SQL a mano, si no los crea por nosotros en sus funciones
import { generateToken } from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
	//& Devuelve cuando se cumple, pero sin datos
	const { email, password } = req.body; //& Datos que si poseen la req, el body

	try {
		//& Nos lleva directamente a el catch
		if (!email) {
			res.status(400).json({ message: "El Email es Obligatorio" });
			return;
		}
		if (!password) {
			res.status(400).json({ message: "La Contraseña es Obligatoria" });
			return;
		}

		const hashedPassword = await hashPassword(password);

		const user = await prismaUser.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		//& Con eso ya esta registrado, tons lo vamos a loggear de una con el token
		const token = generateToken(user);
		res.status(201).json({ token });
	} catch (error: any) {
		if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
			res.status(400).json({ message: "El Email ingresado ya existe" });
		}
		console.log(error);
		res.status(500).json({ error: "Hubo un error en el registro" });
	}
};

export const login = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body; //& Datos que si poseen la req, el body

	try {
		if (!email) {
			res.status(400).json({ message: "El Email es Obligatorio" });
			return;
		}
		if (!password) {
			res.status(400).json({ message: "La Contraseña es Obligatoria" });
			return;
		}

		const user = await prismaUser.findUnique({ where: { email } }); //& Desestructuramos el email
		if (!user) {
			res
				.status(404)
				.json({ message: "El usuario o la contraseña no fueron encontrados" });
			return;
		}

		const passwordMatch = await comparePasswords(password, user.password);
		if (!passwordMatch)
			res.status(401).json({ error: "Usuario y contraseña no coinciden" });

		const token = generateToken(user);
		res.status(200).json({ token });
	} catch (error) {
		console.log("Login Error: ", error);
	}
};
