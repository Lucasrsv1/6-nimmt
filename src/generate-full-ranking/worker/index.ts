import consoleStamp from "console-stamp";
import { Serializable } from "child_process";

import { IStats } from "../models/stats";
import { IFinishMessageFromWorker, IMessageToWorker, IStartMessageFromWorker } from "../models/worker-messages";

import { Game } from "../../game";
import { strategies } from "../../game/strategies";

// Add time stamp to all logs
consoleStamp(console, {
	format: `:date(yyyy-mm-dd HH:MM:ss.l).yellow :label [WORKER ID: ${process.env.CHILD_ID}, PID: ${process.pid}]`
});

let totalPoints: number = 0;
const stats: Record<string, IStats> = {};
for (const strategy of strategies)
	stats[strategy.name] = { victories: 0, points: 0, gamesPlayed: 0 };

process.on("message", async (message: Serializable | IMessageToWorker) => {
	if (typeof message !== "object" || !("possibilities" in message))
		return console.info("Received message:", message);

	const { possibilities } = message;
	for (const match of possibilities) {
		// Instantiate each player with its strategy, and instantiate the game with the players.
		const game = new Game(
			match.map(
				(strategyIndex, playerNumber) => new strategies[strategyIndex](playerNumber + 1)
			),
			message.logging
		);

		for (let i = 0; i < message.gamesToPlay; i++) {
			const ranking = await game.play();

			// A strategy may appear more than once in the ranking, so we need to count it only once.
			for (const strategyName of new Set(game.players.map(p => p.strategyName)))
				stats[strategyName].gamesPlayed++;

			for (const { strategyName, points, position } of ranking) {
				totalPoints += points;
				stats[strategyName].points += points;

				if (position === 1)
					stats[strategyName].victories++;
			}
		}
	}

	const finishMessage: IFinishMessageFromWorker = {
		finished: true,
		failure: false,
		results: {
			totalPoints,
			stats
		}
	};

	process.send?.(finishMessage);
});

const startMessage: IStartMessageFromWorker = {
	started: true
};

console.log("Worker started.");
process.send?.(startMessage);
