import { Html, RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { CONTACT_LINKS } from "../../content";

const TITLE_FONT = "/fonts/kenpixel.ttf";

function BurstParticles({ burstId, isMobile, onDone }) {
  const pointsRef = useRef();
  const materialRef = useRef();
  const age = useRef(0);
  const done = useRef(false);
  const count = isMobile ? 90 : 180;

  const { positions, velocities } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const v = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.35, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(2.7 + Math.random() * 2.3);

      p[i3] = 0;
      p[i3 + 1] = 0;
      p[i3 + 2] = 0;
      v[i3] = dir.x;
      v[i3 + 1] = dir.y;
      v[i3 + 2] = dir.z;
    }

    return { positions: p, velocities: v };
  }, [burstId, count]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !materialRef.current) return;

    age.current += delta;
    const life = age.current;
    const array = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      array[i3] += velocities[i3] * delta;
      array[i3 + 1] += velocities[i3 + 1] * delta - delta * 0.4;
      array[i3 + 2] += velocities[i3 + 2] * delta;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    materialRef.current.opacity = Math.max(0, 1 - life / 1.2);

    if (life >= 1.2 && !done.current) {
      done.current = true;
      onDone?.();
    }
  });

  return (
    <points ref={pointsRef} position={[0, -2.48, 1.4]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={isMobile ? 0.08 : 0.11}
        color="#7ff3ff"
        transparent
        opacity={1}
        depthWrite={false}
      />
    </points>
  );
}

export default function Contact3D({ position, isMobile }) {
  const rootRef = useRef();
  const [burstId, setBurstId] = useState(0);
  const [showBurst, setShowBurst] = useState(false);

  useFrame((state, delta) => {
    if (!rootRef.current) return;
    rootRef.current.rotation.y = THREE.MathUtils.damp(rootRef.current.rotation.y, state.pointer.x * 0.07, 2.2, delta);
  });

  const triggerBurst = () => {
    setBurstId((value) => value + 1);
    setShowBurst(true);
  };

  return (
    <group ref={rootRef} position={position}>
      <Text
        font={TITLE_FONT}
        fontSize={0.76}
        color="#f1fdff"
        anchorX="center"
        anchorY="middle"
        position={[0, 5.1, 0]}
      >
        CONTACT TERMINAL
      </Text>

      <RoundedBox args={[10, 6.2, 1.3]} radius={0.26} smoothness={12} castShadow receiveShadow>
        <meshStandardMaterial
          color="#0d2f3b"
          emissive="#0f5166"
          emissiveIntensity={0.42}
          metalness={0.5}
          roughness={0.2}
        />
      </RoundedBox>

      <RoundedBox args={[8.7, 5.1, 0.24]} radius={0.16} smoothness={10} position={[0, 0.1, 0.76]}>
        <meshPhysicalMaterial
          color="#80f4ff"
          transmission={0.84}
          thickness={0.66}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.08}
          emissive="#185f6b"
          emissiveIntensity={0.32}
        />
      </RoundedBox>

      <Html
        transform
        center
        position={[0, 0.26, 1.01]}
        distanceFactor={8}
        style={{ pointerEvents: "auto" }}
      >
        <div className="terminal-links">
          {CONTACT_LINKS.map((item) => (
            <a
              key={item.label}
              className="terminal-link-row"
              href={item.href}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              <span className="terminal-link-label">{item.label}</span>
              <span className="terminal-link-value">{item.value}</span>
            </a>
          ))}
        </div>
      </Html>

      <Html transform center position={[0, -2.34, 1.02]} style={{ pointerEvents: "auto" }}>
        <button className="contact-burst-btn" type="button" onClick={triggerBurst}>
          Send Message
        </button>
      </Html>

      {showBurst && <BurstParticles burstId={burstId} isMobile={isMobile} onDone={() => setShowBurst(false)} />}
    </group>
  );
}
