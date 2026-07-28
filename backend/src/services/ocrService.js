const Tesseract = require("tesseract.js");

const readImage = async (imagePath) => {
  const result = await Tesseract.recognize(
    imagePath,
    "eng"
  );

  return result.data.text;
};


const parseStudents = (text) => {
  const students = [];

  const lines = text.split("\n").filter(line => line.trim());

  let roll = 1;

  for (let line of lines) {
    line = line.replace(/^[^A-Za-z]*/, "");

    if (!line) continue;

    students.push({
      roll_no: roll++,
      student_name: line.trim(),
    });
  }

  return students;
};

module.exports = {
  readImage, parseStudents
};