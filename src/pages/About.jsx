import Navbar from '../components/Navbar';

const About = () => {
  return (
    <>
      <Navbar />
      <div className='pt-[60px] md:pt-[70px] flex justify-center flex-col items-center px-5 min-w-[300px] m-auto pb-[20px]'>
        <h1 className='pt-[20px] font-bold text-3xl'>About the Project</h1>

        <div className='w-full pt-[20px]'>
          <h1 className='font-semibold pb-4 text-2xl underline'>Project Information</h1>
          <p>
            Our project was to create a poker bot web application, where the user could play our 
            poker bot and test their skills. When we first came together as a group, we 
            had the general idea but had no real idea of how we were going to execute this 
            within the given time.
          </p>

          <p className='pt-[15px]'>
            Our project was to create a poker bot web application, where the user could play our 
            poker bot and test their skills. When we first came together as a group, we 
            had the general idea but had no real idea of how we were going to execute this 
            within the given time.
          </p>
        </div>

        <div className='w-full pt-[20px]'>
          <h1 className='font-semibold pb-4 text-2xl underline'>Languages and Technologies</h1>
          <p>
            We were able to use an array of different tools in our project.
          </p>

          <ul className='pt-[10px]'>
            <li><a href="https://pytorch.org/" target="_blank" className='underline '>Pytorch</a> - Training Model</li>
            <li><a href="https://react.dev/" target="_blank" className='underline '>ReactJS</a> - Web App Framework</li>
            <li><a href="https://tailwindcss.com/" target="_blank" className='underline '>TailwindCSS</a> - Styling UI</li>
            <li><a href="https://firebase.google.com/" target="_blank" className='underline '>Firebase</a> - Connecting Frontend and Backend</li>
          </ul>
        </div>

        <div className='w-full pt-[20px]'>
          <h1 className='font-semibold pb-4 text-2xl underline'>Contributors and Repo</h1>
          <p>
            This project was created by the developers listed below.
            Please checkout our individual Github profiles as well as the 
            organization Github below.
          </p>

          <ul className='pt-[10px]'>
            <li><a href="https://github.com/ColinC5" target="_blank" className='underline '>Colin Canonaco</a> - Backend (Model)</li>
            <li><a href="https://github.com/jdixon34-cs340" target="_blank" className='underline '>Jared Dixon</a> - Backend (Model)</li>
            <li><a href="https://github.com/Brandon-Marth" target="_blank" className='underline '>Brandon Marth</a> - Frontend (Web Application)</li>
            <li><a href="https://github.com/JMcknight75" target="_blank" className='underline '>Justin McKnight</a> - Backend (Model)</li>
            <li><a href="https://github.com/Jxk0be" target="_blank" className='underline '>Jake Shoffner</a> - Frontend (Web Application)</li>
            <li><a href="https://github.com/COSC401-Neural-Net-Poker" target="_blank" className='underline '>Project Github</a> - Source Code (Frontend and Backend)</li>
          </ul>
        </div>

      </div>
    </>
  )
}

export default About