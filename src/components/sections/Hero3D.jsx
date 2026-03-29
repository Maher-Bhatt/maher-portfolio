import { Float, Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const FONT_URL = "/fonts/helvetiker_bold.typeface.json";

const ORBIT_CONFIG = [
  { radius: 6.2, speed: 0.32, y: 2.8, color: "#5fd8ff", shape: "torusKnot", scale: 0.72 },
  { radius: 7.4, speed: -0.27, y: -1.8, color: "#ffb17d", shape: "icosahedron", scale: 0.82 },
  { radius: 8.5, speed: 0.2, y: 1.1, color: "#8bffcc", shape: "ring", scale: 1.15 },
  { radius: 5.3, speed: -0.35, y: 0.4, color: "#b694ff", shape: "octahedron", scale: 0.66 },
  { radius: 9.2, speed: 0.14, y: -2.4, color: "#ffdc6f", shape: "torusKnot", scale: 0.62 },
];

function Orbiter({ config, index }) {
  const ref = useRef();
  const angle = useRef((index / ORBIT_CONFIG.length) * Math.PI * 2);

  useFrame((state, delta) => {
    if (!ref.current) return;

    angle.current += delta * config.speed;
    ref.current.position.set(
      Math.cos(angle.current) * config.radius,
      config.y + Math.sin(state.clock.elapsedTime * 0.7 + index) * 0.45,
      Math.sin(angle.current) * config.radius
    );

    ref.current.rotation.x += delta * 0.5;
    ref.current.rotation.y -= delta * 0.35;
  });

  return (
    <mesh ref={ref} castShadow>
      {config.shape === "torusKnot" && (
        <torusKnotGeometry args={[config.scale * 0.6, config.scale * 0.16, 120, 16, 2, 3]} />
      )}
      {config.shape === "icosahedron" && <icosahedronGeometry args={[config.scale, 1]} />}
      {config.shape === "octahedron" && <octahedronGeometry args={[config.scale, 1]} />}
      {config.shape === "ring" && <torusGeometry args={[config.scale * 0.7, config.scale * 0.15, 18, 64]} />}
      <meshStandardMaterial
        color={config.color}
        emissive={config.color}
        emissiveIntensity={0.45}
        metalness={0.55}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function Hero3D({ position, isMobile }) {
  const groupRef = useRef();
  const textRef = useRef();
  const rotationTarget = useMemo(() => new THREE.Euler(), []);
  const orbitConfigs = useMemo(
    () =>
      isMobile
        ? ORBIT_CONFIG.slice(0, 3).map((config) => ({
            ...config,
            radius: config.radius * 0.72,
            y: config.y * 0.78,
            scale: config.scale * 0.82,
          }))
        : ORBIT_CONFIG,
    [isMobile]
  );

  useFrame((state, delta) => {
    if (!groupRef.current || !textRef.current) return;

    rotationTarget.y = state.pointer.x * 0.22;
    rotationTarget.x = state.pointer.y * 0.12;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, rotationTarget.y, 4, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, rotationTarget.x, 4, delta);
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.32;

    textRef.current.rotation.x = THREE.MathUtils.damp(
      textRef.current.rotation.x,
      -state.pointer.y * 0.18,
      5,
      delta
    );
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.7}>
        <Text3D
          ref={textRef}
          font={FONT_URL}
          size={isMobile ? 1.7 : 3.35}
          height={isMobile ? 0.45 : 1.05}
          curveSegments={isMobile ? 6 : 10}
          bevelEnabled
          bevelThickness={isMobile ? 0.05 : 0.09}
          bevelSize={isMobile ? 0.03 : 0.05}
          bevelSegments={isMobile ? 4 : 6}
          castShadow
          center
        >
          MAHER
          <meshPhysicalMaterial
            color="#dbf2ff"
            metalness={0.95}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.08}
            emissive="#16506d"
            emissiveIntensity={0.52}
          />
        </Text3D>
      </Float>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, isMobile ? -1.95 : -2.8, 0]}>
        <torusGeometry args={[isMobile ? 4.6 : 6.5, isMobile ? 0.08 : 0.11, 24, 120]} />
        <meshStandardMaterial color="#2f9bc2" emissive="#2f9bc2" emissiveIntensity={0.45} />
      </mesh>

      {orbitConfigs.map((config, index) => (
        <Orbiter key={config.shape + index} config={config} index={index} />
      ))}
    </group>
  );
}
