require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

// ===============================
// Gemini API setup
// ===============================
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing!");
    console.error("Please check your .env file.");
}

const ai = new GoogleGenAI({
    apiKey: apiKey
});

// ===============================
// Helper: Send JSON response
// ===============================
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8"
    });

    res.end(JSON.stringify(data));
}

// ===============================
// Create Server
// ===============================
const server = http.createServer((req, res) => {

    // Allow browser requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle OPTIONS request
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // ===============================
    // Gemini /ask API
    // ===============================
    if (req.method === "POST" && req.url === "/ask") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {

            try {

                // Check API key
                if (!apiKey) {
                    sendJson(res, 500, {
                        error: "GEMINI_API_KEY is missing. Check your .env file."
                    });
                    return;
                }

                // Convert request body to JSON
                let requestData;

                try {
                    requestData = JSON.parse(body);
                } catch (error) {
                    sendJson(res, 400, {
                        error: "Invalid JSON request."
                    });
                    return;
                }

                const question = requestData.question;

                // Check question
                if (!question || !question.trim()) {
                    sendJson(res, 400, {
                        error: "Please enter a question."
                    });
                    return;
                }

                console.log("📩 Question:", question);

                // ===============================
                // Send question to Gemini
                // ===============================
                const response = await ai.models.generateContent({
                    model: "gemini-3.8-flash",
                    contents: question.trim()
                });

                console.log("✅ Gemini response received");

                // ===============================
                // Send answer to browser
                // ===============================
                sendJson(res, 200, {
                    answer: response.text || "No answer received from Gemini."
                });

            } catch (error) {

                console.error("❌ Gemini Error:");
                console.error(error);

                sendJson(res, 500, {
                    error: error.message || "Gemini API request failed.",
                    answer: "Gemini request failed. Please check the VS Code terminal."
                });
            }
        });

        return;
    }

    // ===============================
    // Serve frontend files
    // ===============================

    let filePath;

    if (req.url === "/") {
        filePath = path.join(__dirname, "index.html");
    } else {
        filePath = path.join(__dirname, req.url);
    }

    const extension = path.extname(filePath);

    const contentTypes = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8"
    };

    fs.readFile(filePath, (error, data) => {

        if (error) {
            res.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8"
            });

            res.end("File not found");
            return;
        }

        res.writeHead(200, {
            "Content-Type": contentTypes[extension] || "text/plain; charset=utf-8"
        });

        res.end(data);
    });
});

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ EduGenie server running at http://localhost:${PORT}`);
});