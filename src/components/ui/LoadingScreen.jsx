import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";

export default function LoadingScreen() {
  const { active, progress } = useProgress();
  const roundedProgress = Math.min(100, Math.round(progress));

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-wrap">
            <motion.div
              className="loading-ring"
              style={{ "--progress": `${roundedProgress}%` }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
            />
            <motion.div
              className="loading-core"
              animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.95, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <p className="loading-value">{roundedProgress}%</p>
            <p className="loading-label">Rendering 3D world...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
