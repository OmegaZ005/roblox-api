const express = require("express");
const fetch = require("node-fetch");

const app = express();

// homepage
app.get("/", (req, res) => {
    res.send("API running - go to /games");
});

// debug route (raw Roblox response)
app.get("/games", async (req, res) => {
    try {
        const response = await fetch(
            "https://games.roblox.com/v1/games/list?model.sortOrder=2&model.limit=10",
            {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "application/json"
                }
            }
        );

        const data = await response.json();

        console.log("ROBLOX RESPONSE:", data);

        res.json(data); // send raw response

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ error: "Failed to fetch games" });
    }
});

// IMPORTANT: this keeps server alive
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
