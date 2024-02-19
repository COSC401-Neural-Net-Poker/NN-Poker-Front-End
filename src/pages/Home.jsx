import PokerTableComponent from "../components/PokerTableComponent";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className='w-full h-screen md:pt-[70px] pt-[60px] flex justify-center items-center'>
        <Navbar />
        <PokerTableComponent />
    </div>
  )
}

export default Home