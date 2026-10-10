import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import Player from '../components/Player'
import CameraFollow from '../components/CameraFollow'
import { useGame } from '../context/GameContext'

// Починаємо вантажити важку модель рівня ще в лобі, щоб старт гри був швидшим
useGLTF.preload('/level1.glb')

// Меші моделі, по яких НЕ можна ходити (великі плоскі "квадрати" в моделі)
// Увага: three.js прибирає крапки з імен, тому 'Plane.001' з Blender тут це 'Plane001'
const NO_COLLISION = ['Plane001', 'Plane004']

// Якщо гравець упав нижче цієї висоти (річка) — рівень починається заново
const FALL_LIMIT_Y = -5

// Тригер міні-гри: коли гравець проходить z більше за це значення, стартує гра з нотами
// TODO: (я) підібрати місце тригера на карті
const TRIGGER_Z = 0

// Тимчасові вороги (кубики), які зникають після міні-гри
// TODO: (я) замінити на моделі вовків і розставити як потрібно
const ENEMY_POSITIONS = [
  [1.8, 0.5, 1],
  [2.5, 0.5, 1.2],
  [3.2, 0.5, 1],
]

// Ворог-кубик: коли ворогів переможено, він зменшується і зникає
function EnemyBox({ position, defeated }) {
  const meshRef = useRef(null)

  useFrame((_, delta) => {
    if (!defeated || !meshRef.current) return

    const nextScale = Math.max(0, meshRef.current.scale.x - delta * 1.5)
    meshRef.current.scale.setScalar(nextScale)
    meshRef.current.rotation.y += delta * 8
    meshRef.current.visible = nextScale > 0
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  )
}

// Перший рівень: лісова стежка та фініш.
// TODO: (я) розширити сценарій на другий і третій рівні з новими механіками і локаціями
function Level1() {
  const level = useGLTF('/level1.glb')
  const playerRef = useRef()
  const { setStatus, status, enemiesDefeated, resetGame } = useGame()
  const finishPosition = [2.5, 0.5, 2]

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

  useFrame(() => {
    if (!playerRef.current || status !== 'playing') return

    const playerPosition = playerRef.current.position

    // Упав у річку — рівень заново
    if (playerPosition.y < FALL_LIMIT_Y) {
      resetGame()
      return
    }

    // Дійшов до тригера, а вороги ще живі — запускаємо міні-гру
    if (!enemiesDefeated && playerPosition.z > TRIGGER_Z) {
      setStatus('rhythm')
      return
    }

    // Фініш рахується тільки після того, як вороги переможені
    const victoryReached =
      enemiesDefeated &&
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

      {ENEMY_POSITIONS.map((position, index) => (
        <EnemyBox key={index} position={position} defeated={enemiesDefeated} />
      ))}

      <mesh position={finishPosition}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={0.5} />
      </mesh>

      <Player ref={playerRef} groundMeshes={groundMeshes} />

      {/* Під час міні-гри (status 'rhythm') камера наближається до обличчя Муші */}
      <CameraFollow targetRef={playerRef} closeUp={status === 'rhythm'} />
    </>
  )
}

export default Level1
