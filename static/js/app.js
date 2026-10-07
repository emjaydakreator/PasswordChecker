const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");

const scoreDisplay = document.getElementById("score");
const entropyDisplay = document.getElementById("entropy");

const recommendations = document.getElementById("recommendations");


const checkElements = {
    length: document.getElementById("lengthCheck"),
    uppercase: document.getElementById("uppercaseCheck"),
    lowercase: document.getElementById("lowercaseCheck"),
    number: document.getElementById("numberCheck"),
    special: document.getElementById("specialCheck"),
    not_common: document.getElementById("commonCheck")
};


togglePassword.addEventListener("click", () => {

    const hidden = passwordInput.type === "password";

    passwordInput.type = hidden ? "text" : "password";

    togglePassword.textContent = hidden ? "Hide" : "Show";
});


passwordInput.addEventListener("input", async () => {

    const password = passwordInput.value;

    if (password.length === 0) {
        resetInterface();
        return;
    }

    try {

        const response = await fetch("/api/check", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                password: password
            })
        });


        if (!response.ok) {
            throw new Error("Unable to analyse password.");
        }


        const data = await response.json();

        updateInterface(data);

    } catch (error) {

        console.error(error);

        strengthText.textContent = "Error";
    }

});


function updateInterface(data) {

    scoreDisplay.textContent =
        `${data.score} / ${data.max_score}`;

    entropyDisplay.textContent =
        `${data.entropy} bits`;

    strengthText.textContent =
        data.strength;


    const percentage =
        (data.score / data.max_score) * 100;

    strengthFill.style.width =
        `${percentage}%`;


    const strengthColors = {
        "Weak": "#ff5252",
        "Fair": "#ffb347",
        "Strong": "#f4d35e",
        "Very Strong": "#5ed692"
    };

    strengthFill.style.background =
        strengthColors[data.strength] || "#6b7280";

    strengthText.style.color =
        strengthColors[data.strength] || "#ffffff";


    Object.entries(data.checks).forEach(
        ([checkName, passed]) => {

            const element =
                checkElements[checkName];

            if (!element) {
                return;
            }

            const indicator =
                element.querySelector(".indicator");

            element.classList.remove(
                "passed",
                "failed"
            );

            if (passed) {

                element.classList.add("passed");
                indicator.textContent = "✓";

            } else {

                element.classList.add("failed");
                indicator.textContent = "✕";

            }
        }
    );


    recommendations.innerHTML = "";


    if (data.tips.length === 0) {

        const item =
            document.createElement("li");

        item.textContent =
            "Excellent. Your password meets all current requirements.";

        recommendations.appendChild(item);

        return;
    }


    data.tips.forEach(tip => {

        const item =
            document.createElement("li");

        item.textContent = tip;

        recommendations.appendChild(item);

    });
}


function resetInterface() {

    scoreDisplay.textContent = "0 / 6";
    entropyDisplay.textContent = "0 bits";

    strengthText.textContent = "Waiting...";
    strengthText.style.color = "";

    strengthFill.style.width = "0%";


    Object.values(checkElements).forEach(
        element => {

            element.classList.remove(
                "passed",
                "failed"
            );

            element.querySelector(
                ".indicator"
            ).textContent = "○";

        }
    );


    recommendations.innerHTML =
        "<li>Start typing to analyse your password.</li>";
}