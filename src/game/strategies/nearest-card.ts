import { GameColumn } from "../models/game-column";
import { Player } from "../models/player";

export class NearestCard extends Player {
	protected strategyName: string = "NearestCard";

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * In this strategy, the player chooses the card that is nearest to the top card in one of the columns,
	 * considering that such column has less than 5 cards and that the player's card is bigger than the top card in the column.
	 *
	 * @param gameColumns Current state of the game columns.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameColumns: GameColumn[]): number {
		const columnValues = gameColumns.map(column => (column.countCards < 5 ? column.biggestCard : Infinity));

		const nearest = {
			index: 0,
			distance: Math.min(
				...columnValues.map(cv => (this.cards[0].number > cv ? this.cards[0].number - cv : Infinity))
			)
		};

		for (let i = 1; i < this.cards.length; i++) {
			const distance = Math.min(
				...columnValues.map(cv => (this.cards[i].number > cv ? this.cards[i].number - cv : Infinity))
			);

			if (distance < nearest.distance) {
				nearest.index = i;
				nearest.distance = distance;
			}
		}

		return nearest.index;
	}
}
