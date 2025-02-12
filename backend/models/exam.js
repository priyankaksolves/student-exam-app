const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Question = require("./question"); // Corrected path
const ExamQuestion = require("./examQuestion"); // Import the junction table

const Exam = sequelize.define("Exam", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: false },
    is_live: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_by: { type: DataTypes.INTEGER, allowNull: false }
});

// ✅ Define Many-to-Many Relationship
Exam.belongsToMany(Question, { through: ExamQuestion, foreignKey: "exam_id" });
Question.belongsToMany(Exam, { through: ExamQuestion, foreignKey: "question_id" });

module.exports = Exam;
