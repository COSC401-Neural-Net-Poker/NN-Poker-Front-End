import Navbar from '../components/Navbar';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) setAuthorized(true);
    });

    return () => {
      listen();
    }
  }, []);

return (
    <div className='w-full h-screen pt-[70px] px-5'>
      <Navbar />
      {/* I think for the future, we should create a history component
          and just import it here, and then an error component as well */}
      {authorized ? 
        <h1>History Page</h1> :
        <h1 className='font-bold text-red-500 text-3xl'>YOU MUST LOGIN TO VIEW HISTORY</h1>
      }
    </div>
  )
}

export default History