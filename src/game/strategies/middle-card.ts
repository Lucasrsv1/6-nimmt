import { GameRow } from "../models/game-row";
import { Player } from "../models/player";

export class MiddleCard extends Player {
	public readonly strategyName: string = "MiddleCard";

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * In this strategy, the player chooses the card that is in the middle of their hand.
	 *
	 * @param gameRows Current state of the game rows.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameRows: GameRow[]): number {
		return Math.floor(this.cards.length / 2);
	}
}
