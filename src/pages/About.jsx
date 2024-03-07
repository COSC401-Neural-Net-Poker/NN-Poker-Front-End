import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div className='flex justify-center items-center'>
      <Navbar />
      <div className='pt-[60px] md:pt-[70px] flex justify-center flex-col items-center px-5 min-w-[300px] m-auto pb-[30px]'>
        <h1 className='pt-[20px] font-bold text-3xl'>About the Project</h1>

        <div className='w-full pt-[20px]'>
          <h1 className='font-semibold pb-4 text-2xl underline'>Project Information</h1>
          <p>
            Our project was to create a poker bot web application, where the user could play our 
            poker bot and test their skills. When we first came together as a group, we 
            had the general idea but didn't know exactly how we were going to implement this.
          </p>

          <p className='pt-[15px]'>
            During the Fall 2023 semester, we spent around 2 months planning out what we wanted
            out of this project as well as how we were going to tackle all the work that came along
            with it. We decided to split our team into 2 sub-groups, frontend and backend. This was
            the optimal way to ensure both sides of the project, UI and our model, could be worked on
            simultaneously and we could be as efficient with our limited time as possible.
          </p>

          <p className='pt-[15px]'>
            During the Spring 2024 semester, we tackled the technical problems associated with
            implementing a project such as ours. We had actually found technologies like Firebase
            that made some of the features we had planned a lot easier to get working. After some time
            researching ways to train our model and implementing a basic frontend, we were on the home-stretch of
            linking the two together through Firebase and getting what you see today!
          </p>
        </div>

        <div className='w-full pt-[20px]'>
          <h1 className='font-semibold pb-4 text-2xl underline'>Languages and Technologies</h1>
          <p>
            This project used a lot of different tools and technologies to come together.
            On the frontend we used around 3-4 React libraries not mentioned here, but can be found
            on our Github linked below. The backend also used a variety of tools in order to train
            our model and link to the frontend.
          </p>

          <ul className='pt-[10px]'>
            <li><a href="https://pytorch.org/" target="_blank" className='underline font-semibold text-[#FF8200]'>Pytorch</a> - Training Model</li>
            <li><a href="https://react.dev/" target="_blank" className='underline font-semibold text-[#FF8200]'>ReactJS</a> - Web App Framework</li>
            <li><a href="https://tailwindcss.com/" target="_blank" className='underline font-semibold text-[#FF8200]'>TailwindCSS</a> - Styling UI</li>
            <li><a href="https://firebase.google.com/" target="_blank" className='underline font-semibold text-[#FF8200]'>Firebase</a> - Connecting Frontend and Backend</li>
          </ul>
        </div>

        <div className='w-full pt-[20px]'>
          <h1 className='font-semibold pb-4 text-2xl underline'>Contributors and Repo</h1>
          <p>
            This project was created by the developers listed below.
            Please checkout our individual Github profiles as well as the 
            organizational Github below.
          </p>

          <ul className='pt-[10px]'>
            <li><a href="https://github.com/ColinC5" target="_blank" className='underline font-semibold text-[#FF8200]'>Colin Canonaco</a> - Backend (Model)</li>
            <li><a href="https://github.com/jdixon34-cs340" target="_blank" className='underline font-semibold text-[#FF8200]'>Jared Dixon</a> - Backend (Model)</li>
            <li><a href="https://github.com/Brandon-Marth" target="_blank" className='underline font-semibold text-[#FF8200]'>Brandon Marth</a> - Frontend (Web Application)</li>
            <li><a href="https://github.com/JMcknight75" target="_blank" className='underline font-semibold text-[#FF8200]'>Justin McKnight</a> - Backend (Model)</li>
            <li><a href="https://github.com/Jxk0be" target="_blank" className='underline font-semibold text-[#FF8200]'>Jake Shoffner</a> - Frontend (Web Application)</li>
            <li><a href="https://github.com/COSC401-Neural-Net-Poker" target="_blank" className='underline font-semibold text-[#FF8200]'>Project Github</a> - Source Code (Frontend and Backend)</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default About