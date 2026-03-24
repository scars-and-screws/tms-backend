import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { DATABASE_URL, NODE_ENV } from "../config/env.js";

// instantiate Neo adapter using the pooled URL
const adapter = new PrismaNeon({
  connectionString: DATABASE_URL,
});

// initialize prisma client with adapter
const prisma = new PrismaClient({
  adapter,
  log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export default prisma;
