import React, {useState, useEffect} from 'react';
import './App.css';
import GameStats from './Components/GameStats';
import PlayerCards from './Components/PlayerCards';
import GameApp from './Components/GameApp';

function App() {

    const [gameStatus, setGameStatus] = useState(false);
    const [appMode, setAppMode] = useState(0);
    const [result, setResult] = useState(0);
    const [turn, setTurn] = useState(0);
    const [playersData, setPlayersData] = useState({
        1: '',
        2: ''
    });

    const [reset, setReset] = useState(false);
    useEffect(() => {
        if(reset) {
            setGameStatus(false);
            setReset(false);
            setResult(0);
            setTurn(0);
        }
    }, [reset]);

    return (
        <div className="app">
            <div className="outer-container">
                {gameStatus && 
                    <GameStats 
                        appMode={appMode}
                        reset={setReset}
                        result={result}
                        setResult={setResult}
                    />
                }
                <PlayerCards 
                    appMode={appMode}
                    currentTurn={turn}
                    playersSymbols={playersData}
                />
                <div className="board-container">
                    {!reset && <GameApp
                        gameStatus={gameStatus}
                        gameMode={appMode}
                        playerTurn={turn}
                        playersData={playersData}
                        setPlayerData={setPlayersData}
                        setGameMode={setAppMode}
                        setGameStatus={setGameStatus}
                        setTurn={setTurn}
                        setResult={setResult}
                    /> }
                </div>
            </div>
        </div>
    )
}


export default App;
