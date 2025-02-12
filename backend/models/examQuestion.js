const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ExamQuestion = sequelize.define("ExamQuestion", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    exam_id: { type: DataTypes.INTEGER, allowNull: false },
    question_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
    timestamps: false
});

module.exports = ExamQuestion;
