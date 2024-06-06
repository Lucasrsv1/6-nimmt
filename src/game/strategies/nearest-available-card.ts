import { Card } from "../models/card";
import { GameRow } from "../models/game-row";
import { Player } from "../models/player";

/**
 * A card that can be added to a game row possibly without exceeding the maximum number of cards in the row.
 */
class AvailableCard {
	constructor (
		public readonly card: Card,
		public readonly cardIndex: number,
		public readonly row: GameRow
	) {}

	/**
	 * Distance from the biggest card in the row, considering the empty slots.
	 */
	public get distance () {
		const realDistance = this.card.number - this.row.biggestCard;
		const creditsForEmptySlots = 5 * this.emptySlots;
		return realDistance - creditsForEmptySlots;
	}

	public get emptySlots () {
		return 5 - this.row.countCards;
	}
}

export class NearestAvailableCard extends Player {
	public readonly strategyName: string = "NearestAvailableCard";

	/**
	 * Strategy that chooses a row to take when the player is forced to take a row.
	 *
	 * In this strategy, the row with the least amount of points is chosen.
	 * In case of a tie, is chosen the row with the least amount of allowed cards from the player's hand.
	 * In case the tie remains, the row with the most cards is chosen.
	 *
	 * @param gameRows Current state of the game rows.
	 * @returns Index of the game row that the player chooses to take.
	 * @override
	 */
	protected chooseRowToTake (gameRows: GameRow[]): number {
		let chosenRowIndex = 0;
		let playableCardsChosenRow = Math.min(
			5 - gameRows[0].countCards,
			this.cards.filter(card => gameRows[0].canAddCard(card)).length
		);

		for (let i = 1; i < gameRows.length; i++) {
			// Don't choose this row if it has more points than the chosen row
			if (gameRows[i].totalPoints > gameRows[chosenRowIndex].totalPoints)
				continue;

			const playableCards = Math.min(
				5 - gameRows[i].countCards,
				this.cards.filter(card => gameRows[i].canAddCard(card)).length
			);

			if (gameRows[i].totalPoints === gameRows[chosenRowIndex].totalPoints) {
				// Don't choose this row if we have more cards that can be played on it than on the chosen row
				if (playableCards > playableCardsChosenRow)
					continue;

				// Don't choose this row if it has less cards than the chosen row
				if (playableCards === playableCardsChosenRow && gameRows[i].countCards < gameRows[chosenRowIndex].countCards)
					continue;
			}

			chosenRowIndex = i;
			playableCardsChosenRow = playableCards;
		}

		return chosenRowIndex;
	}

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * In this strategy, the player chooses the card that is nearest to the top card of the row that the card is most likely to fit in,
	 * considering that such row has less than 5 cards and that each empty slot on it weigh in favor of the corresponding card.
	 *
	 * @param gameRows Current state of the game rows.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameRows: GameRow[]): number {
		const availableCards = this.cards.reduce(
			(acc: AvailableCard[], card: Card, index: number) => {
				const row = this.nearestRow(gameRows, card);
				if (!row || row.countCards === 5)
					return acc;

				acc.push(new AvailableCard(card, index, row));
				return acc;
			},
			[]
		);

		if (!availableCards.length) {
			// Choose the biggest card that doesn't fit in any row
			for (let i = this.cards.length - 1; i >= 0; i--) {
				if (!gameRows.some(row => row.canAddCard(this.cards[i])))
					return i;
			}

			// If all cards fit in a row, choose the smallest card
			return 0;
		}

		// Choose the card that is nearest to the top card of the row it belongs to.
		// In case of a tie, choose the card whose row has more empty slots.
		let nearest = availableCards[0];
		for (let i = 1; i < availableCards.length; i++) {
			if (
				availableCards[i].distance < nearest.distance ||
				(availableCards[i].distance === nearest.distance && availableCards[i].emptySlots > nearest.emptySlots)
			)
				nearest = availableCards[i];
		}

		return nearest.cardIndex;
	}

	/**
	 * Find the nearest available row for a card, that is, the row that the card is most likely to fit in.
	 * @param gameRows Current state of the game rows.
	 * @param card Card to find the nearest row for.
	 * @returns The nearest row for the card.
	 */
	private nearestRow (gameRows: GameRow[], card: Card): GameRow | null {
		const availableRows = gameRows.filter(row => row.canAddCard(card));
		if (!availableRows.length)
			return null;

		const nearest = {
			row: availableRows[0],
			distance: card.number - availableRows[0].biggestCard
		};

		for (let j = 1; j < availableRows.length; j++) {
			const distance = card.number - availableRows[j].biggestCard;
			if (distance < nearest.distance) {
				nearest.row = availableRows[j];
				nearest.distance = distance;
			}
		}

		return nearest.row;
	}
}
