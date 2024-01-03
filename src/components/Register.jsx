import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase';

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
    <div className="bg-gray-300 w-1/2 h-1/2">
      <form onSubmit={(e) => handleRegister(e)}>
        <input placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button type="submit" className="bg-sky-400 py-1 px-2 rounded-xl">Register</button>
        <h1 className="cursor-pointer text-slate-800" onClick={() => login("Login")}>Already have an account?</h1>
      </form>
    </div>
  )
}

export default Register