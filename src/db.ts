import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({
	errorFormat: "pretty",
	log: ["error", "query", "info", "warn"],
});

export default db;
