import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1 className='font-bold text-red-500'>Testing TailwindCSS</h1>,
    errorElement: <h1 className="text-3xl font-bold text-red-400">Page Does Not Exist</h1>
  },
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
