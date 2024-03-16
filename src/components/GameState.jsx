const GameState = ({gameState} = "start") => {
  return (
    <div className="absolute z-10 w-full h-screen top-0 right-0 flex justify-center items-center bg-black/70">
        <div className="w-full flex-col flex justify-center items-center max-h-[50%] h-full md:w-[600px] md:h-[500px] bg-white md:rounded-xl">
            <h1>{gameState === "over" ? 'Game Over, Wanna Play Again?' : 'Ready To Play?'}</h1>
            <div>
                {gameState === "over" ?
                <button>Play Again!</button> : 
                <button>Start Game!</button>}
            </div>
        </div>
    </div>
  )
}

export default GameState