import { combinationsWithReplacement } from "combinatorial-generators";

import { strategies, strategyIndexes } from "../game/strategies";

/**
 * Generate all possible combinations of strategies for 2 to 10 players.
 * @param logging Logging flag.
 * @returns Array of all possible combinations of strategies.
 */
export function generatePossibilities (logging: boolean = false): number[][] {
	const possibilities: number[][] = [];
	for (let players = 2; players <= 10; players++) {
		for (const combination of combinationsWithReplacement(strategyIndexes, players)) {
			const repetitionCounter: Record<string, number> = {};
			for (const strategyIndex of combination)
				repetitionCounter[strategyIndex] = (repetitionCounter[strategyIndex] || 0) + 1;

			// Ignore combinations that don't have at least one strategy that appears only once
			if (Object.keys(repetitionCounter).some(strategy => repetitionCounter[strategy] === 1))
				possibilities.push(combination);
		}
	}

	if (logging) {
		for (const match of possibilities)
			console.log(match.map(strategyIndex => strategies[strategyIndex].name));
	}

	console.log("Total number of possibilities:", possibilities.length);
	return possibilities;
}
