import PokerTableComponent from "../components/PokerTableComponent";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase"
import { onAuthStateChanged } from "firebase/auth";

const Home = () => {

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)
        let userData = {
            email: user.email,
            history: []
        }

        if (!docSnap.exists()) {
            const userRef = doc(db, "users", user.uid)
            await setDoc(
                userRef,
                userData,
                { merge: true }
            )
        }
      }

      return () => listen()
    })
  }, [])
  
  return (
    <div className='w-full h-screen md:pt-[70px] pt-[60px] flex justify-center items-center'>
        <Navbar />
        <PokerTableComponent />
    </div>
  )
}

export default Home