const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/", (req, res) => {
    res.send("API is running. Go to /games");
});

app.get("/games", async (req, res) => {
    try {
        const gamesRes = await fetch(
            "https://games.roblox.com/v1/games?sortOrder=Desc&limit=10"
        );

        const gamesData = await gamesRes.json();

        const games = gamesData.data.map(game => ({
            name: game.name,
            placeId: game.id
        }));

        res.json(games);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch games" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
