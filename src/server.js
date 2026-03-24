import app from "./app.js";
import { PORT } from "./core/config/env.js";
import prisma from "./core/database/prisma.js";

// START THE SERVER
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Gracefully disconnect from the database on process termination
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server closed gracefully");
    process.exit(0);
  });
});
