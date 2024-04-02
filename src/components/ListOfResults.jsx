import { Link } from 'react-router-dom';
import { useState } from "react";
import { Icon } from '@iconify/react';

const ListOfResults = ({history = []}) => {
  let reversedHistory = []
  for (let i = history?.length - 1; i >= 0; --i) reversedHistory.push(history[i])
  const [historyDisplay, setHistoryDisplay] = useState(reversedHistory.slice(0, 10))

  const b1 = document.querySelector('.B1')
  const b2 = document.querySelector('.B2')
  const b3 = document.querySelector('.B3')
  const b4 = document.querySelector('.B4')  
  const b5 = document.querySelector('.B5')

  const pageButtons = []
  let counter = 1
  let historyLength = reversedHistory?.length <= 50 ? reversedHistory?.length : 50

  for (let i = 0; i < historyLength; ++i) {
    if (i % 9 === 0 && i !== 0) {
      pageButtons.push(counter)
      counter++
    }
  }

  const updateHistoryShown = (page) => {
    if (page == 0) {
      setHistoryDisplay(reversedHistory.slice(0, 10))
      if (b1) {
        b1.style.backgroundColor = "#4B4B4B";
        b1.style.color = "#FF8200"
      }      
      if (b2) b2.style = null
      if (b3) b3.style = null
      if (b4) b4.style = null
      if (b5) b5.style = null
    }
    if (page == 1) { 
      setHistoryDisplay(reversedHistory.slice(10, 20))
      if (b2) {
        b2.style.backgroundColor = "#4B4B4B";
        b2.style.color = "#FF8200"
      }      
      if (b1) b1.style = null
      if (b3) b3.style = null
      if (b4) b4.style = null
      if (b5) b5.style = null
    }
    if (page == 2) {
      setHistoryDisplay(reversedHistory.slice(20, 30))
      if (b3) {
        b3.style.backgroundColor = "#4B4B4B";
        b3.style.color = "#FF8200"
      }
      if (b2) b2.style = null
      if (b1) b1.style = null
      if (b4) b4.style = null
      if (b5) b5.style = null
    }
    if (page == 3) {
      setHistoryDisplay(reversedHistory.slice(30, 40))
      if (b4) {
        b4.style.backgroundColor = "#4B4B4B";
        b4.style.color = "#FF8200"
      }      
      if (b2) b2.style = null
      if (b3) b3.style = null
      if (b1) b1.style = null
      if (b5) b5.style = null
    }
    if (page == 4) {
      setHistoryDisplay(reversedHistory.slice(40, 50))
      if (b5) {
        b5.style.backgroundColor = "#4B4B4B";
        b5.style.color = "#FF8200"
      }
      if (b2) b2.style = null
      if (b3) b3.style = null
      if (b4) b4.style = null
      if (b1) b1.style = null
    }
  }

  return (
    <div className="flex w-full items-center h-full flex-col">
        {historyDisplay.map((game, ind) => {
            return(
              <Link key={ind} className='w-full h-[7%] my-1' to={`/history/${ind}`}>
                <div className="h-full w-full cursor-pointer bg-[#cbcfcc] hover:bg-[#4B4B4B] hover:text-[#cbcfcc] duration-150 ease-in-out transition-all text-[#4B4B4B] flex justify-between items-center text-2xl md:text-3xl font-bold">
                  <h1 className="px-3">{game.date}:</h1>
                  <div className="flex items-center px-3">
                    {game.result === "win" ? <Icon icon="mdi:crown" /> : <Icon icon="mage:robot-fill" />}
                    <h1>{game.result}</h1>
                  </div>
                </div>
              </Link>
            )
        })}
        {pageButtons.length < 2 ? '' :
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 md:mb-[60px] mb-[10%] flex w-full justify-center items-center">
          {pageButtons.map((button, ind) => {
            let classId = "B" + (ind + 1)
            return(
              <button key={ind} onClick={() => updateHistoryShown(ind)} className={`${classId} bg-[#FF8200] mx-1 text-white font-bold py-3 px-6 text-lg rounded-lg`}>{button}</button>
            )
          })}
        </div> 
        }
    </div>
  )
}

export default ListOfResults