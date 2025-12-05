// prisma.config.ts
import { defineConfig, env } from "@prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },

  // Add the datasource connection here:
  datasource: {
    // prefer DATABASE_URL in .env; for sqlite you can use e.g. "file:./dev.db"
    url: env("DATABASE_URL"), 
  },
});
