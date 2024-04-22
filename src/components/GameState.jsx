import { useState, useEffect } from "react";
import MyRobot from "./robot-dude.svg";
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const GameState = ({gameState = "start", startGame, winningHand = null, winner = null, numOfHands = null}) => {
  const [visibility, setVisibility] = useState(true)

  useEffect(() => {
    if (gameState === "over") {
      setVisibility(true); // Show the modal when game state is "over"
    }
  }, [gameState]);

  const handleClick = () => {
      setVisibility(false)
      startGame(true)
  }
  return (
    <>
      {visibility ? 
        <div className="absolute text-white whitespace-nowrap z-[19] w-full h-screen top-0 right-0 flex justify-center items-center bg-black/70">
          {gameState === "over" ? 
            <div className="w-full flex-col flex modal-bg items-center justify-start max-h-[80%] h-full md:w-[1200px] md:h-[700px] md:rounded-xl">
              <h1 className="text-4xl py-[30px] font-bold text-center">Game Over, Wanna Play Again?</h1>
              <div className="text-xl flex justify-center items-center font-semibold hover:text-white duration-300 ease-in-out transition-all">
                <button className="px-2 py-1 hover:scale-[105%] hover:drop-shadow-[0_0_0.55rem_#f21343] duration-300 ease-in-out transition-all bottom-buttons rounded-md text-3xl" onClick={() => handleClick()}>Play Again!</button>
              </div>
              <div className="flex justify-around md:flex-row flex-col items-center w-full h-full mt-[30px]">
                <div className="w-full flex flex-col justify-start items-center h-full">
                  
                  <div className="flex items-center text-[28px] font-bold">
                    <h1 className="text-[30px] mt-1">{winner === "win" ? <Icon icon="mdi:crown" /> : <Icon icon="mage:robot-fill" />}</h1>
                    <h1>&nbsp;Winning Hand:</h1>
                  </div>
                  <div className="w-[90%] h-full my-[20px] bg-red-500">

                  </div>
                </div>
                <div className="w-full flex flex-col justify-start items-center h-full">
                  
                  <div className="flex items-center text-[28px] font-bold">
                    <h1>Game Information:</h1>
                  </div>
                  <div className="w-full h-full my-[20px] flex flex-col gap-4">
                    <div className="flex items-center text-[23px]">
                      <h1 className="font-bold">Game Winner:&nbsp;</h1>
                      <h1>The Bluff Buddy (</h1>
                      <h1 className="text-[30px] mt-1">{winner === "win" ? <Icon icon="mdi:crown" /> : <Icon icon="mage:robot-fill" />}</h1>
                      <h1>)</h1>
                    </div>
                    <div className="flex items-center text-[23px]">
                      <h1 className="text-[23px] font-bold">Total Hands:&nbsp;</h1>
                      <h1>{numOfHands}</h1>
                    </div>
                    <div className="flex items-center mt-[40px] text-[23px]">
                      <h1 className="text-[23px]">More details in the&nbsp;</h1>
                      <Link className="underline" to="/history">History Page!</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div> :
            <div className="w-full flex-col flex modal-bg items-center justify-center max-h-[50%] h-full md:w-[800px] md:h-[600px] md:rounded-xl">
              <img className="w-[200px]" src={MyRobot} />
              <h1 className="text-4xl pb-[30px] font-bold text-center">Ready to Play?</h1>
              <div className="text-xl flex justify-center items-center font-semibold hover:text-white duration-300 ease-in-out transition-all">
                <button className="px-2 py-1 hover:scale-[105%] hover:drop-shadow-[0_0_0.55rem_#f21343] duration-300 ease-in-out transition-all bottom-buttons rounded-md text-3xl" onClick={() => handleClick()}>Start Game!</button>
              </div>
            </div>}
        </div> 
        :
        ''}
    </>
  )
}

export default GameState