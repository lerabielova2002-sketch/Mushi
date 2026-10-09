import { Canvas } from '@react-three/fiber'
import Level1 from '../levels/Level1'
import { useGame } from '../context/GameContext'

// Тут створюється 3D-сцена: камера, світло і поточний рівень.
// Усе, що всередині <Canvas>, — це 3D-об'єкти (three.js).
function Game() {
  const { resetVersion } = useGame()

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      {/* Світло */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      {/* Поточний рівень */}
      <Level1 key={resetVersion} />
    </Canvas>
  )
}

export default Game
