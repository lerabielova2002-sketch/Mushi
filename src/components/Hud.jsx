import { useGame } from '../context/GameContext'

// HUD — звичайний HTML поверх 3D-сцени.
function Hud() {
  const { lives, score } = useGame()

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', fontSize: 24 }}>
      <div>Життя: {lives}</div>
      <div>Очки: {score}</div>
      {/* TODO: (я) показати ноти флейти */}
    </div>
  )
}

export default Hud
