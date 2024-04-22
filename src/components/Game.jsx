import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Round from './Round';

const Game = ({historyData = []}) => {
  let { id } = useParams()
  const navigate = useNavigate();

  let reversedHistory = []
  for (let i = historyData?.length - 1; i >= 0; --i) reversedHistory.push(historyData[i])

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user) navigate("/")
    });
  
    return () => listen()
  }, []);
  
  return (
    <div className='w-full h-screen pt-[70px] px-5 flex justify-center items-center'>
      <Navbar />
      <div className="flex w-full items-center h-full flex-col">
        <div className='flex md:justify-around items-center text-3xl md:flex-row flex-col'>
            <h1 className='px-3'><span className='font-bold'>Result:</span> {reversedHistory[id]?.result}</h1>
            <h1 className='px-3'><span className='font-bold'>Date:</span> {reversedHistory[id]?.date}</h1>
            <h1 className='px-3'><span className='font-bold'># of Hands:</span> {reversedHistory[id]?.numOfHands}</h1> 
        </div>
        <h1 className='pt-[20px] font-bold text-3xl'>Hands</h1>
        <div className='mt-[20px] w-1/2 h-auto'>
          {reversedHistory[id]?.handHistory.map((round, ind) => {
            return(
              <Round key={ind} roundData={round} roundNum={ind} />
            )
          })}
        </div>
      </div>
      <Link to="/history" className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-[60px] bg-[#FF8200] hover:text-[#FF8200] hover:bg-white duration-150 ease-in-out transition-all text-white font-bold py-3 px-6 text-lg rounded-lg">Go Back</Link>            
    </div>
  )
}

export default Game