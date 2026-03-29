import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MainScene from "./components/scene/MainScene";
import Nav from "./components/ui/Nav";
import LoadingScreen from "./components/ui/LoadingScreen";
import ProjectDetail from "./components/ui/ProjectDetail";
import { HERO_CONTENT, NAV_SECTIONS, PROJECTS } from "./content";

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}

export default function App() {
  const isMobile = useIsMobile();
  const scrollRef = useRef();
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [focusedProjectPoint, setFocusedProjectPoint] = useState(null);

  const selectedProject = useMemo(
    () => PROJECTS.find((project) => project.id === selectedProjectId) ?? null,
    [selectedProjectId]
  );

  const scrollToSection = useCallback((index) => {
    if (!scrollRef.current) return;

    const maxScroll = scrollRef.current.offsetHeight - window.innerHeight;
    const progress = index / Math.max(1, NAV_SECTIONS.length - 1);
    const target = Math.max(0, maxScroll * progress);

    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const handleProjectSelect = useCallback((projectId, worldPoint) => {
    setSelectedProjectId(projectId);
    setFocusedProjectPoint(worldPoint);
  }, []);

  const clearProject = useCallback(() => {
    setSelectedProjectId(null);
    setFocusedProjectPoint(null);
  }, []);

  return (
    <div className="app-shell">
      <LoadingScreen />

      <MainScene
        isMobile={isMobile}
        scrollRef={scrollRef}
        selectedProjectId={selectedProjectId}
        focusedProjectPoint={focusedProjectPoint}
        onSectionChange={setCurrentSection}
        onProjectSelect={handleProjectSelect}
        onClearProject={clearProject}
      />

      <div className="overlay-layer">
        <Nav sections={NAV_SECTIONS} currentSection={currentSection} onJump={scrollToSection} />

        <motion.div
          className="hero-overlay"
          animate={{
            opacity: currentSection <= 1 ? 1 : 0,
            y: currentSection <= 1 ? 0 : 24,
          }}
          transition={{ duration: 0.45 }}
        >
          <p className="hero-role">{HERO_CONTENT.role}</p>
          <p className="hero-subtitle">{HERO_CONTENT.subtitle}</p>
          <div className="hero-cta-row">
            {HERO_CONTENT.ctas.map((cta) => (
              <button key={cta.id} type="button" className="cta-btn" onClick={() => scrollToSection(cta.sectionIndex)}>
                {cta.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="section-pill"
          key={NAV_SECTIONS[currentSection]?.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {NAV_SECTIONS[currentSection]?.label}
        </motion.div>
      </div>

      <AnimatePresence>{selectedProject && <ProjectDetail project={selectedProject} onClose={clearProject} />}</AnimatePresence>

      <div className="scroll-driver" ref={scrollRef} aria-hidden>
        {NAV_SECTIONS.map((section) => (
          <section key={section.id} className="scroll-step" />
        ))}
      </div>
    </div>
  );
}
