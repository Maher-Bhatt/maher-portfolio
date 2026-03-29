import { RoundedBox, Text, useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { PROJECTS } from "../../content";

const TITLE_FONT = "/fonts/kenpixel.ttf";
const BODY_FONT = "/fonts/arialbd.ttf";
const DISABLE_RAYCAST = () => null;

function linkString(links) {
  const labels = [];
  if (links.live) labels.push("Live");
  if (links.github) labels.push("GitHub");
  return labels.join(" | ");
}

function ProjectCard({ project, slot, selectedProjectId, onProjectSelect, isMobile }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const isActive = selectedProjectId === project.id;
  const showBack = hovered || isActive;
  const basePosition = useMemo(() => new THREE.Vector3(...slot.position), [slot.position]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const targetFlip = hovered || isActive ? Math.PI : 0;
    const targetScale = isActive ? slot.scale * 1.16 : hovered ? slot.scale * 1.05 : slot.scale;
    const targetForward = isActive ? 5.2 : hovered ? 0.45 : 0;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetFlip, 6, delta);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, basePosition.x, 6, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      basePosition.y + Math.sin(state.clock.elapsedTime * 0.8 + slot.index) * 0.2,
      5,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      basePosition.z + targetForward,
      5,
      delta
    );
    groupRef.current.scale.x = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 5, delta);
    groupRef.current.scale.y = THREE.MathUtils.damp(groupRef.current.scale.y, targetScale, 5, delta);
    groupRef.current.scale.z = THREE.MathUtils.damp(groupRef.current.scale.z, targetScale, 5, delta);
  });

  const handleSelect = (event) => {
    event.stopPropagation();
    const worldPosition = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPosition);

    if (isActive) {
      onProjectSelect(null, null);
      return;
    }

    onProjectSelect(project.id, worldPosition.toArray());
  };

  const width = slot.featured ? (isMobile ? 5.2 : 6.1) : isMobile ? 3.9 : 4.4;
  const height = slot.featured ? (isMobile ? 3.2 : 3.8) : isMobile ? 2.5 : 2.9;
  const depth = slot.featured ? 0.36 : 0.28;
  const titleSize = slot.featured ? (isMobile ? 0.42 : 0.54) : isMobile ? 0.3 : 0.35;
  const bodySize = slot.featured ? (isMobile ? 0.2 : 0.24) : isMobile ? 0.16 : 0.18;
  const textZ = depth * 0.57;

  return (
    <group
      ref={groupRef}
      position={slot.position}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={handleSelect}
    >
      <RoundedBox args={[width, height, depth]} radius={0.14} smoothness={8} castShadow>
        <meshStandardMaterial
          color={slot.featured ? "#b8f0ff" : "#86d8ff"}
          emissive={slot.featured ? "#2f8cad" : "#194b74"}
          emissiveIntensity={slot.featured ? 0.54 : 0.38}
          metalness={0.35}
          roughness={0.16}
        />
      </RoundedBox>

      {!showBack && (
        <group position={[0, 0, textZ]}>
          <Text
            font={TITLE_FONT}
            color="#f2fdff"
            fontSize={titleSize}
            maxWidth={width - 0.8}
            anchorX="center"
            anchorY="middle"
            position={[0, height * 0.26, 0]}
          >
            {project.title}
          </Text>
          <Text
            font={BODY_FONT}
            color="#dff7ff"
            fontSize={bodySize}
            maxWidth={width - 1}
            anchorX="center"
            anchorY="middle"
            lineHeight={1.35}
            textAlign="center"
            position={[0, -0.02, 0]}
          >
            {project.tagline}
          </Text>
          <Text
            font={BODY_FONT}
            color="#a7ddf2"
            fontSize={slot.featured ? 0.14 : 0.125}
            maxWidth={width - 1}
            anchorX="center"
            anchorY="middle"
            lineHeight={1.25}
            textAlign="center"
            position={[0, -height * 0.34, 0]}
          >
            {project.tech.join(" | ")}
          </Text>
        </group>
      )}

      {showBack && (
        <group rotation={[0, Math.PI, 0]} position={[0, 0, textZ]}>
          <Text
            font={TITLE_FONT}
            color="#effcff"
            fontSize={slot.featured ? 0.35 : 0.29}
            maxWidth={width - 1}
            anchorX="center"
            anchorY="middle"
            position={[0, height * 0.28, 0]}
          >
            Deep Dive
          </Text>
          <Text
            font={BODY_FONT}
            color="#e1f7ff"
            fontSize={slot.featured ? 0.16 : 0.14}
            maxWidth={width - 1}
            anchorX="center"
            anchorY="middle"
            lineHeight={1.32}
            textAlign="center"
            position={[0, 0, 0]}
          >
            {project.details}
          </Text>
          <Text
            font={BODY_FONT}
            color="#9ed4e7"
            fontSize={0.13}
            maxWidth={width - 1}
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            position={[0, -height * 0.34, 0]}
          >
            {linkString(project.links)}
          </Text>
        </group>
      )}
    </group>
  );
}

export default function Projects3D({ position, isMobile, selectedProjectId, onProjectSelect }) {
  const ringRef = useRef([]);

  const slots = useMemo(
    () => [
      { index: 0, projectId: "certchain", position: [0, 1.6, 0], scale: 1.16, featured: true },
      { index: 1, projectId: "ztees", position: [-7.4, 1.4, -2.1], scale: 0.98, featured: false },
      { index: 2, projectId: "itm-campus-retrieve", position: [7.4, 1.3, -2.1], scale: 0.98, featured: false },
      { index: 3, projectId: "itm-notes", position: [0, -2.3, -3.8], scale: 0.94, featured: false },
    ],
    []
  );

  const corridorRings = useMemo(
    () => [
      { radius: 8.6, z: -10, y: 0.6, rotX: Math.PI / 2, rotY: 0.1 },
      { radius: 9.4, z: -18, y: 0.3, rotX: Math.PI / 2, rotY: -0.16 },
      { radius: 10.2, z: -26, y: 0.1, rotX: Math.PI / 2, rotY: 0.12 },
      { radius: 11.1, z: -34, y: -0.2, rotX: Math.PI / 2, rotY: -0.1 },
    ],
    []
  );

  useFrame((_, delta) => {
    ringRef.current.forEach((ring, index) => {
      if (!ring) return;
      ring.rotation.z += delta * (0.02 + index * 0.006);
    });
  });

  return (
    <group position={position}>
      {corridorRings.map((ring, index) => (
        <mesh
          key={`corridor-${index}`}
          ref={(el) => {
            ringRef.current[index] = el;
          }}
          position={[0, ring.y, ring.z]}
          rotation={[ring.rotX, ring.rotY, 0]}
          raycast={DISABLE_RAYCAST}
        >
          <torusGeometry args={[ring.radius, 0.07, 16, 120]} />
          <meshStandardMaterial color="#4fb5f0" emissive="#215a7f" emissiveIntensity={0.34} />
        </mesh>
      ))}

      <mesh position={[0, -3.75, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow raycast={DISABLE_RAYCAST}>
        <ringGeometry args={[8.4, 17.8, 96]} />
        <meshStandardMaterial color="#041225" emissive="#11345a" emissiveIntensity={0.3} metalness={0.45} />
      </mesh>

      <Text
        font={TITLE_FONT}
        fontSize={0.74}
        color="#e9f9ff"
        position={[0, 4.8, -0.9]}
        anchorX="center"
        anchorY="middle"
        raycast={DISABLE_RAYCAST}
      >
        PROJECTS GALLERY
      </Text>

      {slots.map((slot) => {
        const project = PROJECTS.find((entry) => entry.id === slot.projectId);
        if (!project) return null;

        return (
          <ProjectCard
            key={project.id}
            project={project}
            slot={slot}
            selectedProjectId={selectedProjectId}
            onProjectSelect={onProjectSelect}
            isMobile={isMobile}
          />
        );
      })}
    </group>
  );
}
