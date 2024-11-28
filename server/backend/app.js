require("dotenv").config();

const express = require("express");
const cors = require("cors"); 
const { GoogleGenerativeAI } = require("@google/generative-ai");

//!Express Instance
const app = express();

//!Middlewares
app.use(express.json());
app.use(cors());
//!Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

//!Generate Content Route
app.post("/generate", async (req, res) => {
    const { prompt } = req.body; // User-provided prompt
    try {
        // Retrieve the model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response; 
        const text = response.text();
        res.send(text);

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Something went wrong while generating content" });
    }
});

//!Start Server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
