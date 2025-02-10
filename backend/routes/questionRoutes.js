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

module.exports = router;
