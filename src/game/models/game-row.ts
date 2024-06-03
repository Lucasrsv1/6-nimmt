import { Card } from "./card";

export class GameRow {
	private cards: Card[];

	constructor () {
		this.cards = [];
	}

	public get biggestCard (): number {
		if (!this.cards.length)
			return 0;

		return this.cards[this.cards.length - 1].number;
	}

	public get countCards (): number {
		return this.cards.length;
	}

	public get totalPoints (): number {
		return this.cards.reduce((sum: number, card: Card) => sum + card.points, 0);
	}

	public canAddCard (card: Card): boolean {
		return card.number > this.biggestCard;
	}

	/**
	 * Add a card to the row.
	 * @param card Card to add to the row.
	 * @returns Amount of points that must be added to the player's score.
	 */
	public addCard (card: Card): number {
		if (this.biggestCard > card.number)
			throw new Error(`Card ${card.number} is not bigger than ${this.biggestCard}`);

		this.cards.push(card);

		if (this.cards.length === 6) {
			const overflow = this.cards.splice(0, 5);
			return overflow.reduce((sum: number, card: Card) => sum + card.points, 0);
		}

		return 0;
	}

	/**
	 * Start the row by removing all cards and adding the specified one.
	 * @param card Card to add to the start of the row.
	 * @returns Amount of points that must be added to the player's score.
	 */
	public startRow (card: Card): number {
		const points = this.totalPoints;

		this.cards.splice(0);
		this.cards.push(card);

		return points;
	}
}
