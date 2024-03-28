import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import ListOfResults from '../components/ListOfResults';

const History = ({historyData}) => {
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (user) setAuthorized(true)
      else setAuthorized(false)
    });

    return () => listen()
  }, []);

return (
    <div className='w-full h-screen flex-col pt-[70px] px-5 flex justify-center items-center'>
      <Navbar />
      {authorized ? <ListOfResults history={historyData} /> :
        <h1 className='font-bold text-red-500 text-3xl'>YOU MUST LOGIN TO VIEW HISTORY</h1>
      }
    </div>
  )
}

export default History