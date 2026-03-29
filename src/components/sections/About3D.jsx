import { Float, MeshDistortMaterial, RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { ABOUT_BIO, ABOUT_STATS } from "../../content";

const LABEL_FONT = "/fonts/kenpixel.ttf";

export default function About3D({ position, isMobile }) {
  const rootRef = useRef();
  const statsRef = useRef([]);
  const debrisRef = useRef([]);
  const panelWorld = new THREE.Vector3(position[0], position[1] + 2.1, position[2]);

  useFrame((state, delta) => {
    if (rootRef.current) {
      rootRef.current.rotation.y = THREE.MathUtils.damp(
        rootRef.current.rotation.y,
        state.pointer.x * 0.08,
        3,
        delta
      );
    }

    statsRef.current.forEach((group, index) => {
      if (!group) return;
      const angle = state.clock.elapsedTime * 0.45 + (index / ABOUT_STATS.length) * Math.PI * 2;
      const radius = isMobile ? 4.8 : 6.4;

      group.position.set(
        Math.cos(angle) * radius,
        2 + Math.sin(state.clock.elapsedTime + index) * 0.8,
        Math.sin(angle) * (isMobile ? 2.4 : 3.5)
      );
      group.lookAt(panelWorld);
    });

    debrisRef.current.forEach((mesh, index) => {
      if (!mesh) return;
      mesh.rotation.x += delta * (0.2 + index * 0.02);
      mesh.rotation.y -= delta * (0.17 + index * 0.015);
    });
  });

  return (
    <group ref={rootRef} position={position}>
      <Float speed={0.7} floatIntensity={0.5} rotationIntensity={0.25}>
        <mesh position={[0, -2.4, 0]} castShadow receiveShadow>
          <icosahedronGeometry args={[4.1, isMobile ? 2 : 4]} />
          <MeshDistortMaterial
            color="#0d1f35"
            emissive="#1e3d63"
            emissiveIntensity={0.55}
            roughness={0.18}
            metalness={0.32}
            distort={0.24}
            speed={1.4}
          />
        </mesh>
      </Float>

      <RoundedBox args={[7.4, 4.2, 0.55]} radius={0.22} smoothness={10} position={[0, 2.2, 0]} castShadow>
        <meshPhysicalMaterial
          color="#7fe8ff"
          transmission={0.72}
          thickness={0.9}
          roughness={0.13}
          metalness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.12}
          emissive="#0e3f54"
          emissiveIntensity={0.35}
          opacity={0.92}
          transparent
        />
      </RoundedBox>

      <Text
        font={LABEL_FONT}
        position={[0, 3.15, 0.34]}
        color="#e8fbff"
        anchorX="center"
        anchorY="middle"
        fontSize={0.52}
        maxWidth={6.2}
      >
        ABOUT
      </Text>

      <Text
        font={LABEL_FONT}
        position={[0, 2.05, 0.34]}
        color="#a9f3ff"
        anchorX="center"
        anchorY="middle"
        fontSize={0.27}
        maxWidth={6.3}
        lineHeight={1.5}
      >
        {ABOUT_BIO}
      </Text>

      {ABOUT_STATS.map((stat, index) => (
        <group
          key={stat}
          ref={(el) => {
            statsRef.current[index] = el;
          }}
        >
          <mesh castShadow>
            <dodecahedronGeometry args={[0.85, 0]} />
            <meshStandardMaterial
              color="#9be8ff"
              emissive="#2a8eb4"
              emissiveIntensity={0.45}
              metalness={0.58}
              roughness={0.24}
            />
          </mesh>
          <Text
            font={LABEL_FONT}
            position={[0, -1.18, 0]}
            color="#f2fbff"
            fontSize={0.2}
            maxWidth={2.6}
            anchorX="center"
            anchorY="middle"
          >
            {stat}
          </Text>
        </group>
      ))}

      {new Array(isMobile ? 20 : 36).fill(0).map((_, index) => {
        const seed = index + 1;
        const angle = (seed / 36) * Math.PI * 2;
        const radius = 7 + ((seed * 13) % 5);
        const x = Math.cos(angle) * radius;
        const y = -1 + Math.sin(seed * 0.67) * 4;
        const z = Math.sin(angle) * (radius * 0.5);

        return (
          <mesh
            key={`debris-${seed}`}
            ref={(el) => {
              debrisRef.current[index] = el;
            }}
            position={[x, y, z]}
          >
            <tetrahedronGeometry args={[0.08 + (seed % 4) * 0.04, 0]} />
            <meshStandardMaterial color="#6ecbff" emissive="#30658f" emissiveIntensity={0.34} />
          </mesh>
        );
      })}
    </group>
  );
}
