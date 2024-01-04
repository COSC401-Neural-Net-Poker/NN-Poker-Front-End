import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase';
import { Icon } from '@iconify/react';

const Register = ({login}) => {
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

  const handleRegister = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
    .catch((error) => alert(error));

    setEmail("");
    setPassword("");
  }

  return (
    <div className="bg-[#e2e0df] md:w-1/2 md:h-1/2 flex w-full h-full justify-center flex-col items-center text-[#4B4B4B] rounded-xl">
      <div className="flex justify-center items-center drop-shadow-md border-b-2 md:w-1/2 w-2/3 border-[#adb0ae]">
        <Icon className="text-[45px]" icon="ph:user-fill" />
        <h1 className="text-[40px] font-bold">Register</h1>
      </div>

      <form className="mt-2 flex flex-col items-center w-2/3 md:w-1/2" onSubmit={(e) => handleRegister(e)}>
        <input className="outline-none placeholder-gray-500 placeholder-opacity-50 mb-4 w-full rounded-md pl-2 py-1 text-[20px]" placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input className="outline-none placeholder-gray-500 placeholder-opacity-50 mb-4 w-full rounded-md pl-2 py-1 text-[20px]" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button className="mb-4 rounded-md w-full py-1 font-semibold bg-[#4B4B4B] duration-150 hover:bg-[#FF8200] hover:text text-white" type="submit">Register</button>
      </form>
      <h1 className="cursor-pointer text-slate-800 hover:text-[#FF8200] duration-150" onClick={() => login("Login")}>Already have an account?</h1>
    </div>
  )
}

export default Register