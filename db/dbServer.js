import { Sequelize } from "sequelize";

const POSTGRES_URI = process.env.DB_URI;

export const sequelize = new Sequelize(POSTGRES_URI, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

try {
  await sequelize.authenticate();
  console.log("🔥 PostgreSQL Connected via Sequelize!");
} catch (error) {
  console.error("PostgreSQL Connection Error:", error);
  process.exit(1);
}
