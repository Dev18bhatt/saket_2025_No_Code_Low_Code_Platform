const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send("Hello world");
})

app.post("/api/content", async (req, res) => {
    try {
        const data = req.body.question; // The question from the user
        if (!data) {
            return res.status(400).send({ message: "Question is required" });
        }

        // Generate the schema or content based on the prompt
        const result = await generate(data);

        // Ensure that result is returned as a structured JSON object
        if (result) {
            // For example, result could be a plain text response, but we want structured data
            return res.send({
                result: {
                    schema: result,  // Here you can structure it as per your requirements
                    message: "Database schema successfully generated",
                    status: "success"
                }
            });
        } else {
            return res.status(500).send({ message: "Failed to generate schema" });
        }
    } catch (err) {
        console.error(err); // Log the error
        return res.status(500).send({
            message: "An error occurred while generating the content",
            error: err.message
        });
    }
});


const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generate = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);

        // Check if result.response.text() returns meaningful data
        const generatedText = result.response.text();

        console.log("Generated Content:", generatedText);

        // Return structured content (can further be enhanced)
        return generatedText.split("\n");  // Returning plain text for now, but this could be JSON
    } catch (err) {
        console.error("Error in generating content:", err);
        throw new Error("Failed to generate content");
    }
}

// generate();

app.listen(3000, () => {
    console.log("Server is up and running on port 3000");
})

