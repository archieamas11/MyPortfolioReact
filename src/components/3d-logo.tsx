import { ContactShadows, Environment, useTexture } from '@react-three/drei'
import { Canvas, type RootState, useFrame } from '@react-three/fiber'
import { type FC, type RefObject, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const SMALL_MOBILE_MAX_WIDTH = 640
const COIN_RADIUS = 1

interface Coin3DProps {
  enableIntro?: boolean
  isMobile: boolean
  logoSrc: string
  size?: number
}

interface CoinModelProps {
  accentColor: THREE.Color
  enableIntro: boolean
  isMobile: boolean
  logoSrc: string
}

function calculateIntroProgress(
  elapsedTime: number,
  startTime: number,
  duration: number,
  enableIntro: boolean,
) {
  if (!enableIntro) {
    return 1
  }
  return THREE.MathUtils.clamp((elapsedTime - startTime) / duration, 0, 1)
}

function updateMeshRotation(
  mesh: THREE.Group,
  state: RootState,
  isHovered: boolean,
  isMobile: boolean,
  introProgress: number,
  baseRotationX: number,
  baseRotationY: number,
  targetRotation: { x: number; y: number },
) {
  if (isMobile) {
    mesh.rotation.x = baseRotationX
    const isSmallScreen = window.innerWidth < SMALL_MOBILE_MAX_WIDTH
    mesh.rotation.y = isSmallScreen ? baseRotationY + window.scrollY * 0.01 : baseRotationY
    return
  }

  if (introProgress < 1) {
    mesh.rotation.x = baseRotationX
    mesh.rotation.y = baseRotationY
    return
  }

  targetRotation.x = isHovered ? -(state.pointer.y * Math.PI) / 32 : 0
  targetRotation.y = isHovered ? (state.pointer.x * Math.PI) / 32 : 0

  mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotation.x, 0.1)
  mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRotation.y, 0.1)
}

function useIntroAnimation(
  meshRef: RefObject<THREE.Group | null>,
  { enableIntro, isMobile }: { enableIntro: boolean; isMobile: boolean },
  isHoveredRef: RefObject<boolean>,
) {
  const introStartTimeRef = useRef<number | null>(null)
  const introDuration = isMobile ? 0.75 : 1.05
  const targetRotation = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) {
      return
    }

    introStartTimeRef.current ??= state.clock.elapsedTime

    const introProgress = calculateIntroProgress(
      state.clock.elapsedTime,
      introStartTimeRef.current,
      introDuration,
      enableIntro,
    )

    const easedIntro = 1 - (1 - introProgress) ** 3
    const baseRotationX = enableIntro ? (1 - easedIntro) * -0.35 : 0
    const baseRotationY = enableIntro ? (1 - easedIntro) * Math.PI * 1.1 : 0

    updateMeshRotation(
      mesh,
      state,
      isHoveredRef.current,
      isMobile,
      introProgress,
      baseRotationX,
      baseRotationY,
      targetRotation.current,
    )

    mesh.position.y = enableIntro ? (1 - easedIntro) * 0.34 : 0
    mesh.scale.setScalar(enableIntro ? 0.72 + easedIntro * 0.28 : 1)
  })
}

const CoinModel: FC<CoinModelProps> = ({ logoSrc, isMobile, accentColor, enableIntro }) => {
  const meshRef = useRef<THREE.Group>(null)
  const isHoveredRef = useRef(false)
  const texture = useTexture(logoSrc, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 16
  })

  useIntroAnimation(meshRef, { enableIntro, isMobile }, isHoveredRef)

  const coinThickness = 0.105

  return (
    <group
      onPointerEnter={() => {
        if (!isMobile) {
          isHoveredRef.current = true
        }
      }}
      onPointerLeave={() => {
        if (!isMobile) {
          isHoveredRef.current = false
        }
      }}
      ref={meshRef}
    >
      {/* MAIN COIN BODY */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[COIN_RADIUS, COIN_RADIUS, coinThickness, 128]} />
        <meshPhysicalMaterial
          anisotropy={0.9}
          anisotropyRotation={Math.PI * 0.25}
          clearcoat={0.08}
          clearcoatRoughness={0.25}
          color={accentColor}
          envMapIntensity={1.25}
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>

      {/* SIDE WALL / FINELY KNULED / REEDEDED EDGE */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[COIN_RADIUS * 1.005, COIN_RADIUS * 1.005, coinThickness * 0.96, 256]} />
        <meshPhysicalMaterial color={accentColor} envMapIntensity={1.1} metalness={0.92} roughness={0.28} />
      </mesh>

      {/* SUBTLE BEVEL */}
      {/* Front bevel ring */}
      <mesh position={[0, 0, coinThickness / 2 - 0.008]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[COIN_RADIUS * 0.99, COIN_RADIUS * 1.008, 0.014, 96]} />
        <meshPhysicalMaterial color={accentColor} envMapIntensity={1.2} metalness={0.94} roughness={0.19} />
      </mesh>
      {/* Back bevel ring */}
      <mesh position={[0, 0, -coinThickness / 2 + 0.008]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[COIN_RADIUS * 0.99, COIN_RADIUS * 1.008, 0.014, 96]} />
        <meshPhysicalMaterial color={accentColor} envMapIntensity={1.2} metalness={0.94} roughness={0.19} />
      </mesh>

      {/* FRONT LOGO */}
      <mesh position={[0, 0, coinThickness / 2 + 0.002]}>
        <circleGeometry args={[COIN_RADIUS * 0.85, 64]} />
        <meshStandardMaterial
          alphaTest={0.05} /* Cleans up edge artifacts from transparent PNGs */
          bumpMap={texture} /* Creates the depth illusion */
          bumpScale={0.025} /* Increase/decrease for deeper/shallower emboss */
          color={0xff_ff_ff}
          map={texture}
          metalness={0.85} /* Raised to catch highlights on the edge */
          opacity={1}
          roughness={0.15} /* Lowered slightly to make the embossed edge shiny */
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* BACK LOGO*/}
      <mesh position={[0, 0, -coinThickness / 2 - 0.002]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[COIN_RADIUS * 0.85, 64]} />
        <meshStandardMaterial
          alphaTest={0.05}
          bumpMap={texture}
          bumpScale={0.025}
          color={0xff_ff_ff}
          map={texture}
          metalness={0.85}
          opacity={1}
          roughness={0.15}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      {/* OUTER RIM DETAIL – front */}
      <mesh position={[0, 0, coinThickness / 2 + 0.003]}>
        <ringGeometry args={[COIN_RADIUS * 0.88, COIN_RADIUS * 0.925, 64]} />
        <meshPhysicalMaterial color={accentColor} envMapIntensity={1.15} metalness={0.93} roughness={0.18} />
      </mesh>

      {/* OUTER RIM DETAIL – back */}
      <mesh position={[0, 0, -coinThickness / 2 - 0.003]} rotation={[Math.PI, 0, 0]}>
        <ringGeometry args={[COIN_RADIUS * 0.88, COIN_RADIUS * 0.925, 64]} />
        <meshPhysicalMaterial color={accentColor} envMapIntensity={1.15} metalness={0.93} roughness={0.18} />
      </mesh>
    </group>
  )
}

const CoinScene: FC<{
  logoSrc: string
  isMobile: boolean
  accentColor: THREE.Color
  enableIntro: boolean
}> = ({ logoSrc, isMobile, accentColor, enableIntro }) => {
  return (
    <>
      {/* Soft overhead studio lighting with subtle anisotropic highlights */}
      <ambientLight intensity={0.45} />
      {/* Primary soft overhead key light */}
      <directionalLight color="#f8f4eb" intensity={1.6} position={[0, 12, 8]} />
      {/* Fill light – soft and slightly cooler */}
      <directionalLight color="#e0e8ff" intensity={0.55} position={[-8, 4, -10]} />
      {/* Rim light for metallic edge definition */}
      <pointLight intensity={0.35} position={[0, 5, 0]} />

      <CoinModel accentColor={accentColor} enableIntro={enableIntro} isMobile={isMobile} logoSrc={logoSrc} />

      <Environment preset="studio" />

      {/* Soft down-drop shadow with realistic occlusion*/}
      <ContactShadows
        blur={isMobile ? 2.0 : 2.8}
        far={4.5}
        opacity={0.42}
        position={[0, -2.1, 0]}
        resolution={512}
        scale={isMobile ? 8.5 : 11}
      />
    </>
  )
}

const Coin3D: FC<Coin3DProps> = ({
  isMobile,
  logoSrc,
  size,
  enableIntro = true,
}) => {
  const [threeColor, setThreeColor] = useState(() => new THREE.Color('#f43f5e'))

  useEffect(() => {
    const saved = localStorage.getItem('accent-color')
    if (saved) {
      setThreeColor(new THREE.Color(saved))
    }
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const hex = (e as CustomEvent<{ color: string }>).detail.color
      setThreeColor(new THREE.Color(hex))
    }
    window.addEventListener('accentColorChange', handler)
    return () => window.removeEventListener('accentColorChange', handler)
  }, [])

  return (
    <div style={size ? { width: size, height: size } : undefined}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio, 2)}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        }}
      >
        <CoinScene accentColor={threeColor} enableIntro={enableIntro} isMobile={isMobile} logoSrc={logoSrc} />
      </Canvas>
    </div>
  )
}

export default Coin3D
