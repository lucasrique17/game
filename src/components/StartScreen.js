import './StartScreen.css'

const StartScreen = ({startGame}) => {
  return (
    <div className='start'>
        <h1>Secret Words</h1>
        <h4>Clique no botão abaixo para começar a jogar!!!</h4>
        <button onClick={startGame}>Iniciar Jogo</button>
    </div>
  )
}

export default StartScreen