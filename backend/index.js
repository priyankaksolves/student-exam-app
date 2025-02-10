const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes"); // assuming userRoutes is in a "routes" folder
const examRoutes = require("./routes/examRoutes");
const questionRoutes = require("./routes/questionRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // Adjust this if your frontend runs on a different port
    methods: "GET,POST,PUT,DELETE",
    credentials: true
  }));
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes); // Use your user routes here
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
