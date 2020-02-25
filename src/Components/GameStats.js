import React, {useState, useEffect} from 'react'

function GameStats({appMode, reset, result, setResult}) {

    const [scoreData, setScoreData] = useState({
        1: 0,
        2: 0
    });


    useEffect(() => {
        if(result === 1) {
            setScoreData(data => ({...data, 1: data[1] + 1}));
        } else if (result === 2) {
            setScoreData(data => ({...data, 2: data[2] + 1}));
        }

        if(result === 1 || result === 2) setResult(0);
    }, [result, setResult]);


    return (
        <>
            <button className="hard-reset" onClick={() => reset(true)}>Reset All</button>
            <p className="score-1">
            <span className="points">{scoreData[1]}</span>
            <span className="name">Player 1</span>
            </p>
            <i className="points-divider">|</i>
            <p className="score-2">
            <span className="points">{scoreData[2]}</span>
            <span className="name">{appMode === 1 ? 'Computer' : 'Player 2'}</span>
            </p>
        </>
    )
}

export default GameStats;
