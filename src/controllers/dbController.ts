import { Pool } from "pg";

export const pool = new Pool({
	user: process.env.POSTGRES_USER, // Your PostgreSQL user
	host: process.env.HOST, // Your DB host
	database: process.env.POSTGRES_DB, // Your DB name
	password: process.env.POSTGRES_PASSWORD, // Your password
	port: Number(process.env.POSTGRES_PORT), // PostgreSQL default port
});
