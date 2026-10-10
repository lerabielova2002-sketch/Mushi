import { createContext, useCallback, useContext, useState } from 'react'

// Загальний стан гри: життя, очки, історія нот і стан рівня.
// Будь-який компонент може його отримати: const { lives, score, status } = useGame()
const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [fluteNotes, setFluteNotes] = useState([])
  // status: 'playing' | 'rhythm' (міні-гра) | 'game-over' | 'victory'
  const [status, setStatus] = useState('playing')
  const [enemiesDefeated, setEnemiesDefeated] = useState(false)
  const [resetVersion, setResetVersion] = useState(0)

  const loseLife = useCallback(() => {
    setLives((old) => {
      const nextValue = Math.max(0, old - 1)
      if (nextValue <= 0) {
        setStatus('game-over')
      }
      return nextValue
    })
  }, [])

  const addScore = useCallback((points) => {
    setScore((old) => old + points)
  }, [])

  const addFluteNote = useCallback((note) => {
    setFluteNotes((old) => [...old, note].slice(-5))
  }, [])

  const resetGame = useCallback(() => {
    setLives(3)
    setScore(0)
    setFluteNotes([])
    setStatus('playing')
    setEnemiesDefeated(false)
    setResetVersion((old) => old + 1)
  }, [])

  return (
    <GameContext.Provider
      value={{
        lives,
        score,
        fluteNotes,
        status,
        enemiesDefeated,
        resetVersion,
        loseLife,
        addScore,
        addFluteNote,
        resetGame,
        setStatus,
        setEnemiesDefeated,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  return useContext(GameContext)
}
