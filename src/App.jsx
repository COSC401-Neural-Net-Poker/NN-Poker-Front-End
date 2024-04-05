import { RouterProvider, createBrowserRouter } from "react-router-dom";
import History from "./pages/History";
import Error from "./pages/Error";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Home from './pages/Home';
import Game from "./components/Game";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from './firebase';
import { doc, onSnapshot, setDoc } from "firebase/firestore";

function App() {
  const [historyData, setHistoryData] = useState([])

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid)
        const unsubscribeDoc = onSnapshot(docRef, async (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data()
            let pastGames = userData?.history || []
            if (pastGames?.length > 50) {
              let indicesToRemove = pastGames?.length - 50
              pastGames = pastGames.slice(indicesToRemove)
              await setDoc(
                docRef,
                {
                  history: [...pastGames]
                },
                { merge: true }
              )
            }
            setHistoryData(userData?.history)
          }
        })
        return () => unsubscribeDoc()
      }
    });

    return () => listen()
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <Error />
    },
    {
      path: "/auth",
      element: <Auth />
    },
    {
      path: "/history",
      element: <History historyData={historyData} />,
    },
    {
      path: "/history/:id",
      element: <Game historyData={historyData} />
    },
    {
      path: "/about",
      element: <About />
    }
  ])

  return (
    <div className="w-full min-h-screen flex items-center h-auto">
      <div className="mx-auto max-w-[1500px] w-full min-h-screen h-auto">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default App
