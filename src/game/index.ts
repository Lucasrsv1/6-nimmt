import { Card } from "./models/card";
import { CardShuffler } from "./models/card-shuffler";
import { Cheater } from "./strategies/cheater";
import { GameRow } from "./models/game-row";
import { Player } from "./models/player";
import { buildRanking, IRankingPosition } from "./models/ranking";

export class Game {
	private cardShuffler: CardShuffler;
	private gameRows: GameRow[] = [];

	constructor (
		public readonly players: Player[],
		public logging: boolean = false
	) {
		if (this.players.length < 2 || this.players.length > 10)
			throw new Error("Invalid number of players: " + this.players.length);

		this.cardShuffler = new CardShuffler();

		for (let i = 0; i < 4; i++)
			this.gameRows.push(new GameRow());
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
		const availableRows = this.gameRows.filter(row => row.canAddCard(card));
		if (!availableRows.length) {
			const choice = player.chooseRow(this.gameRows);
			if (choice instanceof Promise)
				return choice.then(chosenRow => chosenRow.startRow(card));

			return choice.startRow(card);
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

		return nearest.row.addCard(card);
	}

	/**
	 * Computes a match between the players.
	 * @returns The ranking of the players after the match.
	 */
	public async play (): Promise<IRankingPosition[]> {
		this.log("===== New Game =====");
		this.cardShuffler.loadCards();
		this.cardShuffler.shuffle();

		for (const gameRow of this.gameRows)
			gameRow.startRow(this.cardShuffler.getCard());

		for (const player of this.players)
			player.score = 0;

		this.log("Current rows:", this.gameRows.map((row, index) => ({
			id: `Row ${index + 1}`,
			countCards: row.countCards,
			biggestCard: row.biggestCard,
			totalPoints: row.totalPoints
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
				if (player instanceof Cheater)
					continue;

				const playerChoice = player.play(this.gameRows);
				const card = playerChoice instanceof Promise ? await playerChoice : playerChoice;
				round.push({ player, card });
			}

			const cheaters = this.players.filter(p => p instanceof Cheater) as Cheater[];
			for (const cheater of cheaters) {
				const card = cheater.play(this.gameRows, round.map(t => t.card));
				round.push({ player: cheater, card });
			}

			round.sort((a, b) => a.card.number - b.card.number);
			this.log("Round:", round.map(t => ({ player: t.player.name, card: t.card.number })));

			for (const { player, card } of round) {
				const points = this.playCard(card, player);
				const pointsValue = points instanceof Promise ? await points : points;
				player.score += pointsValue;
				if (pointsValue > 0)
					this.log(player.name, "got", pointsValue, "points");
			}

			this.log("Current rows:", this.gameRows.map((row, index) => ({
				id: `Row ${index + 1}`,
				countCards: row.countCards,
				biggestCard: row.biggestCard,
				totalPoints: row.totalPoints
			})));
		}

		const ranking = buildRanking(this.players);
		this.log("Ranking:", ranking);

		// Play again if there is a tie
		return ranking || this.play();
	}
}
