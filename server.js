const express = require("express");
const fetch = require("node-fetch");

const app = express();

// Home route
app.get("/", (req, res) => {
    res.send("API is running. Go to /games");
});
// game route
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

        // 👇 send RAW data (no mapping yet)
        res.json(data);

    } catch (err) {
        console.error("ERROR:", err.message);
        res.status(500).json({ error: "Failed to fetch games" });
    }
});
