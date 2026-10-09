import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import Player from '../components/Player'
import Enemy from '../components/Enemy'
import CameraFollow from '../components/CameraFollow'
import { useGame } from '../context/GameContext'

const baseEnemies = [
  { id: 1, position: [4, 1, 2], melody: ['do', 're', 'mi'], defeated: false },
  { id: 2, position: [8, 1, -2], melody: ['mi', 're', 'do'], defeated: false },
  { id: 3, position: [11, 1, 2], melody: ['do', 'mi', 're'], defeated: false },
]

// Перший рівень: лісова стежка, платформи, вороги і фініш.
// TODO: (я) розширити сценарій на другий і третій рівні з новими механіками і локаціями
function Level1() {
  const playerRef = useRef()
  const [enemies, setEnemies] = useState(baseEnemies)
  const { addScore, setStatus, status } = useGame()
  const finishPosition = [14, 1, 0]

  const handleEnemyDefeat = (enemyId) => {
    setEnemies((oldEnemies) =>
      oldEnemies.map((enemy) =>
        enemy.id === enemyId ? { ...enemy, defeated: true } : enemy,
      ),
    )
    addScore(10)
  }

  useFrame(() => {
    if (!playerRef.current || status !== 'playing') return

    const playerPosition = playerRef.current.position
    const victoryReached =
      playerPosition.x > finishPosition[0] - 1 &&
      playerPosition.z > finishPosition[2] - 1.5 &&
      playerPosition.z < finishPosition[2] + 1.5 &&
      enemies.every((enemy) => enemy.defeated)

    if (victoryReached) {
      setStatus('victory')
    }
  })

  const platforms = [
    { position: [2, 0.5, 0], size: [2, 1, 2] },
    { position: [5, 1.5, 0], size: [2, 1, 2] },
    { position: [9, 2.2, 0], size: [2, 1, 2] },
  ]

  return (
    <>
      {/* Земля */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="green" />
      </mesh>

      {platforms.map((platform, index) => (
        <mesh key={index} position={platform.position}>
          <boxGeometry args={platform.size} />
          <meshStandardMaterial color="brown" />
        </mesh>
      ))}

      <mesh position={finishPosition}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={0.5} />
      </mesh>

      <Player ref={playerRef} platforms={platforms} />

      {enemies.map((enemy) => (
        <Enemy
          key={enemy.id}
          position={enemy.position}
          melody={enemy.melody}
          playerRef={playerRef}
          onDefeat={() => handleEnemyDefeat(enemy.id)}
          defeated={enemy.defeated}
        />
      ))}

      <CameraFollow targetRef={playerRef} />
    </>
  )
}

export default Level1
