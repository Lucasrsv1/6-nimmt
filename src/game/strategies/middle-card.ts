import { GameColumn } from "../models/game-column";
import { Player } from "../models/player";

export class MiddleCard extends Player {
	protected strategyName: string = "MiddleCard";

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * In this strategy, the player chooses the card that is in the middle of their hand.
	 *
	 * @param gameColumns Current state of the game columns.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameColumns: GameColumn[]): number {
		return Math.floor(this.cards.length / 2);
	}
}
