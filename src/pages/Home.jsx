import { useState } from 'react';
import './PokerTable.css';
import styled from 'styled-components';
import { Component } from 'react';
import cardImageImport from './cardImageImport';
import cardRankings from './cardRankings';

let pot = 0;
let oppMon = 500;
let userMon = 500;
let turn;
let start = 0;
let dealer = 1;
let secondLastMove = "";
let lastMove = "";
let button1 = 0;
let first = 1;
let dealChange = false;
let postFlop = false;
let flop = false;
let theTurn = false;
let river = false;

const theme = {
  blue: {
    default: "#3f51b5",
    hover: "#283593",
  },
  pink: {
    default: "#e91e63",
    hover: "#ad1457",
  },
};

const Button = styled.button`
  background-color: ${(props) => theme[props.theme].default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: ${(props) => theme[props.theme].hover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

const Home = () => {

  let temp;
  let temp2;
  let opp1 = cardImageImport[0];
  let opp2 = cardImageImport[0];
  let mid1 = cardImageImport[0];
  let mid2 = cardImageImport[0];
  let mid3 = cardImageImport[0];
  let mid4 = cardImageImport[0];
  let mid5 = cardImageImport[0];
  let user1 = cardImageImport[0];
  let user2 = cardImageImport[0];

  const [imageOpp1, setImageOpp1] = useState(opp1);
  const [imageOpp2, setImageOpp2] = useState(opp2);
  const [imageMid1, setImageMid1] = useState(mid1);
  const [imageMid2, setImageMid2] = useState(mid2);
  const [imageMid3, setImageMid3] = useState(mid3);
  const [imageMid4, setImageMid4] = useState(mid4);
  const [imageMid5, setImageMid5] = useState(mid5);
  const [imageUser1, setImageUser1] = useState(user1);
  const [imageUser2, setImageUser2] = useState(user2);
  const [displayOpp, setDisplayOpp] = useState("Oppents (word for money) " + oppMon);
  const [displayPot, setDisplayPot] = useState("Amount in pot " + pot);
  const [displayUser, setDisplayUser] = useState("Mesa munies " + userMon);
  const [displayLeftButton, setDisplayLeftButton] = useState("Call");
  const [displayMiddleButton, setDisplayMiddleButton] = useState("Bet 10");
  const [displayRightButton, setDisplayRightButton] = useState("Start Game");
  const [showButtonLeft, setShowButtonLeft] = useState(false);
  const [showButtonCenter, setShowButtonCenter] = useState(false);
  const [showButtonRight, setShowButtonRight] = useState(true);

  //Update text for opponent's pot
  const updatePot = () => {
    // Update the state variable with a new text
    setDisplayOpp("Oppents (word for money) " + oppMon);
    setDisplayPot("Amount in pot " + pot);
    setDisplayUser("Mesa munies " + userMon);
  };

  const changeImage = () => {
    // Update the state with the new image source
    setImageUser1(cardImageImport[1]);
    setImageOpp1(cardImageImport[2]);
    setImageUser2(cardImageImport[3]);
    setImageOpp2(cardImageImport[4]);
    setImageMid1(cardImageImport[5]);
    setImageMid2(cardImageImport[6]);
    setImageMid3(cardImageImport[7]);
    setImageMid4(cardImageImport[8]);
    setImageMid5(cardImageImport[9]);
  };

  function shuffleDeck() {
    // alert(Math.floor(Math.random() * (52 - 1 + 1)) + 1);
    opp1 = cardImageImport[0];
    opp2 = cardImageImport[0];
    mid1 = cardImageImport[0];
    mid2 = cardImageImport[0];
    mid3 = cardImageImport[0];
    mid4 = cardImageImport[0];
    mid5 = cardImageImport[0];
    user1 = cardImageImport[0];
    user2 = cardImageImport[0];

    for (let i = cardImageImport.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (52 - 1 + 1)) + 1;
      temp = cardImageImport[i];
      temp2 = cardRankings[i];
      cardImageImport[i] = cardImageImport[j];
      cardImageImport[j] = temp;
      cardRankings[i] = cardRankings[j];
      cardRankings[j] = cardRankings[i];
    }
  }
  
  function Bet() {
    if(turn == 0) {
      if(first == 1){
        oppMon -= 5;
        pot += 5;
        console.log("Bet of 5 by computer");
      }else{
        oppMon -= 10;
        pot += 10;
        console.log("Bet of 10 by computer");
      }
    }else{
      if(first == 1){
        userMon -= 5;
        pot += 5;
        console.log("Bet of 5 by user");
      }else{
        userMon -= 10;
        pot += 10;
        console.log("Bet of 10 by user");
      }
    }

    turn = (turn > 0) ? 0 : 1; 
    updatePot();
    first = 0;
    secondLastMove = lastMove;
    lastMove = "CA";
    turnStart();
  }

  function Raise() {

    if(turn == 0) {
      if(first == 1){
        oppMon -= 15;
        pot += 15;
        console.log("Raise of 15 by computer");
      }else{
        oppMon -= 20;
        pot += 20;
        console.log("Raise of 20 by computer");
      }
    }else{
      if(first == 1){
        userMon -= 15;
        pot += 15;
        console.log("Raise of 15 by player");
      }else{
        userMon -= 20;
        pot += 20;
        console.log("Raise of 20 by player");
      }
    }

    turn = (turn > 0) ? 0 : 1;
    updatePot();
    first = 0;
    secondLastMove = lastMove;
    lastMove = "R";
    turnStart();
  }

  function Check() {
    secondLastMove = lastMove;
    lastMove = "CH";
    console.log("Check Please");
    turnStart();
  }

  function Fold(){
    if(turn == 0){
      userMon += pot;
      pot = 0;
      console.log("Fold by computer");
    }else{
      oppMon += pot;
      pot = 0;
      console.log("Fold by player");
    }

    handStart();
  }

  //Shows the user's hand
  //The order the cards are dealt is based on who is the dealer
  function revealHand() {
    if(dealer){
      setImageUser1(cardImageImport[1]);
      setImageUser2(cardImageImport[3]);
    }else{
      setImageUser1(cardImageImport[2]);
      setImageUser2(cardImageImport[4]);
    }
  }

  function revealFlop() {
    setImageMid1(cardImageImport[5]);
    setImageMid2(cardImageImport[6]);
    setImageMid3(cardImageImport[7]);
  }

  function revealTurn() {
    setImageMid4(cardImageImport[8]);
  }

  function revealRiver() {
    setImageMid5(cardImageImport[9]);
  }

  function revealOpponent() {
    if(dealer){
      setImageOpp1(cardImageImport[2]);
      setImageOpp2(cardImageImport[4]);
    }else{
      setImageOpp1(cardImageImport[1]);
      setImageOpp2(cardImageImport[3]);
    }
  }

  //Start of a turn for either bot or player
  function turnStart() {
    
    if((secondLastMove == "R" && lastMove == "CA") || (secondLastMove == "CH" && lastMove == "CH") || (secondLastMove == "CA" && lastMove == "CH")){
      console.log("Flop thing");
      if(flop == false){
        revealFlop();
        dealChange = true;
        flop = true;
      }else if(theTurn == false){
        revealTurn();
        dealChange = true;
        theTurn = true;
      }else if(river == false){
        revealRiver();
        dealChange = true;
        river = true
      }else{
        winCheck();
      }
    }

    //Big Blind Goes First After the Flop
    if(dealChange == true){
      turn = (dealer > 0) ? 1 : 0;
      dealChange = false;
      postFlop = true;
      lastMove = "";
      secondLastMove = "";
    }

    //if(turn == 1){
      //Call function to make fen string
      //Call api
      //Do what api says
    //}
    //If player
    //else{
      //No money means you can't bet
      if(userMon == 0 || oppMon == 0){
        setDisplayMiddleButton(false);
        //In the future have an auto advance function
      }
      if(first == 1){
        setDisplayMiddleButton("Bet 5");
        setDisplayLeftButton("Raise 15");
        setDisplayRightButton("Fold");
        button1 = false;
      //Right of or may be changed to own else if because (bet 10) may need to be (raise 10)
      }else if((postFlop && lastMove == "") || (lastMove == "CH") || (lastMove == "CA" && secondLastMove == "" && mid1 == cardImageImport[0])){
        setDisplayLeftButton("Check");
        setDisplayMiddleButton("Bet 10");
        button1 = true;
      }else{
        setDisplayMiddleButton("Bet 10");
        setDisplayLeftButton("Raise 20");
        setDisplayRightButton("Fold");
        button1 = false;
      }
    //}
  }

  function winCheck() {
    let userRoyalFlush = false;
    let userStraightFlush = false;
    let userFlush = false;
    let user4Kind = false;
    let userFullHouse = false;
    let userStraight = false;
    let user3Kind = false;
    let user2Pair = false;
    let userPair = false;
    let compRoyalFlush = false;
    let compStraightFlush = false;
    let compFlush = false;
    let comp4Kind = false;
    let compFullHouse = false;
    let compStraight = false;
    let comp3Kind = false;
    let comp2Pair = false;
    let compPair = false;

      //Flush check

        //Royal flush check
        //Straight Flush check
      //4 of kind
      //Full house
      //flush
      //Straight
      //Three of kind
      //Two pair
      //One pair
      //High card
  }

  function handStart() {
    dealer = (dealer > 0) ? 0 : 1;
    //Blinds - Dealer has the big blind
    //Not sure what to do if the player meant to big blind does not have enough 
    //https://boardgames.stackexchange.com/questions/39045/in-poker-what-happens-with-the-next-players-if-paying-the-big-blind-puts-a-play
    if(dealer == 0){
      if(oppMon < 10){
        pot += oppMon;
        oppMon -= oppMon;
      }else{
        pot += 10;
        oppMon -= 10;
      }
      userMon -= 5;
      pot += 5;
    }else{
      if(userMon < 10){
        pot += userMon
        userMon -= userMon;
      }else{
      pot += 10;
      userMon -= 10;
      }
      pot += 5;
      oppMon -= 5;
    }

    updatePot();
    shuffleDeck();
    revealHand();
    lastMove = "";
    dealChange = false;
    turn = (dealer > 0) ? 0 : 1;
    first = 1;
    postFlop = false;
    flop = false;
    theTurn = false;
    river = false;
    setShowButtonLeft(true);
    setShowButtonCenter(true);
    turnStart();
  }

  function beginGame() {
    setDisplayMiddleButton("Bet 10");
    handStart();
    start = 1;
  }

  return (
    <div className="poker-table">
      <div className="table-top">
        <div className="opponent-cards1">
          <img src={imageOpp1} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="opponent-cards2">
          <img src={imageOpp2} alt="Current Card" />
          {/* Display community cards here */}
        </div>
      </div>
      <div className="amount">
          {displayOpp}
      </div>
      <div className="table-middle">
        <div className="community-cards1">
          <img src={imageMid1} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="community-cards2">
          <img src={imageMid2} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="community-cards3">
          <img src={imageMid3} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="community-cards4">
          <img src={imageMid4} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="community-cards5">
          <img src={imageMid5} alt="Current Card" />
          {/* Display community cards here */}
        </div>
      </div>
      <div className="pot">
          {displayPot}
      </div>
      <div className="table-bottom">
        <div className="player-card1">
          <img src={imageUser1} alt="Current Card" />
          {/* Display player cards and information here */}
        </div>
        <div className="player-card2">
         <img src={imageUser2} alt="Current Card" />
         {/* Display player cards and information here */}
        </div>
      </div>
      <div className="player-chips">
          {displayUser}
      </div>
      <div className="buttons">
        {/* Used as both Raising and Checking */}
        <div className="call">
          {showButtonLeft && <Button theme="pink" onClick={button1 ? Check : Raise}>{displayLeftButton}</Button>}
        </div>
        {/* Used as betting */}
        <div className="bet">
          {showButtonCenter && <Button theme="pink" onClick={Bet}>
            {displayMiddleButton}
          </Button>}
        </div>
        <div className="fold">
        {/* Used as both Folding and start game button */}
          {showButtonRight && <Button theme="pink" onClick={start ? Fold : beginGame}>{displayRightButton}</Button>}
        </div>
      </div>
      <div className="amount">
          <label>
            Amount to Bet: <input name="myInput" />
          </label>
      </div>
    </div>
  )
}

export default Home