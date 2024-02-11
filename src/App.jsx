import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

import { useEffect } from "react";

const gameHistoryData = [];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />
  },
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
