import { motion } from "framer-motion";

export default function Nav({ sections, currentSection, onJump }) {
  return (
    <nav className="overlay-nav" aria-label="Scene navigation">
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          className={`overlay-nav-btn ${currentSection === index ? "is-active" : ""}`}
          onClick={() => onJump(index)}
        >
          {section.label}
          {currentSection === index && (
            <motion.span
              className="overlay-nav-indicator"
              layoutId="overlay-nav-indicator"
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
