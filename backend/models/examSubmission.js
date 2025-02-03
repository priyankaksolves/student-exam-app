const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ExamSubmission = sequelize.define("ExamSubmission", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    answers: {
        type: DataTypes.TEXT, // Storing as JSON string
        allowNull: false,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = ExamSubmission;
