import React, {useRef, useEffect} from 'react'

function PlayerCards({appMode, currentTurn, playersSymbols}) {

    const playerOneCard = useRef(null);
    const playerTwoCard = useRef(null);

    useEffect(() => {
        playerOneCard.current.style.top = '0px';
        playerTwoCard.current.style.top = '0px';
    }, []);

    useEffect(() => {
        const playerOne = playerOneCard.current.style;
        const playerTwo = playerTwoCard.current.style;

        function slideDown(ele) {
            let value = -45;
            const id = setInterval(down, 5);
            function down() {
                if(value < 0) {
                    value += 1;
                    ele.top = `${value}px`;
                } else {
                    clearInterval(id);
                }
            }
        }

        function slideUp(ele) {
            let value = 0;
            const id = setInterval(up, 5);
            function up() {
                if(value > -45) {
                    value -= 1;
                    ele.top = `${value}px`;
                } else {
                    clearInterval(id);
                }
            }
        }


        if(currentTurn === 1) {
            if(playerTwo.top !== '0px') {
                slideDown(playerTwo);
            }
            slideUp(playerOne);
        } else if (currentTurn === 2) {
            if(playerOne.top !== '0px') {
                slideDown(playerOne);
            }
            slideUp(playerTwo);
        } else {
            if(playerOne.top !== '0px') slideDown(playerOne);
            if(playerTwo.top !== '0px') slideDown(playerTwo);
        }
    }, [currentTurn]);

    return (
        <>
            <div className="player-one-turn" ref={playerOneCard}>
                <p>{appMode === 1 ? 'Your Turn!' : 'Go Player 1!'} {` (${playersSymbols[1]})`}</p>
            </div>
            <div className="player-two-turn" ref={playerTwoCard}>
                <p>{appMode === 1 ? <span style={{fontSize: '1rem'}}>Computer's Turn</span> : 'Go Player 2!'} {` (${playersSymbols[2]})` }</p>
            </div>
        </>
    )
}


export default PlayerCards;
