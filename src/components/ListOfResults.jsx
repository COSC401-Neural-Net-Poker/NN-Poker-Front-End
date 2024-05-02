import { Link } from 'react-router-dom';
import { useState } from "react";
import { Icon } from '@iconify/react';
import { act } from 'react-dom/test-utils';

const ListOfResults = ({history = []}) => {
  let reversedHistory = []
  for (let i = history?.length - 1; i >= 0; --i) reversedHistory.push(history[i])

  const [historyDisplay, setHistoryDisplay] = useState(reversedHistory.slice(0, 10))
  const [activePage, setActivePage] = useState(0);

  const pageButtons = []
  let counter = 1
  let historyLength = reversedHistory?.length <= 50 ? reversedHistory?.length : 50

  for (let i = 0; i < historyLength; ++i) {
    if (i == 0){
      pageButtons.push(counter)
      counter++
    }
    if (i % 10 === 0 && i !== 0) {
      pageButtons.push(counter)
      counter++
    }
  }

  const updateHistoryShown = (page) => {
    setActivePage(page)
    setHistoryDisplay(reversedHistory.slice(page * 10, (page + 1) * 10))
  }

  return (
    <>
      <div className="flex w-full items-center h-full flex-col">
          {historyDisplay.map((game, ind) => {
              return(
                <Link key={ind} className='w-full h-[7%] my-1' to={`/history/${activePage * 10 + ind}`}>
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
      </div>

      {pageButtons.length < 2 ? '' :
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 md:mb-[60px] mb-[10%] flex w-full justify-center items-center">
          {pageButtons.map((button, ind) => {
            return(
              <button key={ind} onClick={() => updateHistoryShown(ind)} className={`${activePage === ind ? 'bg-gray-800 text-orange-500' : ''} bg-[#FF8200] mx-1 text-white font-bold py-3 px-6 text-lg rounded-lg`}>{button}</button>
            )
          })}
        </div> 
      }
    </>
  )
}

export default ListOfResults