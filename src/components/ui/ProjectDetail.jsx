import { motion } from "framer-motion";

function LinkButton({ href, label }) {
  if (!href) return null;
  return (
    <a className="detail-link" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

export default function ProjectDetail({ project, onClose }) {
  if (!project) return null;

  return (
    <motion.div
      className="project-detail-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.aside
        className="project-detail-panel"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="detail-close" onClick={onClose} aria-label="Close project details">
          Close
        </button>

        <p className="detail-kicker">{project.featured ? "Featured Project" : "Project"}</p>
        <h2>{project.title}</h2>
        <p className="detail-tagline">{project.tagline}</p>
        <p>{project.details}</p>

        <div className="detail-tech">
          {project.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>

        <div className="detail-links">
          <LinkButton href={project.links.live} label="Live Site" />
          <LinkButton href={project.links.github} label="GitHub" />
        </div>
      </motion.aside>
    </motion.div>
  );
}
