// Ворог. Зараз — просто фіолетова коробка-заглушка.
// position приходить з рівня: <Enemy position={[x, y, z]} />
function Enemy({ position = [3, 1, 0] }) {
  // TODO: (я) рух / поведінка ворога
  // TODO: (я) яка мелодія його перемагає і що відбувається при перемозі
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  )
}

export default Enemy
