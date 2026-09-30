async function askQuestion() {
    const question = document.getElementById("question").value.trim();
    const response = document.getElementById("response");

    if (!question) {
        response.innerText = "Please enter a question.";
        return;
    }

    response.innerText = "🤖 EduGenie is thinking...";

    try {
        const result = await ,fetch("/api/ask" {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

        const raw = await result.text();

        let data;
        try {
            data = JSON.parse(raw);
        } catch {
            console.error("Server returned non-JSON:", raw);
            response.innerText = `Server error (${result.status}). Please check the terminal.`;
            return;
        }

        if (!result.ok) {
            response.innerText = data.error || data.answer || `Server error (${result.status}).`;
            return;
        }

        if (data.answer) {
            response.innerText = data.answer;

            const history = document.getElementById("history");
            const item = document.createElement("div");
            item.className = "history-item";
            item.innerHTML = `<strong>You:</strong> ${escapeHtml(question)}<br><br><strong>EduGenie:</strong> ${escapeHtml(data.answer)}`;
            history.appendChild(item);
        } else {
            response.innerText = "Sorry, no answer received.";
        }
    } catch (error) {
        console.error("Connection error:", error);
        response.innerText = "Server connection error. Make sure the EduGenie server is running.";
    }
}

async function explainSimply() {
    await askWithPrompt(
        "📖 EduGenie is explaining simply...",
        "Explain this topic in very simple words for a student: "
    );
}

async function generateNotes() {
    await askWithPrompt(
        "📝 EduGenie is generating notes...",
        "Generate clear and easy study notes for this topic. Include headings, important points, and a short conclusion: "
    );
}

async function askWithPrompt(loadingMessage, prefix) {
    const question = document.getElementById("question").value.trim();
    const response = document.getElementById("response");

    if (!question) {
        response.innerText = "Please enter a topic first.";
        return;
    }

    response.innerText = loadingMessage;

    try {
        const result = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: prefix + question
            })
        });

        const raw = await result.text();

        let data;
        try {
            data = JSON.parse(raw);
        } catch {
            console.error("Server returned non-JSON:", raw);
            response.innerText = `Server error (${result.status}). Please check the terminal.`;
            return;
        }

        if (!result.ok) {
            response.innerText = data.error || data.answer || `Server error (${result.status}).`;
            return;
        }

        response.innerText = data.answer || "Sorry, no response received.";
    } catch (error) {
        console.error("Connection error:", error);
        response.innerText = "Server connection error. Make sure the EduGenie server is running.";
    }
}

function clearAll() {
    document.getElementById("question").value = "";
    document.getElementById("response").innerText =
        "Your answer will appear here...";
    document.getElementById("history").innerHTML = "";
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
