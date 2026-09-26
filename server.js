
 
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const http = require("http");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const server = http.createServer(async (req, res) => {

    // Allow browser requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // Ask Gemini
    if (req.method === "POST" && req.url === "/ask") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {

            try {
                const { question } = JSON.parse(body);

                const response = await ai.models.generateContent({
                    model: "gemini-3.8-flash",
                    contents: question
                });

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    answer: response.text
                }));

            } catch (error) {

                console.error("Gemini Error:", error.message);

                res.writeHead(500, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    answer: "Gemini is temporarily unavailable. Please try again."
                }));
            }
        });

        return;
    }

    // Server test
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end("EduGenie Server is running!");
});

server.listen(3000, () => {
    console.log("EduGenie server running on http://localhost:3000");
});