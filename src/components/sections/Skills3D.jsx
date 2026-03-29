import { Billboard, Text, useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SKILLS } from "../../content";

const LABEL_FONT = "/fonts/kenpixel.ttf";

const CATEGORY_COLORS = {
  Frontend: "#5fd7ff",
  Web3: "#7df2be",
  Tools: "#ffc27d",
  Business: "#f7a7ff",
};

function SkillOrb({ skill, index, isMobile }) {
  const groupRef = useRef();
  const angle = useRef((index / SKILLS.length) * Math.PI * 2);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const orbitRadius = useMemo(() => 4.8 + skill.proficiency * 8.4, [skill.proficiency]);
  const speed = useMemo(() => 0.17 + skill.proficiency * 0.42, [skill.proficiency]);
  const color = CATEGORY_COLORS[skill.category] ?? "#8fd5ff";

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!hovered) {
      angle.current += delta * speed * (isMobile ? 0.74 : 1);
    }

    const x = Math.cos(angle.current) * orbitRadius;
    const z = Math.sin(angle.current) * orbitRadius;
    const y = Math.sin(angle.current * 1.8 + index) * 1.3;

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, x, 4, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, y, 4, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, z, 4, delta);

    const targetScale = hovered ? 1.45 : 1;
    groupRef.current.scale.x = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 6, delta);
    groupRef.current.scale.y = THREE.MathUtils.damp(groupRef.current.scale.y, targetScale, 6, delta);
    groupRef.current.scale.z = THREE.MathUtils.damp(groupRef.current.scale.z, targetScale, 6, delta);
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.62, isMobile ? 1 : 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          metalness={0.36}
          roughness={0.18}
        />
      </mesh>

      <Text
        font={LABEL_FONT}
        fontSize={0.12}
        color="#032438"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0.65]}
        maxWidth={1.2}
      >
        {skill.name}
      </Text>

      {hovered && (
        <Billboard position={[0, 1.18, 0]}>
          <Text
            font={LABEL_FONT}
            fontSize={0.19}
            color="#f0fbff"
            anchorX="center"
            anchorY="middle"
            maxWidth={4}
          >
            {`${skill.name} | ${skill.category}`}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

export default function Skills3D({ position, isMobile }) {
  const coreRef = useRef();
  const ringsRef = useRef([]);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.25;
    }

    ringsRef.current.forEach((ring, index) => {
      if (!ring) return;
      ring.rotation.z += delta * (0.05 + index * 0.015);
      ring.rotation.x -= delta * (0.03 + index * 0.01);
    });
  });

  return (
    <group position={position}>
      <Text
        font={LABEL_FONT}
        fontSize={0.76}
        color="#f2fcff"
        position={[0, 5.1, 0]}
        anchorX="center"
        anchorY="middle"
      >
        SKILLS SYSTEM
      </Text>

      <group ref={coreRef}>
        <mesh castShadow>
          <icosahedronGeometry args={[1.45, isMobile ? 1 : 3]} />
          <meshStandardMaterial
            color="#8ee9ff"
            emissive="#3db5df"
            emissiveIntensity={0.9}
            metalness={0.65}
            roughness={0.2}
          />
        </mesh>
      </group>

      <pointLight position={[0, 0, 0]} intensity={2.5} color="#67d7ff" distance={24} />

      {[5, 8, 11.5].map((radius, index) => (
        <mesh
          key={`orbit-ring-${radius}`}
          ref={(el) => {
            ringsRef.current[index] = el;
          }}
          rotation={[Math.PI / 2 + index * 0.4, 0, index * 0.25]}
        >
          <torusGeometry args={[radius, 0.06, 18, 90]} />
          <meshStandardMaterial color="#2f7da8" emissive="#245470" emissiveIntensity={0.35} />
        </mesh>
      ))}

      {SKILLS.map((skill, index) => (
        <SkillOrb key={skill.name} skill={skill} index={index} isMobile={isMobile} />
      ))}
    </group>
  );
}
