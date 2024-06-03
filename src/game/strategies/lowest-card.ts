import { GameRow } from "../models/game-row";
import { Player } from "../models/player";

export class LowestCard extends Player {
	protected strategyName: string = "LowestCard";

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * In this strategy, the player chooses the card with the lowest number.
	 *
	 * @param gameRows Current state of the game rows.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameRows: GameRow[]): number {
		return 0;
	}
}
