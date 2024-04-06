import { useState, useEffect } from "react"

const GameState = ({gameState = "start", startGame}) => {
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
          <div className="absolute z-[19] w-full h-screen top-0 right-0 flex justify-center items-center bg-black/70">
          <div className="w-full flex-col flex justify-center items-center max-h-[50%] h-full md:w-[600px] md:h-[500px] bg-white md:rounded-xl">
              <h1 className="text-3xl font-bold mb-[20px] text-center">{gameState === "over" ? 'Game Over, Wanna Play Again?' : 'Ready To Play?'}</h1>
              <div className="text-xl font-semibold hover:text-white duration-300 ease-in-out transition-all">
                  {gameState === "over" ?
                  <button className="px-2 py-1 bg-[#FF8200] rounded-md" onClick={() => handleClick()}>Play Again!</button> : 
                  <button className="px-2 py-1 bg-[#FF8200] rounded-md" onClick={() => handleClick()}>Start Game!</button>}
              </div>
          </div>
      </div> :
      '' }
    </>

  )
}

export default GameState