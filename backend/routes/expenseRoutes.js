const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

// ➕ Add Expense (Protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    // ✅ validation
    if (!title || !amount) {
      return res.status(400).json({ message: "Title and amount required" });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error); // 👈 ADD THIS
    res.status(500).json({ error: error.message });
  }
});

// 📄 Get All Expenses (Protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ DELETE expense (Protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // make sure user owns this expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();

    res.json({ message: "Expense deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;