import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(bodyParser.text());

const API_KEY = "AIzaSyDURksAAnSASnWji98XzqeZ62-_jND_IQI"; // Replace with your actual API key

app.post("/generate", async (req: Request, res: Response) => {
    try {
        const resumeText: string = req.body;

        const prompt = `Don't edit the education part and use fancy words to make this resume sound appealing: ${resumeText}`;

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const text = await result.response.text();

        res.status(200).send(text);
    } catch (error) {
        console.error("Gemini API error:", error);
        res.status(500).send("Error generating content");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
