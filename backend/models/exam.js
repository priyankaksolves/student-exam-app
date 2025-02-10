const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Question = require("..//models/question");


const Exam = sequelize.define("Exam", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: false },
    is_live: { type: DataTypes.BOOLEAN, defaultValue: false }, // New property
    created_by: { type: DataTypes.INTEGER, allowNull: false }
});

// Define relationship
Exam.hasMany(Question, { foreignKey: "exam_id", onDelete: "CASCADE" });
Question.belongsTo(Exam, { foreignKey: "exam_id" });

module.exports = Exam;
