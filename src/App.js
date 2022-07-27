//CSS
import './App.css';

//REACT
import {useCallback, useEffect, useState} from 'react'

//DATA(DADOS)
import {wordsList} from './data/words'

//COMPONENTES
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';


const stages = [
  {id:1, name:'start'},
  {id:2, name:'game'},
  {id:3, name:'end'},

]

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name) 
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    //Escolhendo uma categoria aleatória
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    //Escolhendo uma Palavra aleatória
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return{word, category}
  }, [words])

  //INICIAR JOGO
  const startGame = useCallback(() => {

    //Limpar
    clearLetterStates()

    //Categoria e palavra 
    const {word, category} = pickWordAndCategory()

    //CRIANDO ARRAY PARA LETRAS
    let wordLetters = word.split('')
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    //SETANDO ESTADOS
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
    
    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  //PROCESSANDO A ENTRADA DA LETRA
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase()

    //Verificar de a letra já foi usada
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }

    //incluir letras digitadas
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)

    }
  }

  const clearLetterStates = () => {

    setGuessedLetters([])
    setWrongLetters([])

  } 

  //Checar se as tentativas terminaram
  useEffect(() => {

    if(guesses <= 0){
      //Função para apagar tudo
      clearLetterStates()

      setGameStage(stages[2].name)
    }

  }, [guesses])

  //Checar Vitória
  useEffect (() => {

    const uniqueLetters = [...new Set(letters)]

    //Condição para ganhar
    if(guessedLetters.length === uniqueLetters.length) {

      //Add pontuação
      setScore((actualScore) => actualScore += 100)

      //Restart Game e criar nova palavra
      startGame()


    }

  }, [guessedLetters, letters, startGame])

  //REINICIAR JOGO
  const retry = () => {
    setScore(0)
    setGuesses(3)

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      
      {gameStage === 'start' && <StartScreen startGame={startGame} />}

      {gameStage === 'game' && 
      <Game verifyLetter={verifyLetter} 
      pickedWord={pickedWord} 
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />}

      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;