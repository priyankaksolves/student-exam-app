const express = require("express");
const Exam = require("../models/exam");
const Question = require("../models/question"); // Import Question model
const router = express.Router();

// Create Exam
router.post("/", async (req, res) => {
    try {
        const { title, start_time, end_time, is_live, created_by } = req.body;
        const exam = await Exam.create({ title, start_time, end_time, is_live, created_by });
        res.status(201).json({ message: "Exam created successfully", exam });
    } catch (err) {
        console.error("Create Exam Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get All Exams
router.get("/", async (req, res) => {
    try {
        const exams = await Exam.findAll();
        res.json(exams);
    } catch (err) {
        console.error("Fetch Exams Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get Single Exam by ID
router.get("/:id", async (req, res) => {
    try {
        const exam = await Exam.findByPk(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.json(exam);
    } catch (err) {
        console.error("Fetch Exam Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get Questions by Exam ID
router.get("/:examId/questions", async (req, res) => {
    try {
        const { examId } = req.params;
        const questions = await Question.findAll({
            where: { exam_id: examId },
        });

        if (questions.length === 0) {
            return res.status(404).json({ message: "No questions found for this exam." });
        }

        res.json(questions);
    } catch (err) {
        console.error("Fetch Questions Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Update Exam
router.put("/:id", async (req, res) => {
    try {
        const { title, start_time, end_time, is_live, created_by } = req.body;
        const exam = await Exam.findByPk(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        await exam.update({ title, start_time, end_time, is_live, created_by });
        res.json({ message: "Exam updated successfully", exam });
    } catch (err) {
        console.error("Update Exam Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete Exam
router.delete("/:id", async (req, res) => {
    try {
        const exam = await Exam.findByPk(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        await exam.destroy();
        res.json({ message: "Exam deleted successfully" });
    } catch (err) {
        console.error("Delete Exam Error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
