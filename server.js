cat <<EOT > server.js
const axios = require("axios");
const express = require("express");

const firebaseURL = "https://aviator-lanka-game-default-rtdb.firebaseio.com/live_game_engine.json";

async function startNewRound() {
    try {
        let crashPoint = parseFloat((1.05 + Math.pow(Math.random(), 2) * 14).toFixed(2));
        let durationMs = Math.floor((crashPoint - 1.00) * 3000); 
        if (durationMs < 1500) durationMs = 1500;

        console.log("✈️ New Flight: Will crash at " + crashPoint + "x in " + (durationMs / 1000).toFixed(2) + "s");

        let startTime = Date.now();
        await axios.put(firebaseURL, {
            status: "FLYING",
            crash_point: crashPoint,
            start_time: startTime,
            duration_ms: durationMs
        });

        await new Promise(resolve => setTimeout(resolve, durationMs));

        console.log("💥 Crashed at " + crashPoint + "x!");
        await axios.put(firebaseURL, {
            status: "CRASHED",
            crash_point: crashPoint,
            start_time: startTime,
            duration_ms: durationMs
        });

        console.log("⏳ Next round in 5s...");
        await new Promise(resolve => setTimeout(resolve, 5000));

        startNewRound();
    } catch (error) {
        console.error("❌ Error:", error.message);
        setTimeout(startNewRound, 3000);
    }
}

const app = express();
const PORT = process.env.PORT || 10000;
app.get("/", (req, res) => res.send("Aviator Lanka Game Engine is Running Live!"));
app.listen(PORT, () => {
    console.log("💻 Dummy Web Port listening on port " + PORT);
    startNewRound();
});
