import { GameColumn } from "../models/game-column";
import { Player } from "../models/player";

export class HighestCard extends Player {
	protected strategyName: string = "HighestCard";

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * In this strategy, the player chooses the card with the highest number.
	 *
	 * @param gameColumns Current state of the game columns.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameColumns: GameColumn[]): number {
		return this.cards.length - 1;
	}
}
