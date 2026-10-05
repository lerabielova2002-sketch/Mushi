import { createContext, useCallback, useContext, useState } from 'react'

// Загальний стан гри: життя та очки.
// Будь-який компонент може його отримати: const { lives, score } = useGame()
const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [fluteNotes, setFluteNotes] = useState([])

  const loseLife = () => setLives((old) => old - 1)
  const addScore = (points) => setScore((old) => old + points)
  const addFluteNote = useCallback((note) => {
    setFluteNotes((old) => [...old, note].slice(-5))
  }, [])
  const resetGame = () => {
    setLives(3)
    setScore(0)
    setFluteNotes([])
  }

  return (
    <GameContext.Provider
      value={{ lives, score, fluteNotes, loseLife, addScore, addFluteNote, resetGame }}
    >
      {children}
    </GameContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  return useContext(GameContext)
}
