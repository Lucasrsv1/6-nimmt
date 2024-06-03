import { GameRow } from "../models/game-row";
import { Player } from "../models/player";

export class NearestCard extends Player {
	public readonly strategyName: string = "NearestCard";

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * In this strategy, the player chooses the card that is nearest to the top card in one of the rows,
	 * considering that such row has less than 5 cards and that the player's card is bigger than the top card in the row.
	 *
	 * @param gameRows Current state of the game rows.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameRows: GameRow[]): number {
		const rowValues = gameRows.map(row => (row.countCards < 5 ? row.biggestCard : Infinity));

		const nearest = {
			index: 0,
			distance: Math.min(
				...rowValues.map(rv => (this.cards[0].number > rv ? this.cards[0].number - rv : Infinity))
			)
		};

		for (let i = 1; i < this.cards.length; i++) {
			const distance = Math.min(
				...rowValues.map(rv => (this.cards[i].number > rv ? this.cards[i].number - rv : Infinity))
			);

			if (distance < nearest.distance) {
				nearest.index = i;
				nearest.distance = distance;
			}
		}

		return nearest.index;
	}
}
