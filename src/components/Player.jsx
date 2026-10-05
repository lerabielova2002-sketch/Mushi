import { forwardRef, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGame } from '../context/GameContext'
import useKeyboard from '../hooks/useKeyboard'
import playSound from '../audio/playNote'

const noteKeys = [
  ['Digit1', 'do'],
  ['Digit2', 're'],
  ['Digit3', 'mi'],
]

// Головний герой (гриб Муші). Зараз — просто червона коробка-заглушка.
// ref приходить з Level1, щоб камера знала, за ким їхати.
const Player = forwardRef(function Player({ platforms = [] }, ref) {
  const keys = useKeyboard()
  const { addFluteNote } = useGame()
  const velocityY = useRef(0)
  const isGrounded = useRef(true)
  const spaceWasPressed = useRef(false)

  useEffect(() => {
    const playPressedNote = (event) => {
      if (event.repeat) return

      const note = noteKeys.find(([key]) => key === event.code)?.[1]
      if (!note) return

      playSound(note)
      addFluteNote(note)
    }

    window.addEventListener('keydown', playPressedNote)
    return () => window.removeEventListener('keydown', playPressedNote)
  }, [addFluteNote])

  useFrame((state, delta) => {
    if (!ref || !ref.current) return

    const player = ref.current
    const moveSpeed = 4

    const moveX = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0)
    const moveZ = (keys.KeyS ? 1 : 0) - (keys.KeyW ? 1 : 0)

    player.position.x += moveX * moveSpeed * delta
    player.position.z += moveZ * moveSpeed * delta

    velocityY.current -= 18 * delta
    player.position.y += velocityY.current * delta

    const platformTop = platforms.find((platform) => {
      const halfW = platform.size[0] / 2
      const halfD = platform.size[2] / 2
      const topY = platform.position[1] + platform.size[1] / 2 + 0.5

      return (
        player.position.x >= platform.position[0] - halfW &&
        player.position.x <= platform.position[0] + halfW &&
        player.position.z >= platform.position[2] - halfD &&
        player.position.z <= platform.position[2] + halfD &&
        player.position.y >= topY - 0.9 &&
        player.position.y <= topY + 0.4 &&
        velocityY.current <= 0
      )
    })

    if (platformTop) {
      player.position.y = platformTop.position[1] + platformTop.size[1] / 2 + 0.5
      velocityY.current = 0
      isGrounded.current = true
    } else if (player.position.y <= 1) {
      player.position.y = 1
      velocityY.current = 0
      isGrounded.current = true
    } else {
      isGrounded.current = false
    }

    if (keys.Space && !spaceWasPressed.current && isGrounded.current) {
      velocityY.current = 7
      isGrounded.current = false
    }

    spaceWasPressed.current = Boolean(keys.Space)
  })

  return (
    <mesh ref={ref} position={[0, 1, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
})

export default Player
