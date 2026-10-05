import { useRef } from 'react'
import Player from '../components/Player'
import Enemy from '../components/Enemy'
import CameraFollow from '../components/CameraFollow'

// Перший рівень. Зараз є тільки плоска земля, герой і один ворог.
function Level1() {
  const playerRef = useRef()
  const platforms = [
    { position: [2, 0.5, 0], size: [2, 1, 2] },
    { position: [5, 1.5, 0], size: [2, 1, 2] },
  ]

  // TODO: (я) розстановка ворогів
  // TODO: (я) фініш рівня
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

      <Player ref={playerRef} platforms={platforms} />
      <Enemy />

      <CameraFollow targetRef={playerRef} />
    </>
  )
}

export default Level1
