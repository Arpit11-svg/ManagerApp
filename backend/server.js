const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const expenseRoutes = require("./routes/expenseRoutes");
app.use("/api/expenses", expenseRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});