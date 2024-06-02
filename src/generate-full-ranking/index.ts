import args from "args";
import { ChildProcess } from "child_process";
import consoleStamp from "console-stamp";
import { availableParallelism, cpus } from "os";

import { IChildWorker } from "./models/child-worker";
import { IStats } from "./models/stats";
import { IMessageToWorker, WorkerMessage } from "./models/worker-messages";

import { createWorker } from "./create-worker";
import { generatePossibilities } from "./generate-possibilities";
import { strategies } from "../game/strategies";
import { handleProcessExit, sleep } from "./utils";

const qtyCPUs = availableParallelism ? availableParallelism() : cpus().length;
args.option("workers", "Amount of workers (child processes) to spawn", qtyCPUs)
	.option("games", "Amount of games to play for each possible combination of strategies", 200)
	.option(["p", "log-possibilities"], "Logs all possible strategy combinations to be played", false)
	.option("logging", "Enable logging for the games", false);

const flags = args.parse(process.argv);

// Add time stamp to all logs
consoleStamp(console, {
	format: ":date(yyyy-mm-dd HH:MM:ss.l).yellow :label"
});

const CHILDREN: Array<IChildWorker> = [];

const startTime = Date.now();
let totalPoints: number = 0;
const stats: Record<string, IStats> = {};
for (const strategy of strategies)
	stats[strategy.name] = { victories: 0, points: 0, gamesPlayed: 0 };

async function start () {
	console.log("Starting...");

	handleProcessExit(CHILDREN);
	createWorker(CHILDREN, onMessageFromWorker, flags.workers);

	// Wait for all workers to be ready
	while (CHILDREN.some(c => !c.isReady))
		await sleep(1000);

	console.log("Processing...");
	const possibilities = generatePossibilities(flags.logPossibilities);
	const possibilitiesPerWorker = Math.ceil(possibilities.length / flags.workers);

	for (let i = 0; i < flags.workers; i++) {
		const message: IMessageToWorker = {
			possibilities: possibilities.slice(
				i * possibilitiesPerWorker,
				(i * possibilitiesPerWorker) + possibilitiesPerWorker
			),
			 gamesToPlay: flags.games,
			 logging: flags.logging
		};

		CHILDREN[i].child.send(message);
	}
}

function onMessageFromWorker (child: ChildProcess, message: WorkerMessage) {
	if (typeof message !== "object" || !("started" in message || "finished" in message))
		return console.info("Received message:", message);

	const childRef = CHILDREN.find(c => c.child === child);
	if (!childRef)
		return console.error("Couldn't find reference to child");

	if ("started" in message) {
		childRef.isReady = message.started;
		return;
	}

	if (!message.finished)
		return;

	if (message.failure || !message.results) {
		console.error(new Error(`Worker ${childRef.id} failed`));
		process.exit(1);
	}

	totalPoints += message.results.totalPoints;
	for (const strategy in message.results.stats) {
		stats[strategy].victories += message.results.stats[strategy].victories;
		stats[strategy].points += message.results.stats[strategy].points;
		stats[strategy].gamesPlayed += message.results.stats[strategy].gamesPlayed;
	}

	childRef.isDone = true;
	console.log(`Worker ${childRef.id} finished`);

	const allDone = CHILDREN.every(c => c.isDone);
	if (allDone) {
		let totalGamesPLayed = 0;

		console.log("Victories:");
		const strategyNames = strategies.map(s => s.name).sort((a, b) => stats[b].victories - stats[a].victories);
		for (const strategy of strategyNames) {
			totalGamesPLayed += stats[strategy].victories;
			console.log(`${strategy}: ${stats[strategy].victories} (${(stats[strategy].victories / stats[strategy].gamesPlayed * 100).toFixed(2)}%)`);
		}

		console.log("Points:");
		strategyNames.sort((a, b) => stats[a].points - stats[b].points);
		for (const strategy of strategyNames)
			console.log(`${strategy}: ${stats[strategy].points} (${(stats[strategy].points / totalPoints * 100).toFixed(2)}%)`);

		console.log("Total number of games played:", totalGamesPLayed);
		console.log("Finished in", ((Date.now() - startTime) / 1000).toFixed(3), "seconds");

		process.exit(0);
	}
}

start();
