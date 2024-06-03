import { Card } from "./card";
import { GameRow } from "./game-row";

/**
 * Base class for a player strategy to be used in the game.
 */
export abstract class Player {
	/**
	 * The name of the strategy that this player uses.
	 *
	 * Each strategy must attribute their name to this property.
	 */
	public abstract readonly strategyName: string;

	/**
	 * List of cards that the player has in their hand in ascending order.
	 */
	public readonly cards: Card[];

	/**
	 * The amount of points that the player accumulated in the game.
	 */
	public score: number = 0;

	constructor (public readonly playerNumber: number) {
		this.cards = [];
	}

	/**
	 * The unique name of the player.
	 */
	public get name (): string {
		return `${this.strategyName}-${this.playerNumber}`;
	}

	/**
	 * Adds cards to the player's hand.
	 * @param cards Array of cards to add to the player's hand.
	 */
	public addCards (cards: Card[]): void | Promise<void> {
		this.cards.push(...cards);
		this.cards.sort((a, b) => a.number - b.number);
		return this.onCardsAdded();
	}

	/**
	 * Chooses a card to play from the player's hand.
	 * @param gameRows Current state of the game rows.
	 * @returns Card that the player chooses to play.
	 */
	public play (gameRows: GameRow[]): Card | Promise<Card> {
		const choice = this.chooseCardToPlay(gameRows);
		if (choice instanceof Promise)
			return choice.then(cardIndex => this.selectCard(cardIndex));

		return this.selectCard(choice);
	}

	/**
	 * Chooses a row to take.
	 * @param gameRows Current state of the game rows.
	 * @returns Game row that the player chooses to take.
	 */
	public chooseRow (gameRows: GameRow[]): GameRow | Promise<GameRow> {
		const choice = this.chooseRowToTake(gameRows);
		if (choice instanceof Promise)
			return choice.then(rowIndex => this.selectRow(rowIndex, gameRows));

		return this.selectRow(choice, gameRows);
	}

	/**
	 * Callback that is called when cards are added to the player's hand.
	 *
	 * Some strategies may want to override this method in order to perform additional logic.
	 */
	protected onCardsAdded (): void | Promise<void> {}

	/**
	 * Strategy that chooses a row to take when the player is forced to take a row.
	 *
	 * This is a basic strategy that chooses the row with the least amount of points.
	 * In case of a tie, the row with the most cards is chosen.
	 *
	 * Some strategies may want to override this method in order to perform a different logic.
	 *
	 * @param gameRows Current state of the game rows.
	 * @returns Index of the game row that the player chooses to take.
	 */
	protected chooseRowToTake (gameRows: GameRow[]): number | Promise<number> {
		let chosenRowIndex = 0;

		for (let i = 1; i < gameRows.length; i++) {
			// Choose the row with the least amount of points
			if (gameRows[i].totalPoints < gameRows[chosenRowIndex].totalPoints) {
				chosenRowIndex = i;
				continue;
			}

			// Between rows with the same amount of points, choose the one with the most cards
			if (
				gameRows[i].totalPoints === gameRows[chosenRowIndex].totalPoints &&
				gameRows[i].countCards > gameRows[chosenRowIndex].countCards
			)
				chosenRowIndex = i;
		}

		return chosenRowIndex;
	}

	/**
	 * Method that chooses a card to play from the player's hand.
	 *
	 * Each strategy must implement their specific logic for this method.
	 *
	 * @param gameRows Current state of the game rows.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected abstract chooseCardToPlay (gameRows: GameRow[]): number | Promise<number>;

	/**
	 * Converts a card index into a card from the player's hand.
	 * @param cardIndex Index of the card that the player chooses to play.
	 * @returns Card that the player chooses to play.
	 */
	private selectCard (cardIndex: number): Card {
		if (cardIndex >= this.cards.length || cardIndex < 0)
			throw new Error(`${this.name} tried to play a card that is out of bounds: ${cardIndex}`);

		return this.cards.splice(cardIndex, 1)[0];
	}

	/**
	 * Converts a row index into a row from the game rows.
	 * @param rowIndex Index of the game row that the player chooses to take.
	 * @param gameRows Current state of the game rows.
	 * @returns Game row that the player chooses to take.
	 */
	private selectRow (rowIndex: number, gameRows: GameRow[]): GameRow {
		if (rowIndex >= gameRows.length || rowIndex < 0)
			throw new Error(`${this.name} tried to choose a row that is out of bounds: ${rowIndex}`);

		return gameRows[rowIndex];
	}
}
