import { useFrame } from '@react-three/fiber'

// Камера їде за об'єктом. targetRef — це ref на 3D-об'єкт (mesh) героя.
// offset — де камера стоїть відносно героя [x, y, z].
function CameraFollow({ targetRef, offset = [0, 5, 10] }) {
  // useFrame викликається кожен кадр
  useFrame((state) => {
    const target = targetRef.current
    if (!target) return

    state.camera.position.set(
      target.position.x + offset[0],
      target.position.y + offset[1],
      target.position.z + offset[2],
    )
    state.camera.lookAt(target.position)
  })

  return null
}

export default CameraFollow
