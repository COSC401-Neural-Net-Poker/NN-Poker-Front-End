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
            <div className="w-full flex-col flex modal-bg items-center justify-center max-h-[50%] h-full md:w-[800px] md:h-[600px] md:rounded-xl">
            <img className="w-[200px]" src={MyRobot} />
            <h1 className="text-4xl pb-[30px] font-bold text-center">Game over, want</h1>
            <div className="text-xl flex justify-center items-center font-semibold hover:text-white duration-300 ease-in-out transition-all">
              <button className="px-2 py-1 hover:scale-[105%] hover:drop-shadow-[0_0_0.55rem_#f21343] duration-300 ease-in-out transition-all bottom-buttons rounded-md text-3xl" onClick={() => handleClick()}>Start Game!</button>
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