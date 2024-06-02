import { GameColumn } from "../models/game-column";
import { Player } from "../models/player";

export class RandomCard extends Player {
	protected strategyName: string = "RandomCard";

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * In this strategy, the player chooses a random card from their hand.
	 *
	 * @param gameColumns Current state of the game columns.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameColumns: GameColumn[]): number {
		return Math.floor(Math.random() * this.cards.length);
	}
}
