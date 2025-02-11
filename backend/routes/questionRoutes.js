const express = require("express");
const Question = require("../models/question");
const router = express.Router();

// Get All Questions
router.get("/allquestions", async (req, res) => {
    try {
        const questions = await Question.findAll();
        console.log("Questions:", questions);
        res.json(questions);
    } catch (err) {
        console.error("Fetch questions Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Add a New Question
router.post("/addquestion", async (req, res) => {
    try {
        const { question_text, options, correct_answer, exam_id } = req.body;

        // Validate input
        if (!question_text || !options || options.length < 2 || !correct_answer || !exam_id) {
            return res.status(400).json({ error: "All fields including exam_id are required." });
        }

        // Check if correct_answer is in options
        if (!options.includes(correct_answer)) {
            return res.status(400).json({ error: "Correct answer must be one of the options." });
        }

        // Create new question
        const newQuestion = await Question.create({
            question_text,
            options,
            correct_answer,
            exam_id,  // ✅ Pass exam_id here
        });

        res.status(201).json(newQuestion);
    } catch (err) {
        console.error("Add question Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE a question by ID
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const question = await Question.findByPk(id);
  
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      await question.destroy();
      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


module.exports = router;
