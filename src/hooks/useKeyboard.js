import { useEffect, useState } from 'react'

// Повертає об'єкт з натиснутими клавішами, напр. { KeyW: true, Space: true }
// Використання: const keys = useKeyboard(); if (keys.KeyW) { ... }
function useKeyboard() {
  const [keys, setKeys] = useState({})

  useEffect(() => {
    const down = (e) => setKeys((old) => ({ ...old, [e.code]: true }))
    const up = (e) => setKeys((old) => ({ ...old, [e.code]: false }))

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
