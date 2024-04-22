import { useState, useEffect } from 'react';
import '../pages/PokerTable.css';
import cardImageImport from '../pages/cardImageImport';
import cardRankings from '../pages/cardRankings';
import GameState from './GameState';
import BackFlip from "../pages/cards/BackFlip.svg";
import DeckBruh from "../pages/cards/DeckBruh.svg";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Icon } from '@iconify/react';

let pot = 0;
let oppMon = 200;
let userMon = 200;
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
let compLastMove = "No Move Yet";
let toCall;
const hand = {
  totalPotAmount: 0,
  computerBetAmount: 0,
  playerBetAmount: 0,
  cards: ["", "", "", "", "", "", "", "", ""],
  winCondition: "",
  foldRound: null,
  winner: "",
  winningHand: ["", "", "", "", ""]
}
let handList = [];
let advance; //Used if a player has 0 chips. Flag to auto advance the rest of the hand.
let blindDef = [0, 0]; //Used in case the big blind does not have enough chips. blindDef[0] = user, blindDef[1] = comp

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
  const [displayOpp, setDisplayOpp] = useState(oppMon);
  const [displayPot, setDisplayPot] = useState(pot);
  const [displayUser, setDisplayUser] = useState(userMon);
  const [displayLeftButton, setDisplayLeftButton] = useState("Raise 15");
  const [displayMiddleButton, setDisplayMiddleButton] = useState("Call 5");
  const [displayRightButton, setDisplayRightButton] = useState("Fold");
  const [showButtonLeft, setShowButtonLeft] = useState(false);
  const [showButtonCenter, setShowButtonCenter] = useState(false);
  const [showButtonRight, setShowButtonRight] = useState(false);
  const [cssReveal, setCssReveal] = useState("")
  const [firstThreeMiddle, setFirstThreeMiddle] = useState("")
  const [fourthMiddle, setFourthMiddle] = useState("")
  const [lastMiddle, setLastMiddle] = useState("")
  const [allTop, setAllTop] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [gameState, setGameState] = useState("start")
  const [gameHistory, setGameHistory] = useState([])
  const [userInstance, setUserInstance] = useState(null)
  const [numHandsGS, setNumHandsGS] = useState(0)

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
    const  today = new Date()
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    console.log(hand.cards)
    setNumHandsGS(numHands)
    if (loggedIn) {
      // this currentGame variable will be populated from state during our game
      // hard-coded for the time-being
      let currentGame = {
        result: endResult,
        date: mm + '-' + dd + '-' + yyyy,
        numOfHands: numHands,
        handHistory: handList
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

        endResult = null
        numHands = null
        handList = []
      }
      catch(error) {
        console.log(error)
      }
    }
  }
  const handlePlayAgain = () => {
    gameStart()
  }
  const gameStart = async (cond) => {
    setIsGameStarted(cond)
    userMon = 200;
    oppMon = 200;
    dealer = 1;
    numHands = 0;
    handStart()
  }

  //Update text for opponent's pot
  const updatePot = () => {
    // Update the state variable with a new text
    setDisplayOpp(oppMon);
    setDisplayPot(pot);
    setDisplayUser(userMon);
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

  cardRankings[1] = cardRankings[32];
  cardRankings[2] = cardRankings[14];
  cardRankings[3] = cardRankings[31];
  cardRankings[4] = cardRankings[50];
  cardRankings[5] = cardRankings[5];
  cardRankings[6] = cardRankings[6];
  cardRankings[7] = cardRankings[7];
  cardRankings[8] = cardRankings[34];
  cardRankings[9] = cardRankings[24];
//Negative value test
  cardImageImport[1] = cardImageImport[32];
  cardImageImport[2] = cardImageImport[14];
  cardImageImport[3] = cardImageImport[39];
  cardImageImport[4] = cardImageImport[50];
  cardImageImport[5] = cardImageImport[5];
  cardImageImport[6] = cardImageImport[6];
  cardImageImport[7] = cardImageImport[7];
  cardImageImport[8] = cardImageImport[34];
  cardImageImport[9] = cardImageImport[24];

}
  
//Used for calling
  async function Bet() {
    if(turn == 0) {
      if(first == 1){
        oppMon -= 5;
        pot += 5;
        hand.totalPotAmount += 5;
        hand.computerBetAmount += 5
        console.log("Call of 5 by computer");
        compLastMove = "Call of 5";
      }else{
        oppMon -= toCall;
        pot += toCall;
        hand.computerBetAmount += toCall;
        hand.totalPotAmount += toCall;
        console.log("Call of " + (toCall) + " by computer");
        compLastMove = "Call of " + toCall;
      }
    }else{
      if(first == 1){
        userMon -= 5;
        pot += 5;
        hand.playerBetAmount += 5
        hand.totalPotAmount += 5
        console.log("Call of 5 by user");
      }else{
        userMon -= 10;
        pot += 10;
        hand.playerBetAmount += toCall;
        hand.totalPotAmount += toCall;
        console.log("Call of " + toCall + " by user");
      }
    }
    setShowButtonLeft(false);
    setShowButtonCenter(false);
    setShowButtonRight(false);
    turn = (turn > 0) ? 0 : 1; 
    updatePot();
    first = 0;
    secondLastMove = lastMove;
    lastMove = "CA";
    await turnStart();
  }

  async function Raise() {
    //Condense to final player variable which says whos turn it is
    if(turn == 0) {
      if(first == 1){
        if(userMon >= 15){
          oppMon -= 15;
          pot += 15;
          hand.computerBetAmount += 15;
          hand.totalPotAmount += 15;
          console.log("Raise of 15 by computer");
          compLastMove = "Raise of 15";
          toCall = 10;
        }else{
          console.log("Raise of " + userMon.toString() + " by computer");
          compLastMove = "Raise of " + userMon.toString();
          toCall = userMon;
          oppMon -= userMon;
          pot += userMon;
          hand.computerBetAmount += userMon;
          hand.totalPotAmount += userMon;
        }
      }else if((lastMove == "CA" && secondLastMove == "" && !postFlop) || (postFlop && lastMove == "")){
        if(userMon >= 10){
          oppMon -= 10;
          pot += 10;
          hand.computerBetAmount += 10;
          hand.totalPotAmount += 10;
          console.log("Raise of 10 by computer");
          compLastMove = "Raise of 10";
          toCall = 10;
        }else{
          oppMon -= 5;
          pot += 5;
          hand.computerBetAmount += 5;
          hand.totalPotAmount += 5;
          console.log("Raise of 5 by computer");
          compLastMove = "Raise of 5";
          toCall = 5;
        }
      }else{
        if(userMon >= 10){
          oppMon -= 20;
          pot += 20;
          hand.computerBetAmount += 20;
          hand.totalPotAmount += 20;
          console.log("Raise of 20 by computer " + round[roundNumber]);
          compLastMove = "Raise of 20";
          toCall = 10;
        }else{
          oppMon -= 15;
          pot += 15;
          hand.computerBetAmount += 15;
          hand.totalPotAmount += 15;
          console.log("Raise of 15 by computer " + round[roundNumber]);
          compLastMove = "Raise of 15";
          toCall = 5;
        }
      }
    }else{
      if(first == 1){
        if(oppMon >= 15){
          userMon -= 15;
          pot += 15;
          hand.playerBetAmount += 15;
          hand.totalPotAmount += 15;
          console.log("Raise of 15 by player");
          toCall = 10;
        }else{
          toCall = oppMon;
          console.log("Raise of " + oppMon.toString() + " by playeropp");
          userMon -= oppMon;
          pot += oppMon;
          hand.playerBetAmount += oppMon;
          hand.totalPotAmount += oppMon;
        }
      }else if((lastMove == "CA" && secondLastMove == "" && !postFlop) || (postFlop && lastMove == "")){
        if(oppMon >= 10){
          userMon -= 10;
          pot += 10;
          hand.playerBetAmount += 10;
          hand.totalPotAmount += 10;
          console.log("Raise of 10 by player");
          toCall = 10;
        }else{
          userMon -= 5;
          pot += 5;
          hand.playerBetAmount += 5;
          hand.totalPotAmount += 5;
          console.log("Raise of 5 by player");
          toCall = 5;
        }
      }else{
        if(oppMon >= 10){
          userMon -= 20;
          pot += 20;
          hand.playerBetAmount += 20;
          hand.totalPotAmount += 20;
          console.log("Raise of 20 by player + " + round[roundNumber]);
          toCall = 10;
        }else{
          userMon -= 15;
          pot += 15;
          hand.playerBetAmount += 15;
          hand.totalPotAmount += 15;
          console.log("Raise of 15 by player + " + round[roundNumber]);
          toCall = 5;
        }
      }
    }
    setShowButtonLeft(false);
    setShowButtonCenter(false);
    setShowButtonRight(false);
    round[roundNumber] += 1;
    turn = (turn > 0) ? 0 : 1;
    updatePot();
    first = 0;
    secondLastMove = lastMove;
    lastMove = "R";
    await turnStart();
  }

  async function Check() {
    setShowButtonLeft(false);
    setShowButtonCenter(false);
    setShowButtonRight(false);
    secondLastMove = lastMove;
    lastMove = "CH";
    if(turn == 0){
      console.log("Check by Computer ");
      compLastMove = "Check";
    }else{
      console.log("Check by User");
    }
    turn = (turn > 0) ? 0 : 1;
    await turnStart();
  }

  async function Fold(){
    //Needs to account for dealer I think
    if(turn == 0){
      userWins();
      console.log("Fold by computer");
    }else{
      computerWins();
      console.log("Fold by player");
    }
    setShowButtonLeft(false);
    setShowButtonCenter(false);
    setShowButtonRight(false);
    hand.winCondition = "fold";
    hand.winningHand = [];
    hand.foldRound = roundNumber;
    handList.push(structuredClone(hand));
    await revealOpponent();
    handStart();
  }

  function userWins(){
    userMon += pot - blindDef[0];
    oppMon += blindDef[0];
    console.log(userMon + " " + oppMon + " " + blindDef[0]);
    pot = 0;
    hand.winner = "player"
  }

  function computerWins(){
    oppMon += pot - blindDef[1];
    userMon += blindDef[1]
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
    setFirstThreeMiddle("scale-[120%]")
    await delay(300)
    setFirstThreeMiddle("")
    await delay(300)
    setFirstThreeMiddle("scale-[120%]")
    await delay(100)
    setFirstThreeMiddle("")
    setImageMid1(cardImageImport[5]);
    setImageMid2(cardImageImport[6]);
    setImageMid3(cardImageImport[7]);
  }

  async function revealTurn() {
    setFourthMiddle("scale-[120%]")
    await delay(300)
    setFourthMiddle("")
    await delay(300)
    setFourthMiddle("scale-[120%]")
    await delay(100)
    setFourthMiddle("")
    setImageMid4(cardImageImport[8]);
  }

  async function revealRiver() {
    setLastMiddle("scale-[120%]")
    await delay(300)
    setLastMiddle("")
    await delay(300)
    setLastMiddle("scale-[120%]")
    await delay(100)
    setLastMiddle("")
    setImageMid5(cardImageImport[9]);
  }

  async function revealOpponent() {
    if(dealer){
      setAllTop("scale-[120%]")
      await delay(300)
      setAllTop("")
      await delay(300)
      setAllTop("scale-[120%]")
      await delay(100)
      setAllTop("")
      setImageOpp1(cardImageImport[2]);
      setImageOpp2(cardImageImport[4]);
    }else{
      setAllTop("scale-[120%]")
      await delay(300)
      setAllTop("")
      await delay(300)
      setAllTop("scale-[120%]")
      await delay(100)
      setAllTop("")
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
  await revealOpponent();
  winCheck();
  console.log(hand.cards);
  console.log(hand.winningHand);
  handList.push(structuredClone(hand));
  console.log(handList);
  //Testing
  //if(numHands == 2){
    //saveHistory();
  //}
  await delay(2450)
  //Maybe change to handStart while loop or another function while loop
  handStart();
}

//Start of a turn for either bot or player
async function turnStart() {

  //Flip cards
  if((secondLastMove == "R" && lastMove == "CA") || (secondLastMove == "CH" && lastMove == "CH") || (secondLastMove == "CA" && lastMove == "CH") || advance){
    console.log("Middle Reveal");
    //setShowButtonLeft(true);
    //Just advance if someone is out of money
    if(userMon == 0 || oppMon == 0){
      advance = 1;
      console.log("Adva");
    }
    let i = 0;
    while(advance || i < 1){
      if(flop == false){
        await revealFlop();
        dealChange = true;
        flop = true;
        roundNumber = 1;
      }else if(theTurn == false){
        await revealTurn();
        dealChange = true;
        theTurn = true;
        roundNumber = 2;
      }else if(river == false){
        await revealRiver();
        dealChange = true;
        river = true
        roundNumber = 3;
      }else{
        de();
        return;
      }
      i++;
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

  //Checks if someone is out of money
  if((userMon == 0 && turn == 1) || (oppMon == 0 && turn == 0)){
    advance = 1;
    console.log("Adva");
    turnStart();
    return;
  }

 if(turn == 0){
    let che = 0;
    let be = 0;
    let rai = 0;
    let fo = 0;
    //let ava = {};
    let ava = [];
    let rawAva = [];
    let bin = comBinaryConvert();
    //Set actions avaiable
    if((postFlop && lastMove == "") || (lastMove == "CH") || (lastMove == "CA" && secondLastMove == "" && !postFlop)){
      if(!((userMon == 0 && turn == 0) || (oppMon == 0 && turn == 1))){
          //rai = 1;
        //ava[1] = null
        ava.push([1, null]);
        rawAva.push('raise');
       }
      //fo = 1;
      ava.push([2, null]);
      //ava[2] = null;
      rawAva.push('fold');
      //che = 1;
      //ava[3] = null
      ava.push([3, null]);
      rawAva.push('check');
    }else if(round[roundNumber] >= 4 || (oppMon < 20 && turn == 0)){
      console.log("Three raise rule")
      ava.push([0, null]);
      rawAva.push('call');
      ava.push([2, null]);
      rawAva.push('fold');
    }else{
      //be = 1;
      //ava[0] = null
      ava.push([0, null])
      rawAva.push('call');
      if(!((userMon == 0 && turn == 0) || (oppMon == 0 && turn == 1))){
        //rai = 1;
        //ava[1] = null
        ava.push([1, null]);
        rawAva.push('raise');
      }
      //fo = 1;
      //ava[2] = null
      ava.push([2, null]);
      rawAva.push('fold');
    }
    console.log("Calling model");
    let modelOutput = {}
    modelOutput = await callModel(bin, ava, rawAva);
    modelOutput = Number(modelOutput.output);
    console.log("MODEL OUTPUT", modelOutput)
//
    if(modelOutput === 0){
      Bet();
    }else if(modelOutput === 1){
      Raise();
    }else if(modelOutput === 2){
      Fold();
    }else if (modelOutput === 3){
      Check();
    }
//

 }
 //////If player
  else{
    setShowButtonLeft(true);
    setShowButtonCenter(true);
    setShowButtonRight(true);
    if((userMon == 0 && turn == 0) || (oppMon == 0 && turn == 1)){
      setShowButtonLeft(false);
      console.log(userMon + " first advance " + oppMon + " Turn " + turn);
    }

    if(first == 1){
      if(oppMon >= 15){
        setDisplayLeftButton("Raise 15");
      }else if(oppMon > 0){
        setDisplayLeftButton("Raise " + oppMon.toString());
      }else{
        setShowButtonLeft(false);
      }
      setDisplayMiddleButton("Call 5");
      setDisplayRightButton("Fold");
      button1 = false;
    //Right of or may be changed to own else if because (bet 10) may need to be (raise 10)
    }else if((postFlop && lastMove == "") || (lastMove == "CH") || (lastMove == "CA" && secondLastMove == "" && !postFlop)){
      if(oppMon >= 10){
        setDisplayLeftButton("Raise 10");
      }else{
        setDisplayLeftButton("Raise " + oppMon);
      }
      setDisplayMiddleButton("Check");
      setDisplayRightButton("Fold");
      button1 = true;
    }else if(round[roundNumber] >= 4 || (userMon < 20 && turn == 1) || (oppMon <= 10 && turn == 0 && lastMove == "R")){
      //May need to be 3?
      console.log("Three raise rule")
      setShowButtonLeft(false);
      setDisplayMiddleButton("Call " + (toCall));

      setDisplayRightButton("Fold");
      button1 = false;
      //This is wrong
    }else{
      if(toCall == 0){
        setDisplayMiddleButton("Call " + (10));
      }else{
        setDisplayMiddleButton("Call " + (toCall));
      }
      setDisplayLeftButton("Raise 20");
      setDisplayRightButton("Fold");
      button1 = false;
    }
  }
}

async function callModel(binOutput, legal, rawLegal){
  let bodyObj = {
    "obs": binOutput,
    "legal_actions": legal,
    "raw_legal_actions": rawLegal
  }
  let returnData = {}

  const url = "https://bluffbuddy.lakeviewtechnology.net/model";

  await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
    },
    body: JSON.stringify(bodyObj)
  })
  .then(response => response.json())
  .then(data => returnData = data)
  .catch(error => console.error('Error:', error));

  return returnData;
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
    let uType = "";
    let cType = "";
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
    let Comp = ['', '' ,'' ,'' ,'' ,'' ,'', '', ''];
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
          Comp[7] = cardRankings[1]; 
          hand.cards[7] = cardRankings[1][0] + cardRankings[1][1].toString()
          user2 = cardRankings[3][1];
          Comp[8] = cardRankings[3]; 
          hand.cards[8] = cardRankings[3][0] + cardRankings[3][1].toString()
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
          Comp[7] = cardRankings[2];
          hand.cards[7] = cardRankings[2][0] + cardRankings[2][1].toString()
          user2 = cardRankings[4][1];
          Comp[8] = cardRankings[4];
          hand.cards[8] = cardRankings[4][0] + cardRankings[4][1].toString()
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
        Comp[0] = cardRankings[2];
        hand.cards[0] = cardRankings[2][0] + cardRankings[2][1].toString()
        comp2 = cardRankings[4][1];
        Comp[1] = cardRankings[4];
        hand.cards[1] = cardRankings[4][0] + cardRankings[4][1].toString()
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
        Comp[0] = cardRankings[1];
        hand.cards[0] = cardRankings[1][0] + cardRankings[1][1].toString()
        comp2 = cardRankings[3][1];
        Comp[1] = cardRankings[3];
        hand.cards[1] = cardRankings[3][0] + cardRankings[3][1].toString()
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
      hand.cards[i-3] = cardRankings[i][0] + cardRankings[i][1].toString()
      Comp[i-3] = cardRankings[i];
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
      uType = "Club";
      console.log("H-Club");
    }else if(userDia.length >= 5){
      userFlush = userDia;
      uType = "Dia";
      console.log("H-Dia " + userDia);
    }else if(userSpade.length >= 5){
      userFlush = userSpade;
      uType = "Spade";
      console.log("H-Spade " + userSpade);
    }else if(userHeart.length >= 5){
      userFlush = userHeart;
      uType = "Heart";
      console.log("H-Heart");
    }
    if(compClub.length >= 5){
      compFlush = compClub;
      cType = "Club";
      console.log("C-Club");
    }else if(compDia.length >= 5){
      compFlush = compDia;
      cType = "Dia";
      console.log("C-Dia");
    }else if(compSpade.length >= 5){
      compFlush = compSpade;
      cType = "Spade";
      console.log("C-Spade");
    }else if(compHeart.length >= 5){
      compFlush = compHeart;
      cType = "Heart";
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
      console.log("User wins by straight flush " + userStraightFlush);
      hand.winningHand[0] = uType + userStraightFlush[userStraightFlush.length - 1].toString();
      hand.winningHand[1] = uType + userStraightFlush[userStraightFlush.length - 2].toString();
      hand.winningHand[2] = uType + userStraightFlush[userStraightFlush.length - 3].toString();
      hand.winningHand[3] = uType + userStraightFlush[userStraightFlush.length - 4].toString();
      hand.winningHand[4] = uType + userStraightFlush[userStraightFlush.length - 5].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if(!(userStraightFlush.length >= 5) && compStraightFlush.length >= 5 ){
      computerWins();
      console.log("Computer wins by straight flush");
      hand.winningHand[0] = cType + compStraightFlush[compStraightFlush.length - 1].toString();
      hand.winningHand[1] = cType + compStraightFlush[compStraightFlush.length - 2].toString();
      hand.winningHand[2] = cType + compStraightFlush[compStraightFlush.length - 3].toString();
      hand.winningHand[3] = cType + compStraightFlush[compStraightFlush.length - 4].toString();
      hand.winningHand[4] = cType + compStraightFlush[compStraightFlush.length - 5].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if(userStraightFlush.length >= 5 && compStraightFlush.length >= 5){
      //Tie breaker
      for(let i = 4; i >= 0 ; i--){
        if(userStraightFlush[i] > compStraightFlush[i]){
          userWins();
          console.log("User wins by straight flush 2");
          hand.winningHand[0] = uType + userStraightFlush[userStraightFlush.length - 1].toString();
          hand.winningHand[1] = uType + userStraightFlush[userStraightFlush.length - 2].toString();
          hand.winningHand[2] = uType + userStraightFlush[userStraightFlush.length - 3].toString();
          hand.winningHand[3] = uType + userStraightFlush[userStraightFlush.length - 4].toString();
          hand.winningHand[4] = uType + userStraightFlush[userStraightFlush.length - 5].toString();
          hand.winCondition = "completed";
          hand.foldRound = null;
          return;
        }else if(userStraightFlush[i] < compStraightFlush[i]){
          computerWins();
          console.log("Computer wins by straight flush 2");
          hand.winningHand[0] = cType + compStraightFlush[compStraightFlush.length - 1].toString();
          hand.winningHand[1] = cType + compStraightFlush[compStraightFlush.length - 2].toString();
          hand.winningHand[2] = cType + compStraightFlush[compStraightFlush.length - 3].toString();
          hand.winningHand[3] = cType + compStraightFlush[compStraightFlush.length - 4].toString();
          hand.winningHand[4] = cType + compStraightFlush[compStraightFlush.length - 5].toString();
          hand.winCondition = "completed";
          hand.foldRound = null;
          return;
        }
      }
      console.log("Tie by straight flush");
      hand.winCondition = null;
      hand.foldRound = null;
      hand.winningHand = [];
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
      hand.winningHand[0] = "Heart" + user4.toString();
      hand.winningHand[1] = "Spade" + user4.toString();
      hand.winningHand[2] = "Dia" + user4.toString();
      hand.winningHand[3] = "Club" + user4.toString();
      let final = Comp.slice(-7);
      Comp.sort((a, b) => a[1] - b[1]);
      final = final.filter(item => item[1] !== user4);
      hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if(!user4 && comp4){
      computerWins();
      console.log("Computer wins by 4 of kind");
      hand.winningHand[0] = "Heart" + comp4.toString();
      hand.winningHand[1] = "Spade" + comp4.toString();
      hand.winningHand[2] = "Dia" + comp4.toString();
      hand.winningHand[3] = "Club" + comp4.toString();
      let final = Comp.slice(0, 7);
      Comp.sort((a, b) => a[1] - b[1]);
      final = final.filter(item => item[1] !== comp4);
      hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if(user4 && comp4){
      //Tiebreaker needed
      if(user4 > comp4){
        userWins();
        console.log("User wins by 4 of kind 2");
        hand.winningHand[0] = "Heart" + user4.toString();
        hand.winningHand[1] = "Spade" + user4.toString();
        hand.winningHand[2] = "Dia" + user4.toString();
        hand.winningHand[3] = "Club" + user4.toString();
        let final = Comp.slice(-7);
        Comp.sort((a, b) => a[1] - b[1]);
        final = final.filter(item => item[1] !== user4);
        hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }else if(user4 < comp4){
        computerWins();
        console.log("Computer wins by 4 of kind 2");
        hand.winningHand[0] = "Heart" + comp4.toString();
        hand.winningHand[1] = "Spade" + comp4.toString();
        hand.winningHand[2] = "Dia" + comp4.toString();
        hand.winningHand[3] = "Club" + comp4.toString();
        let final = Comp.slice(0, 7);
        Comp.sort((a, b) => a[1] - b[1]);
        final = final.filter(item => item[1] !== comp4);
        hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }
      temp = userList.indexOf(user4);
      userList.splice(temp, 4);
      temp = compList.indexOf(comp4);
      compList.splice(temp, 4);
      if(userList[userList.length-1] > compList[compList.length-1]){
        userWins();
        console.log("User wins by 4 of kind 3");
        hand.winningHand[0] = "Heart" + user4.toString();
        hand.winningHand[1] = "Spade" + user4.toString();
        hand.winningHand[2] = "Dia" + user4.toString();
        hand.winningHand[3] = "Club" + user4.toString();
        let final = Comp.slice(-7);
        Comp.sort((a, b) => a[1] - b[1]);
        final = final.filter(item => item[1] !== user4);
        hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }else if(userList[userList.length-1] < compList[compList.length-1]){
        computerWins();
        console.log("Computer wins by 4 of kind 3");
        hand.winningHand[0] = "Heart" + comp4.toString();
        hand.winningHand[1] = "Spade" + comp4.toString();
        hand.winningHand[2] = "Dia" + comp4.toString();
        hand.winningHand[3] = "Club" + comp4.toString();
        let final = Comp.slice(0, 7);
        Comp.sort((a, b) => a[1] - b[1]);
        final = final.filter(item => item[1] !== comp4);
        hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }
      hand.winCondition = null;
      hand.foldRound = null;
      hand.winningHand = [];
      console.log("Four of a kind Tie")
      gameTie();
      return;
    }

    //Full house
    if(userList[0] == userList[2]){
      user3.push(userList[0]);
    }
    if(userList[1] == userList[3]){
      user3.push(userList[1]);
    }
    if(userList[2] == userList[4]){
      user3.push(userList[2]);
    }
    if(userList[3] == userList[5]){
      user3.push(userList[3]);
    }
    if(userList[4] == userList[6]){
      user3.push(userList[4]);
    }

    if(compList[0] == compList[2]){
      comp3.push(compList[0]);
    }
    if(compList[1] == compList[3]){
      comp3.push(compList[1]);
    }
    if(compList[2] == compList[4]){
      comp3.push(compList[2]);
    }
    if(compList[3] == compList[5]){
      comp3.push(compList[3]);
    }
    if(compList[4] == compList[6]){
      comp3.push(compList[4]);
    }

    let tmp = userList.slice();
    let tmp2 = compList.slice();
    for(let i = 0; i < tmp.length-1; i++){
      if(tmp[i] == tmp[i+1] && (tmp[i] != user3[user3.length-1])){
        userPair.push(tmp[i]);
      }
    }
    for(let i = 0; i < tmp2.length-1; i++){
      if(tmp2[i] == tmp2[i+1] && tmp[i] != comp3[comp3.length-1]){
        compPair.push(tmp2[i]);
      }
    }

    if((user3.length > 0 && (userPair.length > 0)) && !((compPair.length > 0) && comp3.length > 0)){
      userWins();
      console.log("User wins by Full house");
      let final = Comp.slice(-7);
      final.sort((a, b) => a[1] - b[1]);
      let i = 0;
      while(true){
        if(final[i][1] == user3[user3.length-1]){
          break;
        }
        i++;
      }
      hand.winningHand[0] = final[i][0] + final[i][1].toString();
      hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
      hand.winningHand[2] = final[i+2][0] + final[i+2][1].toString();
      i = 0;
      while(true){
        if(final[i][1] == userPair[userPair.length-1]){
          break;
        }
        i++;
      }
      hand.winningHand[3] = final[i][0] + final[i][1].toString();
      hand.winningHand[4] = final[i+1][0] + final[i+1][1].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if(!(user3.length > 0 && (userPair.length > 0)) && ((compPair.length > 0) && comp3.length > 0)){
      computerWins();
      console.log("Computer wins by Full house");
      let final = Comp.slice(0, 7);
      final.sort((a, b) => a[1] - b[1]);
      let i = 0;
      while(true){
        if(final[i][1] == comp3[comp3.length-1]){
          break;
        }
        i++;
      }
      hand.winningHand[0] = final[i][0] + final[i][1].toString();
      hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
      hand.winningHand[2] = final[i+2][0] + final[i+2][1].toString();
      i = 0;
      console.log(compPair);
      while(true){
        if(final[i][1] == compPair[compPair.length-1]){
          break;
        }
        i++;
      }
      hand.winningHand[3] = final[i][0] + final[i][1].toString();
      hand.winningHand[4] = final[i+1][0] + final[i+1][1].toString();
      console.log(final);
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if((user3.length > 0 && (userPair.length > 0)) && ((compPair.length > 0) && comp3.length > 0)){
      //Tie Breaker
      if(user3[user3.length-1] > comp3[comp3.length-1]){
        userWins();
        console.log("User wins by Full house 2");
        let final = Comp.slice(-7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == user3[user3.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        hand.winningHand[2] = final[i+2][0] + final[i+2][1].toString();
        i = 0;
        while(true){
          if(final[i][1] == userPair[userPair.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[3] = final[i][0] + final[i][1].toString();
        hand.winningHand[4] = final[i+1][0] + final[i+1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }else if(user3[user3.length-1] < comp3[comp3.length-1]){
        computerWins();
        console.log("Computer wins by Full house 2");
        let final = Comp.slice(0, 7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == comp3[comp3.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        hand.winningHand[2] = final[i+2][0] + final[i+2][1].toString();
        i = 0;
        while(true){
          if(final[i][1] == compPair[compPair.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[3] = final[i][0] + final[i][1].toString();
        hand.winningHand[4] = final[i+1][0] + final[i+1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }
      userPair = userPair.filter(item => item !== user3[user3.length-1]);
      compPair = compPair.filter(item => item !== comp3[comp3.length-1]);
      if(userPair[userPair.length-1] > compPair[compPair.length-1]){
        userWins();
        console.log("User wins by Full house 3");
        console.log(userPair[userPair.length-1] + " " + compPair[compPair.length-1])
        let final = Comp.slice(-7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == user3[user3.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        hand.winningHand[2] = final[i+2][0] + final[i+2][1].toString();
        i = 0;
        while(true){
          if(final[i][1] == userPair[userPair.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[3] = final[i][0] + final[i][1].toString();
        hand.winningHand[4] = final[i+1][0] + final[i+1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }else if(userPair[userPair.length-1] < compPair[compPair.length-1]){
        computerWins();
        console.log("Computer wins by Full house 3");
        let final = Comp.slice(0, 7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == comp3[comp3.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        hand.winningHand[2] = final[i+2][0] + final[i+2][1].toString();
        i = 0;
        while(true){
          if(final[i][1] == compPair[compPair.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[3] = final[i][0] + final[i][1].toString();
        hand.winningHand[4] = final[i+1][0] + final[i+1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }

      //Tie game
      gameTie();
      console.log("Tie game in Full house");
      hand.winCondition = null;
      hand.foldRound = null;
      hand.winningHand = [];
      return;
    }

    //Flush
    if(userFlush.length >= 5 && compFlush.length < 5){
       userWins();
       console.log("User wins by Flush");
       hand.winningHand[0] = uType + userFlush[userFlush.length-1].toString();
       hand.winningHand[1] = uType + userFlush[userFlush.length-2].toString();
       hand.winningHand[2] = uType + userFlush[userFlush.length-3].toString();
       hand.winningHand[3] = uType + userFlush[userFlush.length-4].toString();
       hand.winningHand[4] = uType + userFlush[userFlush.length-5].toString();
       hand.winCondition = "completed";
       hand.foldRound = null;
       return;
     }
     if(userFlush.length < 5 && compFlush.length >= 5){
       computerWins();
       console.log("Computer wins by Flush");
       hand.winningHand[0] = cType + compFlush[compFlush.length-1].toString();
       hand.winningHand[1] = cType + compFlush[compFlush.length-2].toString();
       hand.winningHand[2] = cType + compFlush[compFlush.length-3].toString();
       hand.winningHand[3] = cType + compFlush[compFlush.length-4].toString();
       hand.winningHand[4] = cType + compFlush[compFlush.length-5].toString();
       hand.winCondition = "completed";
       hand.foldRound = null;
       return;
     }
     if(userFlush.length >= 5 && compFlush.length >= 5){
       //Tie breaker
       console.log("Test");
       for(let i = 0; i < 5; i++){
         if(userFlush[userFlush.length - 1 - i] > compFlush[compFlush.length - 1 - i]){
           userWins();
           console.log("User wins by Flush 2");
           hand.winningHand[0] = uType + userFlush[userFlush.length-1].toString();
           hand.winningHand[1] = uType + userFlush[userFlush.length-2].toString();
           hand.winningHand[2] = uType + userFlush[userFlush.length-3].toString();
           hand.winningHand[3] = uType + userFlush[userFlush.length-4].toString();
           hand.winningHand[4] = uType + userFlush[userFlush.length-5].toString();
           hand.winCondition = "completed";
           hand.foldRound = null;
           return;
         }else if(compFlush[compFlush.length - 1 - i] > userFlush[userFlush.length - 1 - i]){
           computerWins();
           console.log("Computer wins by Flush 2");
           hand.winningHand[0] = cType + compFlush[compFlush.length-1].toString();
           hand.winningHand[1] = cType + compFlush[compFlush.length-2].toString();
           hand.winningHand[2] = cType + compFlush[compFlush.length-3].toString();
           hand.winningHand[3] = cType + compFlush[compFlush.length-4].toString();
           hand.winningHand[4] = cType + compFlush[compFlush.length-5].toString();
           hand.winCondition = "completed";
           hand.foldRound = null;
           return;
         }
       }
       gameTie();
       hand.winCondition = null;
       hand.foldRound = null;
       hand.winningHand = [];
       console.log("Tie game in Flush")
       return;
    }

      //Straight
    if(userStraight.length == 5 && compStraight.length != 5){
      userWins();
      console.log("User wins by Straight " + userStraight);
      let final = Comp.slice(-7);
      final.sort((a, b) => a[1] - b[1]);
      let i = 6;
      while(true){
        if(final[i][1] == userStraight[userStraight.length-1]){
          break;
        }
        i--;
      }
      hand.winningHand[0] = final[i][0] + final[i][1].toString();
      if(final[i][1] == final[i-1][1]){
        i--;
      }
      if(final[i][1] == final[i-1][1]){
        i--;
      }
      hand.winningHand[1] = final[i-1][0] + final[i-1][1].toString();
      if(final[i-1][1] == final[i-2][1]){
        i--;
      }
      if(final[i-1][1] == final[i-2][1]){
        i--;
      }
      hand.winningHand[2] = final[i-2][0] + final[i-2][1].toString();
      if(final[i-2][1] == final[i-3][1]){
        i--;
      }
      if(final[i-2][1] == final[i-3][1]){
        i--;
      }
      hand.winningHand[3] = final[i-3][0] + final[i-3][1].toString();
      if(final[i-3][1] == final[i-4][1]){
        i--;
      }
      if(final[i-3][1] == final[i-4][1]){
        i--;
      }
      hand.winningHand[4] = final[i-4][0] + final[i-4][1].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if(userStraight.length != 5 && compStraight.length == 5){
      computerWins();
      console.log("Computer wins by Straight " + compStraight);
      let final = Comp.slice(0, 7);
      final.sort((a, b) => a[1] - b[1]);
      let i = 6;
      while(true){
        if(final[i][1] == compStraight[compStraight.length-1]){
          break;
        }
        i--;
      }
      hand.winningHand[0] = final[i][0] + final[i][1].toString();
      if(final[i][1] == final[i-1][1]){
        i--;
      }
      if(final[i][1] == final[i-1][1]){
        i--;
      }
      hand.winningHand[1] = final[i-1][0] + final[i-1][1].toString();
      if(final[i-1][1] == final[i-2][1]){
        i--;
      }
      if(final[i-1][1] == final[i-2][1]){
        i--;
      }
      hand.winningHand[2] = final[i-2][0] + final[i-2][1].toString();
      if(final[i-2][1] == final[i-3][1]){
        i--;
      }
      if(final[i-2][1] == final[i-3][1]){
        i--;
      }
      hand.winningHand[3] = final[i-3][0] + final[i-3][1].toString();
      if(final[i-3][1] == final[i-4][1]){
        i--;
      }
      if(final[i-3][1] == final[i-4][1]){
        i--;
      }
      hand.winningHand[4] = final[i-4][0] + final[i-4][1].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if(userStraight.length == 5 && compStraight.length == 5){
      //Tie breaker
      for(let i = 4; i >= 0; i--){
        if(userStraight[i] > compStraight[i]){
          userWins();
          console.log("User wins by Straight 2 " + userStraight);
          let final = Comp.slice(-7);
          final.sort((a, b) => a[1] - b[1]);
          let i = 6;
          while(true){
            if(final[i][1] == userStraight[userStraight.length-1]){
              break;
            }
            i--;
          }
          hand.winningHand[0] = final[i][0] + final[i][1].toString();
          if(final[i][1] == final[i-1][1]){
            i--;
          }
          if(final[i][1] == final[i-1][1]){
            i--;
          }
          hand.winningHand[1] = final[i-1][0] + final[i-1][1].toString();
          if(final[i-1][1] == final[i-2][1]){
            i--;
          }
          if(final[i-1][1] == final[i-2][1]){
            i--;
          }
          hand.winningHand[2] = final[i-2][0] + final[i-2][1].toString();
          if(final[i-2][1] == final[i-3][1]){
            i--;
          }
          if(final[i-2][1] == final[i-3][1]){
            i--;
          }
          hand.winningHand[3] = final[i-3][0] + final[i-3][1].toString();
          if(final[i-3][1] == final[i-4][1]){
            i--;
          }
          if(final[i-3][1] == final[i-4][1]){
            i--;
          }
          hand.winningHand[4] = final[i-4][0] + final[i-4][1].toString();
          hand.winCondition = "completed";
          hand.foldRound = null;
          return;
        }
        if(compStraight[i] > userStraight[i]){
          computerWins();
          console.log("Computer wins by Straight 2 " + compStraight);
          let final = Comp.slice(0, 7);
          final.sort((a, b) => a[1] - b[1]);
          let i = 6;
          while(true){
            if(final[i][1] == compStraight[compStraight.length-1]){
              break;
            }
            i--;
          }
          hand.winningHand[0] = final[i][0] + final[i][1].toString();
          if(final[i][1] == final[i-1][1]){
            i--;
          }
          if(final[i][1] == final[i-1][1]){
            i--;
          }
          hand.winningHand[1] = final[i-1][0] + final[i-1][1].toString();
          if(final[i-1][1] == final[i-2][1]){
            i--;
          }
          if(final[i-1][1] == final[i-2][1]){
            i--;
          }
          hand.winningHand[2] = final[i-2][0] + final[i-2][1].toString();
          if(final[i-2][1] == final[i-3][1]){
            i--;
          }
          if(final[i-2][1] == final[i-3][1]){
            i--;
          }
          hand.winningHand[3] = final[i-3][0] + final[i-3][1].toString();
          if(final[i-3][1] == final[i-4][1]){
            i--;
          }
          if(final[i-3][1] == final[i-4][1]){
            i--;
          }
          hand.winningHand[4] = final[i-4][0] + final[i-4][1].toString();
          hand.winCondition = "completed";
          hand.foldRound = null;
          return;
        }
      }
      //Tie split pot
      gameTie()
      console.log("Tie game in double straight ");
      hand.winCondition = null;
      hand.foldRound = null;
      hand.winningHand = [];
      return;
    }
    //Three of kind
    if(user3.length > 0 && !comp3.length > 0){
      userWins();
      console.log("User wins by 3 kind");
      let final = Comp.slice(-7);
      final.sort((a, b) => a[1] - b[1]);
      let i = 0;
      while(true){
        if(final[i][1] == user3[user3.length-1]){
          break;
        }
        i++;
      }
      hand.winningHand[0] = final[i][0] + final[i][1].toString();
      hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
      hand.winningHand[2] = final[i+2][0] + final[i+2][1].toString();
      final = final.filter(item => item[1] !== user3[user3.length-1]);
      hand.winningHand[3] = final[final.length-1][0] + final[final.length-1][1].toString();
      hand.winningHand[4] = final[final.length-2][0] + final[final.length-2][1].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if(!user3.length > 0 && comp3.length > 0){
      computerWins();
      console.log("Computer wins by 3 kind");
      let final = Comp.slice(0, 7);
      final.sort((a, b) => a[1] - b[1]);
      let i = 0;
      while(true){
        if(final[i][1] == comp3[comp3.length-1]){
          break;
        }
        i++;
      }
      hand.winningHand[0] = final[i][0] + final[i][1].toString();
      hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
      hand.winningHand[2] = final[i+2][0] + final[i+2][1].toString();
      final = final.filter(item => item[1] !== comp3[comp3.length-1]);
      hand.winningHand[3] = final[final.length-1][0] + final[final.length-1][1].toString();
      hand.winningHand[4] = final[final.length-2][0] + final[final.length-2][1].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if(user3.length > 0 && comp3.length > 0){
      //Tie breaker
      if(user3[user3.length-1] > comp3[comp3.length-1]){
        userWins();
        console.log("User wins by 3 kind 2");
        let final = Comp.slice(-7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == user3[user3.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        hand.winningHand[2] = final[i+2][0] + final[i+2][1].toString();
        final = final.filter(item => item[1] !== user3[user3.length-1]);
        hand.winningHand[3] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winningHand[4] = final[final.length-2][0] + final[final.length-2][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }else if(user3[user3.length-1] < comp3[comp3.length-1]){
        computerWins();
        console.log("Computer wins by 3 kind 2");
        let final = Comp.slice(0, 7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == comp3[comp3.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        hand.winningHand[2] = final[i+2][0] + final[i+2][1].toString();
        final = final.filter(item => item[1] !== comp3[comp3.length-1]);
        hand.winningHand[3] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winningHand[4] = final[final.length-2][0] + final[final.length-2][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }
      temp = userList.indexOf(user3[user3.length-1]);
      userList.splice(temp, 3);
      temp = compList.indexOf(comp3[comp3.length-1]);
      compList.splice(temp, 3);
      for(let i = 3; i > 1; i--){
        if(userList[i] > compList[i]){
          userWins();
          console.log("User wins by 3 kind 3 " + userList[i]);
          let final = Comp.slice(-7);
          final.sort((a, b) => a[1] - b[1]);
          let i = 0;
          while(true){
            if(final[i][1] == user3[user3.length-1]){
              break;
            }
            i++;
          }
          hand.winningHand[0] = final[i][0] + final[i][1].toString();
          hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
          hand.winningHand[2] = final[i+2][0] + final[i+2][1].toString();
          final = final.filter(item => item[1] !== user3[user3.length-1]);
          hand.winningHand[3] = final[final.length-1][0] + final[final.length-1][1].toString();
          hand.winningHand[4] = final[final.length-2][0] + final[final.length-2][1].toString();
          hand.winCondition = "completed";
          hand.foldRound = null;
          return;
        }else if(userList[i] < compList[i]){
          computerWins();
          console.log("Computer wins by 3 kind 3");
          let final = Comp.slice(0, 7);
          final.sort((a, b) => a[1] - b[1]);
          let i = 0;
          while(true){
            if(final[i][1] == comp3[comp3.length-1]){
              break;
            }
            i++;
          }
          hand.winningHand[0] = final[i][0] + final[i][1].toString();
          hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
          hand.winningHand[2] = final[i+2][0] + final[i+2][1].toString();
          final = final.filter(item => item[1] !== comp3[comp3.length-1]);
          hand.winningHand[3] = final[final.length-1][0] + final[final.length-1][1].toString();
          hand.winningHand[4] = final[final.length-2][0] + final[final.length-2][1].toString();
          hand.winCondition = "completed";
          hand.foldRound = null;
          return;
        }
      }
      //Tie spilt pot
      console.log("Tie in three of the kind");
      gameTie();
      hand.winCondition = null;
      hand.foldRound = null;
      hand.winningHand = [];
      return;
    }
    //Two pair
    if((userPair.length > 1) && !(compPair.length > 1)){
      userWins();
      console.log("User wins by 2 Pair");
      let final = Comp.slice(-7);
      final.sort((a, b) => a[1] - b[1]);
      let i = 0;
      while(true){
        if(final[i][1] == userPair[userPair.length-1]){
          break;
        }
        i++;
      }
      hand.winningHand[0] = final[i][0] + final[i][1].toString();
      hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
      i = 0;
      while(true){
        if(final[i][1] == userPair[userPair.length-2]){
          break;
        }
        i++;
      }
      hand.winningHand[2] = final[i][0] + final[i][1].toString();
      hand.winningHand[3] = final[i+1][0] + final[i+1][1].toString();
      final = final.filter(item => item[1] !== userPair[userPair.length-1]);
      final = final.filter(item => item[1] !== userPair[userPair.length-2]);
      hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if(!(userPair.length > 1) && (compPair.length > 1)){
      computerWins();
      console.log("Computer wins by 2 Pair");
      let final = Comp.slice(0, 7);
      final.sort((a, b) => a[1] - b[1]);
      let i = 0;
      while(true){
        if(final[i][1] == compPair[compPair.length-1]){
          break;
        }
        i++;
      }
      hand.winningHand[0] = final[i][0] + final[i][1].toString();
      hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
      i = 0;
      while(true){
        if(final[i][1] == compPair[compPair.length-2]){
          break;
        }
        i++;
      }
      hand.winningHand[2] = final[i][0] + final[i][1].toString();
      hand.winningHand[3] = final[i+1][0] + final[i+1][1].toString();
      final = final.filter(item => item[1] !== compPair[compPair.length-1]);
      final = final.filter(item => item[1] !== compPair[compPair.length-2]);
      hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if((userPair.length > 1) && (compPair.length > 1)){
      //Tie breaker
      //userPair = userList.sort(function (a, b) {  return a - b;  });
      //compPair = compList.sort(function (a, b) {  return a - b;  });
      if(userPair[userPair.length-1] > compPair[compPair.length-1]){
        userWins();
        console.log("User wins by 2 Pair 2");
        let final = Comp.slice(-7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == userPair[userPair.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        i = 0;
        while(true){
          if(final[i][1] == userPair[userPair.length-2]){
            break;
          }
          i++;
        }
        hand.winningHand[2] = final[i][0] + final[i][1].toString();
        hand.winningHand[3] = final[i+1][0] + final[i+1][1].toString();
        final = final.filter(item => item[1] !== userPair[userPair.length-1]);
        final = final.filter(item => item[1] !== userPair[userPair.length-2]);
        hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }else if(userPair[userPair.length-1] < compPair[compPair.length-1]){
        computerWins();
        console.log("Computer wins by 2 Pair 2");
        let final = Comp.slice(0, 7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == compPair[compPair.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        i = 0;
        while(true){
          if(final[i][1] == compPair[compPair.length-2]){
            break;
          }
          i++;
        }
        hand.winningHand[2] = final[i][0] + final[i][1].toString();
        hand.winningHand[3] = final[i+1][0] + final[i+1][1].toString();
        final = final.filter(item => item[1] !== compPair[compPair.length-1]);
        final = final.filter(item => item[1] !== compPair[compPair.length-2]);
        hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }
      if(userPair[userPair.length-2] > compPair[compPair.length-2]){
        userWins();
        console.log("User wins by 2 Pair 3");
        let final = Comp.slice(-7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == userPair[userPair.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        i = 0;
        while(true){
          if(final[i][1] == userPair[userPair.length-2]){
            break;
          }
          i++;
        }
        hand.winningHand[2] = final[i][0] + final[i][1].toString();
        hand.winningHand[3] = final[i+1][0] + final[i+1][1].toString();
        final = final.filter(item => item[1] !== userPair[userPair.length-1]);
        final = final.filter(item => item[1] !== userPair[userPair.length-2]);
        hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }else if(userPair[userPair.length-2] < compPair[compPair.length-2]){
        computerWins();
        console.log("Computer wins by 2 Pair 3");
        let final = Comp.slice(0, 7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == compPair[compPair.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        i = 0;
        while(true){
          if(final[i][1] == compPair[compPair.length-2]){
            break;
          }
          i++;
        }
        hand.winningHand[2] = final[i][0] + final[i][1].toString();
        hand.winningHand[3] = final[i+1][0] + final[i+1][1].toString();
        final = final.filter(item => item[1] !== compPair[compPair.length-1]);
        final = final.filter(item => item[1] !== compPair[compPair.length-2]);
        hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
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
        let final = Comp.slice(-7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == userPair[userPair.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        i = 0;
        while(true){
          if(final[i][1] == userPair[userPair.length-2]){
            break;
          }
          i++;
        }
        hand.winningHand[2] = final[i][0] + final[i][1].toString();
        hand.winningHand[3] = final[i+1][0] + final[i+1][1].toString();
        final = final.filter(item => item[1] !== userPair[userPair.length-1]);
        final = final.filter(item => item[1] !== userPair[userPair.length-2]);
        hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }else if(userList[userList.length-1] < compList[compList.length-1]){
        computerWins();
        console.log("Computer wins by 2 Pair 4");
        let final = Comp.slice(0, 7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == compPair[compPair.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        i = 0;
        while(true){
          if(final[i][1] == compPair[compPair.length-2]){
            break;
          }
          i++;
        }
        hand.winningHand[2] = final[i][0] + final[i][1].toString();
        hand.winningHand[3] = final[i+1][0] + final[i+1][1].toString();
        final = final.filter(item => item[1] !== compPair[compPair.length-1]);
        final = final.filter(item => item[1] !== compPair[compPair.length-2]);
        hand.winningHand[4] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }else{
        //Tie spilt pot
        gameTie();
        console.log("Tie in 2 pairs");
        hand.winCondition = null;
        hand.foldRound = null;
        hand.winningHand = [];
        return;
      }
    }
    //One pair
    if((userPair.length == 1) && !(compPair.length == 1)){
      userWins();
      console.log("User wins by one pair");
      let final = Comp.slice(-7);
      final.sort((a, b) => a[1] - b[1]);
      let i = 0;
      while(true){
        if(final[i][1] == userPair[userPair.length-1]){
          break;
        }
        i++;
      }
      hand.winningHand[0] = final[i][0] + final[i][1].toString();
      hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
      final = final.filter(item => item[1] !== userPair[userPair.length-1]);
      hand.winningHand[2] = final[final.length-1][0] + final[final.length-1][1].toString();
      hand.winningHand[3] = final[final.length-2][0] + final[final.length-2][1].toString();
      hand.winningHand[4] = final[final.length-3][0] + final[final.length-3][1].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if(!(userPair.length == 1) && (compPair.length == 1)){
      computerWins();
      console.log("Computer wins by one pair");
      let final = Comp.slice(0, 7);
      final.sort((a, b) => a[1] - b[1]);
      let i = 0;
      while(true){
        if(final[i][1] == compPair[compPair.length-1]){
          break;
        }
        i++;
      }
      hand.winningHand[0] = final[i][0] + final[i][1].toString();
      hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
      final = final.filter(item => item[1] !== compPair[compPair.length-1]);
      hand.winningHand[2] = final[final.length-1][0] + final[final.length-1][1].toString();
      hand.winningHand[3] = final[final.length-2][0] + final[final.length-2][1].toString();
      hand.winningHand[4] = final[final.length-3][0] + final[final.length-3][1].toString();
      hand.winCondition = "completed";
      hand.foldRound = null;
      return;
    }
    if((userPair.length == 1) && (compPair.length == 1)){
      //Tie breaker
      if(userPair[0] > compPair[0]){
        userWins();
        console.log("User wins by one pair 2");
        let final = Comp.slice(-7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == userPair[userPair.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        final = final.filter(item => item[1] !== userPair[userPair.length-1]);
        hand.winningHand[2] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winningHand[3] = final[final.length-2][0] + final[final.length-2][1].toString();
        hand.winningHand[4] = final[final.length-3][0] + final[final.length-3][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }else if(userPair[0] < compPair[0]){
        computerWins();
        console.log("Computer wins by one pair 2");
        let final = Comp.slice(0, 7);
        final.sort((a, b) => a[1] - b[1]);
        let i = 0;
        while(true){
          if(final[i][1] == compPair[compPair.length-1]){
            break;
          }
          i++;
        }
        hand.winningHand[0] = final[i][0] + final[i][1].toString();
        hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
        final = final.filter(item => item[1] !== compPair[compPair.length-1]);
        hand.winningHand[2] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winningHand[3] = final[final.length-2][0] + final[final.length-2][1].toString();
        hand.winningHand[4] = final[final.length-3][0] + final[final.length-3][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
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
          let final = Comp.slice(-7);
          final.sort((a, b) => a[1] - b[1]);
          let i = 0;
          while(true){
            if(final[i][1] == userPair[userPair.length-1]){
              break;
            }
            i++;
          }
          hand.winningHand[0] = final[i][0] + final[i][1].toString();
          hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
          final = final.filter(item => item[1] !== userPair[userPair.length-1]);
          hand.winningHand[2] = final[final.length-1][0] + final[final.length-1][1].toString();
          hand.winningHand[3] = final[final.length-2][0] + final[final.length-2][1].toString();
          hand.winningHand[4] = final[final.length-3][0] + final[final.length-3][1].toString();
          hand.winCondition = "completed";
          hand.foldRound = null;
          return;
        }else if(userList[i] < compList[i]){
          computerWins();
          console.log("Computer wins by one pair 3");
          let final = Comp.slice(0, 7);
          final.sort((a, b) => a[1] - b[1]);
          let i = 0;
          while(true){
            if(final[i][1] == compPair[compPair.length-1]){
              break;
            }
            i++;
          }
          hand.winningHand[0] = final[i][0] + final[i][1].toString();
          hand.winningHand[1] = final[i+1][0] + final[i+1][1].toString();
          final = final.filter(item => item[1] !== compPair[compPair.length-1]);
          hand.winningHand[2] = final[final.length-1][0] + final[final.length-1][1].toString();
          hand.winningHand[3] = final[final.length-2][0] + final[final.length-2][1].toString();
          hand.winningHand[4] = final[final.length-3][0] + final[final.length-3][1].toString();
          hand.winCondition = "completed";
          hand.foldRound = null;
          return;
        }
      }
      //Tie Spilt tie
      gameTie();
      console.log("Tie in pair");
      hand.winCondition = null;
      hand.foldRound = null;
      hand.winningHand = [];
      return;
    }
    //High card
    for(let i = 6; i > 1; i--){
      if(userList[i] > compList[i]){
        userWins();
        console.log("User wins by Card high");
        let final = Comp.slice(-7);
        final.sort((a, b) => a[1] - b[1]);
        hand.winningHand[0] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winningHand[1] = final[final.length-2][0] + final[final.length-2][1].toString();
        hand.winningHand[2] = final[final.length-3][0] + final[final.length-3][1].toString();
        hand.winningHand[3] = final[final.length-4][0] + final[final.length-4][1].toString();
        hand.winningHand[4] = final[final.length-5][0] + final[final.length-5][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }else if(compList[i] > userList[i]){
        computerWins();
        console.log("Computer wins by Card High");
        let final = Comp.slice(0, 7);
        final.sort((a, b) => a[1] - b[1]);
        hand.winningHand[0] = final[final.length-1][0] + final[final.length-1][1].toString();
        hand.winningHand[1] = final[final.length-2][0] + final[final.length-2][1].toString();
        hand.winningHand[2] = final[final.length-3][0] + final[final.length-3][1].toString();
        hand.winningHand[3] = final[final.length-4][0] + final[final.length-4][1].toString();
        hand.winningHand[4] = final[final.length-5][0] + final[final.length-5][1].toString();
        hand.winCondition = "completed";
        hand.foldRound = null;
        return;
      }
    }
    gameTie();
    console.log("Tie in card high");
    hand.winCondition = null;
    hand.foldRound = null;
    hand.winCondition = null;
    return;
  }

  //Used at the start of each hand
  async function handStart() {
    setGameState("start")

    //Game is over
    if(userMon <= 0){
      setGameState("over")
      endResult = "loss"
      saveHistory()
      return
    }else if(oppMon <= 0){
      setGameState("over")
      endResult = "win"
      saveHistory()
      return
    }

    numHands += 1;
    hand.totalPotAmount = 0;
    hand.computerBetAmount = 0;
    hand.playerBetAmount = 0
    blindDef = [0, 0];
    round = [0, 0, 0, 0];
    compLastMove = "No Move Yet";
    toCall = 0;

    dealer = (dealer > 0) ? 0 : 1;
    //Blinds - Dealer has the big blind
    //Not sure what to do if the player meant to big blind does not have enough 
    //https://boardgames.stackexchange.com/questions/39045/in-poker-what-happens-with-the-next-players-if-paying-the-big-blind-puts-a-play
    if(dealer == 1){
      //Big Blind
      if(oppMon < 10){
        pot += oppMon;
        hand.totalPotAmount += oppMon;
        hand.computerBetAmount += oppMon;
        if(userMon >= 10){
          blindDef[1] = oppMon;
          userMon -= 5;
          pot += 5;
          hand.totalPotAmount += oppMon;
        }
        oppMon -= oppMon;
      }else{
        hand.totalPotAmount += 10;
        hand.computerBetAmount += 10;
        pot += 10;
        oppMon -= 10;
      }
      //Small Blind
      hand.totalPotAmount += 5;
      hand.playerBetAmount += 5;
      userMon -= 5;
      pot += 5;
    }else{
      //console.log(userMon)
      if(userMon < 10){
        pot += userMon;
        hand.totalPotAmount += userMon;
        hand.playerBetAmount += userMon;
        if(oppMon >= 10){
          blindDef[0] = userMon;
          oppMon -= 5;
          pot += 5;
          hand.totalPotAmount += userMon;
        }
        userMon -= userMon;
      }else{
        hand.totalPotAmount += 10;
        hand.playerBetAmount += 10;
        pot += 10;
        userMon -= 10;
      }
      hand.totalPotAmount += 5;
      hand.computerBetAmount += 5;
      pot += 5;
      oppMon -= 5;
    }

    updatePot();
    shuffleDeck();
    //playTest();
    await revealHand();
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
    advance = 0;
    await turnStart();
  }

  return (
    <div className="poker-table">
      <div className="table-top">
        <div className="opponent-cards1">
          <img className={`${allTop} md:drop-shadow-[0_0_0.55rem_black]`} src={imageOpp1} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="opponent-cards2">
          <img className={`${allTop} md:drop-shadow-[0_0_0.55rem_black]`} src={imageOpp2} alt="Current Card" />
          {/* Display community cards here */}
        </div>
      </div>
      <div className="w-full md:flex-row flex-col justify-center items-center flex gap-4">
        <div className="icon-logo yellow-stuff text-black">
          <Icon className='drop-shadow-[0_0_0.08rem_black]' icon="fluent-emoji:robot" />
          &nbsp;<span className=''>AI</span>: {displayOpp}<Icon className='text-[24px] text-[#961733]' icon="mdi:poker-chip" />
        </div>
        <div className="amount text-black"><span className=''>Last Move</span>: {compLastMove}</div>
      </div>
      <div className="table-middle">
        <div className="community-cards1">
          <img className={`${firstThreeMiddle} md:drop-shadow-[0_0_0.55rem_black]`} src={imageMid1} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="community-cards2">
          <img className={`${firstThreeMiddle} md:drop-shadow-[0_0_0.55rem_black]`} src={imageMid2} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="community-cards3">
          <img className={`${firstThreeMiddle} md:drop-shadow-[0_0_0.55rem_black]`} src={imageMid3} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="community-cards4">
          <img className={`${fourthMiddle} md:drop-shadow-[0_0_0.55rem_black]`} src={imageMid4} alt="Current Card" />
          {/* Display community cards here */}
        </div>
        <div className="community-cards5">
          <img className={`${lastMiddle} md:drop-shadow-[0_0_0.55rem_black]`} src={imageMid5} alt="Current Card" />
          {/* Display community cards here */}
        </div>
      </div>
      <div className="pot bg-white text-[#222222]">
          <span className=''>Total Pot</span>: {displayPot}<Icon className='text-[24px] text-[#961733]' icon="mdi:poker-chip" />
      </div>
      <div className="table-bottom">
        <div className={`${cssReveal === "" ? 'right-[200vw] bottom-[200vh]' : 'md:drop-shadow-md fixed top-1/2 left-1/2 transform -translate-x-[40%] -translate-y-[47%]'} z-[16] absolute transition-all duration-300 ease-in-out`}>
          <img className={`${cssReveal}`} src={imageUser1} alt="Current Card" />
        </div>
        <div className={`${cssReveal === "" ? 'right-[200vw] bottom-[200vh]' : 'md:drop-shadow-md fixed top-1/2 left-1/2 transform -translate-x-[45%] -translate-y-[50%]'} z-[16] absolute transition-all duration-300 ease-in-out`}>
          <img className={`${cssReveal}`} src={imageUser1} alt="Current Card" />
        </div>
        <div className={`${cssReveal === "" ? 'player-card1' : 'md:drop-shadow-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[53%]'} z-[16] transition-all duration-300 ease-in-out`}>
          <img className={`${cssReveal} md:drop-shadow-[0_0_0.55rem_black]`} src={imageUser1} alt="Current Card" />
          {/* Display player cards and information here */}
        </div>
        <div className={`${cssReveal === "" ? 'player-card2' : 'md:drop-shadow-md fixed top-1/2 left-1/2 transform -translate-x-[55%] -translate-y-[56%]'} z-[16] transition-all duration-300 ease-in-out`}>
         <img className='md:drop-shadow-[0_0_0.55rem_black]' src={imageUser2} alt="Current Card" />
         {/* Display player cards and information here */}
        </div>
      </div>
      <div className="player-chips text-black text-[#961733">
        <Icon className='mr-[5px] drop-shadow-[0_0_0.08rem_black] text-[26px]' icon="fluent-emoji:person-light" /><span className='text-black'>Player</span>: {displayUser}<Icon className='text-[24px] text-[#961733]' icon="mdi:poker-chip" />
      </div>
      <div className="buttons md:font-bold md:text-3xl font-semibold text-xl">
        {/* Used as both Raising and Checking */}
        {showButtonLeft && <button className='w-full bottom-buttons py-3 rounded-xl m-3 max-w-[300px] min-w-[75px] hover:scale-[105%] hover:drop-shadow-[0_0_0.55rem_#f21343] duration-300 ease-in-out transition-all text-white' onClick={Raise}>{displayLeftButton}</button>}
        
        {/* Used as betting */}
        {showButtonCenter && <button className='w-full bottom-buttons py-3 rounded-xl m-3 max-w-[300px] min-w-[75px] hover:scale-[105%] hover:drop-shadow-[0_0_0.55rem_#f21343] duration-300 ease-in-out transition-all text-white' onClick={button1 ? Check : Bet}>{displayMiddleButton}</button>}

        {/* Used as both Folding and start game button */}
        {showButtonRight && <button className='w-full bottom-buttons py-3 rounded-xl m-3 max-w-[300px] min-w-[75px] hover:scale-[105%] hover:drop-shadow-[0_0_0.55rem_#f21343] duration-300 ease-in-out transition-all text-white' onClick={Fold}>{displayRightButton}</button>}
      </div>
      {gameState === "over" ? <GameState winningHand={null} numOfHands={numHandsGS} winner={endResult} startGame={handlePlayAgain} gameState="over" /> : <GameState startGame={handlePlayAgain} gameState="start" />}
    </div>
  )
}

export default PokerTableComponent