export class Card {
	private _number: number;
	private _points: number;

	constructor (number: number) {
		if (number < 1 || number > 104)
			throw new Error("Invalid card number: " + number);

		this._number = number;

		if (this.number === 55)
			this._points = 7;
		else if ([11, 22, 33, 44, 66, 77, 88, 99].includes(this.number))
			this._points = 5;
		else if (this.number % 10 === 0)
			this._points = 3;
		else if (this.number % 5 === 0)
			this._points = 2;
		else
			this._points = 1;
	}

	get number (): number {
		return this._number;
	}

	get points (): number {
		return this._points;
	}
}
