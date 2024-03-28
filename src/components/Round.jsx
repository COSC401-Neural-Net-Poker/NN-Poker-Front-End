import { useState } from "react"
import back from '../pages/cards/BackCard.svg';
import club2 from '../pages/cards/2_of_clubs.svg';
import dia2 from '../pages/cards/2_of_diamonds.svg';
import heart2 from '../pages/cards/2_of_hearts.svg';
import spade2 from '../pages/cards/2_of_spades.svg';
import club3 from '../pages/cards/3_of_clubs.svg';
import dia3 from '../pages/cards/3_of_diamonds.svg';
import heart3 from '../pages/cards/3_of_hearts.svg';
import spade3 from '../pages/cards/3_of_spades.svg';
import club4 from '../pages/cards/4_of_clubs.svg';
import dia4 from '../pages/cards/4_of_diamonds.svg';
import heart4 from '../pages/cards/4_of_hearts.svg';
import spade4 from '../pages/cards/4_of_spades.svg';
import club5 from '../pages/cards/5_of_clubs.svg';
import dia5 from '../pages/cards/5_of_diamonds.svg';
import heart5 from '../pages/cards/5_of_hearts.svg';
import spade5 from '../pages/cards/5_of_spades.svg';
import club6 from '../pages/cards/6_of_clubs.svg';
import dia6 from '../pages/cards/6_of_diamonds.svg';
import heart6 from '../pages/cards/6_of_hearts.svg';
import spade6 from '../pages/cards/6_of_spades.svg';
import club7 from '../pages/cards/7_of_clubs.svg';
import dia7 from '../pages/cards/7_of_diamonds.svg';
import heart7 from '../pages/cards/7_of_hearts.svg';
import spade7 from '../pages/cards/7_of_spades.svg';
import club8 from '../pages/cards/8_of_clubs.svg';
import dia8 from '../pages/cards/8_of_diamonds.svg';
import heart8 from '../pages/cards/8_of_hearts.svg';
import spade8 from '../pages/cards/8_of_spades.svg';
import club9 from '../pages/cards/9_of_clubs.svg';
import dia9 from '../pages/cards/9_of_diamonds.svg';
import heart9 from '../pages/cards/9_of_hearts.svg';
import spade9 from '../pages/cards/9_of_spades.svg';
import club10 from '../pages/cards/10_of_clubs.svg';
import dia10 from '../pages/cards/10_of_diamonds.svg';
import heart10 from '../pages/cards/10_of_hearts.svg';
import spade10 from '../pages/cards/10_of_spades.svg';
import clubjack from '../pages/cards/jack_of_clubs.svg';
import diajack from '../pages/cards/jack_of_diamonds.svg';
import heartjack from '../pages/cards/jack_of_hearts.svg';
import spadejack from '../pages/cards/jack_of_spades.svg';
import clubqueen from '../pages/cards/queen_of_clubs.svg';
import diaqueen from '../pages/cards/queen_of_diamonds.svg';
import heartqueen from '../pages/cards/queen_of_hearts.svg';
import spadequeen from '../pages/cards/queen_of_spades.svg';
import clubking from '../pages/cards/king_of_clubs.svg';
import diaking from '../pages/cards/king_of_diamonds.svg';
import heartking from '../pages/cards/king_of_hearts.svg';
import spadeking from '../pages/cards/king_of_spades.svg'
import clubeace from '../pages/cards/ace_of_clubs.svg';
import diaace from '../pages/cards/ace_of_diamonds.svg';
import heartace from '../pages/cards/ace_of_hearts.svg';
import spadeace from  '../pages/cards/ace_of_spades.svg';

const cardImages = [
  back,
  club2,
  dia2,
  heart2,
  spade2,
  club3,
  dia3,
  heart3,
  spade3,
  club4,
  dia4,
  heart4,
  spade4,
  club5,
  dia5,
  heart5,
  spade5,
  club6,
  dia6,
  heart6,
  spade6,
  club7,
  dia7,
  heart7,
  spade7,
  club8,
  dia8,
  heart8,
  spade8,
  club9,
  dia9,
  heart9,
  spade9,
  club10,
  dia10,
  heart10,
  spade10,
  clubjack,
  diajack,
  heartjack,
  spadejack,
  clubqueen,
  diaqueen,
  heartqueen,
  spadequeen,
  clubking,
  diaking,
  heartking,
  spadeking,
  clubeace,
  diaace,
  heartace,
  spadeace
];
const cardMapper = {
  "Club2": cardImages[1],
  "Dia2": cardImages[2],
  "Heart2": cardImages[3],
  "Spade2": cardImages[4],
  "Club3": cardImages[5],
  "Dia3": cardImages[6],
  "Heart3": cardImages[7],
  "Spade3": cardImages[8],
  "Club4": cardImages[9],
  "Dia4": cardImages[10],
  "Heart4": cardImages[11],
  "Spade4": cardImages[12],
  "Club5": cardImages[13],
  "Dia5": cardImages[14],
  "Heart5": cardImages[15],
  "Spade5": cardImages[16],
  "Club6": cardImages[17],
  "Dia6": cardImages[18],
  "Heart6": cardImages[19],
  "Spade6": cardImages[20],
  "Club7": cardImages[21],
  "Dia7": cardImages[22],
  "Heart7": cardImages[23],
  "Spade7": cardImages[24],
  "Club8": cardImages[25],
  "Dia8": cardImages[26],
  "Heart8": cardImages[27],
  "Spade8": cardImages[28],
  "Club9": cardImages[29],
  "Dia9": cardImages[30],
  "Heart9": cardImages[31],
  "Spade9": cardImages[32],
  "Club10": cardImages[33],
  "Dia10": cardImages[34],
  "Heart10": cardImages[35],
  "Spade10": cardImages[36],
  "Club11": cardImages[37],
  "Dia11": cardImages[38],
  "Heart11": cardImages[39],
  "Spade11": cardImages[40],
  "Club12": cardImages[41],
  "Dia12": cardImages[42],
  "Heart12": cardImages[43],
  "Spade12": cardImages[44],
  "Club13": cardImages[45],
  "Dia13": cardImages[46],
  "Heart13": cardImages[47],
  "Spade13": cardImages[48],
  "Club14": cardImages[49],
  "Dia14": cardImages[50],
  "Heart14": cardImages[51],
  "Spade14": cardImages[52]
}

const Round = ({roundData = {}}) => {
  const [modalOpen, setModalOpen] = useState(false)

  let topCards = roundData?.cards.slice(0, 2)
  let middleCards = roundData?.cards.slice(2, 7)
  let bottomCards = roundData?.cards.slice(7, 9)

  for (let i = 0; i < topCards.length; ++i) topCards[i] = cardMapper[topCards[i]]
  for (let i = 0; i < middleCards.length; ++i) middleCards[i] = cardMapper[middleCards[i]]
  for (let i = 0; i < bottomCards.length; ++i) bottomCards[i] = cardMapper[bottomCards[i]]

  return (
    <>
      {modalOpen ? 
      <>
        <div onClick={() => setModalOpen(false)} className="z-10 w-full h-screen absolute top-0 left-0 bg-black/50"></div>
        <div className="bg-green-800 p-4 justify-center items-center rounded-lg z-20 md:w-[600px] md:h-[700px] w-full h-[60%] flex flex-col fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-full h-1/3 flex justify-center items-center">
            {topCards.map((card, ind) => {
            return(<img key={ind} className="md:w-1/6 mx-1 w-1/5" src={card} />)
            })}
          </div>
          <div className="w-full h-1/3 flex justify-around items-center">
            {middleCards.map((card, ind) => {
              return(<img key={ind} className="md:w-1/6 mx-1 w-1/5" src={card} />)
            })}
          </div>
          <div className="w-full h-1/3 flex justify-center items-center">
            {bottomCards.map((card, ind) => {
              return(<img key={ind} className="md:w-1/6 mx-1 w-1/5" src={card} />)
            })}
          </div>
        </div>
      </>
 :
      '' 
      }


      <div onClick={() => setModalOpen(true)}>
          {roundData.totalPotAmount}
      </div>
    </>
  )
}

export default Round