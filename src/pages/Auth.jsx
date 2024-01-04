import Login from "../components/Login";
import Register from "../components/Register";
import Navbar from '../components/Navbar';
import { auth } from '../firebase';
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });

    return () => {
      listen();
    }
  }, []);

  const [loginStatus, setLoginStatus] = useState("Login");

  const regState = (state) => setLoginStatus(state);
  const logState = (state) => setLoginStatus(state);

  return (
    <div className='w-full h-screen md:pt-[70px] pt-[60px] flex justify-center items-center'>
        <Navbar />
        {loginStatus === "Login" ? <Login reg={regState} /> : <Register login={logState} />}
    </div>
  )
}

export default Auth