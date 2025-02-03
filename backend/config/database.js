const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("student_exam_db", "postgres", "ksolves", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sync all models with the database
    await sequelize.sync({ alter: true }); // or { force: true } to drop & recreate tables
    console.log("Database synchronized.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testDbConnection();

module.exports = sequelize;
