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
            "https://games.roblox.com/v1/games?sortOrder=Desc&limit=10",
            {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Roblox API request failed");
        }

        const data = await response.json();

        if (!data.data) {
            throw new Error("Invalid API response");
        }

        const games = data.data.map(game => ({
            name: game.name,
            placeId: game.id
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
