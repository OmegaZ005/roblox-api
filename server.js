const express = require("express");
const fetch = require("node-fetch");

const app = express();

let cache = null;
let lastFetch = 0;

app.get("/games", async (req, res) => {
    try {
        // Cache for 60 seconds
        if (cache && Date.now() - lastFetch < 60000) {
            return res.json(cache);
        }

        // Get games
        const gamesRes = await fetch("https://games.roblox.com/v1/games/list?model.maxRows=10");
        const gamesData = await gamesRes.json();

        const placeIds = gamesData.games.map(g => g.placeId).join(",");

        // Get thumbnails
        const thumbRes = await fetch(
            `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${placeIds}&size=150x150&format=Png`
        );
        const thumbData = await thumbRes.json();

        // Merge data
        const games = gamesData.games.map(game => {
            const thumb = thumbData.data.find(t => t.targetId === game.placeId);

            return {
                name: game.name,
                placeId: game.placeId,
                image: thumb ? thumb.imageUrl : ""
            };
        });

        cache = games;
        lastFetch = Date.now();

        res.json(games);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch games" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
