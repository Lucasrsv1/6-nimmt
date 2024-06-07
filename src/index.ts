import args from "args";

import { Game } from "./game";

import { AverageCard } from "./game/strategies/average-card";
// import { Cheater } from "./game/strategies/cheater";
import { HighestCard } from "./game/strategies/highest-card";
import { LowestCard } from "./game/strategies/lowest-card";
import { MiddleCard } from "./game/strategies/middle-card";
import { NearestAvailableCard } from "./game/strategies/nearest-available-card";
import { NearestCard } from "./game/strategies/nearest-card";
import { RandomCard } from "./game/strategies/random-card";

args.option("games", "Amount of games to play", 100000)
	.option("logging", "Enable logging", false);

const flags = args.parse(process.argv);

let totalPoints = 0;
const stats: Record<string, { victories: number, points: number }> = {};

const game = new Game(
	[
		new AverageCard(1),
		new HighestCard(2),
		new LowestCard(3),
		new MiddleCard(4),
		new NearestCard(5),
		new RandomCard(6),
		new NearestAvailableCard(7)
		// new Cheater(8)
	],
	flags.logging
);

async function start () {
	console.log("Processing...");
	const start = Date.now();

	for (let i = 0; i < flags.games; i++) {
		const ranking = await game.play();
		for (const { player, points, position } of ranking) {
			if (!stats[player])
				stats[player] = { victories: 0, points: 0 };

			totalPoints += points;
			stats[player].points += points;

			if (position === 1)
				stats[player].victories++;
		}
	}

	console.log("\nVictories:");
	const players = Object.keys(stats).sort((a, b) => stats[b].victories - stats[a].victories);
	for (const player of players)
		console.log(`${player}: ${stats[player].victories} (${(stats[player].victories / flags.games * 100).toFixed(2)}%)`);

	console.log("\nPoints:");
	players.sort((a, b) => stats[a].points - stats[b].points);
	for (const player of players)
		console.log(`${player}: ${stats[player].points} (${(stats[player].points / totalPoints * 100).toFixed(2)}%)`);

	console.log("\nFinished in", ((Date.now() - start) / 1000).toFixed(3), "seconds");
}

start();
