/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { shaderMaterial, useTrailTexture } from '@react-three/drei'
import * as THREE from 'three'
import './PixelTrail.css'

const DotMaterial = shaderMaterial(
  {
    resolution: new THREE.Vector2(),
    mouseTrail: null as THREE.Texture | null,
    gridSize: 100,
    pixelColor: new THREE.Color('#ffffff'),
  },
  `void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }`,
  `uniform vec2 resolution;
   uniform sampler2D mouseTrail;
   uniform float gridSize;
   uniform vec3 pixelColor;

   vec2 coverUv(vec2 uv) {
     vec2 s = resolution.xy / max(resolution.x, resolution.y);
     vec2 newUv = (uv - 0.5) * s + 0.5;
     return clamp(newUv, 0.0, 1.0);
   }

   void main() {
     vec2 screenUv = gl_FragCoord.xy / resolution;
     vec2 uv = coverUv(screenUv);
     vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;
     float trail = texture2D(mouseTrail, gridUvCenter).r;
     gl_FragColor = vec4(pixelColor, trail);
   }`
)

interface SceneProps {
  gridSize: number
  trailSize: number
  maxAge: number
  interpolate: number
  easingFunction: (x: number) => number
  pixelColor: string
}

function Scene({ gridSize, trailSize, maxAge, interpolate, easingFunction, pixelColor }: SceneProps) {
  const size = useThree((s) => s.size)
  const viewport = useThree((s) => s.viewport)

  const dotMaterial = useMemo(() => new DotMaterial(), []);
  (dotMaterial as any).uniforms.pixelColor.value = new THREE.Color(pixelColor)

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: trailSize,
    maxAge,
    interpolate: interpolate || 0.1,
    ease: easingFunction,
  })

  if (trail) {
    trail.minFilter = THREE.NearestFilter
    trail.magFilter = THREE.NearestFilter
    trail.wrapS = THREE.ClampToEdgeWrapping
    trail.wrapT = THREE.ClampToEdgeWrapping
  }

  const scale = Math.max(viewport.width, viewport.height) / 2

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={onMove}>
      <planeGeometry args={[2, 2]} />
      <primitive
        object={dotMaterial}
        gridSize={gridSize}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        mouseTrail={trail}
      />
    </mesh>
  )
}

interface GooeyFilterProps {
  id?: string
  strength?: number
}

function GooeyFilter({ id = 'goo-filter', strength = 10 }: GooeyFilterProps) {
  return (
    <svg className="goo-filter-container">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}

interface PixelTrailProps {
  gridSize?: number
  trailSize?: number
  maxAge?: number
  interpolate?: number
  easingFunction?: (x: number) => number
  color?: string
  gooeyFilter?: { id: string; strength: number }
  className?: string
}

export default function PixelTrail({
  gridSize = 40,
  trailSize = 0.1,
  maxAge = 250,
  interpolate = 5,
  easingFunction = (x) => x,
  color = '#ffffff',
  gooeyFilter,
  className = '',
}: PixelTrailProps) {
  return (
    <>
      {gooeyFilter && <GooeyFilter id={gooeyFilter.id} strength={gooeyFilter.strength} />}
      <Canvas
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        className={`pixel-canvas ${className}`}
        style={gooeyFilter ? { filter: `url(#${gooeyFilter.id})` } : undefined}
      >
        <Scene
          gridSize={gridSize}
          trailSize={trailSize}
          maxAge={maxAge}
          interpolate={interpolate}
          easingFunction={easingFunction}
          pixelColor={color}
        />
      </Canvas>
    </>
  )
}
