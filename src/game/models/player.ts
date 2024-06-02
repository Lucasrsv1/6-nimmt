import { Card } from "./card";
import { GameColumn } from "./game-column";

/**
 * Base class for a player strategy to be used in the game.
 */
export abstract class Player {
	/**
	 * The name of the strategy that this player uses.
	 *
	 * Each strategy must attribute their name to this property.
	 */
	protected abstract strategyName: string;

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
	 * @param gameColumns Current state of the game columns.
	 * @returns Card that the player chooses to play.
	 */
	public play (gameColumns: GameColumn[]): Card | Promise<Card> {
		const choice = this.chooseCardToPlay(gameColumns);
		if (choice instanceof Promise)
			return choice.then(cardIndex => this.selectCard(cardIndex));

		return this.selectCard(choice);
	}

	/**
	 * Chooses a column to draw.
	 * @param gameColumns Current state of the game columns.
	 * @returns Game column that the player chooses to draw.
	 */
	public chooseColumn (gameColumns: GameColumn[]): GameColumn | Promise<GameColumn> {
		const choice = this.chooseColumnToDraw(gameColumns);
		if (choice instanceof Promise)
			return choice.then(columnIndex => this.selectColumn(columnIndex, gameColumns));

		return this.selectColumn(choice, gameColumns);
	}

	/**
	 * Callback that is called when the player's hand is updated.
	 *
	 * Some strategies may want to override this method in order to perform additional logic.
	 */
	protected onCardsAdded (): void | Promise<void> {}

	/**
	 * Strategy that chooses a column to draw when the player is forced to draw a column.
	 *
	 * This is a basic strategy that chooses the column with the least amount of points.
	 * In case of a tie, the column with the most cards is chosen.
	 *
	 * Some strategies may want to override this method in order to perform a different logic.
	 *
	 * @param gameColumns Current state of the game columns.
	 * @returns Index of the game column that the player chooses to draw.
	 */
	protected chooseColumnToDraw (gameColumns: GameColumn[]): number | Promise<number> {
		let chosenColumnIndex = 0;

		for (let i = 1; i < gameColumns.length; i++) {
			// Choose the column with the least amount of points
			if (gameColumns[i].totalPoints < gameColumns[chosenColumnIndex].totalPoints) {
				chosenColumnIndex = i;
				continue;
			}

			// Between columns with the same amount of points, choose the one with the most cards
			if (
				gameColumns[i].totalPoints === gameColumns[chosenColumnIndex].totalPoints &&
				gameColumns[i].countCards > gameColumns[chosenColumnIndex].countCards
			)
				chosenColumnIndex = i;
		}

		return chosenColumnIndex;
	}

	/**
	 * Method that chooses a card to play from the player's hand.
	 *
	 * Each strategy must implement their specific logic for this method.
	 *
	 * @param gameColumns Current state of the game columns.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected abstract chooseCardToPlay (gameColumns: GameColumn[]): number | Promise<number>;

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
	 * Converts a column index into a column from the game columns.
	 * @param columnIndex Index of the game column that the player chooses to draw.
	 * @param gameColumns Current state of the game columns.
	 * @returns Game column that the player chooses to draw.
	 */
	private selectColumn (columnIndex: number, gameColumns: GameColumn[]): GameColumn {
		if (columnIndex >= gameColumns.length || columnIndex < 0)
			throw new Error(`${this.name} tried to choose a column that is out of bounds: ${columnIndex}`);

		return gameColumns[columnIndex];
	}
}
