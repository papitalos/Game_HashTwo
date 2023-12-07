// Selecione todos os sub-games
const subGames = document.querySelectorAll(".sub-game");
const subCells = document.querySelectorAll(".sub-cell");
const Cells = document.querySelectorAll(".cell");
const $gameBoard = document.querySelector(".game-board");
const $winmsg = document.querySelector(".win-msg")

let playerTurn = "x";
let nextBoard = null;
let tempoParaRefresh = 2000;

function checkVictory(subGame) {

    // Obter todas as células desse subtabuleiro
    const subCell = subGame.querySelectorAll('.sub-cell');
    // Condições de vitória: 3 linhas, 3 colunas, 2 diagonais
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Colunas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Linhas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];

    // Verifique cada condição de vitória
    winConditions.forEach((condition) => {
        const [a, b, c] = condition;

        // Jogos Menores
        if (
            subCell[a].getAttribute('data-state') &&
            subCell[a].getAttribute('data-state') == subCell[b].getAttribute('data-state') &&
            subCell[a].getAttribute('data-state') == subCell[c].getAttribute('data-state') &&
            subCell[a].getAttribute('data-state') != "empty" && subGame.getAttribute('sub-game-state') != "closed"
        ) {

            // Se algum jogador venceu, marque o subtabuleiro
            const winner = subCell[a].getAttribute('data-state');
            let parent = subGame.parentElement;
            parent.setAttribute('data-winner', winner);
            subGame.setAttribute('sub-game-state', "closed")

        }




    });
}

function checkChampion() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Colunas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Linhas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];
    winConditions.forEach((condition) => {
        const [a, b, c] = condition;

        console.log(Cells[a], Cells[b], Cells[c])
        // Jogo principal
        if (Cells[a].getAttribute('data-winner') &&
            Cells[a].getAttribute('data-winner') == Cells[b].getAttribute('data-winner') &&
            Cells[a].getAttribute('data-winner') == Cells[c].getAttribute('data-winner') &&
            Cells[a].getAttribute('data-winner') != "empty" && $gameBoard.getAttribute('data-big-win') == "empty") {

            // Se algum jogador venceu, marque o tabuleiro principal
            const bigwinner = Cells[a].getAttribute('data-winner');
            console.log("passei")
            console.log(bigwinner)
            $gameBoard.setAttribute('data-big-win', bigwinner);
            if ($gameBoard.getAttribute('data-big-win') == bigwinner) {

                $winmsg.setAttribute('champion', bigwinner)

                setTimeout(function () {
                    // Recarrega a página
                    window.location.reload();
                }, tempoParaRefresh);
            }

        }

    })
}

function play(subGame) {
    const cellsInThisGame = subGame.querySelectorAll('.sub-cell');
    // Adicione um ouvinte de clique a cada célula menor
    cellsInThisGame.forEach((subCell) => {
        subCell.addEventListener('click', () => {
            // Verifique se a célula está clicada (expandida)
            if (subCell.classList.contains('clicked')) {
                // Verifique se a célula está vazia (sem X ou O)
                if (!subCell.classList.contains('x') && !subCell.classList.contains('o')) {
                    const currentState = subCell.getAttribute('data-state');
                    nextBoard = subCell.getAttribute('subdata-cell')
                    // Alternar entre X e O
                    if (currentState == "empty" && playerTurn == "x") {
                        subCell.setAttribute('data-state', 'x');
                        subCell.classList.add('x');
                        playerTurn = "o"
                    } else if (currentState == "empty" && playerTurn == "o") {
                        subCell.setAttribute('data-state', 'o');
                        subCell.classList.add('o');
                        playerTurn = "x"
                    }


                    // Verificar vitoria
                    checkVictory(subGame)
                    checkChampion()
                    // Ir pro proximo jogo
                    if (nextBoard != null) {
                        let nextSubGame = null;
                        subGames.forEach((subGame) => {
                            if (subGame.getAttribute('subdata-game') == nextBoard) {
                                nextSubGame = subGame
                            }
                        });

                        expandGame(nextSubGame)
                        play(nextSubGame)
                    }
                }
            }
        });
    });
}

function expandGame(subGame) {
    // Remova a classe 'clicked' de todos os sub-games
    subGames.forEach((game) => game.classList.remove('clicked'));
    // Adicione a classe 'clicked' ao sub-game clicado
    subGame.classList.add('clicked');

    // Remova a classe 'clicked' de todas as células menores
    subCells.forEach((subCell) => subCell.classList.remove('clicked'));
    // Adicione a classe 'clicked' apenas às células do sub-game clicado
    const cellsInClickedGame = subGame.querySelectorAll('.sub-cell');
    cellsInClickedGame.forEach((subCell) => subCell.classList.add('clicked'));

}

// Adicione um ouvinte a cada subgame
subGames.forEach((subGame) => {
    subGame.addEventListener('click', () => {
        if (nextBoard == null) {
            expandGame(subGame)
            play(subGame)
        }

    });
})







