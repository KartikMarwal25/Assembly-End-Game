import React from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import Header from './components/header.jsx'
import Confetti from 'react-confetti'
import { languages } from "./components/languages.js"
import { getFarewellText, getRandomWord } from './components/utils.js'
 
import './index.css'

function App() {
  const [currentWord, setCurrentWord] = useState(()=>getRandomWord());

  const [guessedLetters, setGuessedLetters] = useState([]);


  const wrongGuessesCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length;

  const isGameWon = currentWord.split("").every(Letter => guessedLetters.includes(Letter))
  const numGuessesLeft = languages.length - 1
  const isGameLost = wrongGuessesCount >= numGuessesLeft ;
  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter);




  function addGuessedLetter(letter) {

    setGuessedLetters((prevLetters) =>
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]);

  }

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const alphabetList = alphabet.split("").map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    })

    return (<button className={className} aria-disabled={guessedLetters.includes(letter)} disabled={isGameOver}
      aria-label={`Letter ${letter}`} onClick={() => addGuessedLetter(letter)} key={index}>{letter.toUpperCase()}</button>)
  })


  const words = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost|| guessedLetters.includes(letter);
    const letterClassName = clsx(
     "", isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return(<span key={index}  className={letterClassName}>{shouldRevealLetter ? letter.toUpperCase() : ""}</span>)
  })
  




  const LanguageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessesCount
    const className = clsx("elements-language", isLanguageLost && "lost")
    return (<span className={className} style={{
      backgroundColor: lang.backgroundColor
      , color: lang.color
    }} key={lang.name}>{lang.name}</span>

    )
  })

  const className = clsx("game-status", isGameOver ? isGameWon ? "win" : "lost" : isLastGuessIncorrect ? "farewell-message" : "");

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell">
          {getFarewellText(languages[wrongGuessesCount - 1].name)}
        </p>
      )
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    } if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    }
  }




function startNewGame() {
  setGuessedLetters([]);
  setCurrentWord(getRandomWord());
       }



  /////////////////////////////////////////////////////////////////////////////


  return (
    <>
    {isGameWon && <Confetti
      recycle={false}
      numberOfPieces={1000}
    />}
      <Header />
      <section aria-live="polite"
        role='status'
        className={className}>
        {renderGameStatus()}

      </section>

      <section className="languages ">
        {LanguageElements}

      </section>


      <section className='word'>
        {words} 
      </section>


       <section 
                className="sr-only" 
                aria-live="polite" 
                role="status"
            >
              <p>
                {currentWord.includes(lastGuessedLetter)?
                `Correct! The letter ${lastGuessedLetter} is in the word.` :
                `Incorrect! The letter ${lastGuessedLetter} is not in the word.`}
                You have  {numGuessesLeft } attempts left.
              </p>

                <p>Current word: {currentWord.split("").map(letter => 
                guessedLetters.includes(letter) ? letter + "." : "blank.")
                .join(" ")}</p>
            
            </section>

      <section className='alphabet'>
        {alphabetList}
      </section>
      {isGameOver && <section className='game-button'>
        <button className='new-game' onClick={startNewGame}>New Game</button>
      </section>}



      
    </>
  )
}

export default App
