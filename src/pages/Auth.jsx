import Login from "../components/Login";
import Register from "../components/Register";
import Navbar from '../components/Navbar';

const Auth = () => {
  return (
    <div className='w-full h-screen bg-[#4B4B4B] pt-[70px]'>
        <Navbar />
        <Login />
        <Register />
    </div>
  )
}

export default Auth