import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import Logo from './Logo.png';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) setLoginStatus("Sign Out")
      else setLoginStatus("Sign In")
    });

    return () => {
      listen();
    }
  }, []);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [loginStatus, setLoginStatus] = useState("Sign In");
  const [logoutWarning, setLogoutWarning] = useState(false);

  const openMobileMenu = () => {
    document.body.classList.add('overflow-y-hidden');
    setMobileMenu(!mobileMenu)
  };
  
  const closeMobileMenu = () => {
    document.body.classList.remove('overflow-y-hidden');
    setMobileMenu(!mobileMenu)
  };

  const handleLogout = () => {
    signOut(auth);
    setMobileMenu(false);
    setLogoutWarning(true);

    const timer = setTimeout(() => {
      setLogoutWarning(false)
    }, 2500)

    return () => clearTimeout(timer);
  }

  const mobileClose = () => {
    setMobileMenu(false);
  }

  return (
    <>
      {/* This is the main desktop navigation UI */}
      <div className="fixed w-full top-0 left-0 bg-[#FF8200] text-lg font-semibold text-[#ffffff] h-[60px] md:h-[70px] flex z-40 items-center">
        <div className='flex justify-between items-center w-full max-w-[1500px] mx-auto'>
          <Link onClick={() => mobileClose()} to="/" className='flex items-center pl-5 whitespace-nowrap'>
            <img alt="AI Poker Logo" src={Logo} rel="noreferrer" />
            <h1>The Bluff Buddy</h1>
          </Link>
          <div className='lg:flex justify-between items-center w-2/5 whitespace-nowrap min-w-[600px] hidden px-5'>
            <Link to="/"><h1>Play Game</h1></Link>
            <Link to="/scenario-creator"><h1>Scenario</h1></Link>
            <Link to="/history"><h1>Game History</h1></Link>
            <Link to="/about"><h1>About Project</h1></Link>
            {loginStatus === "Sign In" ? <Link to="/auth"><h1 className='bg-[#4B4B4B] hover:bg-[#ffffff] hover:text-[#4B4B4B] duration-150 px-3 py-1 rounded-md'>Login</h1></Link> :
            <h1 className="cursor-pointer hover:bg-[#4B4B4B] bg-[#ffffff] text-[#4B4B4B] hover:text-white duration-150 px-3 py-1 rounded-md" onClick={() => handleLogout()}>
              Logout
            </h1>}
            
          </div>
          {mobileMenu ? 
          <div className='lg:hidden text-[30px] px-5 cursor-pointer' onClick={closeMobileMenu}>
            <Icon icon="line-md:menu-to-close-transition" />
          </div> :
          <div className='lg:hidden text-[30px] px-5 cursor-pointer' onClick={openMobileMenu} >
            <Icon icon="line-md:close-to-menu-transition" />
          </div>
          }
        </div>
      </div>

      {/* This is the mobile menu */}
      {mobileMenu ? 
      <div className='bg-[#4B4B4B] text-white text-3xl h-screen w-full md:hidden fixed top-0 z-30 left-0 overflow-y-hidden flex justify-center items-center flex-col'>
        <Link onClick={() => mobileClose()} className='my-4' to="/"><h1>Play Game</h1></Link>
        <Link onClick={() => mobileClose()} className='my-4' to="/scenario-creator"><h1>Scenario</h1></Link>
        <Link onClick={() => mobileClose()} className='my-4' to="/history"><h1>Game History</h1></Link>
        <Link onClick={() => mobileClose()} className='my-4' to="/about"><h1>About Project</h1></Link>
        {loginStatus === "Sign In" ? <Link onClick={() => mobileClose()} className='my-4' to="/auth"><h1 className='bg-[#FF8200] px-3 py-1 rounded-md'>Login</h1></Link> :
        <h1 className="cursor-pointer my-4  bg-[#ffffff] text-[#4B4B4B] px-3 py-1 rounded-md" onClick={() => handleLogout()}>
          Logout
        </h1>}
      </div> :
      ''
      }

      {/* This is the half menu that looks better for medium screens */}
      <div className={`${mobileMenu ? 'right-0' : 'right-[-325px]'} bg-[#4B4B4B] drop-shadow-xl text-white duration-200 transition-all md:h-screen md:w-[325px] lg:hidden hidden fixed top-0 z-30 overflow-y-hidden md:flex justify-center items-center`}>
        <div className='px-3 flex flex-col justify-center items-center w-full h-full'>
          <Link onClick={() => mobileClose()} className='my-3' to="/"><h1>Play Game</h1></Link>
          <Link onClick={() => mobileClose()} className='my-3' to="/scenario-creator"><h1>Scenario</h1></Link>
          <Link onClick={() => mobileClose()} className='my-3' to="/history"><h1>Game History</h1></Link>
          <Link onClick={() => mobileClose()} className='my-3' to="/about"><h1>About Project</h1></Link>
          {loginStatus === "Sign In" ? <Link onClick={() => mobileClose()} className='my-3' to="/auth"><h1 className='bg-[#FF8200] hover:bg-[#ffffff] hover:text-[#4B4B4B] duration-150 px-3 py-1 rounded-md'>Login</h1></Link> :
          <h1 className="cursor-pointer my-3 hover:bg-[#4B4B4B] bg-[#ffffff] text-[#4B4B4B] hover:text-white duration-150 px-3 py-1 rounded-md" onClick={() => handleLogout()}>
            Logout
          </h1>}
        </div>
      </div>

      <div className={`${logoutWarning ? 'top-0 mt-[80px]' : 'top-[-300px] mt-0'} rounded-xl drop-shadow-xl duration-500 flex justify-center items-center font-bold text-xl text-white ease-in-out transition-all absolute z-40 bg-[#FF8200] h-[75px] m-auto w-[350px]`}>
          You have successfully logged out!
      </div>
    </>
  )
}

export default Navbar