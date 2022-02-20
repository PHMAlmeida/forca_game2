import { AiFillPlayCircle } from 'react-icons/ai';
import { FiHelpCircle } from 'react-icons/fi';
import { MdQueryStats } from 'react-icons/md';
import { AiFillCheckCircle } from 'react-icons/ai';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useState } from 'react';
import axios from 'axios';

let word;
let lettersArray;
let lettersAlreadyGuessed = [];
let remainingAttempts = 5;
let correctsLetters = 0;
let score = 0;
let currentScore = 1;
let userEmail;


async function getNewWord() {
    
    const options = {
        method: 'GET',
        url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
        params: {count: '1', wordLength: '5'},
        headers: {
        'x-rapidapi-host': 'random-words5.p.rapidapi.com',
        'x-rapidapi-key': 'e6b55a88fcmsh355023f7caa90a0p1d86bbjsnc5f734f6cea9'
        }
    };
    
    let wr = await axios.request(options).then(function (response) {
        return response.data[0];
    });
    console.log(wr);

    word = wr.toUpperCase();
    getWordLetters();
}

function getWordLetters() {
    lettersArray = word.split('');
    console.log(lettersArray[0]);
}

function submitLetter() {
    var letter = document.getElementById("guess").value.toUpperCase();

    if (!(letter.match(/^[A-Za-z]+$/)) || letter==="") {
        alert("This is not a valid letter");
        return;
    }

    if (lettersAlreadyGuessed.find(element => element == letter) != undefined) {
        alert("You already tried this letter");
        return;
    }

    
    document.getElementById("guess").value = "";
    
    lettersArray.forEach((element, index) => {
        if (element == letter) {
            console.log(index);
            document.getElementById(index.toString()).className = "letterCorrect";
            document.getElementById("l" + index.toString()).innerHTML = letter;
            correctsLetters++;
            console.log("achou");
        }

    });
    
    if (lettersArray.find(element => element == letter) == undefined) {
        remainingAttempts--;
        currentScore = currentScore - 0.2;
        if (remainingAttempts == 0) {
            YouLose();
        }
        document.getElementById("remainingAttempts").innerHTML = remainingAttempts + " TIME(S)";
        document.getElementById("guessedLetters").innerHTML += "&nbsp&nbsp" + letter + "&nbsp&nbsp";
    }

    if (correctsLetters == 5) {
        YouWin();
        score = score + currentScore;
        attScore();
    }

    lettersAlreadyGuessed.push(letter);
}

function YouLose() {
    setTimeout(function(){
        document.getElementById("gameResultLose").style.display = "flex";
    }, 1000); 
}

function YouWin() {
    setTimeout(function(){
        document.getElementById("gameResultWin").style.display = "flex";
    }, 1000); 
}

function InitGame() {
    getNewWord();
    document.getElementById("home").style.display = "none";
    document.getElementById("game").style.display = "flex";
    if (document.getElementById("gameResultWin").style.display == "flex" || document.getElementById("gameResultLose").style.display == "flex") {
        document.getElementById("gameResultWin").style.display = "none";
        document.getElementById("gameResultLose").style.display = "none";
        document.getElementById("0").className = "letterEmpty";
        document.getElementById("1").className = "letterEmpty";
        document.getElementById("2").className = "letterEmpty";
        document.getElementById("3").className = "letterEmpty";
        document.getElementById("4").className = "letterEmpty";
        document.getElementById("guessedLetters").innerHTML = "";
        lettersAlreadyGuessed = [];
        remainingAttempts = 5;
        correctsLetters = 0;
        currentScore = 1;
        document.getElementById("remainingAttempts").innerHTML = remainingAttempts + " TIME(S)";
    }
}

function CallHelp() {
    document.getElementById("help").style.display = "flex";
}

async function ShowScore() {
    const res = await axios.get('api/ranking');
    console.log(res.data);
    document.getElementById("ranking").style.display = "flex";

    document.getElementById("rankingPositions").innerHTML = "Your Score: " + score.toFixed(1);
    const ranking = document.getElementById("rankingPositions");
    for (let i = 0; i < res.data.length; i++) {
        let index = i + 1;
        let position = document.createElement("div");
        position.classList.add("position");
        position.setAttribute("id", "p" + index);
        ranking.appendChild(position);
        document.getElementById("p" + index).style.display = 'flex';
        document.getElementById("p" + index).style.justifyContent = "left";
        document.getElementById("p" + index).innerHTML = index + "° &nbsp&nbsp" + res.data[i].userName + "(" + res.data[i].email + ") // score: " + res.data[i].score.toFixed(1);
    }
}

function Login() {
  document.getElementById("login").style.display = "flex";
  document.getElementById("haveAcconuntButton").style.display = "none";
  document.getElementById("dontHaveAcconuntButton").style.display = "none";
}

async function attScore() {
    await axios.post('api/updateScore', { userEmail, score });
}

function CloseRanking() {
    document.getElementById("rankingPositions").innerHTML = "";
    document.getElementById("ranking").style.display = "none";
}

function CloseHelp() {
    document.getElementById("help").style.display = "none";
}

export default function Home() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');

    async function SignUp(event) {
        event.preventDefault();
        const data = { userName, email, score};
        
        if (email != "" && userName != "") {
        const res = await axios.post('api/users', data);
        
        if (res.data.status == 1) {
            alert("Account created. Have fun!");
            var nl_elements = document.getElementsByClassName("non-logged");
            for (var i = 0; i < nl_elements.length; i++) {
                nl_elements[i].style.display = "none";
            }
            
            var l_elements = document.getElementsByClassName("logged");
            for (var i = 0; i < l_elements.length; i++) {
                l_elements[i].style.display = "flex";
            }
            attScore();
            score = res.data.score;
            userEmail = email;
            InitGame();

        } else if (res.data.status == 2) {
            alert("This email already exists");
        } else if (res.data.status == 3) {
            alert("This userName already exists");
        }
        } else {
            alert("Please fill in all the required fields.")
        }
    }

    async function SignIn(event) {
        event.preventDefault();
        const data = { userName, email};
        const res = await axios.post('api/signin', data);
        if (res.data.status == 1) {
            score = res.data.score;
            
            var nl_elements = document.getElementsByClassName("non-logged");
            for (var i = 0; i < nl_elements.length; i++) {
                nl_elements[i].style.display = "none";
            }
  
            var l_elements = document.getElementsByClassName("logged");
            for (var i = 0; i < l_elements.length; i++) {
                l_elements[i].style.display = "flex";
            }
  
            userEmail = email;
            InitGame();
        } else {
            alert("This account doesn't exist");
        }        
    }

    return (
        <div>
          <div id='home' className="home">
            <div className='forcaLogo'>
              <img src='../forca_logo.svg'></img>
            </div>
            <div className='startContainer'>
              <button id='haveAcconuntButton' onClick={Login}>I HAVE AN ACCOUNT</button> 
              <button id='dontHaveAcconuntButton' onClick={InitGame}>PLAY AS A VISITANT</button>
              <div id='login'>
                <input id='email' type="email" placeholder='Your e-mail' value={email} onChange={e => setEmail(e.target.value)}/>
                <input id='userName' type="text" placeholder='Your username' value={userName} onChange={e => setUserName(e.target.value)}/> 
                <button onClick={SignIn}>LOGIN</button>
              </div>
              <button id='buttonPlay' onClick={InitGame}>
                <AiFillPlayCircle size={100}></AiFillPlayCircle>
              </button>
            </div>
          </div>
          
    
          <div id='game' className='game'>
            <header>
              <button className='helpButton' onClick={CallHelp}>
                <FiHelpCircle size={40}></FiHelpCircle>
              </button>
              <div id='gameResultWin'>
                <AiFillCheckCircle size={200} color = "white" ></AiFillCheckCircle>
                <p>YOU WIN</p>
                <input className='non-logged' id='email' type="email" placeholder='Your e-mail' value={email} onChange={e => setEmail(e.target.value)}/>
                <input className='non-logged' id='userName' type="text" placeholder='Your username' value={userName} onChange={e => setUserName(e.target.value)}/>
                <button id='tryAgainButton' className='logged' onClick={InitGame}>TRY ANOTHER WORD</button>
                <button id='signUpButton' className='non-logged' onClick={SignUp}>SignUp</button>
              </div>
    
              <div id='gameResultLose'>
                <AiFillCloseCircle size={200} color = "white" ></AiFillCloseCircle>
                <p>YOU LOSE</p>
                <input className='non-logged' id='email' type="email" placeholder='Your e-mail' value={email} onChange={e => setEmail(e.target.value)}/>
                <input className='non-logged' id='userName' type="text" placeholder='Your username' value={userName} onChange={e => setUserName(e.target.value)}/>
                <button id='tryAgainButton' className='logged' onClick={InitGame}>TRY ANOTHER WORD</button>
                <button id='signUpButton' className='non-logged' onClick={SignUp}>SignUp</button>
              </div>
    
              <div className='containerLogo'>
                <img src='../forca_logo.svg' width={150}></img>
              </div>
    
              <button className='statsButton' onClick={ShowScore}>
                <MdQueryStats size={40}></MdQueryStats>
              </button>          
            </header>
    
            <div id='help'>
                <button id='closeBtn' onClick={CloseHelp}>
                  <AiFillCloseCircle size={40} color = "white" ></AiFillCloseCircle>
                </button>
              <img src="../help_gif.gif" />
            </div>
            <div id="ranking">
              <div id='yourScore'>
                <button id='closeBtn' onClick={CloseRanking}>
                  <AiFillCloseCircle size={40} color = "white" ></AiFillCloseCircle>
                </button>
              </div>
              <div id='rankingPositions'>

              </div>
            </div>
            <div className='gameContainer'>
              <div className='gameContainer1'>
                <p>YOU CAN MISS</p>
                <p id="remainingAttempts">5 TIME(S)</p>
              </div>
    
              <div className='gameContainer2'>
                <div className='letters'>
                  <div id="0" className='letterEmpty'><p id='l0'></p></div>
                  <div id="1" className='letterEmpty'><p id='l1'></p></div>
                  <div id="2" className='letterEmpty'><p id='l2'></p></div>
                  <div id="3" className='letterEmpty'><p id='l3'></p></div>
                  <div id="4" className='letterEmpty'><p id='l4'></p></div>
                </div>
                <div className='guess'>
                  <div className='guessedContainer'>
                    <p>WRONG <br/> GUESSED <br/>LETTERS: </p>
                    <p id='guessedLetters'></p>
                  </div>
                  <div className='guessInputContainer'>
                    <input id="guess" type="text" maxLength={1} placeholder="F"/>
              
                    <button className='guessButton' onClick={submitLetter}>GUESS</button>
                  </div>
                </div>
              </div>
            </div>
          </div> 
        </div>
      )
}
