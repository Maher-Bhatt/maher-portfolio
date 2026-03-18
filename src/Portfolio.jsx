import info           from "./data/info.json";
import projects       from "./data/projects.json";
import skills         from "./data/skills.json";
import certifications from "./data/certifications.json";
import experience     from "./data/experience.json";
import achievements   from "./data/achievements.json";

// ─── STYLES ──────────────────────────────────────────────────────────────────

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&family=Geist:wght@300;400;500;600&display=swap');`;

const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0a0a0a;
  --surface: #111111;
  --border: #222222;
  --border-light: #191919;
  --text: #e8e8e8;
  --muted: #666666;
  --accent: #c8a96e;
  --accent-dim: rgba(200,169,110,0.10);
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body: 'Geist', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'Courier New', monospace;
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: var(--font-body); font-weight: 300; line-height: 1.6; -webkit-font-smoothing: antialiased; }
::selection { background: var(--accent); color: #000; }

.container { max-width: 1060px; margin: 0 auto; padding: 0 32px; }
.section { padding: 88px 0; border-top: 1px solid var(--border); }

/* Nav */
nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(10,10,10,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
.nav-inner { max-width: 1060px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 56px; }
.nav-logo { font-family: var(--font-mono); font-size: 13px; color: var(--muted); letter-spacing: 0.05em; }
.nav-logo span { color: var(--accent); }
.nav-links { display: flex; gap: 28px; list-style: none; }
.nav-links a { font-family: var(--font-mono); font-size: 12px; color: var(--muted); text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; transition: color 0.2s; }
.nav-links a:hover { color: var(--text); }

/* Hero */
.hero { padding: 160px 0 88px; }
.hero-eyebrow { font-family: var(--font-mono); font-size: 12px; color: var(--accent); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 24px; }
.hero-name { font-family: var(--font-display); font-size: clamp(52px, 8vw, 88px); font-weight: 400; line-height: 1.0; letter-spacing: -0.02em; color: var(--text); margin-bottom: 8px; }
.hero-name em { font-style: italic; color: var(--accent); }
.hero-title { font-family: var(--font-mono); font-size: 14px; color: var(--muted); margin-bottom: 32px; letter-spacing: 0.04em; }
.hero-intro { font-size: 17px; color: #aaa; max-width: 520px; line-height: 1.75; margin-bottom: 48px; }
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
.btn-primary { display: inline-flex; align-items: center; gap: 8px; background: var(--accent); color: #000; font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 12px 24px; border: none; cursor: pointer; transition: opacity 0.2s; }
.btn-primary:hover { opacity: 0.85; }
.btn-secondary { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: var(--text); font-family: var(--font-mono); font-size: 12px; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 12px 24px; border: 1px solid var(--border); cursor: pointer; transition: border-color 0.2s; }
.btn-secondary:hover { border-color: #444; }

/* Section labels */
.section-label { font-family: var(--font-mono); font-size: 11px; color: var(--accent); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 12px; }
.section-heading { font-family: var(--font-display); font-size: clamp(28px, 4vw, 40px); font-weight: 400; line-height: 1.1; color: var(--text); margin-bottom: 48px; }

/* About */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
.about-left { display: flex; flex-direction: column; gap: 32px; }
.about-profile { width: 88px; height: 88px; border-radius: 50%; object-fit: cover; object-position: center top; border: 1px solid var(--border); flex-shrink: 0; }
.about-profile-row { display: flex; align-items: center; gap: 20px; margin-bottom: 4px; }
.about-profile-name { font-family: var(--font-display); font-size: 20px; font-weight: 400; color: var(--text); }
.about-profile-role { font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.06em; margin-top: 2px; }
.about-text p { font-size: 15px; color: #999; line-height: 1.85; }
.about-text p + p { margin-top: 18px; }
.about-stats { display: flex; flex-direction: column; gap: 32px; border-left: 1px solid var(--border); padding-left: 48px; }
.stat-num { font-family: var(--font-display); font-size: 44px; font-weight: 400; color: var(--text); line-height: 1; }
.stat-label { font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }

/* Skills */
.skills-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); }
.skill-col { background: var(--bg); padding: 32px; }
.skill-cat { font-family: var(--font-mono); font-size: 11px; color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 20px; }
.skill-item { padding: 10px 0; border-bottom: 1px solid var(--border-light); }
.skill-item:last-child { border-bottom: none; }
.skill-name { font-size: 14px; color: #ccc; font-weight: 400; }
.skill-desc { font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-top: 3px; line-height: 1.5; }

/* Projects — shared primitives */
.meta-block label { display: block; font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }
.meta-block p { font-size: 14px; color: #999; line-height: 1.65; }
.tech-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tech-tag { font-family: var(--font-mono); font-size: 11px; color: var(--muted); border: 1px solid var(--border); padding: 3px 10px; }
.result-bar { background: var(--accent-dim); border-left: 2px solid var(--accent); padding: 12px 18px; margin-top: 20px; font-size: 13px; color: #aaa; line-height: 1.65; }
.result-bar strong { font-family: var(--font-mono); font-size: 10px; color: var(--accent); letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 4px; }
.project-link { font-family: var(--font-mono); font-size: 11px; color: var(--muted); text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s; }
.project-link:hover { color: var(--accent); }

/* Featured project */
.featured-card { border: 1px solid var(--border); padding: 48px; margin-bottom: 2px; background: var(--surface); }
.featured-badge { display: inline-block; font-family: var(--font-mono); font-size: 10px; color: var(--accent); border: 1px solid var(--accent); padding: 3px 10px; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 24px; }
.featured-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
.featured-title { font-family: var(--font-display); font-size: clamp(26px, 3.5vw, 36px); font-weight: 400; color: var(--text); line-height: 1.15; margin-bottom: 6px; }
.featured-tagline { font-family: var(--font-mono); font-size: 12px; color: var(--muted); letter-spacing: 0.04em; }
.featured-body { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 28px; }

/* Regular project cards */
.project-card { border: 1px solid var(--border); padding: 36px; margin-bottom: 1px; transition: background 0.15s; }
.project-card:hover { background: var(--surface); }
.project-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.project-num { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
.project-links { display: flex; gap: 16px; }
.project-title { font-family: var(--font-display); font-size: 22px; font-weight: 400; color: var(--text); margin-bottom: 20px; line-height: 1.25; }
.project-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }

/* Achievements */
.ach-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); }
.ach-card { background: var(--bg); padding: 28px; transition: background 0.15s; position: relative; }
.ach-card:hover { background: var(--surface); }
.ach-highlight {
  display: inline-block; font-family: var(--font-mono); font-size: 10px; font-weight: 500;
  color: #000; background: var(--accent); padding: 2px 10px;
  letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 14px;
}
.ach-highlight-neutral {
  display: inline-block; font-family: var(--font-mono); font-size: 10px;
  color: var(--muted); border: 1px solid var(--border); padding: 2px 10px;
  letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 14px;
}
.ach-title { font-size: 15px; font-weight: 500; color: var(--text); margin-bottom: 8px; line-height: 1.35; }
.ach-desc { font-family: var(--font-mono); font-size: 12px; color: var(--muted); line-height: 1.6; }

/* Experience */
.exp-item { display: grid; grid-template-columns: 200px 1fr; gap: 48px; padding: 36px 0; border-bottom: 1px solid var(--border-light); }
.exp-item:first-child { border-top: 1px solid var(--border-light); }
.exp-role { font-size: 15px; font-weight: 500; color: var(--text); margin-bottom: 4px; }
.exp-org { font-family: var(--font-mono); font-size: 12px; color: var(--accent); margin-bottom: 6px; }
.exp-period { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
.exp-points { list-style: none; }
.exp-points li { font-size: 14px; color: #999; line-height: 1.7; padding: 4px 0 4px 18px; position: relative; }
.exp-points li::before { content: '—'; position: absolute; left: 0; color: var(--border); }

/* Certifications */
.cert-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); }
.cert-card { background: var(--bg); padding: 28px 28px 24px; transition: background 0.15s; }
.cert-card:hover { background: var(--surface); }
.cert-id { font-family: var(--font-mono); font-size: 10px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }
.cert-title { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 8px; line-height: 1.45; }
.cert-issuer { font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin-bottom: 6px; line-height: 1.5; }
.cert-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
.cert-date { font-family: var(--font-mono); font-size: 11px; color: var(--accent); }
.cert-verify { font-family: var(--font-mono); font-size: 10px; color: var(--muted); text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s; }
.cert-verify:hover { color: var(--accent); }
.cert-no-link { font-family: var(--font-mono); font-size: 10px; color: var(--border); }

/* Contact */
.contact-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 96px; }
.contact-note { font-size: 15px; color: #999; line-height: 1.8; }
.contact-note + .contact-note { margin-top: 16px; }
.contact-links { display: flex; flex-direction: column; }
.contact-row { display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid var(--border-light); text-decoration: none; color: var(--text); transition: color 0.2s; }
.contact-row:first-child { border-top: 1px solid var(--border-light); }
.contact-row:hover { color: var(--accent); }
.contact-row-label { font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2px; }
.contact-row-value { font-size: 14px; }
.contact-arrow { font-size: 16px; color: var(--muted); transition: transform 0.2s, color 0.2s; }
.contact-row:hover .contact-arrow { transform: translate(3px, -3px); color: var(--accent); }

/* Footer */
footer { border-top: 1px solid var(--border); padding: 28px 0; }
.footer-inner { max-width: 1060px; margin: 0 auto; padding: 0 32px; display: flex; justify-content: space-between; align-items: center; }
.footer-text { font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 0.06em; }

/* Responsive */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .about-grid { grid-template-columns: 1fr; gap: 40px; }
  .about-stats { border-left: none; padding-left: 0; border-top: 1px solid var(--border); padding-top: 28px; flex-direction: row; flex-wrap: wrap; gap: 24px; }
  .skills-grid { grid-template-columns: repeat(2, 1fr); }
  .featured-body, .project-meta { grid-template-columns: 1fr; }
  .featured-header { flex-direction: column; gap: 16px; }
  .exp-item { grid-template-columns: 1fr; gap: 12px; }
  .ach-grid { grid-template-columns: repeat(2, 1fr); }
  .cert-grid { grid-template-columns: repeat(2, 1fr); }
  .contact-inner { grid-template-columns: 1fr; gap: 40px; }
  .footer-inner { flex-direction: column; gap: 10px; text-align: center; }
}
@media (max-width: 480px) {
  .container { padding: 0 20px; }
  .skills-grid, .ach-grid, .cert-grid { grid-template-columns: 1fr; }
  .featured-card, .project-card { padding: 24px; }
}
`;

// ─── SHARED PRIMITIVES ───────────────────────────────────────────────────────

function MetaBlock({ label, children }) {
  return (
    <div className="meta-block">
      <label>{label}</label>
      <p>{children}</p>
    </div>
  );
}

function TechTags({ tags }) {
  return (
    <div className="tech-tags">
      {tags.map((t) => <span key={t} className="tech-tag">{t}</span>)}
    </div>
  );
}

function ResultBar({ text }) {
  return (
    <div className="result-bar">
      <strong>Result</strong>{text}
    </div>
  );
}

function ProjectLinks({ github, live }) {
  return (
    <div className="project-links">
      {github && <a href={github} target="_blank" rel="noreferrer" className="project-link">GitHub ↗</a>}
      {live   && <a href={live}   target="_blank" rel="noreferrer" className="project-link">Live ↗</a>}
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  const links = ["about", "skills", "projects", "achievements", "experience", "certifications", "contact"];
  return (
    <nav>
      <div className="nav-inner">
        <span className="nav-logo"><span>mb</span> / portfolio</span>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l}><a href={`#${l}`}>{l}</a></li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero({ data }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-eyebrow">Available for opportunities · {data.location}</div>
        <h1 className="hero-name"><em>Maher</em> Bhatt</h1>
        <p className="hero-title">{data.title}</p>
        <p className="hero-intro">{data.intro}</p>
        <div className="hero-actions">
          <a href="#projects" className="btn-primary">View Projects ↓</a>
          <a href="#contact" className="btn-secondary">Contact</a>
        </div>
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────

function About({ data }) {
  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section-label">01 · About</div>
        <div className="about-grid">
          <div className="about-left">
            <div className="about-profile-row">
              <img
                src="/assets/profile.jpg"
                alt="Maher Bhatt"
                className="about-profile"
              />
              <div>
                <div className="about-profile-name">Maher Bhatt</div>
                <div className="about-profile-role">Web Developer · AI Explorer · CTF Player</div>
              </div>
            </div>
            <div className="about-text">
              {data.about.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <div className="about-stats">
            {data.stats.map((s) => (
              <div key={s.label}>
                <div className="stat-num">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skills ──────────────────────────────────────────────────────────────────

function Skills({ data }) {
  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="section-label">02 · Skills</div>
        <h2 className="section-heading">What I work with</h2>
        <div className="skills-grid">
          {data.map((cat) => (
            <div key={cat.category} className="skill-col">
              <div className="skill-cat">{cat.category}</div>
              {cat.items.map((item) => (
                <div key={item.name} className="skill-item">
                  <div className="skill-name">{item.name}</div>
                  <div className="skill-desc">{item.description}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ────────────────────────────────────────────────────────────────

function Projects({ data }) {
  const featured = data.find((p) => p.featured);
  const rest = data.filter((p) => !p.featured);

  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="section-label">03 · Projects</div>
        <h2 className="section-heading">Selected work</h2>

        {featured && (
          <div className="featured-card">
            <span className="featured-badge">Featured Project</span>
            <div className="featured-header">
              <div>
                <h3 className="featured-title">{featured.title}</h3>
                <p className="featured-tagline">{featured.tagline}</p>
              </div>
              <ProjectLinks github={featured.github} live={featured.live} />
            </div>
            <div className="featured-body">
              <MetaBlock label="Problem">{featured.problem}</MetaBlock>
              <MetaBlock label="Solution">{featured.solution}</MetaBlock>
            </div>
            <TechTags tags={featured.tech} />
            <ResultBar text={featured.result} />
          </div>
        )}

        {rest.map((p, i) => (
          <div key={p.id} className="project-card">
            <div className="project-header">
              <span className="project-num">0{i + 1}</span>
              <ProjectLinks github={p.github} live={p.live} />
            </div>
            <h3 className="project-title">{p.title}</h3>
            <div className="project-meta">
              <MetaBlock label="Problem">{p.problem}</MetaBlock>
              <MetaBlock label="Solution">{p.solution}</MetaBlock>
            </div>
            <TechTags tags={p.tech} />
            <ResultBar text={p.result} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Achievements ─────────────────────────────────────────────────────────────

function Achievements({ data }) {
  const ranked = ["Top 4", "Top 2", "Lead"];
  return (
    <section className="section" id="achievements">
      <div className="container">
        <div className="section-label">04 · Achievements</div>
        <h2 className="section-heading">Competitions & recognition</h2>
        <div className="ach-grid">
          {data.map((a) => (
            <div key={a.title} className="ach-card">
              <div className={ranked.includes(a.highlight) ? "ach-highlight" : "ach-highlight-neutral"}>
                {a.highlight}
              </div>
              <div className="ach-title">{a.title}</div>
              <div className="ach-desc">{a.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Experience ──────────────────────────────────────────────────────────────

function Experience({ data }) {
  return (
    <section className="section" id="experience">
      <div className="container">
        <div className="section-label">05 · Experience</div>
        <h2 className="section-heading">What I&apos;ve built &amp; learned</h2>
        {data.map((e) => (
          <div key={e.role} className="exp-item">
            <div>
              <div className="exp-role">{e.role}</div>
              <div className="exp-org">{e.org}</div>
              <div className="exp-period">{e.period}</div>
            </div>
            <ul className="exp-points">
              {e.points.map((pt, i) => <li key={i}>{pt}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Certifications ──────────────────────────────────────────────────────────

function Certifications({ data }) {
  return (
    <section className="section" id="certifications">
      <div className="container">
        <div className="section-label">06 · Certifications</div>
        <h2 className="section-heading">Credentials</h2>
        <div className="cert-grid">
          {data.map((c) => (
            <div key={c.id} className="cert-card">
              <div className="cert-id">{c.id}</div>
              <div className="cert-title">{c.title}</div>
              <div className="cert-issuer">{c.issuer}</div>
              <div className="cert-footer">
                <span className="cert-date">{c.date}</span>
                {c.verify
                  ? <a href={c.verify} target="_blank" rel="noreferrer" className="cert-verify">Verify ↗</a>
                  : <span className="cert-no-link">—</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function Contact({ data }) {
  const links = [
    { label: "Email",    value: data.email,                    href: `mailto:${data.email}` },
    { label: "GitHub",   value: "github.com/Maher-Bhatt",      href: data.github },
    { label: "LinkedIn", value: "linkedin.com/in/maher-bhatt", href: data.linkedin },
    { label: "Phone",    value: data.phone,                    href: `tel:${data.phone.replace(/\s/g, "")}` },
  ];

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-label">07 · Contact</div>
        <h2 className="section-heading">Let&apos;s talk</h2>
        <div className="contact-inner">
          <div>
            {data.contactLines.map((line, i) => (
              <p key={i} className="contact-note" style={i > 0 ? { marginTop: "16px" } : {}}>
                {line}
              </p>
            ))}
            <p className="contact-note" style={{ marginTop: "20px", color: "var(--muted)" }}>
              Based in {data.location}
            </p>
          </div>
          <div className="contact-links">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="contact-row"
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                <div>
                  <div className="contact-row-label">{l.label}</div>
                  <div className="contact-row-value">{l.value}</div>
                </div>
                <span className="contact-arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Root assembly ────────────────────────────────────────────────────────────

export default function Portfolio() {
  return (
    <>
      <style>{fonts}</style>
      <style>{css}</style>
      <Nav />
      <main>
        <Hero           data={info} />
        <About          data={info} />
        <Skills         data={skills} />
        <Projects       data={projects} />
        <Achievements   data={achievements} />
        <Experience     data={experience} />
        <Certifications data={certifications} />
        <Contact        data={info} />
      </main>
      <footer>
        <div className="footer-inner">
          <span className="footer-text">© 2025 Maher Bhatt</span>
          <span className="footer-text" style={{ color: "var(--border)" }}>
            maherbhatt01@gmail.com
          </span>
        </div>
      </footer>
    </>
  );
}
