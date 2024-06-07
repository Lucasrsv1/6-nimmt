import { Card } from "../models/card";
import { GameRow } from "../models/game-row";
import { Player } from "../models/player";

export class Cheater extends Player {
	public readonly strategyName: string = "Cheater";

	/**
	 * Chooses a card to play from the player's hand.
	 * @param gameRows Current state of the game rows.
	 * @param otherCards Cards played by the other players.
	 * @returns Card that the player chooses to play.
	 * @override
	 */
	public play (gameRows: GameRow[], otherCards: Card[] = []): Card {
		const choice = this.chooseCardToPlay(gameRows, otherCards);
		return this.cards.splice(choice, 1)[0];
	}

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * In this strategy, the player chooses the card that will result in less points given the other players' cards.
	 *
	 * @param gameRows Current state of the game rows.
	 * @param otherCards Cards played by the other players.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameRows: GameRow[], otherCards: Card[] = []): number {
		if (!otherCards.length)
			throw new Error("A cheater can only play a rigged game that reveals the other players' cards.");

		const lessPointsCards = {
			options: [] as Array<{ index: number, distance: number }>,
			points: Infinity
		};

		for (let i = 0; i < this.cards.length; i++) {
			// Makes sure that the original rows won't be modified by the simulations
			const simulationGameRows = gameRows.map(row => row.clone());

			// Gather the cards to simulate this player's turn
			const simulationRound = otherCards.slice()
				.concat(this.cards[i])
				.sort((a, b) => a.number - b.number);

			for (const card of simulationRound) {
				const [ points, distance ] = this.simulatePlayCard(simulationGameRows, card);

				// Chose this card if it is this player's turn and it resulted in less points.
				if (card === this.cards[i]) {
					if (points < lessPointsCards.points) {
						lessPointsCards.options = [{ index: i, distance }];
						lessPointsCards.points = points;
						break;
					}

					if (points === lessPointsCards.points)
						lessPointsCards.options.push({ index: i, distance });
				}
			}
		}

		// In case there are multiple cards with the same amount of points, choose the one with the smallest distance
		let choice = lessPointsCards.options[0];
		for (let i = 1; i < lessPointsCards.options.length; i++) {
			if (lessPointsCards.options[i].distance < choice.distance)
				choice = lessPointsCards.options[i];
		}

		return choice.index;
	}

	/**
	 * Simulates a player's turn
	 * @param gameRows Current state of the game rows.
	 * @param card The card that the player is playing.
	 * @returns Amount of points that would be added to the player's score.
	 */
	private simulatePlayCard (gameRows: GameRow[], card: Card): [number, number] {
		const availableRows = gameRows.filter(row => row.canAddCard(card));
		if (!availableRows.length) {
			const choice = this.chooseRow(gameRows) as GameRow;
			return [choice.startRow(card), Infinity];
		}

		const nearest = {
			row: availableRows[0],
			distance: card.number - availableRows[0].biggestCard
		};

		for (let i = 1; i < availableRows.length; i++) {
			const distance = card.number - availableRows[i].biggestCard;
			if (distance < nearest.distance) {
				nearest.row = availableRows[i];
				nearest.distance = distance;
			}
		}

		return [nearest.row.addCard(card), nearest.distance];
	}
}
