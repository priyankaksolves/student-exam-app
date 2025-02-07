const express = require("express");
const Exam = require("../models/exam");
const Question = require("../models/question");
const ExamSubmission = require("../models/examSubmission");
const router = express.Router();

// Create an Exam with a Custom List of Questions
router.post("/", async (req, res) => {
    try {
        const { title, start_time, end_time, is_live, created_by, questions } = req.body;

        // Create exam
        const exam = await Exam.create({ title, start_time, end_time, is_live, created_by });

        // If questions are provided, add them to the exam
        if (questions && Array.isArray(questions)) {
            const formattedQuestions = questions.map(q => ({
                exam_id: exam.id,
                question_text: q.question_text,
                options: q.options,
                correct_answer: q.correct_answer
            }));

            await Question.bulkCreate(formattedQuestions);
        }

        res.status(201).json({ message: "Exam created successfully", exam });
    } catch (err) {
        console.error("Create Exam Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Add a Question to an Exam
router.post("/:examId/questions", async (req, res) => {
    try {
        const { examId } = req.params;
        const { question_text, options, correct_answer } = req.body;

        const exam = await Exam.findByPk(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        const question = await Question.create({ exam_id: examId, question_text, options, correct_answer });
        res.status(201).json({ message: "Question added successfully", question });
    } catch (err) {
        console.error("Add Question Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Update a Question
router.put("/questions/:questionId", async (req, res) => {
    try {
        const { questionId } = req.params;
        const { question_text, options, correct_answer } = req.body;

        const question = await Question.findByPk(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        await question.update({ question_text, options, correct_answer });
        res.json({ message: "Question updated successfully", question });
    } catch (err) {
        console.error("Update Question Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a Questionreq
router.delete("/questions/:questionId", async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await Question.findByPk(questionId);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        await question.destroy();
        res.json({ message: "Question deleted successfully" });
    } catch (err) {
        console.error("Delete Question Error:", err);
        res.status(500).json({ error: err.message });
    }
});

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

// Submit Exam Answers
router.post("/:examId/submit", async (req, res) => {
    try {
        const { examId } = req.params;
        const { answers, userId } = req.body; // Extract userId properly

        // Validate request payload
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: "Invalid answers format" });
        }

        // Fetch all questions for the given exam
        const questions = await Question.findAll({ where: { exam_id: examId } });

        if (!questions.length) {
            return res.status(404).json({ message: "Exam not found or has no questions" });
        }

        let score = 0;
        const totalQuestions = questions.length;

        // Compare submitted answers with correct ones
        answers.forEach((answer) => {
            const question = questions.find((q) => q.id === answer.questionId);
            console.log("Question:", question + answer.selectedOption);
            if (question && question.correct_answer === answer.selectedOption) {
                score++;
            }
        });

        // Save submission in the database
        const submission = await ExamSubmission.create({
            user_id: userId, // Ensure user_id is correctly passed
            exam_id: examId,
            answers: JSON.stringify(answers),
            score,
        });

        return res.status(200).json({ 
            message: "Exam submitted successfully", 
            score, 
            totalQuestions,
            submissionId: submission.id 
        });

    } catch (err) {
        console.error("Exam Submission Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:examId/score/:userId", async (req,res)=>{
    try{
        const {examId, userId} = req.params;
        const submission = await ExamSubmission.findOne({
            where: {exam_id: examId}
        });
        if (!submission){
            return res.status(404).json({message: "No submission found for this exam"});
        }
        res.json({score: submission.score});
    } catch (err){
        console.error("Fetch Score Error:", err);
        res.status(500).json({error: err.message});
    }
})


module.exports = router;
