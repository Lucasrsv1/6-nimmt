import { GameColumn } from "../models/game-column";
import { Player } from "../models/player";

export class AverageCard extends Player {
	protected strategyName: string = "AverageCard";

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * In this strategy, the player chooses the card that is closest to the average of the cards in their hand.
	 *
	 * @param gameColumns Current state of the game columns.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameColumns: GameColumn[]): number {
		const avg = this.cards.reduce((acc, card) => acc + card.number, 0) / this.cards.length;
		const nearest = {
			index: 0,
			distance: Math.abs(this.cards[0].number - avg)
		};

		for (let i = 1; i < this.cards.length; i++) {
			const distance = Math.abs(this.cards[i].number - avg);
			if (distance < nearest.distance) {
				nearest.index = i;
				nearest.distance = distance;
			}
		}

		return nearest.index;
	}
}
