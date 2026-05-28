const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/quiz", async (req, res) => {

  try {

    const { topic, difficulty } = req.body;

    const prompt = `
Generate exactly 50 multiple choice quiz questions on the topic "${topic}".

Difficulty level: ${difficulty}

Rules:
- Each question must have:
  1. question
  2. options (4 options only)
  3. answer
  4. explanation

- explanation must NEVER be empty
- explanation should be simple and clear
- answer must exactly match one option
- return ONLY pure JSON
- do NOT use markdown
- do NOT add extra text

JSON Format:
[
  {
    "question": "What does CSS stand for?",
    "options": [
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Creative Style System",
      "Colorful Style Sheets"
    ],
    "answer": "Cascading Style Sheets",
    "explanation": "CSS stands for Cascading Style Sheets and is used to style webpages."
  }
]
`;

    const response = await axios.post(

      "https://openrouter.ai/api/v1/chat/completions",

      {
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text =
      response.data.choices[0].message.content;

    console.log(text);

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const quiz = JSON.parse(cleaned);

    res.json(quiz);

  } catch (error) {

    console.log("FULL ERROR:");

    console.log(
      error.response?.data ||
      error.message
    );

    res.status(500).json({
      error: "Quiz generation failed",
    });
  }
});

app.listen(5000, () => {

  console.log(
    "Server running on port 5000"
  );
});