import React, {useRef, useEffect, useState} from 'react'

export default function GameApp({gameStatus, gameMode, playerTurn, playersData, setPlayerData, setGameMode, setGameStatus, setTurn, setResult}) {

    const [gridData, setGridData] = useState(new Array(9).fill(''));
    const [winner, setWinner] = useState(0);

    const gameChoice = useRef(null);
    const gameStarter = useRef(null);
    const gameBoard = useRef(null);
    const canvas = useRef(null);
    const tiedMessage = useRef(null);
    const winMessage = useRef(null);
    const loseMessage = useRef(null);

    const refIntervals = useRef([]);
    const refTimeouts = useRef([]);

    const refPlayersData = useRef();
    const refPlayerTurn = useRef();
    const refPlayerPlayable = useRef(false);

    const refGameMode = useRef();
    const refGameState = useRef();
    const refGridData = useRef();
    const refSetResult = useRef(setResult);
    const refSetTurn = useRef(setTurn);

    const allEqual = arr => {
        let xCount = 0, oCount = 0;
        arr.forEach(value => {
            if(value === 'X') xCount++;
            else if(value === 'O') oCount++;
        });

        if(xCount === 3 || oCount === 3) return true;
        return false;
    };

    const fadeIn = (ele, time = 5) => {
        const id = setInterval(fIn, time);
        refIntervals.current.push(id);
        let opacity = 0;
        ele.style.display = 'block';
        function fIn() {
            if(opacity < 1) {
                opacity += 0.05;
                ele.style.opacity = opacity;
            } else {
                clearInterval(id);
            }
        }
    };

    const fadeOut = (ele, time = 5) => {
        const id = setInterval(fOut, time);
        refIntervals.current.push(id);
        let opacity = 1;
        function fOut() {
            if(opacity > 0) {
                opacity -= 0.05;
                ele.style.opacity = opacity;
            } else {
                ele.style.display = 'none';
                clearInterval(id);
            }
        }
    };

    const modeHandler = mode => {
        setGameMode(mode);
        fadeOut(gameChoice.current);
        fadeIn(gameStarter.current);
    };

    const selectHandler = sym => {
        setPlayerData({
            1: sym,
            2: (sym === 'X') ? 'O' : 'X'
        });

        fadeOut(gameStarter.current);
        fadeIn(gameBoard.current);
        setGameStatus(true);

        const id = setTimeout(() => {
            setTurn(Math.floor(Math.random() * 2) + 1);
            refPlayerPlayable.current = true;
        }, 1000);

        refTimeouts.current.push(id);
    };

    const tileClick = key => {
        if(gridData[key] !== '' || (playerTurn !== 1 && playerTurn !== 2) || (gameMode === 1 && playerTurn === 2)) return;
        const copyArr = [...gridData];
        copyArr[key] = playerTurn === 1 ? playersData[1] : playersData[2];
        setGridData(copyArr);
    };






    useEffect(() => {
        if(refPlayersData.current !== playersData){
            refPlayersData.current = playersData;
        }

        if(refPlayerTurn.current !== playerTurn) {
            refPlayerTurn.current = playerTurn;
        }

        if(refGameState.current !== gameStatus) {
            refGameState.current = gameStatus;
        }

        if(refGameMode.current !== gameMode) {
            refGameMode.current = gameMode;
        }

        if(refGridData.current !== gridData) {
            refGridData.current = gridData;
        }

    }, [playersData, playerTurn, gameStatus, gameMode, gridData]);


    useEffect(() => {
        const result = (() => {
            const sequences = [
                [0,1,2], [3,4,5], [6,7,8],
                [0,3,6], [1,4,7], [2,5,8],
                [0,4,8], [2,4,6]
            ];

            let winner = 0;

            sequences.forEach(arr => {
                const a = arr[0], b = arr[1], c = arr[2];

                if(gridData[a] !== '' && allEqual([
                    gridData[a],
                    gridData[b],
                    gridData[c]
                ])) {
                    winner = gridData[a] === refPlayersData.current[1] ? 1 : 2;

                    refSetResult.current(winner);

                    arr.forEach(index => {
                        document.querySelector(`#tile${index} i`).classList.add('win');
                    });
                }
            });

            return winner;
        })();

        function endGameProcess(message) {
            refIntervals.current = [];
            refTimeouts.current = [];
            const timeout1 = setTimeout(() => fadeIn(message.current, 50), 1000);

            const timeout2 = setTimeout(() => {
                fadeOut(message.current, 50);
                Array.from(document.querySelectorAll('.win')).forEach(ele => ele.classList.remove('win'));
                setGridData(new Array(9).fill(''));
            }, 5000);

            const timeout3 = setTimeout(() => {
                refSetTurn.current(Math.floor(Math.random() * 2) + 1);
                refPlayerPlayable.current = true;
            }, 7000);

            refTimeouts.current.push(timeout1, timeout2, timeout3);
        }

        if(refGameState && refPlayerPlayable.current) {
            if(result === 0) {
                if(gridData.every(data => data !== '')) {
                    setWinner(result);
                    refSetTurn.current(0);
                    refPlayerPlayable.current = false;
                    endGameProcess(tiedMessage);
                } else {
                    const turn = refPlayerTurn.current === 1 ? 2 : 1;
                    refSetTurn.current(turn);
                }
            } else if (result !== 0) {
                setWinner(result);
                refSetTurn.current(0);
                refPlayerPlayable.current = false;

                if(refGameMode.current === 2 || result === 1) endGameProcess(winMessage);
                else {
                    endGameProcess(loseMessage);
                }
            }
        }
    }, [gridData]);


    useEffect(() => {
        if(refGameMode.current === 1 && playerTurn === 2 && refPlayerPlayable.current) {
            const data = refGridData.current;
            const gridEmpty = data.every(tile => tile === '');
            const isCenterTileAvailable = data[4] === '';
            const corners = [0,2,6,8];
            const directional = [1,3,5,7];

            const sequences = [
                [0,1,2], [3,4,5], [6,7,8],
                [0,3,6], [1,4,7], [2,5,8],
                [0,4,8], [2,4,6]
            ];

            //--- Code Borrowed From codepen.io/ElaMoscicka ---/
            function emptySquares(board) {
                return board.filter(index => typeof index === 'number');
            }

            function checkWin(board, player) {
                let plays = board.reduce((arr, ele, index) => 
                (ele === player) ? arr.concat(index) : arr, []);
                let gameWon = null;

                for(let [index, win] of sequences.entries()) {
                    if(win.every(elem => plays.indexOf(elem) > -1)) {
                        gameWon = {index: index, player: player};
                        break;
                    }
                }
                return gameWon;
            }

            function minimax(newBoard, player) {
                let openSpots = emptySquares(newBoard);

                if(checkWin(newBoard, refPlayersData.current[1])) {
                    return {score: -10};
                } else if (checkWin(newBoard, refPlayersData.current[2])) {
                    return {score: 10};
                } else if (openSpots.length === 0) {
                    return {score: 0};
                }

                let moves = [];

                for(let i = 0; i < openSpots.length; i++) {
                    let move = {};
                    move.index = newBoard[openSpots[i]];
                    newBoard[openSpots[i]] = player;

                    if(player === refPlayersData.current[2]) {
                        let result = minimax(newBoard, refPlayersData.current[1]);
                        move.score = result.score;
                    } else {
                        let result = minimax(newBoard, refPlayersData.current[2]);
                        move.score = result.score;
                    }

                    newBoard[openSpots[i]] = move.index;
                    moves.push(move);
                }

                let bestMove;

                if(player === refPlayersData.current[2]) {
                    let bestScore = -10000;

                    for(let i = 0; i < moves.length; i++) {
                        if(moves[i].score > bestScore) {
                            bestScore = moves[i].score;
                            bestMove = i;
                        }
                    }
                } else {
                    let bestScore = 10000;
                    for(let i = 0; i < moves.length; i++) {
                        if(moves[i].score < bestScore) {
                            bestScore = moves[i].score;
                            bestMove = i;
                        }
                    }
                }
                return moves[bestMove];
            }

            function computerTurn() {
                

                const board = [...Array.from(data.keys()).map(key => (data[key] !== '') ? data[key] : key)];
                const bestSpot = minimax(board, refPlayersData.current[2]);

                return bestSpot.index;
            }
            //------------------------------------------------//


            const checkForDefenseMoves = (function() {
                let emptyTile = null;
                let found = false;
                sequences.forEach(arr => {
                    if(!found) {
                        let player1Counter = 0, computerCounter = 0, emptySlots = 0;
                        arr.forEach(tile => {
                            if( data[tile] === "" ) emptySlots++;
                            else if (data[tile] === refPlayersData.current[1]) player1Counter++;
                            else computerCounter++;
                        });

                        if(player1Counter === 2 && emptySlots === 1 && computerCounter === 0) {
                            emptyTile = arr.filter(num => data[num] === '').shift();
                            found = true;
                        } 
                    }
                });
                return emptyTile;
            })();

            const checkForWinMoves = (function() {
                let emptyTile = null;
                let found = false;
                sequences.forEach(arr => {
                    if(!found) {
                        let player1Counter = 0, computerCounter = 0, emptySlots = 0;
                        arr.forEach(tile => {
                            if( data[tile] === "" ) emptySlots++;
                            else if (data[tile] === refPlayersData.current[1]) player1Counter++;
                            else computerCounter++;
                        });

                        if(player1Counter === 0 && emptySlots === 1 && computerCounter === 2) {
                            emptyTile = arr.filter(num => data[num] === '').shift();
                            found = true;
                        } 
                    }
                });
                return emptyTile;
            })();

            

            let tile = undefined;
            if(checkForWinMoves !== null) {
                tile = checkForWinMoves;
            } else if(checkForDefenseMoves !== null) {
                tile = checkForDefenseMoves;
            } else if(gridEmpty) {
                const firstAvailables = [...corners, 4];
                const randomIndex = Math.floor(Math.random() * 5);
                tile = firstAvailables[randomIndex];
            } else if (isCenterTileAvailable) {
                tile = 4;
            } else if (corners.every(num => data[num] === '')) {
                const randomIndex = Math.floor(Math.random() * 4);
                tile = corners[randomIndex];
            } else if (directional.every(num => data[num] === '') && corners.every(num => data[num] !== refPlayersData.current[1])) {
                const cpuTile = corners.filter(num => data[num] === refPlayersData.current[2]).shift();

                switch(cpuTile) {
                    case 0:
                        tile = 8;
                        break;
                    case 2:
                        tile = 6;
                        break;
                    case 6:
                        tile = 2;
                        break;
                    case 8:
                        tile = 0;
                        break;
                    default:
                        tile = undefined;
                        break;
                }
            } else {
                tile = computerTurn();
            }

            if(tile !== undefined) {
                const id = setTimeout(() => setGridData(gridData => gridData.map((e,index) => (index === tile) ? refPlayersData.current[2] : e)), 800);
                refTimeouts.current.push(id);
            }

        }
    }, [playerTurn]);



    useEffect(() => {
        const c = canvas.current;
        const ctx = c.getContext("2d");
        ctx.moveTo(4,215);
        ctx.lineTo(661, 215);

        ctx.moveTo(4,430);
        ctx.lineTo(661, 430);

        ctx.moveTo(222,0);
        ctx.lineTo(222, 645);

        ctx.moveTo(440,0);
        ctx.lineTo(440, 645);
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 5;
        ctx.stroke();

        return() => {
            refIntervals.current.forEach(interval => clearInterval(interval));
            refIntervals.current = [];

            refTimeouts.current.forEach(timeout => clearTimeout(timeout));
            refTimeouts.current = [];
        }
    }, []);

    return (
        <>
            <div ref={gameChoice} className="game-choice">
                <p>How do you want to play?</p>
                <button className="one-player" onClick={() => modeHandler(1)}>One Player</button>
                <button className="two-player" onClick={() => modeHandler(2)}>Two Player</button>
            </div>
            <div className="game-starter" ref={gameStarter} style={{display: 'none', opacity: '0'}}>
                <p>{gameMode === 1 ? 'Would you like to be X or O?' : 'Player 1 : Would you like X or O?'}</p>
                <button className="choose-x" onClick={() => selectHandler('X')}>X</button>
                <button className="choose-o" onClick={() => selectHandler('O')}>O</button>
                <button className="back-button" onClick={() => {
                        fadeOut(gameStarter.current);
                        fadeIn(gameChoice.current);
                }}><i className="fa fa-arrow-left"></i> Back</button>
            </div>
            <div className="game-board" ref={gameBoard} style={{display: 'none', opacity: '0'}}>
                <div className="draw-message" ref={tiedMessage} style={{display: 'none', opacity: '0'}}>
                    <p style={{left: '80px'}}>It is a draw.</p>
                </div>
                <div className="lose-message" ref={loseMessage} style={{display: 'none', opacity: '0'}}>
                    <p>Uh oh, you lost.</p>
                </div>
                <div className="win-message" ref={winMessage} style={{display: 'none', opacity: '0'}}>
                    <p>
                        {
                            (gameMode === 1 ? 'You Win!' : `Player ${winner} Wins!`)
                        }
                    </p>
                </div>
                <canvas ref={canvas} id="myCanvas" height='660' width='660'/>
                <ul className="boxes">
                    {
                        [0,1,2,3,4,5,6,7,8].map(key => {
                            return (
                                <li id={`tile${key}`} key={key} onClick={() => tileClick(key)}>
                                    <i className="letter">
                                        <span>{gridData[key]}</span>
                                    </i>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        </>
    )
}
