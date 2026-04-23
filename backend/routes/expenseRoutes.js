const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

// ➕ Add Expense (Protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { itemName, description, type, location, contactInfo } = req.body;

    if (!itemName || !description || !type || !location || !contactInfo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      user: req.user._id,
      itemName,
      description,
      type,
      location,
      contactInfo
    });

    res.status(201).json(expense);

  } catch (error) {
    console.error("ERROR:", error.message);
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
      return res.status(404).json({ message: "Item not found" });
    }

    // make sure user owns this expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();

    res.json({ message: "Item deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;