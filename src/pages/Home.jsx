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
  const [displayOpp, setDisplayOpp] = useState("Computer Chip Amount: " + oppMon);
  const [displayPot, setDisplayPot] = useState("Amount of Chips in the Pot: " + pot);
  const [displayUser, setDisplayUser] = useState("User's Chip Amount: " + userMon);
  const [displayLeftButton, setDisplayLeftButton] = useState("Call");
  const [displayMiddleButton, setDisplayMiddleButton] = useState("Bet 10");
  const [displayRightButton, setDisplayRightButton] = useState("Start Game");
  const [showButtonLeft, setShowButtonLeft] = useState(false);
  const [showButtonCenter, setShowButtonCenter] = useState(false);
  const [showButtonRight, setShowButtonRight] = useState(true);

  //Update text for opponent's pot
  const updatePot = () => {
    // Update the state variable with a new text
    setDisplayOpp("Computer's Chip Amount: " + oppMon);
    setDisplayPot("Amount of Chips in the Pot:  " + pot);
    setDisplayUser("User's Chip Amount: " + userMon);
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
    console.log("Check");
    turnStart();
  }

  function Fold(){
    //Needs to account for dealer I think
    if(turn == 0){
      userWins();
      console.log("Fold by computer");
    }else{
      computerWins();
      console.log("Fold by player");
    }

    handStart();
  }

  function userWins(){
    userMon += pot;
    pot = 0;
  }

  function computerWins(){
    oppMon += pot;
    pot = 0;
  }

  function gameTie(){
    userMon += (pot/2);
    oppMon += (pot/2);
    if((pot % 2) == 1){
      //Don't know what is right
      if(dealer){
        oppMon += 1;
      }else{
        userMon += 1;
      }
    }
    pot = 0;
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

  function hideFlop(){
    setImageMid1(cardImageImport[0]);
    setImageMid2(cardImageImport[0]);
    setImageMid3(cardImageImport[0]);
    setImageMid4(cardImageImport[0]);
    setImageMid5(cardImageImport[0]);
  }

  function hideOpponent(){
    setImageOpp1(cardImageImport[0]);
    setImageOpp2(cardImageImport[0]);
  }

  function logNumbersToTenBillion() {
    for (let i = 0; i <= 10000000000; i++) {
      console.log(i);
    }
  }

const delay = ms => new Promise(res => setTimeout(res, ms));
async function test(){
  winCheck();
  revealOpponent();
  await delay(4000);
  //Maybe change to handStart while loop or another function while loop
  handStart();
}
  //Start of a turn for either bot or player
  function turnStart() {
    
    if((secondLastMove == "R" && lastMove == "CA") || (secondLastMove == "CH" && lastMove == "CH") || (secondLastMove == "CA" && lastMove == "CH")){
      console.log("Middle Reveal");
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
        test();
        return;
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
      }else if((postFlop && lastMove == "") || (lastMove == "CH") || (lastMove == "CA" && secondLastMove == "" && !postFlop)){
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
    let userClub = [];
    let userHeart = [];
    let userSpade = [];
    let userDia = [];
    let compClub = [];
    let compHeart = [];
    let compSpade = [];
    let compDia = [];
    let userFlush = [];
    let compFlush = [];
    let userStraight = [];
    let compStraight = [];
    let userStraightFlush = 0;
    let compStraightFlush = 0;
    let comp4 = [];
    let user4 = [];
    let comp3 = [];
    let user3 = [];
    let userPair = [];
    let compPair = [];
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
            userClub.push(cardRankings[(i*2) + 1][1]);
          }else if(cardRankings[(i*2) + 1][0] == 'dia'){
            userDia.push(cardRankings[(i*2) + 1][1]);
          }else if(cardRankings[(i*2) + 1][0] == 'heart'){
            userHeart.push(cardRankings[(i*2) + 1][1]);
          }else{
            userSpade.push(cardRankings[(i*2) + 1][1]);
          }
          user1 = cardRankings[1][1];
          user2 = cardRankings[3][1];
        }else{
          if(cardRankings[(i*2) + 2][0] == 'club'){
            userClub.push(cardRankings[(i*2) + 2][1]);
          }else if(cardRankings[(i*2) + 2][0] == 'dia'){
            userDia.push(cardRankings[(i*2) + 2][1]);
          }else if(cardRankings[(i*2) + 2][0] == 'heart'){
            userHeart.push(cardRankings[(i*2) + 2][1]);
          }else{
            userSpade.push(cardRankings[(i*2) + 2][1]);
          }
          user1 = cardRankings[2][1];
          user2 = cardRankings[4][1];
        }
    }
    for(let i = 0; i < 2; i++){
      if(dealer){
        if(cardRankings[(i*2) + 2][0] == 'club'){
          compClub.push(cardRankings[(i*2) + 2][1]);
        }else if(cardRankings[(i*2) + 2][0] == 'dia'){
          compDia.push(cardRankings[(i*2) + 2][1]);
        }else if(cardRankings[(i*2) + 2][0] == 'heart'){
          compHeart.push(cardRankings[(i*2) + 2][1]);
        }else{
          compSpade.push(cardRankings[(i*2) + 2][1]);
        }
        comp1 = cardRankings[2][1];
        comp2 = cardRankings[4][1];
      }else{
        if(cardRankings[(i*2) + 1][0] == 'club'){
          compClub.push(cardRankings[(i*2) + 1][1]);
        }else if(cardRankings[(i*2) + 1][0] == 'dia'){
          compDia.push(cardRankings[(i*2) + 1][1]);
        }else if(cardRankings[(i*2) + 1][0] == 'heart'){
          compHeart.push(cardRankings[(i*2) + 1][1]);
        }else{
          compSpade.push(cardRankings[(i*2) + 1][1]);
        }
        comp1 = cardRankings[1][1];
        comp2 = cardRankings[3][1];
      }
    }
    for(let i = 5; i < 10; i++){
      if(cardRankings[i][0] == 'club'){
        compClubClub.push(cardRankings[i][1]);
        userClub.push(cardRankings[i][1]);
      }else if(cardRankings[i][0] == 'dia'){
        compDia.push(cardRankings[i][1]);
        userDia.push(cardRankings[i][1]);
      }else if(cardRankings[i][0] == 'heart'){
       compHeart.push(cardRankings[i][1]);
       userHeart.push(cardRankings[i][1]);
      }else{
        compSpade.push(cardRankings[i][1]);
        userSpade.push(cardRankings[i][1]);
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
    console.log(userList + " User short " + userListShort);

    //Flush check
    if(userClub.length >= 5){
      userFlush = userClub;
      console.log("Club");
    }else if(userDia.length >= 5){
      userFlush = userDia;
      console.log("Dia");
    }else if(userSpade.length >= 5){
      userFlush = userSpade;
      console.log("Spade");
    }else if(userHeart.length >= 5){
      userFlush = userHeart;
      console.log("Heart");
    }
    if(compClub.length >= 5){
      compFlush = compClub;
    }else if(compDia.length >= 5){
      compFlush = compDia;
    }else if(compSpade.length >= 5){
      compFlush = compSpade;
    }else if(compHeart.length >= 5){
      compFlush = compHeart;
    }

    //Straight check
    //WRONg START AT END FIRST AND STOP IF MATCHES FLUSH
    for(let i = 0; i < (userListShort-4); i++){
      for(let j = 0; j < 9; j++){
        if(userListShort.slice(i, i+5) == straight[j]){
          userStraight = userListShort.slice(i, i+5);
        }
      }
    }
    for(let i = 0; i < (compListShort-4); i++){
      for(let j = 0; j < 9; j++){
        if(compListShort.slice(i, i+5) == straight[j]){
          compStraight = compListShort.slice(i, i+5);
        }
      }
    }
    if(userList[6] == 14 && userList.slice(0, 4) == [2, 3, 4, 5]){
      userStraight = (userList.slice(0, 4)).concat(userList[6]);
    }
    if(compList[6] == 14 && compList.slice(0, 4) == [2, 3, 4, 5]){
      compStraight = (compList.slice(0, 4)).concat(compList[6]);
    }



    //User wins yo 



        //Straight Flush check
    //BROKEN NEEDS to BE FIXED

    if((!userStraight.length && !userFlush.length) && !(!compStraight.length && !compFlush.length)){
      userWins();
      console.log("User wins by straight flush");
      return;
    }
    if(!(!userStraight.length && !userFlush.length) && (!compStraight.length && !compFlush.length)){
      computerWins();
      console.log("Computer wins by srtaight flush");
      return;
    }
    if((!userStraight.length && !userFlush.length) && (!compStraight.length && !compFlush.length)){
      //Tie breaker
      if(userList[4] > compList[4]){
        userWins();
        console.log("User wins by staight flush 2");
        return;
      }else if(userList[4] > compList[4]){
        computerWins();
        console.log("Computer wins by staight flush 2");
        return;
      }
      //May need to add something for Royal straight vs weak Ace straight
    }

      //4 of kind
    if(userList[0] == userList[3]){
      user4 = 0;
    }else if(userList[1] == userList[4]){
      user4 = 1;
    }else if(userList[2] == userList[5]){
      user4 = 2;
    }else if(userList[3] == userList[6]){
      user4 = 3;
    }else if(userList[4] == userList[7]){
      user4 = 4;
    }

    if(compList[0] == compList[3]){
      comp4 = 0;
    }else if(compList[1] == compList[4]){
      comp4 = 1;
    }else if(compList[2] == compList[5]){
      comp4 = 2;
    }else if(compList[3] == compList[6]){
      comp4 = 3;
    }else if(compList[4] == compList[7]){
      comp4 = 4;
    }

    if(user4 && !comp4){
      userWins();
      console.log("User wins by 4 of kind");
      return;
    }
    if(!user4 && comp4){
      computerWins();
      console.log("Computer wins by 4 of kind");
      return;
    }
    if(user4 && comp4){
      //Tiebreaker needed
      if(userList[user4] > compList[comp4]){
        userWins();
        console.log("User wins by 4 of kind 2");
        return;
      }else if(userList[user4] < compList[comp4]){
        computerWins();
        console.log("Computer wins by 4 of kind 2");
        return;
      }
    }
      //Full house
    if(userList[0] == userList[2]){
      user3.push[0];
    }else if(userList[1] == userList[3]){
      user3.push[1];
    }else if(userList[2] == userList[4]){
      user3.push[2];
    }else if(userList[3] == userList[5]){
      user3.push[3];
    }else if(userList[4] == userList[6]){
      user3.push[4];
    }else if(userList[5] == userList[7]){
      user3.push[5];
    }

    if(compList[0] == compList[2]){
      comp3.push[0];
    }else if(compList[1] == compList[3]){
      comp3.push[1];
    }else if(compList[2] == compList[4]){
      comp3.push[2];
    }else if(compList[3] == compList[5]){
      comp3.push[3];
    }else if(compList[4] == compList[6]){
      comp3.push[4];
    }else if(compList[5] == compList[7]){
      comp3.push[5];
    }

    for(let i = 0; i < 6; i++){
      if(userList[i] == userList[i+1]){
        userPair.push(i);
      }
    }
    for(let i = 0; i < 6; i++){
      if(compList[i] == compList[i+1]){
        compPair.push(i);
      }
    }

    if((user3.length > 0 && (userPair.length > 0)) && !((compPair.length > 0) && comp3.length > 0)){
      userWins();
      console.log("User wins by Full house");
      return;
    }
    if(!(user3.length > 0 && (userPair.length > 0)) && ((compPair.length > 0) && comp3.length > 0)){
      computerWins();
      console.log("Computer wins by Full house");
      return;
    }
    if((user3.length > 0 && (userPair.length > 0)) && ((compPair.length > 0) && comp3.length > 0)){
      //Tie Breaker
      if(user3[0] > comp3[0]){
        userWins();
        console.log("User wins by Full house 2");
        return;
      }else if(user3[0] < comp3[0]){
        computerWins();
        console.log("Computer wins by Full house 2");
        return;
      }
    }
      //flush
    if(userFlush.length >= 5 && compFlush.length < 5){
      userWins();
      console.log("User wins by Flush");
      return;
    }
    if(userFlush.length < 5 && compFlush.length >= 5){
      computerWins();
      console.log("Computer wins by Flush");
      return;
    }
    if(userFlush.length >= 5 && compFlush.length >= 5){
      //Tie breaker
      //Call the tie breaker function
      for(let i = 4; i >= 0; i--){
        if(userFlush[i] > compFlush[i]){
          userWins();
          console.log("User wins by Flush 2");
          return;
        }else if(compFlush[i] > userFlush[i]){
          computerWins();
          console.log("Computer wins by Flush 2");
          return;
        }
      }

      gameTie();
      console.log("Game tie in Flush");
      return;
    }
      //Straight
      if(userStraight.length == 5 && compStraight.length != 5){
        userWins();
        console.log("User wins by Straight " + userStraight.length);
        return;
      }
      if(userStraight.length != 5 && compStraight.length == 5){
        computerWins();
        console.log("Computer wins by Straight");
        return;
      }
      if(userStraight.length == 5 && compStraight.length == 5){
        //Tie breaker
        if(userStraight[4] > compStraight[4]){
          userWins();
          console.log("User wins by Straight 2");
          return;
        }else if(userStraight[4] > compStraight[4]){
          computerWins();
          console.log("Computer wins by Straight 2");
          return;
        }else{
          //Tie split pot
          //May need to add something for Royal straight vs weak Ace straight'
          gameTie()
          console.log("Tie game in straight " + userStraight.length);
          return;
        }
      }
      //Three of kind
      if(user3.length > 0 && !comp3.length > 0){
        userWins();
        console.log("User wins by 3 kind");
        return;
      }
      if(!user3.length > 0 && comp3.length > 0){
        computerWins();
        console.log("Computer wins by 3 kind");
        return;
      }
      if(user3.length > 0 && comp3.length > 0){
        //Tie breaker
        if(user3[0] > comp3[0]){
          userWins();
          console.log("User wins by 3 kind 2");
          return;
        }else if(user3[0] < comp3[0]){
          computerWins();
          console.log("Computer wins by 3 kind 2");
          return;
        }

        temp = userList.indexOf(user3[0]);
        userList.splice(temp, 3);
        temp = compList.indexOf(comp3[0]);
        compList.splice(temp, 3);
        for(let i = 3; i > 1; i--){
          if(userList[i] > compList[i]){
            userWins();
            console.log("User wins by 3 kind 3");
            return;
          }else if(userList[i] < compList[i]){
            computerWins();
            console.log("Computer wins by 3 kind 3");
            return;
          }
        }
        //Tie spilt pot
      }
      //Two pair
      if((userPair.length > 1) && !(compPair.length > 1)){
        userWins();
        console.log("User wins by 2 2 kind");
        return;
      }
      if(!(userPair.length > 1) && (compPair.length > 1)){
        computerWins();
        console.log("Computer wins by 2 2 kind");
        return;
      }
      if((userPair.length > 1) && (compPair.length > 1)){
        //Tie breaker
        userPair = userList.sort(function (a, b) {  return a - b;  });
        compPair = compList.sort(function (a, b) {  return a - b;  });
        if(userPair[1] > compPair[1]){
          userWins();
          console.log("User wins by 2 2 kind 2");
          return;
        }else if(userPair[1] < compPair[1]){
          computerWins();
          console.log("Computer wins by 2 2 kind 2");
          return;
        }
        if(userPair[0] > compPair[0]){
          userWins();
          console.log("User wins by 2 2 kind 3");
          return;
        }else if(userPair[0] < compPair[0]){
          computerWins();
          console.log("Computer wins by 2 2 kind 3");
          return;
        }
        //Have to find highest card that is not apart of pair to break tie
        temp = userList.indexOf(userPair[1]);
        userList.splice(temp, 2);
        temp = compList.indexOf(userPair[0]);
        userList.splice(temp, 2);
        temp = userList.indexOf(compPair[1]);
        compList.splice(temp, 2);
        temp = compList.indexOf(compPair[0]);
        compList.splice(temp, 2);
        if(userList[2] > compList[2]){
          userWins();
          console.log("User wins by 2 2 kind 4");
          return;
        }else if(userList[2] < compList[2]){
          computerWins();
          console.log("Computer wins by 2 2 kind 4");
          return;
        }else{
          //Tie spilt pot
          gameTie();
          console.log("Tie in 2 pairs");
          return;
        }
      }
      //One pair
      if((userPair.length == 1) && !(compPair.length == 1)){
        userWins();
        console.log("User wins by one pair");
        return;
      }
      if(!(userPair.length == 1) && (compPair.length == 1)){
        computerWins();
        console.log("Computer wins by one pair");
        return;
      }
      if((userPair.length == 1) && (compPair.length == 1)){
        //Tie breaker
        if(userPair[0] > compPair[0]){
          userWins();
          console.log("User wins by one pair 2");
          return;
        }else if(userPair[0] < compPair[0]){
          computerWins();
          console.log("Computer wins by one pair 2");
          return;
        }
        temp = userList.indexOf(userPair[0]);
        userList.splice(temp, 2);
        temp = compList.indexOf(compPair[0]);
        compList.splice(temp, 2);
        //Tie Breaker is top 3 cards not in the pair
        for(let i = 5; i > 2; i--){
          if(userList[i] > compList[i]){
            userWins();
            console.log("User wins by one pair 3");
            return;
          }else if(userList[i] < compList[i]){
            computerWins();
            console.log("Computer wins by one pair 3");
            return;
          }
        }
        //Tie Spilt tie
        gameTie();
        console.log("Tie in pair");
        return;
      }
      //High card
      //Tie breaker logic
      if(userList.slice(2) == compList.slice(2)){
        //Game is a tie
        //Split pot
        gameTie();
        console.log("Tie in card high");
        return;
      }
      for(let i = 6; i > 1; i--){
        if(userList[i] > compList[i]){
          userWins();
          console.log("User wins by Card high");
          return;
        }else if(compList[i] > userList[i]){
          computerWins();
          console.log("Computer wins by Card High");
          return;
        }
      }
  }

  function handStart() {
   //While loop

   if(userMon == 0){
    alert("The computer has won the game");
   }else if(oppMon == 0){
    alert("The human has won the game");
   }

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
    hideFlop();
    hideOpponent();
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
    //winCheck();

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
    </div>
  )
}

export default Home