import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Raycaster, Vector3 } from 'three'
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

// Починаємо вантажити моделі одразу при імпорті, а не при кожному рендері компонента
Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path))

// Головний герой (гриб Муші), тепер з 3D-моделлю і анімаціями.
const Player = forwardRef(function Player({ platforms = [], groundMeshes }, ref) {
  const keys = useKeyboard()
  const { addFluteNote, status } = useGame()
  const velocityY = useRef(0)
  const isGrounded = useRef(true)
  const spaceWasPressed = useRef(false)
  const [activeAnimation, setActiveAnimation] = useState('idle')

  // Промінь, який летить вниз від гравця і шукає землю в моделі рівня
  const raycaster = useRef(new Raycaster())
  const rayOrigin = useRef(new Vector3())
  const rayDown = useRef(new Vector3(0, -1, 0))

  // Другий промінь — горизонтальний, щоб гравець не проходив крізь скелі та дерева
  const wallRaycaster = useRef(new Raycaster(undefined, undefined, 0, 0.45))
  const wallDirection = useRef(new Vector3())

  const idleModel = useGLTF(MODEL_PATHS.idle)
  const walkModel = useGLTF(MODEL_PATHS.walk)
  const jumpModel = useGLTF(MODEL_PATHS.jump)
  const fallModel = useGLTF(MODEL_PATHS.fall)

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

  // true, якщо в напрямку (dirX, dirZ) за 0.45 одиниці є стіна (скеля, дерево)
  const isBlocked = (player, dirX, dirZ) => {
    if (!groundMeshes) return false

    // Промінь на рівні "колін": нижчі за 0.5 камінці гравець просто переступає
    rayOrigin.current.set(player.position.x, player.position.y - 0.4, player.position.z)
    wallDirection.current.set(dirX, 0, dirZ)
    wallRaycaster.current.set(rayOrigin.current, wallDirection.current)

    const hits = wallRaycaster.current.intersectObjects(groundMeshes, false)

    // Ігноруємо майже горизонтальні поверхні (це земля, а не стіна)
    return hits.some((hit) => {
      if (!hit.face) return true
      const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld)
      return Math.abs(normal.y) < 0.7
    })
  }

  useFrame((_, rawDelta) => {
    if (!ref || !ref.current || status !== 'playing') return

    // Обмежуємо delta: після важкого завантаження перший кадр може тривати секунди,
    // і гравець за один кадр пролетів би крізь землю
    const delta = Math.min(rawDelta, 0.05)

    const player = ref.current
    const moveSpeed = 4

    const moveX = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0)
    const moveZ = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0)
    const isMoving = Math.abs(moveX) > 0.01 || Math.abs(moveZ) > 0.01

    // Рухаємось окремо по X і Z, тому біля стіни можна ковзати вздовж неї
    const stepX = moveX * moveSpeed * delta
    const stepZ = moveZ * moveSpeed * delta

    if (stepX !== 0 && !isBlocked(player, Math.sign(stepX), 0)) {
      player.position.x += stepX
    }
    if (stepZ !== 0 && !isBlocked(player, 0, Math.sign(stepZ))) {
      player.position.z += stepZ
    }

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

    // Шукаємо землю під гравцем: тільки там, де в моделі є меш (порожнеча = падіння)
    let groundY = null
    if (groundMeshes) {
      rayOrigin.current.set(player.position.x, player.position.y + 0.5, player.position.z)
      raycaster.current.set(rayOrigin.current, rayDown.current)
      const hits = raycaster.current.intersectObjects(groundMeshes, false)
      if (hits.length > 0) {
        groundY = hits[0].point.y + 1 // 1 — висота центру гравця над землею
      }
    }

    if (platformTop) {
      player.position.y = platformTop.position[1] + platformTop.size[1] / 2 + 0.5
      velocityY.current = 0
      isGrounded.current = true
    } else if (groundY !== null && player.position.y <= groundY && velocityY.current <= 0) {
      player.position.y = groundY
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
    <group ref={ref} position={[2.5, 5, -3.5]} scale={[0.05, 0.05, 0.05]} rotation={[0, Math.PI / 2, 0]}>
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
