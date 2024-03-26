import { RouterProvider, createBrowserRouter } from "react-router-dom";
import History from "./pages/History";
import Error from "./pages/Error";
import About from "./pages/About";
import Scenario from "./pages/Scenario";
import Auth from "./pages/Auth";
import Home from './pages/Home';
import { useEffect } from "react";

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
    path: "/scenario-creator",
    element: <Scenario />
  },
  {
    path: "/history",
    element: <History />,
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
    <div className="w-full min-h-screen flex items-center h-auto">
      <div className="mx-auto max-w-[1500px] w-full min-h-screen h-auto">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default App
