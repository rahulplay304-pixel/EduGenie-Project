async function askQuestion() {
    const question = document.getElementById("question").value;
    const response = document.getElementById("response");

    if (question.trim() === "") {
        response.innerText = "Please enter a question.";
        return;
    }

    response.innerText = "🤖 EduGenie is thinking...";

    try {
        const result = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await result.json();

        if (data.answer) {
            response.innerText = data.answer;

            const history = document.getElementById("history");

            history.innerHTML += `
                <div class="history-item">
                    <strong>You:</strong> ${question}
                    <br><br>
                    <strong>EduGenie:</strong> ${data.answer}
                </div>
            `;
        } else {
            response.innerText = "Sorry, no answer received.";
        }

    } catch (error) {
        response.innerText = "Server connection error.";
        console.error(error);
    }
}


function clearAll() {
    document.getElementById("question").value = "";

    document.getElementById("response").innerText =
        "Your answer will appear here...";

    document.getElementById("history").innerHTML = "";
}


async function explainSimply() {
    const question = document.getElementById("question").value;
    const response = document.getElementById("response");

    if (question.trim() === "") {
        response.innerText = "Please enter a topic first.";
        return;
    }

    response.innerText = "📖 EduGenie is explaining simply...";

    try {
        const result = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question:
                    "Explain this topic in very simple words for a student: " +
                    question
            })
        });

        const data = await result.json();

        if (data.answer) {
            response.innerText = data.answer;
        } else {
            response.innerText = "Sorry, no explanation received.";
        }

    } catch (error) {
        response.innerText = "Server connection error.";
        console.error(error);
    }
}


async function generateNotes() {
    const question = document.getElementById("question").value;
    const response = document.getElementById("response");

    if (question.trim() === "") {
        response.innerText = "Please enter a topic first.";
        return;
    }

    response.innerText = "📝 EduGenie is generating notes...";

    try {
        const result = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question:
                    "Generate clear and easy study notes for this topic. " +
                    "Include headings, important points, and a short conclusion: " +
                    question
            })
        });

        const data = await result.json();

        if (data.answer) {
            response.innerText = data.answer;
        } else {
            response.innerText = "Sorry, notes could not be generated.";
        }

    } catch (error) {
        response.innerText = "Server connection error.";
        console.error(error);
    }
}
