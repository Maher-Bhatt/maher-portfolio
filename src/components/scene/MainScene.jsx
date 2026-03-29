import { AdaptiveDpr } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, lazy } from "react";
import CameraRig from "./CameraRig";
import Particles from "./Particles";

const Hero3D = lazy(() => import("../sections/Hero3D"));
const About3D = lazy(() => import("../sections/About3D"));
const Projects3D = lazy(() => import("../sections/Projects3D"));
const Skills3D = lazy(() => import("../sections/Skills3D"));
const Agency3D = lazy(() => import("../sections/Agency3D"));
const Contact3D = lazy(() => import("../sections/Contact3D"));

export default function MainScene({
  isMobile,
  scrollRef,
  selectedProjectId,
  focusedProjectPoint,
  onSectionChange,
  onProjectSelect,
  onClearProject,
}) {
  return (
    <Canvas
      shadows={!isMobile}
      dpr={isMobile ? [1, 1.2] : [1, 1.8]}
      camera={{ position: [0, 2.2, 18], fov: isMobile ? 55 : 47, near: 0.1, far: 180 }}
      gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
      onPointerMissed={onClearProject}
      style={{ position: "fixed", inset: 0, zIndex: 1 }}
    >
      <color attach="background" args={["#02050d"]} />
      <fog attach="fog" args={["#02050d", 18, 120]} />

      <hemisphereLight color="#8ac5ff" groundColor="#0a1322" intensity={0.45} />
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow={!isMobile}
        position={[18, 20, 12]}
        intensity={1.5}
        color="#bce8ff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-16, 8, -196]} intensity={2.8} color="#4ac2ff" />
      <pointLight position={[0, 7, -282]} intensity={2.2} color="#ffb27d" />
      <pointLight position={[0, 6, -350]} intensity={2.2} color="#8ef4ff" />

      <Suspense fallback={null}>
        <CameraRig
          scrollRef={scrollRef}
          focusPoint={focusedProjectPoint}
          onSectionChange={onSectionChange}
          isMobile={isMobile}
        />

        <Particles isMobile={isMobile} />

        <Hero3D position={[0, 0.8, 0]} isMobile={isMobile} />
        <About3D position={[14, 0, -52]} isMobile={isMobile} />
        <Projects3D
          position={[0, 0, -118]}
          isMobile={isMobile}
          selectedProjectId={selectedProjectId}
          onProjectSelect={onProjectSelect}
        />
        <Skills3D position={[-18, 0.5, -214]} isMobile={isMobile} />
        <Agency3D position={[0, 0.6, -282]} isMobile={isMobile} />
        <Contact3D position={[0, 0.8, -350]} isMobile={isMobile} />
      </Suspense>

      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
