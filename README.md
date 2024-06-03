# Comparison of Strategies to Play 6 Nimmt!

![6 Nimmt!](logo.jpg "6 Nimmt!")

<p align="center">
	<span>English</span> |
	<a href="https://github.com/Lucasrsv1/6-nimmt/blob/master/README.pt-br.md">Português Brasileiro</a>
</p>

This project aims to make a comparison between possible strategies to win the game [6 Nimmt!](https://www.google.com/search?q=6+nimmt%21) in order to assist in the search for a strategy that is significantly better than the others.

*Note: Such a strategy that is significantly better has not yet been found... [help us find it!](#como-adicionar-uma-nova-estratégia)*

[The game manual is available at this link.](https://world-of-board-games.com.sg/docs/6-Nimmt.pdf)

## Strategies

Currently implemented and compared strategies are:

- **AverageCard:** the player chooses the card that is closest to the average of the cards in their hand.

- **HighestCard:** the player chooses the card with the highest number.

- **LowestCard:** the player chooses the card with the lowest number.

- **MiddleCard:** the player chooses the card that is in the middle of their hand.

- **NearestCard:** the player chooses the card that is nearest to the top card in one of the rows, considering that such row has less than 5 cards and that the player's card is bigger than the top card in the row.

- **RandomCard:** the player chooses a random card from their hand.

### Choosing the Row to Take

When the player is forced to choose a line to take all of its cards as points, a specific strategy can be executed to make that choice.

For all simple strategies developed (`AverageCard`, `HighestCard`, `LowestCard`, `MiddleCard`, `NearestCard`, `RandomCard`) a simple logic is being applied in which the player chooses the line with the lowest number of points and, in case of a tie, the line with the most cards is chosen.

This standard row choice logic is implemented in the `Player` class and consequently is already implemented in all strategies, and can be overridden by the strategy through the `chooseRowToTake` method.

## How to Run the Comparisons?

### Setup Environment

Este projeto foi desenvolvido e testado usando o **Node.js v18.19.0**, **npm v10.2.3** and **npx v10.2.2**, but other versions should work as well.

To run this project you must first clone the repository:

```sh
git clone https://github.com/Lucasrsv1/6-nimmt.git
cd 6-nimmt
```

Then install dependencies using the following command:

```sh
npm install
```

That's it, now you can run [quick strategy tests](#teste-rápido-de-estratégias), and generate the [complete strategy comparison ranking](#geração-do-ranking-completo-de-comparação-das-estratégias).

### Project Structure

This project is divided into three separate parts:

1. The `src/game/` folder, where the game logic is implemented, as well as each of the strategies developed.

2. The `src/index.ts` file, which is a simple program that allows the execution of several games with a certain fixed group of strategies/players, resulting in a quick validation of the effectiveness of the strategies.

3. The `src/generate-full-ranking/` folder, which is a program responsible for generating the complete ranking comparing each strategy with all the others, testing all possible combinations of 2 to 10 players to produce the official result of the comparison between the strategies developed.

### Quick Strategy Test

To quickly test the effectiveness of a strategy, access the `src/index.ts` file and change the array of players passed as a parameter when creating an instance of the `Game` class which represents the game to be played. You can set up the game using any combination of strategies, and can even repeat strategies, as long as it includes 2 to 10 players.

After that, simply run the program and analyze the results of the games played using the following command:

```sh
npx ts-node ./src/index.ts
```

You can also specify how many games will be played using the option `-g` or `--games`, and you can enable logs using the flags `-l` or `--logging`, according to the instructions in the program's help message:

```sh
npx ts-node ./src/index.ts help
```
```log
Usage: index.ts [options] [command]

Commands:
  help     Display help
  version  Display version

Options:
  -g, --games <n>  Amount of games to play (defaults to 100000)
  -h, --help       Output usage information
  -l, --logging    Enable logging (disabled by default)
  -v, --version    Output the version number
```

#### **Usage example:**

```sh
npx ts-node ./src/index.ts
```
```log
Processing...

Victories:
NearestCard-5: 27715 (27.71%)
HighestCard-2: 26408 (26.41%)
RandomCard-6: 15851 (15.85%)
MiddleCard-4: 11460 (11.46%)
AverageCard-1: 9571 (9.57%)
LowestCard-3: 8995 (9.00%)

Points:
NearestCard-5: 1827080 (13.06%)
HighestCard-2: 1894172 (13.54%)
RandomCard-6: 2304382 (16.48%)
MiddleCard-4: 2549587 (18.23%)
AverageCard-1: 2697831 (19.29%)
LowestCard-3: 2711890 (19.39%)

Finished in 9.844 seconds
```

### Generation of the Complete Strategy Comparison Ranking

To generate the complete ranking comparing all game possibilities for all strategies, simply execute the following command:

```sh
npx ts-node ./src/generate-full-ranking/index.ts
```

You can also specify how many games will be played for each possibility using the option `-g` or `--games`, and you can define the number of child processes that will be used to compute the results through the option `-w` or `--workers`. Additionally, you can enable logs for each match using the flags `-l` or `--logging`, and activate the printing of all possible strategy combinations using the flags `-p` or `--log-possibilities`, as instructed in the program's help message:

```sh
npx ts-node ./src/generate-full-ranking/index.ts help
```
```log
Usage: index.ts [options] [command]

Commands:
  help     Display help
  version  Display version

Options:
  -g, --games <n>          Amount of games to play for each possible combination of strategies (defaults to 200)
  -h, --help               Output usage information
  -p, --log-possibilities  Logs all possible strategy combinations to be played (disabled by default)
  -l, --logging            Enable logging for the games (disabled by default)
  -v, --version            Output the version number
  -w, --workers <n>        Amount of workers (child processes) to spawn (defaults to the number of CPUs)
```

#### **Usage example:**

```sh
npx ts-node ./src/generate-full-ranking/index.ts
```
```log
[2024-06-02 19:12:43.791] [LOG] Starting...
[2024-06-02 19:12:43.795] [LOG] Spawning worker 0
...
[2024-06-02 19:12:44.044] [LOG] Spawning worker 19
[2024-06-02 19:12:51.782] [LOG] [WORKER ID: 9, PID: 26884] Worker started.
...
[2024-06-02 19:12:55.397] [LOG] [WORKER ID: 15, PID: 14684] Worker started.
[2024-06-02 19:12:56.370] [LOG] Processing...
[2024-06-02 19:12:56.404] [LOG] Total number of possibilities: 6596
[2024-06-02 19:13:26.711] [LOG] Worker 1 finished
...
[2024-06-02 19:13:31.994] [LOG] Worker 19 finished
[2024-06-02 19:13:31.995] [LOG] Victories:
[2024-06-02 19:13:31.995] [LOG] HighestCard: 282572 (15.02%)
[2024-06-02 19:13:31.996] [LOG] NearestCard: 269002 (14.30%)
[2024-06-02 19:13:31.996] [LOG] MiddleCard: 210390 (11.19%)
[2024-06-02 19:13:31.997] [LOG] AverageCard: 191952 (10.20%)
[2024-06-02 19:13:31.997] [LOG] RandomCard: 185898 (9.88%)
[2024-06-02 19:13:31.997] [LOG] LowestCard: 179386 (9.54%)
[2024-06-02 19:13:31.997] [LOG] Points:
[2024-06-02 19:13:31.998] [LOG] HighestCard: 29043722 (15.08%)
[2024-06-02 19:13:31.998] [LOG] NearestCard: 29132884 (15.13%)
[2024-06-02 19:13:31.999] [LOG] MiddleCard: 32923479 (17.10%)
[2024-06-02 19:13:31.999] [LOG] RandomCard: 33257322 (17.27%)
[2024-06-02 19:13:31.999] [LOG] AverageCard: 33551238 (17.43%)
[2024-06-02 19:13:32.000] [LOG] LowestCard: 34632214 (17.99%)
[2024-06-02 19:13:32.000] [LOG] Total number of games played: 1319200
[2024-06-02 19:13:32.001] [LOG] Finished in 48.212 seconds
```

### Building to Use Node.js Directly

If you prefer, you can build the project to run directly with Node.js using the command:

```sh
npm run build
```

After that, quick tests can be run using the command:

```sh
node ./dist/index.js
```

And the complete ranking can be generated using the command:

```sh
node ./dist/generate-full-ranking/index.js
```

## Strategy Comparison Results

### Ranking by Victories

| # | Strategy    | Victories | Percentage |
|---|-------------|-----------|------------|
| 1 | HighestCard | 282.851   | 15.04%     |
| 2 | NearestCard | 269.508   | 14.33%     |
| 3 | MiddleCard  | 210.731   | 11.20%     |
| 4 | AverageCard | 191.217   | 10.17%     |
| 5 | RandomCard  | 185.718   | 9.87%      |
| 6 | LowestCard  | 179.175   | 9.53%      |

The best strategy so far is `HighestCard` which has won ~15.04% of all games it has participated in.

### Ranking By Points

| # | Strategy    | Points       | Percentage |
|---|-------------|--------------|------------|
| 1 | HighestCard | 29,039,498   | 15.08%     |
| 2 | NearestCard | 29,140,990   | 15.14%     |
| 3 | MiddleCard  | 32,908,295   | 17.09%     |
| 4 | RandomCard  | 33,259,775   | 17.27%     |
| 5 | AverageCard | 33,568,385   | 17.43%     |
| 6 | LowestCard  | 34,619,615   | 17.98%     |

The best strategy so far is `HighestCard` which received only ~15.08% of the total points that were acquired by all strategies together.

To generate the rankings, a total of **1,319,200** games were played and the processing time was **46.358** seconds.

## How to Add a New Strategy?

To create a new strategy, follow these steps:

1. Create a new TypeScript file in the `src/game/strategies/` folder and export a new class with the name of your new strategy. This class must inherit the class `Player`.

2. Implement the method `chooseCardToPlay`, and assign the name of your strategy to the property `strategyName`.

3. If you prefer to use a different logic for choosing which row to take when the player plays a card lower than the top card of all rows, thus being forced to take a row, you can override the `chooseRowToTake` method.

4. If your strategy requires performing some processing when the player receives new cards, override the `onCardsAdded` method.

5. Perform [quick tests](#teste-rápido-de-estratégias) with your new strategy using the `src/index.ts` file to check whether it looks promising.

6. Add your strategy to the `strategies` array in the `src/game/strategies/index.ts` file so that it can be used to generate the complete strategy ranking.

7. Finally, [generate the complete strategy comparison ranking](#geração-do-ranking-completo-de-comparação-das-estratégias) through the `src/generate-full-ranking/index.ts` file to validate whether your strategy was successful or not.

**Note:** for methods `chooseCardToPlay`, `chooseRowToTake` and `onCardsAdded` you can return a `Promise` if you need to perform some asynchronous processing, but be careful to return a promise only if it is strictly necessary, as returning a promise means that `await` must be executed during the game and this will slow down processing. Execution is slower even if an already resolved promise is returned. Execution will also be slower if the method is implemented using `async` even if it has no `await` in its logic.

### Template for New Strategies

To make implementing your new strategy easier, use the code below as a template:

```TypeScript
import { GameRow } from "../models/game-row";
import { Player } from "../models/player";

// Name this class after the name of your strategy.
export class NewStrategy extends Player {
	// Attribute the name of your strategy to this property.
	protected strategyName: string = "NewStrategy";

	/**
	 * Callback that is called when cards are added to the player's hand.
	 *
	 * Your strategy may override this method in order to perform additional logic.
	 * If you don't need this, you can remove this method.
	 * @override
	 */
	protected onCardsAdded (): void | Promise<void> {
		// Perform additional logic when cards are added to the player's hand.
	}

	/**
	 * Strategy that chooses a row to take when the player is forced to take a row.
	 *
	 * Describe here how your strategy chooses a row to take.
	 * If you would rather keep the default logic, you can remove this method.
	 *
	 * @param gameRows Current state of the game rows.
	 * @returns Index of the game row that the player chooses to take.
	 * @override
	 */
	protected chooseRowToTake (gameRows: GameRow[]): number | Promise<number> {
		// Choose a row and return its index.
	}

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * Describe here how your strategy chooses a card to play.
	 *
	 * @param gameRows Current state of the game rows.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameRows: GameRow[]): number | Promise<number> {
		// Choose a card and return its index.
		console.log("Available cards:", this.cards);
	}
}
```

### Submitting New Strategies

If you manage to develop a strategy that ranks higher than the `HighestCard` strategy in the full strategy comparison ranking, please open a pull-request so we can add your successful strategy to the project!

**Note:** your strategy does not need to be significantly better than the others, it just needs to be consistently ranked above the `HighestCard` strategy.
