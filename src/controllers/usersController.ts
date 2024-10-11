import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import { prismaUser } from "../models/user";

export const createUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { email, password } = req.body;
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
				email: String(email),
				password: hashedPassword,
			},
		});

		res.status(201).json(user);
	} catch (error: any) {
		if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
			res.status(400).json({ message: "El Email ingresado ya existe" });
		}
		console.log(error);
		res.status(500).json({ error: "Hubo un error, prueba mas tarde" }); //& Error interno de la DB
	}
};

export const getAllUsers = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const users = await prismaUser.findMany(); //& Si no le ponemos un Where, trae todos
		res.status(200).json(users); //& Retorna todos
	} catch (error: any) {
		console.log(error);
		res.status(500).json({ error: "Hubo un error, prueba mas tarde" }); //& Error interno de la DB
	}
};

export const getUserById = async (
	req: Request,
	res: Response
): Promise<void> => {
	const userId = parseInt(req.params.id); //& Se pasa en params la Id, porque tenemos la ruta tipo '/users/:id', ya que es un query param

	try {
		const user = await prismaUser.findUnique({
			where: {
				id: userId,
			},
		});

		if (!user) {
			res.status(404).json({ error: "El usuario no fue encontrado" });
			return; // Vacio, porque es una promesa vacia
		}

		res.status(200).json(user); //& Retorna Usuario
	} catch (error: any) {
		console.log(error);
		res.status(500).json({ error: "Hubo un error, prueba mas tarde" }); //& Error interno de la DB
	}
};

export const updateUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	const userId = parseInt(req.params.id); //& Se pasa en params la Id, porque tenemos la ruta tipo '/users/:id', ya que es un query param
	const { email, password } = req.body;

	try {
		let dataToUpdate: any = { ...req.body }; //& Sera lo mismo que el body que viene

		if (password) {
			const hashedPassword = await hashPassword(password);
			dataToUpdate.password = hashedPassword;
		}

		if (email) {
			dataToUpdate.email = email;
		}

		const user = await prismaUser.update({
			where: {
				//& Saber a donde
				id: userId,
			},
			data: dataToUpdate, //& Copiar lo que vamos a modificar
		});

		res.status(200).json(user); //& Retorna Usuario
	} catch (error: any) {
		if (error?.code == "P2002" && error?.meta?.target?.includes("email")) {
			res.status(400).json({ error: "El Email ingresado ya existe" }); //& No se cambio
		} else if (error?.code == "P2025") {
			//& No existe el usuario
			res.status(404).json({ error: "Usuario no Encontrado" });
		} else {
			console.log(error);
			res.status(500).json({ error: "Hubo un error, prueba mas tarde" }); //& Error interno de la DB
		}
	}
};

export const deleteUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	const userId = parseInt(req.params.id); //& Se pasa en params la Id, porque tenemos la ruta tipo '/users/:id', ya que es un query param

	try {
		const user = await prismaUser.findUnique({
			where: {
				//& Saber a donde
				id: userId,
			},
		});

		await prismaUser.delete({
			where: {
				id: userId,
			},
		});

		res
			.status(200)
			.json({
				message: `El Usuario asociado al correo: "${user?.email}" ah sido eliminado`,
			})
			.end(); //& Asegurarse que no se pueda mandar nada mas a la request, creo.
	} catch (error: any) {
		if (error?.code == "P2025") {
			//& No existe el usuario
			res.status(404).json({ error: "Usuario no Encontrado" });
		} else {
			console.log(error);
			res.status(500).json({ error: "Hubo un error, prueba mas tarde" }); //& Error interno de la DB
		}
	}
};
