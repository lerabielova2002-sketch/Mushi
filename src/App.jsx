import Game from './components/Game'
import Hud from './components/Hud'
import { GameProvider } from './context/GameContext'

function App() {
  return (
    <GameProvider>
      <Game />
      <Hud />
    </GameProvider>
  )
}

export default App
