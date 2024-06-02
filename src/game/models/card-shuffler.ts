import { Card } from "./card";

export class CardShuffler {
	private cards: Card[] = [];

	public get remainingCards (): number {
		return this.cards.length;
	}

	public loadCards (): void {
		this.cards = [];
		for (let i = 1; i <= 104; i++)
			this.cards.push(new Card(i));
	}

	public shuffle (): void {
		for (let i = this.cards.length; i > 0; i--) {
			const j = Math.floor(Math.random() * i);
			[this.cards[i - 1], this.cards[j]] = [this.cards[j], this.cards[i - 1]];
		}
	}

	public getCard (): Card {
		if (!this.cards.length)
			throw new Error("The deck is empty");

		return this.cards.splice(0, 1)[0];
	}

	public getCards (quantity: number): Card[] {
		if (this.cards.length < quantity)
			throw new Error(`Only ${this.cards.length} cards are available`);

		return this.cards.splice(0, quantity).sort((a, b) => a.number - b.number);
	}
}
