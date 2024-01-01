import Login from "../components/Login";
import Register from "../components/Register";
import Navbar from '../components/Navbar';

const Auth = () => {
  return (
    <div className='w-full h-screen bg-[#d3b9e8] pt-[70px]'>
        <Navbar />
        <Login />
        <Register />
    </div>
  )
}

export default Auth