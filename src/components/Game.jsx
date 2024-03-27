import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Game = ({historyData}) => {
    let { id } = useParams()
    return (
        <div className="flex w-full items-center justify-center h-full flex-col">
            <Link to="/history">Back to History Page</Link>
            <h1>{historyData[id].result}</h1>
            <h1>{historyData[id].date}</h1>
            <h1>{historyData[id].numOfHands}</h1>
            {historyData[id].handHistory.map((round, ind) => {
                return(
                    <div key={ind}>
                        <h1>{round.totalPotAmount}</h1>
                        <h1>{round.computerBetAmount}</h1>
                        <h1>{round.playerBetAmount}</h1>
                        <h1>{round.winCondition}</h1>
                        <h1>{round.foldRound}</h1>
                        <h1>{round.winner}</h1>
                        {round.winningHand ? round.winningHand.map((card, ind1) => {
                            return(
                                <h1 key={ind1}>{card}</h1>
                            )
                        }) : ''
                        }
                        {round.cards.map((card, ind2) => {
                            return(
                                <h1 key={ind2}>{card}</h1>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default Game