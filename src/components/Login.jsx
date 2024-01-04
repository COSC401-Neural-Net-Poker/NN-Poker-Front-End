import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase';
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';

const Login = ({reg}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });

    return () => {
      listen();
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
    .catch((error) => alert(error));

    setEmail("");
    setPassword("");
  }

  const handleGoogle = () => {
    signInWithPopup(auth, googleProvider)
    .catch((error) => alert(error));
  }

  return (
    <div className="bg-gray-300 w-1/2 h-1/2 flex justify-center flex-col items-center text-[#4B4B4B] rounded-xl">
      <div className="flex justify-center items-center drop-shadow-md border-b-2 w-1/2 border-[#adb0ae]">
        <Icon className="text-[45px]" icon="ph:user-fill" />
        <h1 className="text-[40px] font-bold">Login</h1>
      </div>

      <form className="mt-2 flex flex-col items-center w-1/2" onSubmit={(e) => handleLogin(e)}>
        <input className="mb-4 w-full rounded-md pl-1 text-[20px]" placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input className="mb-4 w-full rounded-md pl-1 text-[20px]" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button className="mb-4 rounded-md w-full py-1 font-semibold bg-[#4B4B4B] duration-150 hover:bg-[#FF8200] hover:text text-white" type="submit">Login</button>
      </form>
      <button onClick={() => handleGoogle()} className="bg-white mb-5 w-1/2 duration-150 hover:bg-[#FF8200] hover:text-white flex justify-center items-center py-1 px-2 rounded-md">
        <Icon className="mr-3 text-[25px]" icon="flat-color-icons:google" />Sign in with Google
      </button>
      <h1 className="cursor-pointer text-slate-800" onClick={() => reg("Register")}>Don't have an account yet?</h1>
    </div>
  )
}

export default Login