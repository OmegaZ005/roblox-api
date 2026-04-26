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

        if (!response.ok) {
            throw new Error("Request failed: " + response.status);
        }

        const data = await response.json();

        const games = data.games.map(game => ({
            name: game.name,
            placeId: game.placeId
        }));

        res.json(games);

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ error: "Failed to fetch games" });
    }
});
