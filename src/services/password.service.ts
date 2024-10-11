import bcrypt from "bcrypt";

const SALT_ROUDNS: number = 10; //& Veces que da la vuelta pa crear el Hash

export const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, SALT_ROUDNS);
};

export const comparePasswords = async (
	password: string,
	hash: string
): Promise<boolean> => {
	return await bcrypt.compare(password, hash);
};
