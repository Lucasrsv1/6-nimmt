import { Player } from "./player";

export interface IRankingPosition {
	player: string;
	points: number;
	position: number;
}

/**
 * Builds the game ranking.
 * @param players Instances of the players that participated in the game.
 * @returns Ranking with the game results, or null if there is a tie.
 */
export function buildRanking (players: Player[]): IRankingPosition[] | null {
	const ranking: IRankingPosition[] = [];
	const playersCopy = players.slice().sort((a, b) => a.score - b.score);

	if (playersCopy[0].score === playersCopy[1].score)
		return null;

	for (const player of playersCopy) {
		ranking.push({
			player: player.name,
			points: player.score,
			position: ranking.length + 1
		});
	}

	return ranking;
}
