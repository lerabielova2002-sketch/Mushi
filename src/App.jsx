import { useState } from 'react'
import Game from './components/Game'
import Hud from './components/Hud'
import Lobby from './components/Lobby'
import { GameProvider } from './context/GameContext'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <GameProvider>
      {isPlaying ? (
        <>
          <Game />
          <Hud />
        </>
      ) : (
        <Lobby onStart={() => setIsPlaying(true)} />
      )}
    </GameProvider>
  )
}

export default App
