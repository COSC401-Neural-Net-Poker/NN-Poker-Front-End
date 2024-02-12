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
  let opp = [cardImageImport[0], cardImageImport[0]];
  let mid = [cardImageImport[0], cardImageImport[0], cardImageImport[0] ,cardImageImport[0], cardImageImport[0]];
  let user = [cardImageImport[0], cardImageImport[0]];

  const [imageOpp1, setImageOpp1] = useState(opp[0]);
  const [imageOpp2, setImageOpp2] = useState(opp[1]);
  const [imageMid1, setImageMid1] = useState(mid[0]);
  const [imageMid2, setImageMid2] = useState(mid[1]);
  const [imageMid3, setImageMid3] = useState(mid[2]);
  const [imageMid4, setImageMid4] = useState(mid[3]);
  const [imageMid5, setImageMid5] = useState(mid[4]);
  const [imageUser1, setImageUser1] = useState(user[0]);
  const [imageUser2, setImageUser2] = useState(user[1]);
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
    opp[0] = cardImageImport[0];
    opp[1] = cardImageImport[0];
    mid[0] = cardImageImport[0];
    mid[1] = cardImageImport[0];
    mid[2] = cardImageImport[0];
    mid[3] = cardImageImport[0];
    mid[4] = cardImageImport[0];
    user[0] = cardImageImport[0];
    user[1] = cardImageImport[0];

    for (let i = cardImageImport.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (52 - 1 + 1)) + 1;
      temp = cardImageImport[i];
      temp2 = cardRankings[i];
      cardImageImport[i] = cardImageImport[j];
      cardImageImport[j] = temp;
      cardRankings[i] = cardRankings[j];
      cardRankings[j] = temp2;
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
      console.log("User not dealer");
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
      }else if((postFlop && lastMove == "") || (lastMove == "CH") || (lastMove == "CA" && secondLastMove == "" && mid[0] == cardImageImport[0])){
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
    //let userRoyalFlush = false;     // 9
    //let userStraightFlush = false;  // 8
    //let user4Kind = false;          // 7
    //let userFullHouse = false;      // 6
    //let userFlush = false;          // 5
    //let userStraight = false;       // 4
    //let user3Kind = false;          // 3
    //let user2Pair = false;          // 2
    //let userPair = false;           // 1
    //let compRoyalFlush = false;     // 9
    //let compStraightFlush = false;  // 8
    //let compFlush = false;          // 7
    //let comp4Kind = false;          // 6
    //let compFullHouse = false;      // 5
    //let compStraight = false;       // 4
    //let comp3Kind = false;          // 3
    //let comp2Pair = false;          // 2
    //let compPair = false;           // 1
    let userClub = 0;
    let userHeart = 0;
    let userSpade = 0;
    let userDia = 0;
    let compClub = 0;
    let compHeart = 0;
    let compSpade = 0;
    let compDia = 0;
    let userFlush = -1;
    let compFlush = -1;
    let userStraight = -1;
    let compStraight = -1;
    let comp4 = false;
    let user4 = false;
    let comp3 = false;
    let user3 = false;
    let userPair = 0;
    let compPair = 0;
    let user1 = -1;
    let user2 = -1;
    let comp1 = -1;
    let comp2 = -1;
    let userList = [];
    let compList = [];
    let userListShort = [];
    let compListShort = [];
    let userHigh = -1;
    let compHigh = -1;
    let straight = [[2, 3, 4, 5 ,6], [3, 4, 5, 6, 7] ,[4, 5, 6, 7, 8], [5, 6, 7, 8, 9], [6, 7, 8, 9, 10], 
      [7, 8, 9, 10, 11], [8, 9, 10, 11, 12], [9, 10, 11, 12, 13], [10, 11, 12, 13, 14]];
    let straight1 = [2, 3, 4, 5 ,6];
    let straight2 = [3, 4, 5, 6, 7];
    let straight3 = [4, 5, 6, 7, 8];
    let straight4 = [5, 6, 7, 8, 9];
    let straight5 = [6, 7, 8, 9, 10];
    let straight6 = [7, 8, 9, 10, 11];
    let straight7 = [8, 9, 10, 11, 12];
    let straight8 = [9, 10, 11, 12, 13];
    let straight9 = [10, 11, 12, 13, 14];

    //Change this later is bad
    //Could condesnse by using dealer in math
    //Flush
    for(let i = 0; i < 2; i++){
        if(dealer){
          if(cardRankings[(i*2) + 1][0] == 'club'){
            userClub++;
          }else if(cardRankings[(i*2) + 1][0] == 'dia'){
            userDia++;
          }else if(cardRankings[(i*2) + 1][0] == 'heart'){
            userHeart++;
          }else{
            userSpade++;
          }
          user1 = cardRankings[1][1];
          user2 = cardRankings[3][1];
        }else{
          if(cardRankings[(i*2) + 2][0] == 'club'){
            userClub++;
          }else if(cardRankings[(i*2) + 2][0] == 'dia'){
            userDia++;
          }else if(cardRankings[(i*2) + 2][0] == 'heart'){
            userHeart++;
          }else{
            userSpade++;
          }
          user1 = cardRankings[2][1];
          user2 = cardRankings[4][1];
        }
    }
    for(let i = 0; i < 2; i++){
      if(dealer){
        if(cardRankings[(i*2) + 2][0] == 'club'){
          compClubClub++;
        }else if(cardRankings[(i*2) + 2][0] == 'dia'){
          compDia++;
        }else if(cardRankings[(i*2) + 2][0] == 'heart'){
          compHeart++;
        }else{
          compSpade++;
        }
        comp1 = cardRankings[2][1];
        comp2 = cardRankings[4][1];
      }else{
        if(cardRankings[(i*2) + 1][0] == 'club'){
          compClub++;
        }else if(cardRankings[(i*2) + 1][0] == 'dia'){
          compDia++;
        }else if(cardRankings[(i*2) + 1][0] == 'heart'){
          compHeart++;
        }else{
          compSpade++;
        }
        comp1 = cardRankings[1][1];
        comp2 = cardRankings[3][1];
      }
    }
    for(let i = 5; i < 10; i++){
      if(cardRankings[i][0] == 'club'){
        compClubClub++;
        userClub++;
      }else if(cardRankings[(i) + 2][0] == 'dia'){
        compDia++;
        userDia++;
      }else if(cardRankings[(i) + 2][0] == 'heart'){
       compHeart++;
       userHeart++;
      }else{
        compSpade++;
        userSpade++;
      }
    }

    userList.push(user1);
    userList.push(user2);
    userList.push(cardRankings[5][1]);
    userList.push(cardRankings[6][1]);
    userList.push(cardRankings[7][1]);
    userList.push(cardRankings[8][1]);
    userList.push(cardRankings[9][1]);

    compList.push(comp1);
    compList.push(comp2);
    compList.push(cardRankings[5][1]);
    compList.push(cardRankings[6][1]);
    compList.push(cardRankings[7][1]);
    compList.push(cardRankings[8][1]);
    compList.push(cardRankings[9][1]);

    userList = userList.sort(function (a, b) {  return a - b;  });
    compList = compList.sort(function (a, b) {  return a - b;  });

    userListShort = userList.concat();
    compListShort = compList.concat();

    for(let i = 0; i < userListShort.length - 1; i++){
      if(userListShort[i] == userListShort[i + 1]){
        userListShort.splice(i, 1);
      }
    }
    for(let i = 0; i < compListShort.length - 1; i++){
      if(compListShort[i] == compListShort[i + 1]){
        compListShort.splice(i, 1);
      }
    }


    console.log(compList + " Computer " + compListShort);
    console.log(userList + " user short " + userListShort);

    //Flush check
    if(userClub >= 5 || userDia >= 5 || userSpade >= 5 || userHeart >= 5){
      userFlush = true;
    }
    if(compClub >= 5 || compDia >= 5 || compSpade >= 5 || compHeart >= 5){
      compFlush = true;
    }
    //Straight check
    for(let i = 0; i < (userListShort-4); i++){
      for(let j = 0; j < 9; j++){
        if(userListShort.slice(i, i+5) == straight[j]){
          userStraight = true;
        }
      }
    }
    for(let i = 0; i < (compListShort-4); i++){
      for(let j = 0; j < 9; j++){
        if(compListShort.slice(i, i+5) == straight[j]){
          compStraight = true;
        }
      }
    }
    if(userList[6] == 14 && userList.slice(0, 4) == [2, 3, 4, 5]){
      userStraight = true;
    }
    if(compList[6] == 14 && compList.slice(0, 4) == [2, 3, 4, 5]){
      compStraight = true;
    }
        //Royal flush check
    if((userStraight && userFlush) && !(compStraight && compFlush)){
      //User wins
    }
    if(!(userStraight && userFlush) && (compStraight && compFlush)){
      //Comp wins
    }
    if((userStraight && userFlush) && (compStraight && compFlush)){
      //Tiebreaker needed
    }
        //Straight Flush check
      //4 of kind
    if(userList[0] == userList[3] || userList[1] == userList[4] || userList[2] == userList[5] || userList[3] == userList[6] || userList[4] == userList[7]){
      user4 = true;
    }
    if(compList[0] == compList[3] || compList[1] == compList[4] || compList[2] == compList[5] || compList[3] == compList[6] || compList[4] == compList[7]){
      comp4 = true;
    }
    if(user4 && !comp4){
      //User wins
    }
    if(!user4 && comp4){
      //Comp wins
    }
    if(user4 && comp4){
      //Tiebreaker needed
    }
      //Full house
    if(userList[0] == userList[2] || userList[1] == userList[3] || userList[2] == userList[4] || userList[3] == userList[5] || userList[4] == userList[6] || userList[5] == userList[7]){
      user3 = true;
    }
    if(compList[0] == compList[2] || compList[1] == compList[3] || compList[2] == compList[4] || compList[3] == compList[5] || compList[4] == compList[6] || compList[5] == compList[7]){
      comp3 = true;
    }

    for(let i = 0; i < 6; i++){
      if(userList[i] == userList[i+1]){
        userPair++;
      }
    }
    for(let i = 0; i < 6; i++){
      if(compList[i] == compList[i+1]){
        compPair++;
      }
    }

    if((user3 && (userPair > 0)) && !((compPair > 0) && comp3)){
      //User wins
    }
    if(!(user3 && (userPair > 0)) && ((compPair > 0) && comp3)){
      //Comp wins
    }
    if((user3 && (userPair > 0)) && ((compPair > 0) && comp3)){
      //Tie Breaker
    }
      //flush
    if(userFlush && !compFlush){
      //User wins
    }
    if(!userFlush && compFlush){
      //Comp wins
    }
    if(userFlush && compFlush){
      //Tie breaker
    }
      //Straight
      if(userStraight && !compStraight){
        //User wins
      }
      if(!userStraight && compStraight){
        //Comp wins
      }
      if(userStraight && compStraight){
        //Tie breaker
      }
      //Three of kind
      if(user3 && !comp3){
        //User wins
      }
      if(!user3 && comp3){
        //Comp wins
      }
      if(user3 && comp3){
        //Tie breaker
      }
      //Two pair
      if((userPair > 1) && !(compPair > 1)){
        //User wins
      }
      if(!(userPair > 1) && (compPair > 1)){
        //Comp wins
      }
      if((userPair > 1) && (compPair > 1)){
        //Tie breaker
      }
      //One pair
      if((userPair == 1) && !(compPair == 1)){
        //User wins
      }
      if(!(userPair == 1) && (compPair == 1)){
        //Comp wins
      }
      if((userPair == 1) && (compPair == 1)){
        //Tie breaker
      }
      //High card
      //Tie breaker logic
  }

  function handStart() {
    dealer = (dealer > 0) ? 0 : 1;
    //Blinds - Dealer has the big blind
    //Not sure what to do if the player meant to big blind does not have enough 
    //https://boardgames.stackexchange.com/questions/39045/in-poker-what-happens-with-the-next-players-if-paying-the-big-blind-puts-a-play
    if(dealer == 1){
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
    turn = (dealer > 0) ? 1 : 0;
    first = 1;
    postFlop = false;
    flop = false;
    theTurn = false;
    river = false;
    setShowButtonLeft(true);
    setShowButtonCenter(true);

    //Del later
    winCheck();

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