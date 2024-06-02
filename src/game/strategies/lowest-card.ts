import { GameColumn } from "../models/game-column";
import { Player } from "../models/player";

export class LowestCard extends Player {
	protected strategyName: string = "LowestCard";

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * In this strategy, the player chooses the card with the lowest number.
	 *
	 * @param gameColumns Current state of the game columns.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameColumns: GameColumn[]): number {
		return 0;
	}
}
