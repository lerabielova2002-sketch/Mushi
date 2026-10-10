import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import Player from '../components/Player'
import CameraFollow from '../components/CameraFollow'
import { useGame } from '../context/GameContext'

// Меші моделі, по яких НЕ можна ходити (великі плоскі "квадрати" в моделі)
// Увага: three.js прибирає крапки з імен, тому 'Plane.001' з Blender тут це 'Plane001'
const NO_COLLISION = ['Plane001', 'Plane004']

// Перший рівень: лісова стежка та фініш.
// TODO: (я) розширити сценарій на другий і третій рівні з новими механіками і локаціями
function Level1() {
  const level = useGLTF('/level1.glb')
  const playerRef = useRef()

  // Збираємо всі меші рівня, крім тих, що в NO_COLLISION
  const groundMeshes = useMemo(() => {
    const meshes = []
    level.scene.traverse((object) => {
      if (object.isMesh && !NO_COLLISION.includes(object.name)) {
        meshes.push(object)
      }
    })
    return meshes
  }, [level.scene])
  const { setStatus, status } = useGame()
  const finishPosition = [2.5, 0.5, 2]

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

  

      <mesh position={finishPosition}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={0.5} />
      </mesh>

      <Player ref={playerRef} groundMeshes={groundMeshes} />

      {/* TODO: (я) якщо playerRef.current.position.y < -10 — гравець упав у річку, треба програш/рестарт рівня */}

      <CameraFollow targetRef={playerRef} />
    </>
  )
}

export default Level1
