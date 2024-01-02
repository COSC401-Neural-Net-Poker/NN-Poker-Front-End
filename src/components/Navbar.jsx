import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useState } from 'react';

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const openMobileMenu = () => {
    document.body.classList.add('overflow-y-hidden');
    setMobileMenu(!mobileMenu)
  };
  
  const closeMobileMenu = () => {
    document.body.classList.remove('overflow-y-hidden');
    setMobileMenu(!mobileMenu)
  };

  return (
    <>
      <div className="fixed w-full top-0 left-0 bg-[#061415] text-lg font-semibold text-[#f3f2f2] h-[60px] md:h-[70px] flex z-20 items-center">
        <div className='flex justify-between items-center w-full max-w-[1500px] mx-auto'>
          <div className='whitespace-nowrap px-5'>
            <Link to="/"><h1>Imagine our Logo</h1></Link>
          </div>
          <div className='md:flex justify-between items-center w-2/5 whitespace-nowrap min-w-[600px] hidden px-5'>
            <Link to="/"><h1>Play Game</h1></Link>
            <Link to="/scenario-creator"><h1>Scenario</h1></Link>
            <Link to="/history"><h1>Game History</h1></Link>
            <Link to="/about"><h1>About Project</h1></Link>
            <Link to="/auth"><h1>Login/Register</h1></Link>
          </div>
          {mobileMenu ? 
          <div className='md:hidden text-[30px] px-5 cursor-pointer' onClick={closeMobileMenu}>
            <Icon icon="line-md:menu-to-close-transition" />
          </div> :
          <div className='md:hidden text-[30px] px-5 cursor-pointer' onClick={openMobileMenu} >
            <Icon icon="line-md:close-to-menu-transition" />
          </div>
          }
        </div>
      </div>
      {mobileMenu ? 
      <div className='bg-black h-screen w-full md:hidden fixed top-0 z-10 left-0 overflow-y-hidden'>&nbsp;</div> :
      ''
      }
    </>
  )
}

export default Navbar