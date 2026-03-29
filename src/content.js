export const NAV_SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "agency", label: "Agency" },
  { id: "contact", label: "Contact" },
];

export const HERO_CONTENT = {
  role: "Web3 Developer | Frontend Engineer | Founder",
  subtitle:
    "Building immersive products and shipping high-conviction digital experiences for Indian businesses.",
  ctas: [
    { id: "projects", label: "View Projects", sectionIndex: 2 },
    { id: "contact", label: "Open Terminal", sectionIndex: 5 },
  ],
};

export const ABOUT_BIO =
  "Second-year B.Tech CS student at ITM Baroda. I blend design, engineering, and Web3 execution to launch products that look premium and perform in the real world.";

export const ABOUT_STATS = [
  "4+ Projects Live",
  "Founder @ Velocity Web",
  "Web3 Builder",
  "B.Tech CS | 2nd Year | ITM Baroda",
];

export const PROJECTS = [
  {
    id: "certchain",
    title: "CertChain",
    featured: true,
    tagline: "On-chain ERC-721 NFT certificate minter on Ethereum Sepolia.",
    details:
      "Built at a Web3 hackathon with Solidity smart contracts and wallet-based issuance flows.",
    tech: ["React", "Vite", "Solidity", "Ethers.js", "MetaMask", "Remix IDE"],
    links: {
      github: "https://github.com/Maher-Bhatt",
    },
  },
  {
    id: "ztees",
    title: "Z Tees",
    featured: false,
    tagline: "Live Indian streetwear e-commerce for a real client with real orders.",
    details:
      "Custom cart, product image flip interactions, WhatsApp checkout, built with zero templates.",
    tech: ["HTML", "CSS", "JavaScript"],
    links: {
      live: "https://ztees.store",
      github: "https://github.com/Maher-Bhatt/Z-Tees",
    },
  },
  {
    id: "itm-campus-retrieve",
    title: "ITM Campus Retrieve",
    featured: false,
    tagline: "Lost-and-found workflow app designed for campus utility.",
    details: "Shipped as a usable system for college students and staff.",
    tech: ["React", "HTML", "CSS", "JavaScript"],
    links: {
      live: "https://itm-campus-retrieves.vercel.app",
      github: "https://github.com/Maher-Bhatt/ITM-CAMPUS-RETRIEVES",
    },
  },
  {
    id: "itm-notes",
    title: "ITM Notes",
    featured: false,
    tagline: "Study platform with 150+ MCQs across 5 engineering subjects.",
    details: "Built for quick exam prep with simple navigation and fast loading.",
    tech: ["HTML", "CSS", "JavaScript"],
    links: {
      live: "https://itm-notes.vercel.app",
      github: "https://github.com/Maher-Bhatt/ITM-NOTES",
    },
  },
];

export const SKILLS = [
  { name: "React", category: "Frontend", proficiency: 0.94 },
  { name: "HTML", category: "Frontend", proficiency: 0.95 },
  { name: "CSS", category: "Frontend", proficiency: 0.93 },
  { name: "JavaScript", category: "Frontend", proficiency: 0.92 },
  { name: "Vite", category: "Frontend", proficiency: 0.86 },
  { name: "Solidity", category: "Web3", proficiency: 0.8 },
  { name: "Ethers.js", category: "Web3", proficiency: 0.82 },
  { name: "ERC-721", category: "Web3", proficiency: 0.84 },
  { name: "MetaMask", category: "Web3", proficiency: 0.88 },
  { name: "Git", category: "Tools", proficiency: 0.88 },
  { name: "GitHub", category: "Tools", proficiency: 0.91 },
  { name: "Vercel", category: "Tools", proficiency: 0.9 },
  { name: "Figma", category: "Tools", proficiency: 0.82 },
  { name: "Client Management", category: "Business", proficiency: 0.87 },
  { name: "Project Scoping", category: "Business", proficiency: 0.84 },
  { name: "Agency Ops", category: "Business", proficiency: 0.81 },
];

export const CONTACT_LINKS = [
  { label: "GitHub", value: "github.com/Maher-Bhatt", href: "https://github.com/Maher-Bhatt" },
  { label: "Website", value: "maherbhatt.me", href: "https://maherbhatt.me" },
  {
    label: "Support",
    value: "buymeacoffee.com/maherbhatt",
    href: "https://buymeacoffee.com/maherbhatt",
  },
  { label: "Agency", value: "velocityweb.online", href: "https://velocityweb.online" },
];

export const AGENCY_CONTENT = {
  title: "Velocity Web",
  subtitle: "Founder",
  line: "Building digital products for Indian businesses.",
  href: "https://velocityweb.online",
};
