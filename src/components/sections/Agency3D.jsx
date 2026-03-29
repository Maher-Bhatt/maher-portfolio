import { Html, Text, Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AGENCY_CONTENT } from "../../content";

const LABEL_FONT = "/fonts/kenpixel.ttf";
const FONT_URL = "/fonts/helvetiker_bold.typeface.json";

export default function Agency3D({ position, isMobile }) {
  const groupRef = useRef();
  const portalRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.07;
    }

    if (portalRef.current) {
      portalRef.current.rotation.z += delta * 0.45;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh
        ref={portalRef}
        position={[0, 0.4, -1.6]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[5.4, 0.22, 32, 120]} />
        <meshStandardMaterial
          color="#ffba7c"
          emissive="#ff9f4e"
          emissiveIntensity={0.7}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, 0.4, -1.6]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.1, 4.7, 96]} />
        <meshStandardMaterial color="#210f05" emissive="#5e2a0c" emissiveIntensity={0.35} />
      </mesh>

      <Text3D
        font={FONT_URL}
        size={isMobile ? 1.35 : 1.85}
        height={0.48}
        curveSegments={8}
        bevelEnabled
        bevelThickness={0.05}
        bevelSize={0.035}
        bevelSegments={6}
        position={[0, 2.2, 0]}
        center
      >
        {AGENCY_CONTENT.title}
        <meshStandardMaterial
          color="#ffe6c9"
          emissive="#cd7d3a"
          emissiveIntensity={0.45}
          metalness={0.72}
          roughness={0.17}
        />
      </Text3D>

      <Text
        font={LABEL_FONT}
        fontSize={0.62}
        color="#ffd5b1"
        anchorX="center"
        anchorY="middle"
        position={[0, -0.35, 0.3]}
      >
        {AGENCY_CONTENT.subtitle}
      </Text>

      <Text
        font={LABEL_FONT}
        fontSize={0.27}
        color="#ffeede"
        anchorX="center"
        anchorY="middle"
        position={[0, -1.2, 0.3]}
        maxWidth={9}
      >
        {AGENCY_CONTENT.line}
      </Text>

      <Html transform position={[0, -2.15, 0.4]} center>
        <a className="scene-link" href={AGENCY_CONTENT.href} target="_blank" rel="noreferrer">
          velocityweb.online
        </a>
      </Html>
    </group>
  );
}
