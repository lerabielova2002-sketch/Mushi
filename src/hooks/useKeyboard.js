import { useEffect, useState } from 'react'

// Повертає об'єкт із натиснутими клавішами, напр. { KeyW: true, Space: true }
// Використання: const keys = useKeyboard(); if (keys.KeyW) { ... }
function useKeyboard() {
  const [keys, setKeys] = useState({})

  useEffect(() => {
    const down = (event) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
        event.preventDefault()
      }

      setKeys((old) => ({ ...old, [event.code]: true }))
    }

    const up = (event) => {
      setKeys((old) => ({ ...old, [event.code]: false }))
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  return keys
}

export default useKeyboard
