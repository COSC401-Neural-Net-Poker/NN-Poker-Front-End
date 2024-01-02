import { RouterProvider, createBrowserRouter } from "react-router-dom";
import History from "./pages/History";
import Error from "./pages/Error";
import About from "./pages/About";
import Scenario from "./pages/Scenario";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import { useEffect } from "react";

const gameHistoryData = [];

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar /> <h1 className='font-bold text-red-500'>Testing TailwindCSS</h1></>,
    errorElement: <Error />
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/scenario-creator",
    element: <Scenario />
  },
  {
    path: "/history",
    element: <History data={gameHistoryData} />,
  },
  {
    path: "/about",
    element: <About />
  }
])

function App() {

  useEffect(() => {
    // Firebase pull history data from user if user exists
  }, [])
  
  return (
    <div className="w-full h-screen flex items-center">
      <div className="mx-auto max-w-[1500px] w-full h-screen">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default App
