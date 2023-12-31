import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import History from "./pages/History";
import Error from "./pages/Error";
import About from "./pages/About";
import Scenario from "./pages/Scenario";
import Auth from "./pages/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1 className='font-bold text-red-500'>Testing TailwindCSS</h1>,
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

  return (
    <>
      <Navbar />
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  )
}

export default App
