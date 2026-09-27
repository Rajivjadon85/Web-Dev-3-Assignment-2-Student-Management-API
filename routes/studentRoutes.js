const express = require("express");
const router = express.Router();
const students = require("../data/students");

// Get all students
router.get("/", (req, res) => {
  let result = students;

  if (req.query.course) {
    result = students.filter(
      (student) => student.course.toLowerCase() === req.query.course.toLowerCase()
    );
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});

// Get one student
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((item) => item.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${req.params.id} not found.`
    });
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// Add a student
router.post("/", (req, res) => {
  const { name, course, age, email } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Name is required."
    });
  }

  if (!course || typeof course !== "string" || !course.trim()) {
    return res.status(400).json({
      success: false,
      message: "Course is required."
    });
  }

  const newId = students.length > 0
    ? Math.max(...students.map((student) => student.id)) + 1
    : 1;

  const newStudent = {
    id: newId,
    name: name.trim(),
    age,
    course: course.trim(),
    email
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: "Student added successfully.",
    data: newStudent
  });
});

// Update a student
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((item) => item.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${req.params.id} not found.`
    });
  }

  if (req.body.name !== undefined) {
    if (typeof req.body.name !== "string" || !req.body.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name must be a non-empty string."
      });
    }
    student.name = req.body.name.trim();
  }

  if (req.body.course !== undefined) {
    if (typeof req.body.course !== "string" || !req.body.course.trim()) {
      return res.status(400).json({
        success: false,
        message: "Course must be a non-empty string."
      });
    }
    student.course = req.body.course.trim();
  }

  if (req.body.age !== undefined) student.age = req.body.age;
  if (req.body.email !== undefined) student.email = req.body.email;

  res.status(200).json({
    success: true,
    message: `Student with ID ${id} updated successfully.`,
    data: student
  });
});

// Delete a student
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${req.params.id} not found.`
    });
  }

  const deletedStudent = students.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: `Student with ID ${id} deleted successfully.`,
    data: deletedStudent
  });
});

module.exports = router;
