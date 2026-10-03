import { useRef } from 'react'
import Player from '../components/Player'
import Enemy from '../components/Enemy'
import CameraFollow from '../components/CameraFollow'

// Перший рівень. Зараз є тільки плоска земля, герой і один ворог.
function Level1() {
  const playerRef = useRef()

  // TODO: (я) платформи (масив позицій + .map)
  // TODO: (я) розстановка ворогів
  // TODO: (я) фініш рівня
  return (
    <>
      {/* Земля */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="green" />
      </mesh>

      <Player ref={playerRef} />
      <Enemy />

      <CameraFollow targetRef={playerRef} />
    </>
  )
}

export default Level1
