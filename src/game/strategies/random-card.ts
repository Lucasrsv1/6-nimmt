import { GameRow } from "../models/game-row";
import { Player } from "../models/player";

export class RandomCard extends Player {
	public readonly strategyName: string = "RandomCard";

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * In this strategy, the player chooses a random card from their hand.
	 *
	 * @param gameRows Current state of the game rows.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameRows: GameRow[]): number {
		return Math.floor(Math.random() * this.cards.length);
	}
}
