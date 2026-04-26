const express = require("express");
const fetch = require("node-fetch");

const app = express();

// Home route
app.get("/", (req, res) => {
    res.send("API is running. Go to /games");
});

// Games route
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

        if (!data.games) {
            console.error("Bad response:", data);
            return res.status(500).json({ error: "Invalid API response" });
        }

        const games = data.games.map(game => ({
            name: game.name,
            placeId: game.placeId
        }));

        res.json(games);

    } catch (err) {
        console.error("ERROR:", err.message);
        res.status(500).json({ error: "Failed to fetch games" });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
