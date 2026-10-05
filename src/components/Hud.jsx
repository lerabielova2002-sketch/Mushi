import { useGame } from '../context/GameContext'

// HUD — звичайний HTML поверх 3D-сцени.
function Hud() {
  const { lives, score, fluteNotes } = useGame()

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', fontSize: 24 }}>
      <div>Життя: {lives}</div>
      <div>Очки: {score}</div>
      <div>Ноти: {fluteNotes.length ? fluteNotes.join(' - ') : '—'}</div>
    </div>
  )
}

export default Hud
