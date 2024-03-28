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

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user) navigate("/")
    });
  
    return () => listen()
  }, []);

  return (
    <div className='w-full h-screen pt-[70px] px-5 flex justify-center items-center'>
      <Navbar />
      <div className="flex w-full items-center h-full flex-col bg-red-200">
        <div className='flex justify-around text-3xl md:flex-row flex-col'>
            <h1 className='px-3'><span className='font-bold'>Result:</span> {historyData[id]?.result}</h1>
            <h1 className='px-3'><span className='font-bold'>Date:</span> {historyData[id]?.date}</h1>
            <h1 className='px-3'><span className='font-bold'># of Hands:</span> {historyData[id]?.numOfHands}</h1> 
        </div>
        <h1 className='pt-[20px] font-bold text-3xl'>Hands</h1>
        <div className='mt-[20px] w-1/2 bg-slate-600 h-auto'>
          {historyData[id]?.handHistory.map((round, ind) => {
              return(
                  <Round key={ind} roundData={round} />
              )
          })}
        </div>
      </div>
      <Link to="/history" className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-[60px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 text-lg rounded">Go Back</Link>            
    </div>
  )
}

export default Game