# Comparação de Estratégias para Jogar Pega em 6!

![6 Nimmt!](logo.jpg "6 Nimmt!")

<p align="center">
	<a href="https://github.com/Lucasrsv1/6-nimmt/blob/master/README.md">English</a> |
	<span>Português Brasileiro</span>
</p>

Este projeto tem como objetivo realizar uma comparação entre possíveis estratégias para vencer o jogo <a href="https://www.google.com/search?q=6+nimmt%21" target="_blank">Pega em 6!</a> a fim de auxiliar na busca por uma estratégia que seja significativamente melhor que as outras.

*Observação: tal estratégia que seja significativamente melhor ainda não foi encontrada... [ajude-nos a encontrá-la!](#como-adicionar-uma-nova-estratégia)*

<a href="https://world-of-board-games.com.sg/docs/6-Nimmt.pdf" target="_blank">
	O manual do jogo está disponível neste link.
</a>

## Estratégias

As estratégias básicas implementadas e comparadas são:

- **AverageCard:** o jogador escolhe a carta que mais se aproxima da média das cartas da sua mão.

- **HighestCard:** o jogador escolhe a carta com o número mais alto.

- **LowestCard:** o jogador escolhe a carta com o número mais baixo.

- **MiddleCard:** o jogador escolhe a carta que está no meio da sua mão.

- **NearestCard:** o jogador escolhe a carta que está mais próxima da carta do topo de uma das linhas, considerando que tal linha tem menos de 5 cartas e que a carta do jogador é maior que a carta do topo da linha.

- **RandomCard:** o jogador escolhe uma carta aleatória de sua mão.

Atualmente as estratégias mais elaboradas implementadas e comparadas são:

- **NearestAvailableCard:** o jogador escolhe a carta que está mais próxima da carta do topo da linha onde a carta tem maior probabilidade de encaixar, considerando que tal linha tem menos de 5 cartas e que cada espaço vazio nela pesa a favor da carta correspondente.

### Escolha da Linha para Pegar

Quando o jogador é forçado a escolher uma linha para pegar todas as suas cartas como pontos, uma estratégia específica pode ser executada para fazer essa escolha.

Para todas as estratégias simples desenvolvidas (`AverageCard`, `HighestCard`, `LowestCard`, `MiddleCard`, `NearestCard`, `RandomCard`) está sendo aplicada uma lógica simples na qual o jogador escolhe a linha com a menor quantidade de pontos e, em caso de empate, é escolhida a linha com mais cartas.

Essa lógica padrão da escolha da linha é implementada na classe `Player` e consequentemente já vem implementada em todas as estratégias, podendo ser sobrescrita pela estratégia por meio do método `chooseRowToTake`.

## Como Executar as Comparações?

### Preparação do Ambiente

Este projeto foi desenvolvido e testado usando o **Node.js v18.19.0**, o **npm v10.2.3** e o **npx v10.2.2**, mas outras versões também devem funcionar.

Para executar este projeto você deverá primeiro clonar o repositório:

```sh
git clone https://github.com/Lucasrsv1/6-nimmt.git
cd 6-nimmt
```

Em seguida realize a instalação de dependências usando o seguinte comando:

```sh
npm install
```

Pronto, agora você já pode executar [testes rápidos de estratégias](#teste-rápido-de-estratégias), e gerar o [ranking completo de comparação das estratégias](#geração-do-ranking-completo-de-comparação-das-estratégias).

### Estrutura do Projeto

Este projeto é dividido em três partes distintas:

1. A pasta `src/game/`, onde está implementada a lógica do jogo Pega em 6!, bem como cada uma das estratégias desenvolvidas.

2. O arquivo `src/index.ts`, que é um programa simples que permite a execução de vários jogos com um determinado grupo fixo de estratégias/jogadores, resultando em uma rápida validação da efetividade das estratégias.

3. A pasta `src/generate-full-ranking/`, que é um programa responsável por gerar o ranking completo comparando cada estratégia com todas as outras, testando todas as combinações possíveis de 2 a 10 jogadores para produzir o resultado oficial da comparação entre as estratégias desenvolvidas.

### Teste Rápido de Estratégias

Para testar rapidamente a efetividade de uma estratégia, acesse o arquivo `src/index.ts` e altere o vetor de jogadores passado como parâmetro na criação da instância da classe `Game` que representa o jogo a ser jogado. Você pode configurar o jogo usando qualquer combinação de estratégias, podendo inclusive repetir estratégias, desde que inclua de 2 a 10 jogadores.

Feito isso, basta executar o programa e analisar o resultado das partidas jogadas usando o seguinte comando:

```sh
npx ts-node ./src/index.ts
```

Você também pode especificar quantas partidas serão jogadas por meio da opção `-g` ou `--games`, e pode ativar a impressão de logs usando as flags `-l` ou `--logging`, conforme as instruções da mensagem de ajuda do programa:

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

#### **Exemplo de uso:**

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

### Geração do Ranking Completo de Comparação das Estratégias

Para gerar o ranking completo comparando todas as possibilidades de jogos para todas as estratégias, basta executar o seguinte comando:

```sh
npx ts-node ./src/generate-full-ranking/index.ts
```

Você também pode especificar quantas partidas serão jogadas para cada possibilidade por meio da opção `-g` ou `--games`, e pode definir o número de processos filhos que serão usados para computar os resultados por meio da opção `-w` ou `--workers`. Além disso, você pode ativar a impressão de logs de cada partida usando as flags `-l` ou `--logging`, e ativar a impressão de todas as combinações de estratégias possíveis por meio das flags `-p` ou `--log-possibilities`, conforme as instruções da mensagem de ajuda do programa:

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

#### **Exemplo de uso:**

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
[2024-06-02 19:13:31.995] [LOG] HighestCard: 282572 (32.48%)
[2024-06-02 19:13:31.996] [LOG] NearestCard: 269649 (30.99%)
[2024-06-02 19:13:31.996] [LOG] MiddleCard: 211314 (24.29%)
[2024-06-02 19:13:31.997] [LOG] AverageCard: 190678 (21.92%)
[2024-06-02 19:13:31.997] [LOG] RandomCard: 185946 (21.37%)
[2024-06-02 19:13:31.997] [LOG] LowestCard: 179041 (20.58%)
[2024-06-02 19:13:31.997] [LOG] Points:
[2024-06-02 19:13:31.998] [LOG] HighestCard: 29048136 (15.09%)
[2024-06-02 19:13:31.998] [LOG] NearestCard: 29133801 (15.13%)
[2024-06-02 19:13:31.999] [LOG] MiddleCard: 32905904 (17.09%)
[2024-06-02 19:13:31.999] [LOG] RandomCard: 33247914 (17.27%)
[2024-06-02 19:13:31.999] [LOG] AverageCard: 33583832 (17.44%)
[2024-06-02 19:13:32.000] [LOG] LowestCard: 34618672 (17.98%)
[2024-06-02 19:13:32.000] [LOG] Number of games played by each strategy: 870000
[2024-06-02 19:13:32.000] [LOG] Total number of games played: 1319200
[2024-06-02 19:13:32.001] [LOG] Finished in 48.212 seconds
```

### Build para Usar o Node.js Diretamente

Se preferir, você pode gerar o build do projeto para executá-lo diretamente com o Node.js por meio do comando:

```sh
npm run build
```

Feito isso, testes rápidos poderão ser executados através do comando:

```sh
node ./dist/index.js
```

E o ranking completo poderá ser gerado através do comando:

```sh
node ./dist/generate-full-ranking/index.js
```

## Resultados da Comparação das Estratégias

### Ranking Por Vitórias

| # | Estratégia           | Nº de Vitórias | Percentual |
|---|----------------------|----------------|------------|
| 1 | NearestAvailableCard | 765.208        | 36,71%     |
| 2 | HighestCard          | 600.175        | 28,79%     |
| 3 | NearestCard          | 533.941        | 25,62%     |
| 4 | MiddleCard           | 414.645        | 19,89%     |
| 5 | AverageCard          | 375.540        | 18,02%     |
| 6 | RandomCard           | 362.171        | 17,38%     |
| 7 | LowestCard           | 351.920        | 16,88%     |

A melhor estratégia até o momento é a `NearestAvailableCard` que ganhou **~36,71%** de todos os jogos em que participou.

### Ranking Por Pontos

| # | Estratégia           | Nº de Pontos | Percentual |
|---|----------------------|--------------|------------|
| 1 | NearestAvailableCard | 57.812.371   | 11,63%     |
| 2 | HighestCard          | 64.905.430   | 13,06%     |
| 3 | NearestCard          | 67.063.286   | 13,49%     |
| 4 | MiddleCard           | 75.354.042   | 15,16%     |
| 5 | RandomCard           | 76.343.272   | 15,36%     |
| 6 | AverageCard          | 76.717.331   | 15,43%     |
| 7 | LowestCard           | 78.912.221   | 15,87%     |

A melhor estratégia até o momento é a `NearestAvailableCard` que recebeu apenas **~11,63%** do total de pontos que foram adquiridos por todas as estratégias em conjunto.

Para a montagem dos rankings foram jogados no total **3.403.600** jogos, sendo que cada estratégia jogou **2.084.400** jogos, e o tempo de processamento foi de **105,692** segundos.

### Jogador Trapaceiro

Foi implementada uma "estratégia" especial chamada `Cheater` que ao ser executada ela toma a decisão de qual carta jogar considerando quais cartas os outros jogadores jogaram, o que configura trapaça. Com isso, essa "estratégia" fornece uma ideia de quantas partidas um jogador quase ideal poderia vencer.

Abaixo está o ranking incluindo o jogador trapaceiro:

| # | Estratégia           | Nº de Vitórias | Vitórias (%) | Nº de Pontos | Pontos (%) |
|---|----------------------|----------------|--------------|--------------|------------|
| 1 | Cheater              | 2.834.927      | 62,14%       |  77.090.229  |  6,61%     |
| 2 | NearestAvailableCard | 1.198.607      | 26,27%       | 127.273.586  | 10,91%     |
| 3 | HighestCard          |   937.269      | 20,55%       | 141.387.859  | 12,12%     |
| 4 | NearestCard          |   805.255      | 17,65%       | 147.019.688  | 12,60%     |
| 5 | MiddleCard           |   606.024      | 13,28%       | 166.169.046  | 14,25%     |
| 6 | AverageCard          |   551.570      | 12,09%       | 167.621.955  | 14,37%     |
| 7 | RandomCard           |   526.502      | 11,54%       | 166.896.335  | 14,31%     |
| 8 | LowestCard           |   505.246      | 11,08%       | 172.981.979  | 14,83%     |

Para a montagem desse ranking foram jogados no total **7.965.400** jogos, sendo que cada estratégia jogou **4.561.800** jogos, e o tempo de processamento foi de **702,794** segundos.

## Como Adicionar uma Nova Estratégia?

Para criar uma nova estratégia, siga o passo a passo:

1. Crie um novo arquivo TypeScript na pasta `src/game/strategies/` e exporte uma nova classe com o nome da sua nova estratégia. Essa classe deverá herdar a classe `Player`.

2. Realize a implementação do método `chooseCardToPlay`, e atribua o nome da sua estratégia à propriedade `strategyName`.

3. Se quiser especificar uma lógica diferente da padrão para escolher qual linha pegar quando o jogador jogar uma carta menor que a carta do topo de todas as linhas, sendo então forçado a escolher uma linha, você pode sobrescrever o método `chooseRowToTake`.

4. Se para a sua estratégia for necessário realizar algum processamento quando o jogador receber novas cartas, sobrescreva o método `onCardsAdded`.

5. Realize [testes rápidos](#teste-rápido-de-estratégias) com a sua nova estratégia por meio do arquivo `src/index.ts` para verificar se ela parece promissora.

6. Adicione sua estratégia ao vetor `strategies` do arquivo `src/game/strategies/index.ts` para que ela seja usada na geração do ranking completo de estratégias.

7. Por fim, execute a [geração do ranking completo de comparação das estratégias](#geração-do-ranking-completo-de-comparação-das-estratégias) através do arquivo `src/generate-full-ranking/index.ts` para validar se sua estratégia foi bem sucedida ou não.

**Observação:** para os métodos `chooseCardToPlay`, `chooseRowToTake` e `onCardsAdded` você pode retornar uma promessa (`Promise`) caso necessite realizar algum processamento assíncrono, mas tome o cuidado de retornar um promessa somente se for restritamente necessário, pois o retorno de uma promessa significa que `await` deverá ser executado durante o jogo e isso tornará o processamento mais lento. A execução é mais lenta mesmo se for retornada uma promessa já resolvida. A execução também será mais lenta se o método for implementado usando `async` mesmo que não tenha nenhum `await` em sua lógica.

**Dica:** você pode comentar as estratégias mais elaboradas no arquivo `src/game/strategies/index.ts` e manter apenas as básicas para fazer uma validação mais rápida do ranking e ter uma previsão de como sua estratégia se comporta em relação a estratégia `HighestCard`, que é a melhor estratégia básica.

### Template Padrão de Novas Estratégias

Para facilitar a implementação da sua nova estratégia, utilize o código abaixo como modelo:

```TypeScript
import { GameRow } from "../models/game-row";
import { Player } from "../models/player";

// Nomeie esta classe com o nome da sua estratégia.
export class NewStrategy extends Player {
	// Atribua o nome da sua estratégia a esta propriedade.
	public readonly strategyName: string = "NewStrategy";

	/**
	 * Callback that is called when cards are added to the player's hand.
	 *
	 * Sua estratégia pode substituir esse método para executar lógica adicional.
	 * ? Se isso não for necessário, você pode remover este método.
	 * @override
	 */
	protected onCardsAdded (): void | Promise<void> {
		// Execute alguma lógica adicional quando cartas forem adicionadas à mão do jogador.
	}

	/**
	 * Strategy that chooses a row to take when the player is forced to take a row.
	 *
	 * TODO: Descreva aqui como sua estratégia escolhe uma linha para pegar.
	 * ? Se preferir manter a lógica padrão, você pode remover este método.
	 *
	 * @param gameRows Current state of the game rows.
	 * @returns Index of the game row that the player chooses to take.
	 * @override
	 */
	protected chooseRowToTake (gameRows: GameRow[]): number | Promise<number> {
		// Escolha uma linha e retorne seu índice.
	}

	/**
	 * Strategy that chooses a card to play from the player's hand.
	 *
	 * TODO: Descreva aqui como sua estratégia escolhe uma carta para jogar.
	 *
	 * @param gameRows Current state of the game rows.
	 * @returns Index of the card that the player chooses to play.
	 */
	protected chooseCardToPlay (gameRows: GameRow[]): number | Promise<number> {
		// Escolha uma carta e retorne seu índice.
		console.log("Cartas disponíveis:", this.cards);
	}
}
```

### Submetendo Novas Estratégias

Se você conseguir desenvolver alguma estratégia que seja classificada acima da estratégia `HighestCard` no ranking completo de comparação das estratégias, por favor abra um pull-request para adicionarmos sua estratégia bem sucedida ao projeto!

**Observação:** sua estratégia não precisa ser significativamente melhor que as outras, basta ela ser consistentemente classificada acima da estratégia `HighestCard`.
