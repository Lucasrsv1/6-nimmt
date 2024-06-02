import { Card } from "./models/card";
import { CardShuffler } from "./models/card-shuffler";
import { GameColumn } from "./models/game-column";
import { Player } from "./models/player";
import { buildRanking, IRankingPosition } from "./models/ranking";

export class Game {
	private cardShuffler: CardShuffler;
	private gameColumns: GameColumn[] = [];

	constructor (
		public readonly players: Player[],
		public logging: boolean = false
	) {
		if (this.players.length < 2 || this.players.length > 10)
			throw new Error("Invalid number of players: " + this.players.length);

		this.cardShuffler = new CardShuffler();

		for (let i = 0; i < 4; i++)
			this.gameColumns.push(new GameColumn());
	}

	private get log (): typeof console.log {
		return this.logging ? console.log : () => {};
	}

	/**
	 * Calculates the number of cards to be dealt to each player,
	 * considering the number of remaining cards and distributing a maximum of 10 cards per player at a time.
	 * @returns Number of cards to be dealt to each player.
	 */
	private getQtyCardsPerPlayer (): number {
		return Math.min(10, Math.floor(this.cardShuffler.remainingCards / this.players.length));
	}

	/**
	 * Compute a player's turn
	 * @param card The card that the player is playing.
	 * @param player The player that played the card.
	 * @returns Amount of points that must be added to the player's score.
	 */
	private playCard (card: Card, player: Player): number | Promise<number> {
		const availableColumns = this.gameColumns.filter(column => column.canAddCard(card));
		if (!availableColumns.length) {
			const choice = player.chooseColumn(this.gameColumns);
			if (choice instanceof Promise)
				return choice.then(chosenColumn => chosenColumn.startColumn(card));

			return choice.startColumn(card);
		}

		const nearest = {
			column: availableColumns[0],
			distance: Math.abs(card.number - availableColumns[0].biggestCard)
		};

		for (let i = 1; i < availableColumns.length; i++) {
			const distance = Math.abs(card.number - availableColumns[i].biggestCard);
			if (distance < nearest.distance) {
				nearest.column = availableColumns[i];
				nearest.distance = distance;
			}
		}

		return nearest.column.addCard(card);
	}

	/**
	 * Computes a match between the players.
	 * @returns The ranking of the players after the match.
	 */
	public async play (): Promise<IRankingPosition[]> {
		this.log("===== New Game =====");
		this.cardShuffler.loadCards();
		this.cardShuffler.shuffle();

		for (const gameColumn of this.gameColumns)
			gameColumn.startColumn(this.cardShuffler.getCard());

		for (const player of this.players)
			player.score = 0;

		this.log("Current columns:", this.gameColumns.map((column, index) => ({
			id: `Column ${index + 1}`,
			countCards: column.countCards,
			biggestCard: column.biggestCard,
			totalPoints: column.totalPoints
		})));

		while (this.players[0].cards.length || this.cardShuffler.remainingCards > this.players.length) {
			if (!this.players[0].cards.length) {
				const qtyCardsPerPlayer = this.getQtyCardsPerPlayer();
				for (const player of this.players) {
					const promise = player.addCards(this.cardShuffler.getCards(qtyCardsPerPlayer));
					if (promise)
						await promise;
				}

				this.log("Amount of remaining cards in the deck:", this.cardShuffler.remainingCards);
				for (const player of this.players)
					this.log("Player", player.name, "has", player.cards.length, "cards in their hand:", player.cards);
			}

			const round: Array<{ player: Player, card: Card }> = [];
			for (const player of this.players) {
				const playerChoice = player.play(this.gameColumns);
				const card = playerChoice instanceof Promise ? await playerChoice : playerChoice;
				round.push({ player, card });
			}

			round.sort((a, b) => a.card.number - b.card.number);
			this.log("Round:", round.map(t => ({ player: t.player.name, card: t.card.number })));

			for (const { player, card } of round) {
				const points = this.playCard(card, player);
				player.score += points instanceof Promise ? await points : points;
			}

			this.log("Current columns:", this.gameColumns.map((column, index) => ({
				id: `Column ${index + 1}`,
				countCards: column.countCards,
				biggestCard: column.biggestCard,
				totalPoints: column.totalPoints
			})));
		}

		const ranking = buildRanking(this.players);
		this.log("Ranking:", ranking);

		// Play again if there is a tie
		return ranking || this.play();
	}
}
