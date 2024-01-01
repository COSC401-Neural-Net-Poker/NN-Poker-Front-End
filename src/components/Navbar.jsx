import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="fixed w-full top-0 left-0 bg-[#0d2e1f] text-[#c9c9c9] h-[70px] flex z-10 items-center">
      <div className='flex justify-between items-center w-full max-w-[1500px] mx-auto'>
        <div>
          <Link to="/"><h1>Imagine our Logo</h1></Link>
        </div>
        <div className='flex justify-between items-center w-1/3 whitespace-nowrap'>
          <Link to="/"><h1>Play</h1></Link>
          <Link to="/scenario-creator"><h1>Scenario</h1></Link>
          <Link to="/history"><h1>Game History</h1></Link>
          <Link to="/about"><h1>About Project</h1></Link>
          <Link to="/auth"><h1>Login/Register</h1></Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar