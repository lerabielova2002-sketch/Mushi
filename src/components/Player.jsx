// Головний герой (гриб Муші). Зараз — просто червона коробка-заглушка.
// ref приходить з Level1, щоб камера знала, за ким їхати.
function Player({ ref }) {
  // TODO: (я) рух вліво/вправо/вперед (використай useKeyboard і ref.current.position)
  // TODO: (я) стрибок і гравітація
  // TODO: (я) гра на флейті (кнопка -> playSound)
  return (
    <mesh ref={ref} position={[0, 1, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}

export default Player
