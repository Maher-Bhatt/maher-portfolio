import { PointMaterial, Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function createPoints(count, spread) {
  const points = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const radius = spread * (0.2 + Math.random() * 0.8);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const index = i * 3;

    points[index] = radius * Math.sin(phi) * Math.cos(theta);
    points[index + 1] = radius * Math.cos(phi) * (0.4 + Math.random() * 0.8);
    points[index + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  return points;
}

export default function Particles({ isMobile }) {
  const groupRef = useRef();
  const materialRef = useRef();

  const count = isMobile ? 2200 : 6200;
  const positions = useMemo(() => createPoints(count, 240), [count]);

  useFrame((state, delta) => {
    if (!groupRef.current || !materialRef.current) return;

    groupRef.current.rotation.y += delta * 0.006;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.12;

    const targetSize = isMobile ? 0.026 : 0.032;
    materialRef.current.size = THREE.MathUtils.lerp(materialRef.current.size, targetSize, 0.08);
  });

  return (
    <group ref={groupRef}>
      <Points positions={positions} stride={3} frustumCulled>
        <PointMaterial
          ref={materialRef}
          color="#84d7ff"
          size={0.03}
          sizeAttenuation
          depthWrite={false}
          transparent
          opacity={0.72}
        />
      </Points>
    </group>
  );
}
