import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import Player from '../components/Player'
import CameraFollow from '../components/CameraFollow'
import { useGame } from '../context/GameContext'

// Перший рівень: лісова стежка та фініш.
// TODO: (я) розширити сценарій на другий і третій рівні з новими механіками і локаціями
function Level1() {
  const level = useGLTF('/level1.glb')
  const playerRef = useRef()
  const { setStatus, status } = useGame()
  const finishPosition = [14, 1, 0]

  useFrame(() => {
    if (!playerRef.current || status !== 'playing') return

    const playerPosition = playerRef.current.position
    const victoryReached =
      playerPosition.x > finishPosition[0] - 1 &&
      playerPosition.z > finishPosition[2] - 1.5 &&
      playerPosition.z < finishPosition[2] + 1.5

    if (victoryReached) {
      setStatus('victory')
    }
  })

  return (
    <>
      <primitive object={level.scene} position={[7, 0, 0]} scale={0.025} />

      {/* Земля */}
      {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="green" />
      </mesh> */}

      <mesh position={finishPosition}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={0.5} />
      </mesh>

      <Player ref={playerRef} />

      <CameraFollow targetRef={playerRef} />
    </>
  )
}

export default Level1
