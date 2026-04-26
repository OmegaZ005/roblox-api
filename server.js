const express = require("express");
const fetch = require("node-fetch");

const app = express();

// Home route
app.get("/", (req, res) => {
    res.send("API running - go to /games");
});

// Games route
app.get("/games", async (req, res) => {
    try {
        // Step 1: get games
        const response = await fetch(
            "https://games.roblox.com/v1/games?sortOrder=Desc&limit=10",
            {
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const data = await response.json();

        if (!data.data) {
            return res.status(500).json({ error: "Bad response from Roblox" });
        }

        // Step 2: get universe IDs
        const universeIds = data.data.map(game => game.id);

        // Step 3: get thumbnails
        const thumbsRes = await fetch(
            `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeIds.join(",")}&size=150x150&format=Png&isCircular=false`
        );

        const thumbsData = await thumbsRes.json();

        // Step 4: combine data
        const games = data.data.map(game => {
            const thumb = thumbsData.data.find(t => t.targetId === game.id);

            return {
                name: game.name,
                placeId: game.rootPlaceId,
                image: thumb ? thumb.imageUrl : null
            };
        });

        res.json(games);

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ error: "Failed to fetch games" });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
