const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Task = require("../models/Task");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get All the tasks using: GET "/api/notes/getuser". Login required
router.get("/fetchalltasks", fetchuser, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new Note using: POST "/api/tasks/addtask". Login required
router.post(
  "/addtask",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, dueDate, status, assignedUser } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const task = new Task({
        title,
        description,
        dueDate,
        status,
        assignedUser,
        user: req.user.id,
      });
      const savedNote = await task.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
router.put("/updatetask/:id", fetchuser, async (req, res) => {
  const { title, description, dueDate, status, assignedUser } = req.body;
  try {
    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (dueDate) {
      newNote.dueDate = dueDate;
    }
    if (status) {
      newNote.status = status;
    }
    if (assignedUser) {
      newNote.assignedUser = assignedUser;
    }

    // Find the note to be updated and update it
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send("Not Found");
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ task });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Delete an existing Task using: DELETE "/api/tasks/deletetask". Login required
router.delete("/deletetask/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted and delete it
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send("Not Found");
    }

    //Allow deletion only if user owns this Note
    if (task.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    task = await Task.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", task: task });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
