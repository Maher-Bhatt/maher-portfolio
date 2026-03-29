import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const WAYPOINTS = [
  { position: [0, 2.2, 18], lookAt: [0, 1.2, 0] },
  { position: [12.5, 4.2, -36], lookAt: [14, 1.6, -52] },
  { position: [0, 3.4, -102], lookAt: [0, 1.2, -118] },
  { position: [-15.5, 3.8, -198], lookAt: [-18, 1.2, -214] },
  { position: [0, 3.7, -264], lookAt: [0, 1.7, -282] },
  { position: [0, 2.6, -330], lookAt: [0, 1.2, -350] },
];

export default function CameraRig({
  scrollRef,
  focusPoint,
  onSectionChange,
  isMobile,
  sectionCount = WAYPOINTS.length,
}) {
  const { camera, pointer } = useThree();

  const rigState = useRef({
    x: WAYPOINTS[0].position[0],
    y: WAYPOINTS[0].position[1],
    z: WAYPOINTS[0].position[2],
    lx: WAYPOINTS[0].lookAt[0],
    ly: WAYPOINTS[0].lookAt[1],
    lz: WAYPOINTS[0].lookAt[2],
  });

  const focusBlend = useRef(0);
  const lookAtLerp = useRef(new THREE.Vector3(...WAYPOINTS[0].lookAt));

  const vectors = useMemo(
    () => ({
      basePos: new THREE.Vector3(),
      baseLook: new THREE.Vector3(),
      focusPos: new THREE.Vector3(),
      targetPos: new THREE.Vector3(),
      targetLook: new THREE.Vector3(),
      focusVec: new THREE.Vector3(),
    }),
    []
  );

  useLayoutEffect(() => {
    if (!scrollRef?.current) return undefined;

    const state = rigState.current;
    Object.assign(state, {
      x: WAYPOINTS[0].position[0],
      y: WAYPOINTS[0].position[1],
      z: WAYPOINTS[0].position[2],
      lx: WAYPOINTS[0].lookAt[0],
      ly: WAYPOINTS[0].lookAt[1],
      lz: WAYPOINTS[0].lookAt[2],
    });

    onSectionChange?.(0);

    const scope = scrollRef.current;
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scrollRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.25,
          invalidateOnRefresh: true,
        },
      });

      WAYPOINTS.slice(1).forEach((waypoint) => {
        timeline.to(state, {
          duration: 1,
          x: waypoint.position[0],
          y: waypoint.position[1],
          z: waypoint.position[2],
          lx: waypoint.lookAt[0],
          ly: waypoint.lookAt[1],
          lz: waypoint.lookAt[2],
        });
      });

      ScrollTrigger.create({
        trigger: scrollRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const index = Math.min(sectionCount - 1, Math.floor(self.progress * sectionCount));
          onSectionChange?.(index);
        },
      });
    }, scope);

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 60);

    return () => {
      window.clearTimeout(refreshId);
      ctx.revert();
    };
  }, [onSectionChange, scrollRef, sectionCount]);

  useFrame((_, delta) => {
    const state = rigState.current;
    const parallaxX = pointer.x * (isMobile ? 0.35 : 0.8);
    const parallaxY = pointer.y * (isMobile ? 0.22 : 0.55);

    vectors.basePos.set(state.x + parallaxX, state.y + parallaxY, state.z);
    vectors.baseLook.set(state.lx, state.ly, state.lz);

    const hasFocus = Array.isArray(focusPoint);
    const targetBlend = hasFocus ? 1 : 0;
    focusBlend.current = THREE.MathUtils.damp(focusBlend.current, targetBlend, 4, delta);

    if (hasFocus) {
      vectors.focusVec.set(focusPoint[0], focusPoint[1], focusPoint[2]);
      vectors.focusPos.set(
        focusPoint[0] + pointer.x * 0.22,
        focusPoint[1] + (isMobile ? 0.95 : 1.2) + pointer.y * 0.15,
        focusPoint[2] + (isMobile ? 4.4 : 6.2)
      );
    } else {
      vectors.focusVec.copy(vectors.baseLook);
      vectors.focusPos.copy(vectors.basePos);
    }

    vectors.targetPos.lerpVectors(vectors.basePos, vectors.focusPos, focusBlend.current);
    vectors.targetLook.lerpVectors(vectors.baseLook, vectors.focusVec, focusBlend.current);

    const posLerp = 1 - Math.exp(-delta * 5);
    const lookLerp = 1 - Math.exp(-delta * 6);

    camera.position.lerp(vectors.targetPos, posLerp);
    lookAtLerp.current.lerp(vectors.targetLook, lookLerp);
    camera.lookAt(lookAtLerp.current);
  });

  return null;
}
