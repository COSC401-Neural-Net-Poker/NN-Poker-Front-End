import { useState, useEffect } from 'react';
import '../pages/PokerTable.css';
import styled from 'styled-components';
import cardImageImport from '../pages/cardImageImport';
import cardRankings from '../pages/cardRankings';
import GameState from './GameState';
import BackFlip from "../pages/cards/BackFlip.svg";
import DeckBruh from "../pages/cards/DeckBruh.svg";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";

let pot = 0;
let oppMon = 500;
let userMon = 500;
let turn;
let dealer;
let secondLastMove = "";
let lastMove = "";
let button1 = 0;
let first = 1;
let dealChange = false;
let postFlop = false;
let flop = false;
let theTurn = false;
let river = false;
let round = [0, 0, 0, 0]
let roundNumber = 0;
let endResult;
let numHands;
const hand = {
  totalBet: 0,
  compBet: 0,
  userBet: 0,
  winCondition: "",
  foldRound: null,
  winner: "",
  winningHand: null
}


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

const PokerTableComponent = () => {
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
  const [displayRightButton, setDisplayRightButton] = useState("Fold");
  const [showButtonLeft, setShowButtonLeft] = useState(false);
  const [showButtonCenter, setShowButtonCenter] = useState(false);
  const [showButtonRight, setShowButtonRight] = useState(false);
  const [cssReveal, setCssReveal] = useState("")
  const [firstThreeMiddle, setFirstThreeMiddle] = useState("")
  const [fourthMiddle, setFourthMiddle] = useState("")
  const [lastMiddle, setLastMiddle] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [gameState, setGameState] = useState("start")
  const [gameHistory, setGameHistory] = useState([])
  const [userInstance, setUserInstance] = useState(null)

  // Wherever the game is at an ending point, we need to do setGameState("over")
  // and we also need to run saveHistory() and either pass in our game data or just track it for each
  // new game with state.

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true)
        setUserInstance(user)
      }
      else setLoggedIn(false)
    });

    return () => listen()
  }, []);

  // (BRANDON BUDDY) Whenever the game comes to a close, we need to call this function to save the game history automatically
  const saveHistory = async () => {
    // This will save the game data to the users history array
    today = new Date()
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    if (loggedIn) {
      // this currentGame variable will be populated from state during our game
      // hard-coded for the time-being
      let currentGame = {
        result: endResult,
        date: mm + '-' + dd + '-' + yyyy,
        numOfHands: numHands,
        handHistory: [
          {
            totalPotAmount: 125,
            computerBetAmount: 75,
            playerBetAmount: 50,
            cards: ["Club11", "Spade14", "Heart8", "Heart3", "Heart14", "Spade11", "Dia10", "Dia13", "Dia2"],
            winCondition: "fold",
            foldRound: 3,
            winner: "computer",
            winningHand: null
          },
          {
            totalPotAmount: 75,
            computerBetAmount: 25,
            playerBetAmount: 50,
            cards: ["Dia5", "Club10", "Heart10", "Spade14", "Club4", "Heart4", "Spade4", "Dia4", "Club6"],
            winCondition: "completed",
            foldRound: null,
            winner: "player",
            winningHand: ["Club14", "Club13", "Club12", "Club11", "Club10"]
          },
        ]
      }
      try {
        const userRef = doc(db, "users", userInstance?.uid)
        const docSnap = await getDoc(userRef)
        const userData = docSnap.data()
        let pastGames = userData?.history || []
        await setDoc(
            userRef,
            {
              history: [...pastGames, currentGame]
            },
            { merge: true }
        )
      }
      catch(error) {
        console.log(error)
      }
    }
  }

  const resetBoard = async () => {
    console.log("resetting poker table")
    // reset the poker table, setup the new game
    // I don't know how to do this (BRANDON BUDDY)
  }


  const gameStart = async (cond) => {
    setIsGameStarted(cond)
    userMon = 500
    oppMon = 500
    dealer = 1;
    handStart()
  }

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

  function playTest() {
    opp[0] = cardImageImport[0];
    opp[1] = cardImageImport[0];
    mid[0] = cardImageImport[0];
    mid[1] = cardImageImport[0];
    mid[2] = cardImageImport[0];
    mid[3] = cardImageImport[0];
    mid[4] = cardImageImport[0];
    user[0] = cardImageImport[0];
    user[1] = cardImageImport[0];

    cardRankings[1] = cardRankings[1];
    cardRankings[2] = cardRankings[51];
    cardRankings[3] = cardRankings[3];
    cardRankings[4] = cardRankings[50];
    cardRankings[5] = cardRankings[15];
    cardRankings[6] = cardRankings[17];
    cardRankings[7] = cardRankings[21];
    cardRankings[8] = cardRankings[29];
    cardRankings[9] = cardRankings[39];

    cardImageImport[1] = cardImageImport[1];
    cardImageImport[2] = cardImageImport[51];
    cardImageImport[3] = cardImageImport[3];
    cardImageImport[4] = cardImageImport[50];
    cardImageImport[5] = cardImageImport[15];
    cardImageImport[6] = cardImageImport[17];
    cardImageImport[7] = cardImageImport[21];
    cardImageImport[8] = cardImageImport[29];
    cardImageImport[9] = cardImageImport[39];
  }
  
  function Bet() {
    if(turn == 0) {
      if(first == 1){
        oppMon -= 5;
        pot += 5;
        hand.totalBet += 5;
        hand.compBet += 5
        console.log("Bet of 5 by computer");
      }else{
        oppMon -= 10;
        pot += 10;
        hand.compBet += 10;
        hand.totalBet += 10;
        console.log("Bet of 10 by computer");
      }
    }else{
      if(first == 1){
        userMon -= 5;
        pot += 5;
        hand.userBet += 5
        hand.totalBet += 5
        console.log("Bet of 5 by user");
      }else{
        userMon -= 10;
        pot += 10;
        hand.userBet += 10;
        hand.totalBet += 10;
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
    //Condense to final player variable which says whos turn it is
    if(turn == 0) {
      if(first == 1){
        oppMon -= 15;
        pot += 15;
        hand.compBet += 15;
        hand.totalBet += 15;
        console.log("Raise of 15 by computer");
      }else{
        oppMon -= 20;
        pot += 20;
        hand.compBet += 20;
        hand.totalBet += 20;
        console.log("Raise of 20 by computer " + round[roundNumber]);
      }
    }else{
      if(first == 1){
        userMon -= 15;
        pot += 15;
        hand.userBet += 15;
        hand.totalBet += 15;
        console.log("Raise of 15 by player");
      }else{
        userMon -= 20;
        pot += 20;
        hand.userBet += 20;
        hand.totalBet += 20;
        console.log("Raise of 20 by player + " + round[roundNumber]);
      }
    }

    round[roundNumber] += 1;
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
    hand.winCondition = "fold";
    hand.winningHand = null;

    handStart();
  }

  function userWins(){
    userMon += pot;
    pot = 0;
    hand.winner = "user"
  }

  function computerWins(){
    oppMon += pot;
    pot = 0;
    hand.winner = "computer"
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
  async function revealHand() {
    if(dealer){
      setImageUser1(cardImageImport[0])
      setImageUser2(cardImageImport[0])
      setCssReveal("d")
      await delay(600)
      setImageUser1(cardImageImport[0])
      setImageUser2(cardImageImport[0])
      await delay(300)
      setImageUser1(cardImageImport[1]);
      setImageUser2(cardImageImport[3]);
      setCssReveal("")

    }else{
      setImageUser1(cardImageImport[0])
      setImageUser2(cardImageImport[0])
      setCssReveal("d")
      await delay(600)
      setImageUser1(cardImageImport[0])
      setImageUser2(cardImageImport[0])
      await delay(300)
      setImageUser1(cardImageImport[2]);
      setImageUser2(cardImageImport[4]);
      setCssReveal("")
      console.log("User not dealer");
    }
  }

  async function revealFlop() {
    setFirstThreeMiddle("scale-[150%]")
    await delay(100)
    setFirstThreeMiddle("")
    await delay(100)
    setFirstThreeMiddle("scale-[150%]")
    await delay(100)
    setFirstThreeMiddle("")
    setImageMid1(cardImageImport[5]);
    setImageMid2(cardImageImport[6]);
    setImageMid3(cardImageImport[7]);
  }

  async function revealTurn() {
    setFourthMiddle("scale-[150%]")
    await delay(700)
    setFourthMiddle("")
    setImageMid4(cardImageImport[8]);
  }

  async function revealRiver() {
    setLastMiddle("scale-[150%]")
    await delay(700)
    setLastMiddle("")
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
async function de(){
  winCheck();
  revealOpponent();
  await delay(4000);
  //Maybe change to handStart while loop or another function while loop
  handStart();
}

//Start of a turn for either bot or player
async function turnStart() {
  //Flip cards
  if((secondLastMove == "R" && lastMove == "CA") || (secondLastMove == "CH" && lastMove == "CH") || (secondLastMove == "CA" && lastMove == "CH")){
    console.log("Middle Reveal");
    setShowButtonLeft(true);
    if(flop == false){
      revealFlop();
      dealChange = true;
      flop = true;
      roundNumber = 1;
    }else if(theTurn == false){
      revealTurn();
      dealChange = true;
      theTurn = true;
      roundNumber = 2;
    }else if(river == false){
      revealRiver();
      dealChange = true;
      river = true
      roundNumber = 3;
    }else{
      de();
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

 if(turn == 0){
    let che = 0;
    let be = 0;
    let rai = 0;
    let fo = 0;
    //let ava = {};
    let ava = []
    let rawAva = [];
    let bin = comBinaryConvert();
    //Set actions avaiable
    if(oppMon == 0){
      //Maybe nothing
      che = 1;
    }else if((postFlop && lastMove == "") || (lastMove == "CH") || (lastMove == "CA" && secondLastMove == "" && !postFlop)){
      //ra = 1;
      //ava[1] = null
      ava.push([1, null])
      rawAva.push('raise');
      //fo = 1;
      ava.push([2, null])
      //ava[2] = null
      rawAva.push('fold')
      //che = 1;
      //ava[3] = null
      ava.push([3, null])
      rawAva.push('check')
    }else{
      //be = 1;
      //ava[0] = null
      ava.push([0, null])
      rawAva.push('call');
      //rai = 1;
      //ava[1] = null
      ava.push([1, null])
      rawAva.push('raise');
      //fo = 1;
      //ava[2] = null
      ava.push([2, null])
      rawAva.push('fold')
    }
    console.log("Calling model");
    modelOutput = callModel(bin, ava, rawAva);
    modelOutput = Number(modelOutput.output);
    if(modelOutput == 0){
      Bet();
    }else if(modelOutput == 1){
      Raise();
    }else if(modelOutput == 2){
      Fold();
    }else(modelOutput == 3){
      Check();
    }

   //Call api
   //Do what api says
 }
 //////If player
 else{
    //No money means you can't bet
    if(userMon == 0 || oppMon == 0){
      setDisplayMiddleButton(false);
      //In the future have an auto advance function
    }
    if(first == 1){
      setDisplayLeftButton("Raise 15");
      setDisplayMiddleButton("Bet 5");
      setDisplayRightButton("Fold");
      button1 = false;
    //Right of or may be changed to own else if because (bet 10) may need to be (raise 10)
    }else if((postFlop && lastMove == "") || (lastMove == "CH") || (lastMove == "CA" && secondLastMove == "" && !postFlop)){
      setDisplayLeftButton("Check");
      setDisplayMiddleButton("Bet 10");
      setDisplayRightButton("Fold");
      button1 = true;
    }else if(round[roundNumber] == 4){
      //May need to be 3?
      console.log("Three raise rule")
      setShowButtonLeft(false);
      setDisplayMiddleButton("Bet 10");
      setDisplayRightButton("Fold");
      //This is wrong
    }else{
      setDisplayMiddleButton("Bet 10");
      setDisplayLeftButton("Raise 20");
      setDisplayRightButton("Fold");
      button1 = false;
    }
  }
}

function callModel(binOutput, legal, rawLegal){
  let bodyObj = {
    "obs": binOutput,
    "legal_actions": legal,
    "raw_legal_actions": rawLegal
  }
  
  const url = "http://35.202.107.161:8080/model";
  const body = {
    input_string: bodyObj
  };
  console.log("Sending to model: " + JSON.stringify(bodyObj))

  
  fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
    },
    body: JSON.stringify(bodyObj)
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

  return data;
}

function comBinaryConvert(){
  let comBin = Array(72).fill(0);
  var suit = {
    Spade: 0,
    Heart: 13,
    Dia: 26,
    Club: 39
  };
  let cardConvert = [-1, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0];
  //Get just computer's cards
  if(dealer){
    comBin[cardConvert[cardRankings[2][1]] + suit[cardRankings[2][0]]] = 1;
    comBin[cardConvert[cardRankings[4][1]] + suit[cardRankings[4][0]]] = 1;
  }else{
    comBin[cardConvert[cardRankings[1][1]] + suit[cardRankings[1][0]]] = 1;
    comBin[cardConvert[cardRankings[3][1]] + suit[cardRankings[3][0]]] = 1;
  }
  //Get flop's cards
  if(flop){
    comBin[cardConvert[cardRankings[5][1]] + suit[cardRankings[5][0]]] = 1;
    comBin[cardConvert[cardRankings[6][1]] + suit[cardRankings[6][0]]] = 1;
    comBin[cardConvert[cardRankings[7][1]] + suit[cardRankings[7][0]]] = 1;
  }
  //Get the turn's cards
  if(theTurn){
    comBin[cardConvert[cardRankings[8][1]] + suit[cardRankings[8][0]]] = 1;
  }
  //Get the river's cards
  if(river){
    comBin[cardConvert[cardRankings[9][1]] + suit[cardRankings[9][0]]] = 1;
  }
  //Set the raise number
  comBin[52+roundNumber[0]] = 1;
  comBin[52+roundNumber[1]] = 1;
  comBin[52+roundNumber[2]] = 1;
  comBin[52+roundNumber[3]] = 1;
  return comBin;
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
    let userSAll = [];
    let compSAll = [];
    let userStraightFlush = [];
    let compStraightFlush = [];
    let comp4 = 0;
    let user4 = 0;
    let comp3 = [];
    let user3 = [];
    let userPair = [];
    let compPair = [];
    let user1 = -1;
    let user2 = -1;
    let comp1 = -1;
    let comp2 = -1;
    let userList = []; //User cards + middle
    let compList = [];
    let userListShort = []; //User cards without
    let compListShort = [];
    let userHigh = -1;
    let compHigh = -1;
    let straight = [[2, 3, 4, 5 ,6], [3, 4, 5, 6, 7] ,[4, 5, 6, 7, 8], [5, 6, 7, 8, 9], [6, 7, 8, 9, 10], 
      [7, 8, 9, 10, 11], [8, 9, 10, 11, 12], [9, 10, 11, 12, 13], [10, 11, 12, 13, 14]];

    //Change this later is bad
    //Could condesnse by using dealer in math
    //Flush
    for(let i = 0; i < 2; i++){
        if(dealer){
          if(cardRankings[(i*2) + 1][0] == 'Club'){
            userClub.push(cardRankings[(i*2) + 1][1]);
          }else if(cardRankings[(i*2) + 1][0] == 'Dia'){
            userDia.push(cardRankings[(i*2) + 1][1]);
          }else if(cardRankings[(i*2) + 1][0] == 'Heart'){
            userHeart.push(cardRankings[(i*2) + 1][1]);
          }else{
            userSpade.push(cardRankings[(i*2) + 1][1]);
          }
          user1 = cardRankings[1][1];
          user2 = cardRankings[3][1];
        }else{
          if(cardRankings[(i*2) + 2][0] == 'Club'){
            userClub.push(cardRankings[(i*2) + 2][1]);
          }else if(cardRankings[(i*2) + 2][0] == 'Dia'){
            userDia.push(cardRankings[(i*2) + 2][1]);
          }else if(cardRankings[(i*2) + 2][0] == 'Heart'){
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
        if(cardRankings[(i*2) + 2][0] == 'Club'){
          compClub.push(cardRankings[(i*2) + 2][1]);
        }else if(cardRankings[(i*2) + 2][0] == 'Dia'){
          compDia.push(cardRankings[(i*2) + 2][1]);
        }else if(cardRankings[(i*2) + 2][0] == 'Heart'){
          compHeart.push(cardRankings[(i*2) + 2][1]);
        }else{
          compSpade.push(cardRankings[(i*2) + 2][1]);
        }
        comp1 = cardRankings[2][1];
        comp2 = cardRankings[4][1];
      }else{
        if(cardRankings[(i*2) + 1][0] == 'Club'){
          compClub.push(cardRankings[(i*2) + 1][1]);
        }else if(cardRankings[(i*2) + 1][0] == 'Dia'){
          compDia.push(cardRankings[(i*2) + 1][1]);
        }else if(cardRankings[(i*2) + 1][0] == 'Heart'){
          compHeart.push(cardRankings[(i*2) + 1][1]);
        }else{
          compSpade.push(cardRankings[(i*2) + 1][1]);
        }
        comp1 = cardRankings[1][1];
        comp2 = cardRankings[3][1];
      }
    }
    for(let i = 5; i < 10; i++){
      if(cardRankings[i][0] == 'Club'){
        compClub.push(cardRankings[i][1]);
        userClub.push(cardRankings[i][1]);
      }else if(cardRankings[i][0] == 'Dia'){
        compDia.push(cardRankings[i][1]);
        userDia.push(cardRankings[i][1]);
      }else if(cardRankings[i][0] == 'Heart'){
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
        i--;
      }
    }
    for(let i = 0; i < compListShort.length - 1; i++){
      if(compListShort[i] == compListShort[i + 1]){
        compListShort.splice(i, 1);
        i--;
      }
    }


    console.log(compList + " Computer " + compListShort);
    console.log(userList + " User short " + userListShort);

    //Flush check
    if(userClub.length >= 5){
      userFlush = userClub;
      console.log("H-Club");
    }else if(userDia.length >= 5){
      userFlush = userDia;
      console.log("H-Dia " + userDia);
    }else if(userSpade.length >= 5){
      userFlush = userSpade;
      console.log("H-Spade " + userSpade);
    }else if(userHeart.length >= 5){
      userFlush = userHeart;
      console.log("H-Heart");
    }
    if(compClub.length >= 5){
      compFlush = compClub;
      console.log("C-Club");
    }else if(compDia.length >= 5){
      compFlush = compDia;
      console.log("C-Dia");
    }else if(compSpade.length >= 5){
      compFlush = compSpade;
      console.log("C-Spade");
    }else if(compHeart.length >= 5){
      compFlush = compHeart;
      console.log("C-Heart");
    }

    userFlush = userFlush.sort(function (a, b) {  return a - b;  });
    compFlush = compFlush.sort(function (a, b) {  return a - b;  });

    //Straight check
    for(let i = 0; i < (userListShort.length-4); i++){
      for(let j = 0; j < 9; j++){
        if(userListShort.slice(i, i+5).every(function(element, index) {
          return element === straight[j][index]; })){
          userStraight = userListShort.slice(i, i+5);
          userSAll.push(userListShort.slice(i, i+5));
        }
      }
    }
    for(let i = 0; i < (compListShort.length-4); i++){
      for(let j = 0; j < 9; j++){
        if(compListShort.slice(i, i+5).every(function(element, index) {
          return element === straight[j][index]; })){
          compStraight = compListShort.slice(i, i+5);
          compSAll.push(compListShort.slice(i, i+5));
        }
      }
    }

    //Check for weak ace straight
    if(userList[6] == 14 && userListShort[0] == 2 && userListShort[1] == 3 && userListShort[2] == 4 && userListShort[3] == 5){
      if(userStraight < 5  || (userStraight[4] != 14)){
        userStraight = (userListShort.slice(0, 4)).concat(userList[6]);
      }
      userSAll.push((userListShort.slice(0, 4)).concat(userList[6]));
    }
    if(compList[6] == 14 && compListShort.slice(0, 4) == [2, 3, 4, 5]){
      if(compStraight < 5  || (compStraight[4] != 14)){
        compStraight = (compListShort.slice(0, 4)).concat(compList[6]);
      }
      compSAll.push((compListShort.slice(0, 4)).concat(compList[6]));
    }


    //Straight Flush Setup
    if(userStraight.length >= 5 && userFlush.length >= 5){
      for(let i = 0; i < (userFlush.length-4); i++){
        for(let j = 0; j < userSAll.length; j++){
          if(userFlush.slice(i, i+5).every(function(element, index) {
            return element === userSAll[j][index]; })){
              userStraightFlush = userFlush.slice(i, i+5)
          }
        }
      }
    }
    if(compStraight.length >= 5 && compFlush.length >= 5){
      for(let i = 0; i < (compFlush.length-4); i++){
        for(let j = 0; j < compSAll.length; j++){
          if(compFlush.slice(i, i+5).every(function(element, index) {
            return element === compSAll[j][index]; })){
              compStraightFlush = compFlush.slice(i, i+5)
          }
        }
      }
    }

    //Straight Flush Win Check
    if(userStraightFlush.length >= 5 && !(compStraightFlush.length >= 5)){
      userWins();
      console.log("User wins by straight flush");
      return;
    }
    if(!(userStraightFlush.length >= 5) && compStraightFlush.length >= 5 ){
      computerWins();
      console.log("Computer wins by straight flush");
      return;
    }
    if(userStraightFlush.length >= 5 && compStraightFlush.length >= 5){
      //Tie breaker
      for(let i = 4; i >= 0 ; i--){
        if(userStraightFlush[i] > compStraightFlush[i]){
          userWins();
          console.log("User wins by straight flush 2");
          return;
        }else if(userStraightFlush[i] < compStraightFlush[i]){
          computerWins();
          console.log("Computer wins by straight flush 2");
          return;
        }
      }
      console.log("Tie by straight flush 2");
      gameTie();
      return;
      //May need to add something for Royal straight vs weak Ace straight
    }

    //4 of kind Set up
    if(userList[0] == userList[3]){
      user4 = userList[0];
    }else if(userList[1] == userList[4]){
      user4 = userList[1];
    }else if(userList[2] == userList[5]){
      user4 = userList[2];
    }else if(userList[3] == userList[6]){
      user4 = userList[3];
    }

    if(compList[0] == compList[3]){
      comp4 = compList[0];
    }else if(compList[1] == compList[4]){
      comp4 = compList[1];
    }else if(compList[2] == compList[5]){
      comp4 = compList[2];
    }else if(compList[3] == compList[6]){
      comp4 = compList[3];
    }

    //4 of kind Win Check
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
      if(user4 > comp4){
        userWins();
        console.log("User wins by 4 of kind 2");
        return;
      }else if(user4 < comp4){
        computerWins();
        console.log("Computer wins by 4 of kind 2");
        return;
      }
      temp = userList.indexOf(user4);
      userList.splice(temp, 4);
      temp = compList.indexOf(comp4);
      compList.splice(temp, 4);
      if(userList[userList.length-1] > compList[compList.length-1]){
        userWins();
        console.log("User wins by 4 of kind 3");
        return;
      }else if(userList[userList.length-1] < compList[compList.length-1]){
        computerWins();
        console.log("Computer wins by 4 of kind 3");
        return;
      }
    }

    //Full house
    if(userList[0] == userList[2]){
      user3.push(userList[0]);
    }else if(userList[1] == userList[3]){
      user3.push(userList[1]);
    }else if(userList[2] == userList[4]){
      user3.push(userList[2]);
    }else if(userList[3] == userList[5]){
      user3.push(userList[3]);
    }else if(userList[4] == userList[6]){
      user3.push(userList[4]);
    }

    if(compList[0] == compList[2]){
      comp3.push(compList[0]);
    }else if(compList[1] == compList[3]){
      comp3.push(compList[1]);
    }else if(compList[2] == compList[4]){
      comp3.push(compList[2]);
    }else if(compList[3] == compList[5]){
      comp3.push(compList[3]);
    }else if(compList[4] == compList[6]){
      comp3.push(compList[4]);
    }

    let tmp = userList.slice()
    for(let i = 0; i < user3.length; i++){
      temp = userList.indexOf(user3[i]);
      tmp.splice(temp, 3);
    }
    let tmp2 = compList.slice()
    for(let i = 0; i < comp3.length; i++){
      temp = compList.indexOf(comp3[i]);
      tmp2.splice(temp, 3);
    }

    for(let i = 0; i < tmp.length-1; i++){
      if(tmp[i] == tmp[i+1]){
        userPair.push(tmp[i]);
      }
    }
    for(let i = 0; i < tmp2.length-1; i++){
      if(tmp2[i] == tmp2[i+1]){
        compPair.push(tmp[i]);
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
      if(user3[user3.length-1] > comp3[comp3.length-1]){
        userWins();
        console.log("User wins by Full house 2");
        return;
      }else if(user3[user3.length-1] < comp3[comp3.length-1]){
        computerWins();
        console.log("Computer wins by Full house 2");
        return;
      }

      if(userPair[userPair.length-1] > compPair[compPair.length-1]){
        userWins();
        console.log("User wins by Full house 3");
        return;
      }else if(userPair[userPair.length-1] < compPair[compPair.length-1]){
        computerWins();
        console.log("Computer wins by Full house 3");
        return;
      }

      //Tie game
      gameTie();
      console.log("Tie game in Full house");
      return;
    }

    //Flush
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
       for(let i = 0; i < 5; i--){
         if(userFlush[userFlush.length - 1 - i] > compFlush[compFlush.length - 1 - i]){
           userWins();
           console.log("User wins by Flush 2");
           return;
         }else if(compFlush[compFlush.length - 1 - i] > userFlush[userFlush.length - 1 - i]){
           computerWins();
           console.log("Computer wins by Flush 2");
           return;
         }
       }
       gameTie();
       console.log("Tie game in Flush")
    }

      //Straight
      if(userStraight.length == 5 && compStraight.length != 5){
        userWins();
        console.log("User wins by Straight " + userStraight);
        return;
      }
      if(userStraight.length != 5 && compStraight.length == 5){
        computerWins();
        console.log("Computer wins by Straight " + compStraight);
        return;
      }
      if(userStraight.length == 5 && compStraight.length == 5){
        //Tie breaker
        for(let i = 4; i >= 0; i--){
          if(userStraight[i] > compStraight[i]){
            userWins();
            console.log("User wins by Straight 2 " + userStraight);
            return;
          }
          if(compStraight[i] > userStraight[i]){
            computerWins();
            console.log("Computer wins by Straight 2 " + compStraight);
            return;
          }
        }
        //Tie split pot
        gameTie()
        console.log("Tie game in double straight ");
        return;
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
        if(user3[user3.length-1] > comp3[comp3.length-1]){
          userWins();
          console.log("User wins by 3 kind 2");
          return;
        }else if(user3[user3.length-1] < comp3[comp3.length-1]){
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
            console.log("User wins by 3 kind 3 " + userList[i]);
            return;
          }else if(userList[i] < compList[i]){
            computerWins();
            console.log("Computer wins by 3 kind 3");
            return;
          }
        }
        //Tie spilt pot
        gameTie();
        return;
      }
      //Two pair
      if((userPair.length > 1) && !(compPair.length > 1)){
        userWins();
        console.log("User wins by 2 Pair");
        return;
      }
      if(!(userPair.length > 1) && (compPair.length > 1)){
        computerWins();
        console.log("Computer wins by 2 Pair");
        return;
      }
      if((userPair.length > 1) && (compPair.length > 1)){
        //Tie breaker
        //userPair = userList.sort(function (a, b) {  return a - b;  });
        //compPair = compList.sort(function (a, b) {  return a - b;  });
        if(userPair[userPair.length-1] > compPair[compPair.length-1]){
          userWins();
          console.log("User wins by 2 Pair 2");
          return;
        }else if(userPair[userPair.length-1] < compPair[compPair.length-1]){
          computerWins();
          console.log("Computer wins by 2 Pair 2");
          return;
        }
        if(userPair[userPair.length-2] > compPair[compPair.length-2]){
          userWins();
          console.log("User wins by 2 Pair 3");
          return;
        }else if(userPair[userPair.length-2] < compPair[compPair.length-2]){
          computerWins();
          console.log("Computer wins by 2 Pair 3");
          return;
        }
        //Have to find highest card that is not apart of pair to break tie
        temp = userList.indexOf(userPair[userPair.length-1]);
        userList.splice(temp, 2);
        temp = userList.indexOf(userPair[userPair.length-2]);
        userList.splice(temp, 2);
        temp = compList.indexOf(compPair[compPair.length-1]);
        compList.splice(temp, 2);
        temp = compList.indexOf(compPair[compPair.length-2]);
        compList.splice(temp, 2);
        if(userList[userList.length-1] > compList[compList.length-1]){
          userWins();
          console.log("User wins by 2 Pair 4");
          return;
        }else if(userList[userList.length-1] < compList[compList.length-1]){
          computerWins();
          console.log("Computer wins by 2 Pair 4");
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
        for(let i = userList.length-1; i > userList.length-4; i--){
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
      gameTie();
      console.log("Tie in card high");
      return;
  }

  //Used at the start of each hand
  function handStart() {

    //Game is over
    if(userMon == 0){
      alert("The computer has won the game");
      endResult = "computer"
      saveHistory()
      gameStart()
    }else if(oppMon == 0){
      alert("The human has won the game");
      endResult = "user"
      saveHistory()
      gameStart()
    }

    numHands += 1;
    hand.totalBet = 0;
    hand.compBet = 0;
    hand.userBet = 0

    dealer = (dealer > 0) ? 0 : 1;
    //Blinds - Dealer has the big blind
    //Not sure what to do if the player meant to big blind does not have enough 
    //https://boardgames.stackexchange.com/questions/39045/in-poker-what-happens-with-the-next-players-if-paying-the-big-blind-puts-a-play
    if(dealer == 1){
      if(oppMon < 10){
        pot += oppMon;
        hand.totalBet += oppMon;
        hand.compBet += oppMon;
        oppMon -= oppMon;
      }else{
        hand.totalBet += 10;
        hand.compBet += 10;
        pot += 10;
        oppMon -= 10;
      }
      hand.totalBet += 5;
      hand.userBet += 5;
      userMon -= 5;
      pot += 5;
    }else{
      //console.log(userMon)
      if(userMon < 10){
        pot += userMon
        hand.totalBet += userMon
        hand.userBet += userMon
        userMon -= userMon;
      }else{
        hand.totalBet += 10
        hand.userBet += 10
        pot += 10;
        userMon -= 10;
      }
      hand.totalBet += 5;
      hand.compBet += 5;
      pot += 5;
      oppMon -= 5;
    }

    updatePot();
    shuffleDeck();
    //playTest();
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
    roundNumber = 0;
    setShowButtonLeft(true);
    setShowButtonCenter(true);
    setShowButtonRight(true);
    turnStart();
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
          <img className={`${firstThreeMiddle}`} src={imageMid1} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="community-cards2">
          <img className={`${firstThreeMiddle}`} src={imageMid2} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="community-cards3">
          <img className={`${firstThreeMiddle}`} src={imageMid3} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="community-cards4">
          <img className={`${fourthMiddle}`} src={imageMid4} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="community-cards5">
          <img className={`${lastMiddle}`} src={imageMid5} alt="Current Card" />
          {/* Display community cards here */}
        </div>
      </div>
      <div className="pot">
          {displayPot}
      </div>
      <div className="table-bottom">
        <div className={`${cssReveal === "" ? 'right-[200vw] bottom-[200vh]' : 'drop-shadow-md fixed top-1/2 left-1/2 transform -translate-x-[40%] -translate-y-[47%]'} absolute transition-all duration-300 ease-in-out`}>
          <img className={`${cssReveal}`} src={imageUser1} alt="Current Card" />
        </div>
        <div className={`${cssReveal === "" ? 'right-[200vw] bottom-[200vh]' : 'drop-shadow-md fixed top-1/2 left-1/2 transform -translate-x-[45%] -translate-y-[50%]'} absolute transition-all duration-300 ease-in-out`}>
          <img className={`${cssReveal}`} src={imageUser1} alt="Current Card" />
        </div>
        <div className={`${cssReveal === "" ? 'player-card1' : 'drop-shadow-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[53%]'} transition-all duration-300 ease-in-out`}>
          <img className={`${cssReveal}`} src={imageUser1} alt="Current Card" />
          {/* Display player cards and information here */}
        </div>
        {}
        <div className={`${cssReveal === "" ? 'player-card2' : 'drop-shadow-md fixed top-1/2 left-1/2 transform -translate-x-[55%] -translate-y-[56%]'} transition-all duration-300 ease-in-out`}>
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
          {showButtonRight && <Button theme="pink" onClick={Fold}>{displayRightButton}</Button>}
        </div>
      </div>
      <GameState startGame={gameStart} gameState={gameState} endGame={resetBoard} />
      <h1 className='text-3xl text-black font-bold z-20'>{isGameStarted ? "We can now start game (connect to backend)" : 'GAME IS NOT STARTED YET'}</h1>
      {/* This below is for testing the saveHistory() implementation */}
      <button onClick={() => saveHistory()}>Save History</button>
    </div>
  )
}

export default PokerTableComponent