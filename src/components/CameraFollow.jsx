import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const MIN_DISTANCE = 3
const MAX_DISTANCE = 20

// Камера їде за героєм і обертається за ПКМ.
function CameraFollow({ targetRef, offset = [0, 5, 10] }) {
  const yaw = useRef(-Math.PI / 4)
  const pitch = useRef(0.7)
  const distance = useRef(Math.hypot(offset[0], offset[1], offset[2]))
  const isRotating = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.button !== 2) return
      isRotating.current = true
      lastPointer.current = { x: event.clientX, y: event.clientY }
    }

    const handlePointerMove = (event) => {
      if (!isRotating.current) return

      const dx = event.clientX - lastPointer.current.x
      const dy = event.clientY - lastPointer.current.y

      yaw.current -= dx * 0.005
      pitch.current = Math.max(-1.2, Math.min(1.2, pitch.current + dy * 0.004))

      lastPointer.current = { x: event.clientX, y: event.clientY }
    }

    const handleWheel = (event) => {
      event.preventDefault()
      distance.current = Math.max(
        MIN_DISTANCE,
        Math.min(MAX_DISTANCE, distance.current + event.deltaY * 0.01),
      )
    }

    const handlePointerUp = () => {
      isRotating.current = false
    }

    const preventContextMenu = (event) => event.preventDefault()

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('contextmenu', preventContextMenu)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('contextmenu', preventContextMenu)
    }
  }, [])

  useFrame((state) => {
    const target = targetRef.current
    if (!target) return

    const cameraX =
      target.position.x +
      Math.sin(yaw.current) * Math.cos(pitch.current) * distance.current + offset[0] * 0.2
    const cameraY =
      target.position.y +
      Math.sin(pitch.current) * distance.current + offset[1] * 0.3
    const cameraZ =
      target.position.z +
      Math.cos(yaw.current) * Math.cos(pitch.current) * distance.current + offset[2] * 0.2

    state.camera.position.set(cameraX, cameraY, cameraZ)
    state.camera.lookAt(target.position.x, target.position.y + 1.2, target.position.z)
  })

  return null
}

export default CameraFollow
