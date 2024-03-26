import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import ListOfResults from '../components/ListOfResults';

const History = () => {
  const [authorized, setAuthorized] = useState(false)
  const [historyData, setHistoryData] = useState([])

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthorized(true);

        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const userData = docSnap.data()
            setHistoryData(userData.history)
        }
      }
      else setAuthorized(false)
    });

    return () => {
      listen();
    }
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