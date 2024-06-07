import { AverageCard } from "./average-card";
// import { Cheater } from "./cheater";
import { HighestCard } from "./highest-card";
import { LowestCard } from "./lowest-card";
import { MiddleCard } from "./middle-card";
import { NearestAvailableCard } from "./nearest-available-card";
import { NearestCard } from "./nearest-card";
import { RandomCard } from "./random-card";

/**
 * List of all available strategies.
 */
export const strategies = [
	// Basic strategies
	AverageCard,
	HighestCard,
	LowestCard,
	MiddleCard,
	NearestCard,
	RandomCard,

	// More elaborate strategies
	NearestAvailableCard

	// Rigged strategy
	// Cheater
];

/**
 * List of all available strategy indexes.
 * This is used to map the number of the strategy index to the strategy class.
 */
export const strategyIndexes = strategies.map((_, index) => index);
