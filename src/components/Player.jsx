import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useGame } from '../context/GameContext'
import useKeyboard from '../hooks/useKeyboard'
import playSound from '../audio/playNote'

const noteKeys = [
  ['Digit1', 'do'],
  ['Digit2', 're'],
  ['Digit3', 'mi'],
]

const MODEL_PATHS = {
  idle: '/Mushy%20IDLE.glb',
  walk: '/Mushy%20WALK.glb',
  jump: '/Mushy%20JUMP.glb',
  fall: '/Mushy%20FALL.glb',
}

// Головний герой (гриб Муші), тепер з 3D-моделлю і анімаціями.
const Player = forwardRef(function Player({ platforms = [] }, ref) {
  const keys = useKeyboard()
  const { addFluteNote, status } = useGame()
  const velocityY = useRef(0)
  const isGrounded = useRef(true)
  const spaceWasPressed = useRef(false)
  const [activeAnimation, setActiveAnimation] = useState('idle')

  const idleModel = useGLTF(MODEL_PATHS.idle)
  const walkModel = useGLTF(MODEL_PATHS.walk)
  const jumpModel = useGLTF(MODEL_PATHS.jump)
  const fallModel = useGLTF(MODEL_PATHS.fall)

  useGLTF.preload(MODEL_PATHS.idle)
  useGLTF.preload(MODEL_PATHS.walk)
  useGLTF.preload(MODEL_PATHS.jump)
  useGLTF.preload(MODEL_PATHS.fall)

  const idleRef = useRef(null)
  const walkRef = useRef(null)
  const jumpRef = useRef(null)
  const fallRef = useRef(null)

  const idleScene = useMemo(() => idleModel.scene.clone(), [idleModel.scene])
  const walkScene = useMemo(() => walkModel.scene.clone(), [walkModel.scene])
  const jumpScene = useMemo(() => jumpModel.scene.clone(), [jumpModel.scene])
  const fallScene = useMemo(() => fallModel.scene.clone(), [fallModel.scene])

  const { actions: idleActions } = useAnimations(idleModel.animations, idleRef)
  const { actions: walkActions } = useAnimations(walkModel.animations, walkRef)
  const { actions: jumpActions } = useAnimations(jumpModel.animations, jumpRef)
  const { actions: fallActions } = useAnimations(fallModel.animations, fallRef)

  useEffect(() => {
    const actionMaps = [idleActions, walkActions, jumpActions, fallActions]
    actionMaps.forEach((actionMap) => {
      Object.values(actionMap).forEach((action) => {
        action.stop()
      })
    })

    const selectedMap = {
      idle: idleActions,
      walk: walkActions,
      jump: jumpActions,
      fall: fallActions,
    }[activeAnimation]

    const selectedAction = Object.values(selectedMap || {})[0]
    if (selectedAction) {
      selectedAction.reset().play()
    }
  }, [activeAnimation, idleActions, walkActions, jumpActions, fallActions])

  useEffect(() => {
    const playPressedNote = (event) => {
      if (event.repeat || status !== 'playing') return

      const note = noteKeys.find(([key]) => key === event.code)?.[1]
      if (!note) return

      playSound(note)
      addFluteNote(note)
    }

    window.addEventListener('keydown', playPressedNote)
    return () => window.removeEventListener('keydown', playPressedNote)
  }, [addFluteNote, status])

  useFrame((_, delta) => {
    if (!ref || !ref.current || status !== 'playing') return

    const player = ref.current
    const moveSpeed = 4

    const moveX = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0)
    const moveZ = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0)
    const isMoving = Math.abs(moveX) > 0.01 || Math.abs(moveZ) > 0.01

    player.position.x += moveX * moveSpeed * delta
    player.position.z += moveZ * moveSpeed * delta

    velocityY.current -= 18 * delta
    player.position.y += velocityY.current * delta

    const platformTop = platforms.find((platform) => {
      const halfW = platform.size[0] / 2
      const halfD = platform.size[2] / 2
      const topY = platform.position[1] + platform.size[1] / 2 + 0.5

      return (
        player.position.x >= platform.position[0] - halfW &&
        player.position.x <= platform.position[0] + halfW &&
        player.position.z >= platform.position[2] - halfD &&
        player.position.z <= platform.position[2] + halfD &&
        player.position.y >= topY - 0.9 &&
        player.position.y <= topY + 0.4 &&
        velocityY.current <= 0
      )
    })

    if (platformTop) {
      player.position.y = platformTop.position[1] + platformTop.size[1] / 2 + 0.5
      velocityY.current = 0
      isGrounded.current = true
    } else if (player.position.y <= 1) {
      player.position.y = 1
      velocityY.current = 0
      isGrounded.current = true
    } else {
      isGrounded.current = false
    }

    if (keys.Space && !spaceWasPressed.current && isGrounded.current) {
      velocityY.current = 7
      isGrounded.current = false
    }

    spaceWasPressed.current = Boolean(keys.Space)

    const nextAnimation = !isGrounded.current
      ? velocityY.current > 0
        ? 'jump'
        : 'fall'
      : isMoving
        ? 'walk'
        : 'idle'

    if (nextAnimation !== activeAnimation) {
      setActiveAnimation(nextAnimation)
    }
  })

  return (
    <group ref={ref} position={[0, 1, 0]} scale={[0.12, 0.12, 0.12]} rotation={[0, Math.PI / 2, 0]}>
      <group ref={idleRef} visible={activeAnimation === 'idle'}>
        <primitive object={idleScene} />
      </group>
      <group ref={walkRef} visible={activeAnimation === 'walk'}>
        <primitive object={walkScene} />
      </group>
      <group ref={jumpRef} visible={activeAnimation === 'jump'}>
        <primitive object={jumpScene} />
      </group>
      <group ref={fallRef} visible={activeAnimation === 'fall'}>
        <primitive object={fallScene} />
      </group>
    </group>
  )
})

export default Player
