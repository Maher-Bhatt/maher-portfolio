import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Code, 
  Database, 
  Terminal, 
  Cpu, 
  Award, 
  Menu, 
  X,
  Star,
  Trophy,
  Layout,
  Send,
  MapPin,
  CheckCircle,
  Calendar,
  Sparkles,
  Bot,
  Loader2,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';

// --- CONFIGURATION SECTION ---

// 1. GEMINI API KEY
const apiKey = ""; 

// 2. FIREBASE CONFIGURATION
let firebaseConfig;
let appId = 'default-app-id';

try {
  // @ts-ignore
  firebaseConfig = JSON.parse(__firebase_config);
  // @ts-ignore
  if (typeof __app_id !== 'undefined') {
    appId = __app_id.replace(/\//g, '_');
  }
} catch (e) {
  firebaseConfig = {
    apiKey: "PASTE_YOUR_FIREBASE_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  };
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- GEMINI API HELPER ---
const callGemini = async (prompt, systemInstruction = "") => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
        }),
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to AI services right now.";
  }
};

// --- INITIAL DATA (Seeding) ---
const INITIAL_DATA = {
  profile: {
    name: 'Maher Bhatt',
    role: 'Computer Science Student & AI Enthusiast',
    tagline: 'Blending Creativity with Technology to solve real-world problems.',
    bio: 'Passionate Computer Science student at ITM SLS Baroda University specializing in AI, Python, and data science. Enthusiastic hackathon participant (Hecatron 2025) with 26+ industry certifications from IBM and Google Cloud. Currently maintaining a #100DaysOfCode streak while building full-stack projects.',
    email: 'maherbhatt01@gmail.com',
    location: 'Gujarat, India',
    status: 'Open to Internships',
    social: {
      linkedin: 'https://www.linkedin.com/in/maher-bhatt-206035362/',
      github: 'https://github.com/Maher-Bhatt',
      credly: 'https://www.credly.com/users/maher-bhatt/skills',
      google: 'https://www.skills.google/public_profiles/0dfe24c4-985a-48ba-a64e-117f3beef87a'
    },
    stats: { projects: 5, certifications: 26, streak: 100 }
  },
  projects: [
    {
      title: 'ITM Campus Retrieve',
      description: 'AI-powered Lost & Found Management System built for Hecatron 2025 hackathon. Features Gemini Vision AI for item recognition.',
      tech_stack: ['Python', 'Flask', 'Gemini AI', 'SQLite', 'JS'],
      github_link: 'https://github.com/Maher-Bhatt/ITM-CAMPUS-RETRIEVES',
      demo_link: 'https://itm-campus-retrieves.vercel.app/',
      category: 'Web App',
      featured: true,
      isWinner: false,
      stars: 1,
      color: 'from-blue-600 to-cyan-500'
    },
    {
      title: 'Data Visualization Suite',
      description: 'Transforming complex datasets into insightful visual stories. IBM-certified project with interactive charts.',
      tech_stack: ['Python', 'Matplotlib', 'Pandas', 'Seaborn'],
      github_link: null,
      category: 'Data Science',
      featured: true,
      isWinner: false,
      stars: 0,
      color: 'from-purple-600 to-pink-500'
    },
    {
      title: 'Secure Password Generator',
      description: 'Cryptographically secure generator with customizable strength indicators. Part of #100DaysOfCode.',
      tech_stack: ['Python', 'Security', 'CLI'],
      github_link: 'https://github.com/Maher-Bhatt/Password-Generator',
      category: 'Tools',
      featured: false,
      isWinner: false,
      stars: 2,
      color: 'from-green-600 to-emerald-500'
    }
  ],
  skills: [
    { name: 'Python', category: 'Language', level: 95 },
    { name: 'Data Analysis', category: 'Core', level: 85 },
    { name: 'Machine Learning', category: 'Core', level: 80 },
    { name: 'Web Development', category: 'Core', level: 75 },
    { name: 'Flask', category: 'Framework', level: 80 },
    { name: 'Pandas', category: 'Tool', level: 90 },
    { name: 'Google Cloud', category: 'Cloud', level: 70 },
    { name: 'Git & GitHub', category: 'Tool', level: 85 },
  ],
  certifications: [
    { 
      title: 'Data Analysis with Python', 
      issuer: 'IBM', 
      date: 'Jul 2025', 
      type: 'ibm',
      credId: '7a0912bc04904445b9850f9ca474bdeb',
      description: 'Mastered data analysis using Python libraries like Pandas and Numpy.',
      skills: ['Pandas', 'Numpy', 'APIs']
    },
    { 
      title: 'Generative AI Specialist', 
      issuer: 'Google Cloud', 
      date: 'Oct 2025', 
      type: 'google',
      credId: '19187368',
      description: 'Comprehensive understanding of Generative AI principles and LLMs.',
      skills: ['Generative AI', 'LLMs', 'Vertex AI']
    },
    { 
      title: 'Scalable Deployments L3', 
      issuer: 'Google Cloud', 
      date: 'Nov 2025', 
      type: 'google',
      credId: '20036528',
      description: 'Advanced skills in deploying and managing scalable applications using GCP.',
      skills: ['Cloud Run', 'GKE', 'Scalability']
    }
  ]
};

// --- DATA HOOK ---
const usePortfolioData = () => {
  const [data, setData] = useState({ profile: INITIAL_DATA.profile, projects: [], skills: [], certifications: [] });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // @ts-ignore
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          // @ts-ignore
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.warn("Auth Warning:", err);
        try { await signInAnonymously(auth); } catch (e) {}
      }
    };
    initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const publicPath = `artifacts/${appId}/public/data`;
        const isPreview = appId !== 'default-app-id' && !appId.startsWith('1:'); 
        const collectionPath = (col) => isPreview ? `${publicPath}/${col}` : col;

        const [projSnap, skillSnap, certSnap, profileSnap] = await Promise.all([
          getDocs(collection(db, collectionPath('projects'))),
          getDocs(collection(db, collectionPath('skills'))),
          getDocs(collection(db, collectionPath('certifications'))),
          getDocs(collection(db, collectionPath('profile')))
        ]);

        let projects = projSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let skills = skillSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let certifications = certSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let profile = profileSnap.empty ? INITIAL_DATA.profile : profileSnap.docs[0].data();
        let pId = profileSnap.empty ? null : profileSnap.docs[0].id;

        if (projects.length === 0 && !pId) {
          console.log("Attempting to seed Database...");
          try {
            const batchPromises = [];
            const newProfileRef = await addDoc(collection(db, collectionPath('profile')), INITIAL_DATA.profile);
            pId = newProfileRef.id;
            profile = INITIAL_DATA.profile;

            for (const p of INITIAL_DATA.projects) batchPromises.push(addDoc(collection(db, collectionPath('projects')), p));
            for (const s of INITIAL_DATA.skills) batchPromises.push(addDoc(collection(db, collectionPath('skills')), s));
            for (const c of INITIAL_DATA.certifications) batchPromises.push(addDoc(collection(db, collectionPath('certifications')), c));

            await Promise.all(batchPromises);
            
            const [nProj, nSkill, nCert] = await Promise.all([
               getDocs(collection(db, collectionPath('projects'))),
               getDocs(collection(db, collectionPath('skills'))),
               getDocs(collection(db, collectionPath('certifications')))
            ]);
            projects = nProj.docs.map(d => ({ id: d.id, ...d.data() }));
            skills = nSkill.docs.map(d => ({ id: d.id, ...d.data() }));
            certifications = nCert.docs.map(d => ({ id: d.id, ...d.data() }));
          } catch (seedError) {
            console.warn("Offline Mode: Seeding skipped due to permissions.");
            projects = INITIAL_DATA.projects.map((p, i) => ({...p, id: `local-${i}`}));
            skills = INITIAL_DATA.skills.map((s, i) => ({...s, id: `local-${i}`}));
            certifications = INITIAL_DATA.certifications.map((c, i) => ({...c, id: `local-${i}`}));
          }
        }

        setData({ profile, projects, skills, certifications });
        setProfileId(pId);
      } catch (err) { 
        console.log("Offline Mode: Using local data."); 
        setData({ 
          profile: INITIAL_DATA.profile, 
          projects: INITIAL_DATA.projects.map((p,i) => ({...p, id: i})),
          skills: INITIAL_DATA.skills.map((s,i) => ({...s, id: i})),
          certifications: INITIAL_DATA.certifications.map((c,i) => ({...c, id: i}))
        });
      } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  const getCollectionPath = (type) => {
     const isPreview = appId !== 'default-app-id' && !appId.startsWith('1:');
     return isPreview ? `artifacts/${appId}/public/data/${type}` : type;
  };

  const addItem = async (type, item) => {
    try {
      const docRef = await addDoc(collection(db, getCollectionPath(type)), item);
      setData(prev => ({ ...prev, [type]: [...prev[type], { ...item, id: docRef.id }] }));
    } catch (e) { console.error("Add failed (Offline mode)"); }
  };

  const updateItem = async (type, id, updates) => {
    try {
      const path = getCollectionPath(type);
      if (type === 'profile') {
         if (profileId) await updateDoc(doc(db, path, profileId), updates);
      } else {
         await updateDoc(doc(db, path, id), updates);
      }
    } catch(e) { console.error("Update failed (Offline mode)"); }
    
    if (type === 'profile') {
       setData(prev => ({ ...prev, profile: { ...prev.profile, ...updates } }));
    } else {
       setData(prev => ({ ...prev, [type]: prev[type].map(i => i.id === id ? { ...i, ...updates } : i) }));
    }
  };

  const deleteItem = async (type, id) => {
    try {
      await deleteDoc(doc(db, getCollectionPath(type), id));
    } catch(e) { console.error("Delete failed (Offline mode)"); }
    setData(prev => ({ ...prev, [type]: prev[type].filter(i => i.id !== id) }));
  };

  return { data, loading, addItem, updateItem, deleteItem };
};

// --- COMPONENTS ---

const Navbar = ({ activeTab, scrollToSection, isMobileMenuOpen, setIsMobileMenuOpen }) => (
  <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-full shadow-2xl px-6 py-3 flex items-center justify-between w-full max-w-5xl relative">
      <button onClick={() => scrollToSection('home')} className="flex items-center gap-1 group">
        <span className="text-cyan-400 font-mono text-xl group-hover:-rotate-12 transition-transform">&lt;</span>
        <span className="font-bold text-white tracking-tight">Maher</span>
        <span className="text-cyan-400 font-mono text-xl group-hover:rotate-12 transition-transform">/&gt;</span>
      </button>
      <div className="hidden md:flex items-center gap-1">
        {['home', 'projects', 'skills', 'certifications'].map((tab) => (
          <button key={tab} onClick={() => scrollToSection(tab)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab ? 'bg-slate-800 text-cyan-400 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="hidden md:block">
        <button onClick={() => scrollToSection('contact')} className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20">Hire Me</button>
      </div>
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-300 hover:text-white">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl animate-fade-in-up md:hidden">
          {['home', 'projects', 'skills', 'certifications'].map((tab) => (
            <button key={tab} onClick={() => scrollToSection(tab)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors capitalize font-medium">{tab}</button>
          ))}
          <button onClick={() => scrollToSection('contact')} className="w-full bg-cyan-600 text-white py-3 rounded-xl font-bold mt-2">Hire Me</button>
        </div>
      )}
    </div>
  </nav>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-12 relative">
    <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-sm">
      <Icon size={18} className="text-cyan-400" />
      <span className="text-cyan-400 font-medium tracking-wide uppercase text-xs">{title}</span>
    </div>
    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">{subtitle}</h2>
    <div className="w-24 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
  </div>
);

const AdminControls = ({ onEdit, onDelete }) => (
  <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
    <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:scale-105 transition-transform"><Edit2 size={14} /></button>
    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 bg-red-600 text-white rounded-lg shadow-lg hover:scale-105 transition-transform"><Trash2 size={14} /></button>
  </div>
);

const ProjectCard = ({ project, isAdmin, onDelete, onEdit }) => (
  <div className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-900/10 flex flex-col h-full">
    {isAdmin && <AdminControls onEdit={onEdit} onDelete={onDelete} />}
    <div className={`h-56 bg-gradient-to-br ${project.color || 'from-slate-800 to-slate-900'} relative p-6 flex flex-col justify-end overflow-hidden`}>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent" />
      <div className="absolute inset-0 bg-slate-950/20" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/40 text-white backdrop-blur-md border border-white/10">{project.category}</span>
          {project.isWinner && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500 text-yellow-950 shadow-lg shadow-yellow-500/20"><Trophy size={12} /> Winner</span>}
        </div>
        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">{project.title}</h3>
      </div>
    </div>
    <div className="p-8 flex-1 flex flex-col">
      <p className="text-slate-400 leading-relaxed mb-6 flex-1 text-sm">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {project.tech_stack?.slice(0, 4).map((tech) => <span key={tech} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-700/50">{tech}</span>)}
        {project.tech_stack?.length > 4 && <span className="px-3 py-1 text-slate-500 text-xs">+More</span>}
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-auto">
        <div className="flex gap-4">
          {project.demo_link && <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold text-sm group/link">Live Demo <ExternalLink size={16} /></a>}
          {project.github_link ? <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white font-medium text-sm transition-colors"><Github size={16} /> Code</a> : <span className="flex items-center gap-2 text-slate-600 cursor-not-allowed text-sm"><Github size={16} /> Private</span>}
        </div>
      </div>
    </div>
  </div>
);

const Hero = ({ profile, isAdmin, onEdit }) => (
  <div className="min-h-screen flex flex-col justify-center pt-20 relative overflow-hidden">
    <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse-slow pointer-events-none" />
    <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-pulse-slow delay-1000 pointer-events-none" />
    {isAdmin && (
      <div className="absolute top-28 right-4 z-30">
        <button onClick={onEdit} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"><Edit2 size={16} /> Edit Profile</button>
      </div>
    )}
    <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
      <div className="space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700/50 shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-slate-300 text-sm font-medium">{profile.status || "Open to Internships"}</span>
        </div>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[0.9]">
          Hello, I'm <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient">{profile.name}</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-xl leading-relaxed">{profile.role}. <br/><span className="text-slate-500">{profile.tagline}</span></p>
        <div className="flex flex-wrap gap-4 pt-4">
          <button onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})} className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">Let's Talk <Send size={20} /></button>
          <div className="flex gap-2">
            <a href={profile.social?.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-800 hover:bg-blue-600 text-white rounded-2xl transition-all hover:scale-105 border border-slate-700 hover:border-blue-500"><Linkedin size={24} /></a>
            <a href={profile.social?.github} target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all hover:scale-105 border border-slate-700"><Github size={24} /></a>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-800/50 max-w-lg">
          <div><div className="text-3xl font-bold text-white mb-1">{profile.stats?.projects}+</div><div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Projects</div></div>
          <div><div className="text-3xl font-bold text-white mb-1">{profile.stats?.certifications}+</div><div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Certifications</div></div>
          <div><div className="text-3xl font-bold text-white mb-1">{profile.stats?.streak}</div><div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Day Streak</div></div>
        </div>
      </div>
      <div className="relative animate-fade-in-right hidden lg:block group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-[#0F1117] rounded-2xl shadow-2xl overflow-hidden border border-slate-800/50">
          <div className="flex items-center justify-between px-5 py-4 bg-[#161b22] border-b border-slate-800">
            <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div><div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div><div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div></div>
            <div className="text-xs text-slate-500 font-mono flex items-center gap-2"><Database size={12} /> portfolio.py</div>
          </div>
          <div className="p-8 font-mono text-sm md:text-base leading-loose overflow-x-auto">
             <div className="text-slate-400"><span className="text-purple-400">class</span> <span className="text-yellow-300">Student</span>:<br/>&nbsp;&nbsp;<span className="text-purple-400">def</span> <span className="text-blue-400">__init__</span>(self):<br/>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-cyan-400">self</span>.name = <span className="text-green-400">"{profile.name}"</span><br/>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-cyan-400">self</span>.status = <span className="text-green-400">"{profile.status}"</span><br/></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Projects = ({ projects, isAdmin, onAdd, onDelete, onEdit }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Web App', 'Data Science', 'Tools', 'Games'];
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="py-32 relative">
      <SectionHeader icon={Layout} title="Portfolio" subtitle="Featured Projects" />
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${filter === cat ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/25' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'}`}>{cat}</button>
        ))}
         {isAdmin && <button onClick={onAdd} className="ml-auto bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-green-500 text-sm font-bold shadow-lg"><Plus size={16} /> Add New</button>}
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {filteredProjects.map(project => <ProjectCard key={project.id} project={project} isAdmin={isAdmin} onDelete={() => onDelete(project.id)} onEdit={() => onEdit(project)} />)}
      </div>
    </div>
  );
};

const Skills = ({ skills, isAdmin, onAdd, onDelete, onEdit }) => (
  <div className="py-32">
    <div className="flex justify-between items-end mb-12">
      <SectionHeader icon={Cpu} title="Expertise" subtitle="Technical Arsenal" />
      {isAdmin && <button onClick={onAdd} className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-green-500 text-sm font-bold shadow-lg"><Plus size={16} /> Add Skill</button>}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {skills.map((skill, i) => (
        <div key={i} onClick={() => isAdmin && onEdit(skill)} className={`relative group p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1 ${isAdmin ? 'cursor-pointer' : ''}`}>
          {isAdmin && <AdminControls onEdit={() => onEdit(skill)} onDelete={() => onDelete(skill.id)} />}
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700 group-hover:scale-110 transition-transform"><Terminal size={20} /></div>
            <span className="text-xs font-mono text-slate-500">{skill.category}</span>
          </div>
          <h4 className="text-lg font-bold text-white mb-3">{skill.name}</h4>
          <div className="relative h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${skill.level}%` }} />
          </div>
          <div className="text-right mt-1 text-xs text-cyan-400 font-bold">{skill.level}%</div>
        </div>
      ))}
    </div>
  </div>
);

const Certifications = ({ certifications, onCertClick, isAdmin, onAdd, onDelete, onEdit }) => (
  <div className="py-32">
     <div className="flex justify-between items-end mb-12">
      <SectionHeader icon={Award} title="Achievements" subtitle="Certifications" />
      {isAdmin && <button onClick={onAdd} className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-green-500 text-sm font-bold shadow-lg"><Plus size={16} /> Add Cert</button>}
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certifications.map((cert, idx) => (
        <div key={idx} onClick={() => onCertClick(cert)} className="relative group bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-900/10">
          {isAdmin && <AdminControls onEdit={() => onEdit(cert)} onDelete={() => onDelete(cert.id)} />}
          <div className="flex items-start justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${cert.type === 'google' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}><Award size={28} /></div>
            <span className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded-md">{cert.date}</span>
          </div>
          <h4 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-cyan-400 transition-colors">{cert.title}</h4>
          <p className="text-slate-400 text-sm">{cert.issuer}</p>
        </div>
      ))}
    </div>
  </div>
);

const Contact = ({ profile }) => {
  const [formState, setFormState] = useState('idle');
  const [message, setMessage] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setFormState('submitting'); setTimeout(() => setFormState('success'), 1500); };
  const handlePolishMessage = async (e) => {
    e.preventDefault(); if (!message.trim()) return; setIsPolishing(true);
    const systemPrompt = "Rewrite this to be professional for a recruiter.";
    const polished = await callGemini(message, systemPrompt);
    setMessage(polished.replace(/^"(.*)"$/, '$1')); setIsPolishing(false);
  };
  return (
    <div id="contact" className="py-32 relative">
      <div className="bg-[#0F1117] border border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-cyan-500/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-colors duration-1000" />
        <div className="grid lg:grid-cols-2 gap-16 relative z-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Let's build something <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">extraordinary.</span></h2>
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 text-slate-300 group/item hover:text-white transition-colors"><div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400"><Mail size={20} /></div><span className="text-lg">{profile.email}</span></div>
            </div>
            <div className="flex gap-4">
               {[
                 { icon: Linkedin, link: profile.social?.linkedin, color: 'hover:text-blue-400' },
                 { icon: Github, link: profile.social?.github, color: 'hover:text-white' }
               ].map((social, i) => (
                 <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className={`p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 transition-all hover:scale-110 hover:border-slate-600 ${social.color}`}><social.icon size={24} /></a>
               ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800/50 backdrop-blur-sm space-y-6">
             <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Message</label>
                  {message.length > 5 && (
                    <button type="button" onClick={handlePolishMessage} disabled={isPolishing} className="text-xs font-bold text-cyan-400 flex items-center gap-1 hover:text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-md transition-colors">
                       {isPolishing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI Polish
                    </button>
                  )}
                </div>
                <textarea required rows="6" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-cyan-500 outline-none resize-none placeholder-slate-600 leading-relaxed" placeholder="Hi Maher, I'd like to discuss a project..."></textarea>
             </div>
             <button disabled={formState === 'submitting' || formState === 'success'} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                {formState === 'success' ? <><CheckCircle size={20} /> Message Sent!</> : <><Send size={20} /> Send Message</>}
             </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- GEMINI WIDGET ---
const AIChatWidget = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: "Hi! I'm MaherAI. Ask me anything about Maher's skills, projects, or experience!" }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault(); if (!input.trim()) return;
    const userMsg = input; setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]); setIsLoading(true);
    const context = `NAME: ${data.profile.name} ROLE: ${data.profile.role} PROJECTS: ${data.projects.map(p => p.title).join(', ')}`;
    const systemPrompt = `You are MaherAI. Answer based on: ${context}`;
    const aiResponse = await callGemini(userMsg, systemPrompt);
    setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]); setIsLoading(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${isOpen ? 'bg-slate-800 text-slate-400 rotate-90' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white animate-pulse-slow'}`}>{isOpen ? <X size={24} /> : <Bot size={28} />}</button>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px] animate-fade-in-up">
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50 min-h-[300px]">
             {messages.map((msg, idx) => <div key={idx} className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-cyan-600 ml-auto' : 'bg-slate-800'}`}>{msg.text}</div>)}
           </div>
           <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white" /><button type="submit" className="p-2 bg-cyan-600 text-white rounded-xl"><Send size={18} /></button></form>
        </div>
      )}
    </>
  );
};

// --- MODALS (Full Implementation) ---

const ModalWrapper = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
    <div className="relative bg-[#0F1117] border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl p-8 my-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
      </div>
      {children}
    </div>
  </div>
);

const ProjectEditorModal = ({ isOpen, onClose, project, onSave }) => {
  const [formData, setFormData] = useState(project || { title: '', description: '', category: 'Web App', tech_stack: [], demo_link: '', github_link: '' });
  useEffect(() => { if (project) setFormData(project); }, [project]);
  if (!isOpen) return null;
  return (
    <ModalWrapper title={project ? "Edit Project" : "Add New Project"} onClose={onClose}>
      <div className="space-y-5">
        <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Title</label><input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none mt-1" /></div>
        <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Description</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white h-32 focus:border-cyan-500 outline-none mt-1" /></div>
        <div className="grid grid-cols-2 gap-4">
           <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Category</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mt-1"><option>Web App</option><option>Data Science</option><option>Tools</option><option>Games</option></select></div>
           <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tech Stack (comma separated)</label><input value={Array.isArray(formData.tech_stack) ? formData.tech_stack.join(', ') : formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value.split(',').map(s => s.trim())})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mt-1" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Demo Link</label><input value={formData.demo_link} onChange={e => setFormData({...formData, demo_link: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mt-1" /></div>
           <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Github Link</label><input value={formData.github_link} onChange={e => setFormData({...formData, github_link: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mt-1" /></div>
        </div>
        <button onClick={() => onSave(formData)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl mt-4 transition-colors">Save Project</button>
      </div>
    </ModalWrapper>
  );
};

const SkillEditorModal = ({ isOpen, onClose, skill, onSave }) => {
  const [data, setData] = useState(skill || { name: '', category: 'Tool', level: 50 });
  useEffect(() => { if (skill) setData(skill); }, [skill]);
  if (!isOpen) return null;
  return (
    <ModalWrapper title={skill ? "Edit Skill" : "Add Skill"} onClose={onClose}>
      <div className="space-y-5">
        <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Name</label><input value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none mt-1" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Category</label><select value={data.category} onChange={e => setData({...data, category: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mt-1"><option>Language</option><option>Core</option><option>Framework</option><option>Tool</option><option>Cloud</option></select></div>
          <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Level ({data.level}%)</label><input type="range" min="0" max="100" value={data.level} onChange={e => setData({...data, level: parseInt(e.target.value)})} className="w-full mt-4 accent-cyan-500" /></div>
        </div>
        <button onClick={() => onSave(data)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl mt-4 transition-colors">Save Skill</button>
      </div>
    </ModalWrapper>
  );
};

const CertEditorModal = ({ isOpen, onClose, cert, onSave }) => {
  const [data, setData] = useState(cert || { title: '', issuer: '', date: '', description: '', skills: [], type: 'google' });
  useEffect(() => { if (cert) setData(cert); }, [cert]);
  if (!isOpen) return null;
  return (
    <ModalWrapper title={cert ? "Edit Certification" : "Add Certification"} onClose={onClose}>
      <div className="space-y-5">
        <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Title</label><input value={data.title} onChange={e => setData({...data, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none mt-1" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Issuer</label><input value={data.issuer} onChange={e => setData({...data, issuer: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mt-1" /></div>
          <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Date</label><input value={data.date} onChange={e => setData({...data, date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mt-1" /></div>
        </div>
        <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Description</label><textarea value={data.description} onChange={e => setData({...data, description: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white h-32 focus:border-cyan-500 outline-none mt-1" /></div>
        <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Skills (comma separated)</label><input value={Array.isArray(data.skills) ? data.skills.join(', ') : data.skills} onChange={e => setData({...data, skills: e.target.value.split(',').map(s=>s.trim())})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mt-1" /></div>
        <button onClick={() => onSave(data)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl mt-4 transition-colors">Save Certification</button>
      </div>
    </ModalWrapper>
  );
};

const ProfileEditorModal = ({ isOpen, onClose, profile, onSave }) => {
  const [data, setData] = useState(profile);
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => { if (profile) setData(profile); }, [profile]);

  const handleEnhanceBio = async () => {
    if (!data.bio) return;
    setIsEnhancing(true);
    const systemPrompt = "You are a professional resume writer. Rewrite this bio to be impactful, concise, and professional for a Computer Science student.";
    const enhanced = await callGemini(data.bio, systemPrompt);
    setData(prev => ({ ...prev, bio: enhanced }));
    setIsEnhancing(false);
  };

  if (!isOpen) return null;
  return (
    <ModalWrapper title="Edit Profile" onClose={onClose}>
      <div className="space-y-5">
        <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Name</label><input value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none mt-1" /></div>
        <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Role</label><input value={data.role} onChange={e => setData({...data, role: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mt-1" /></div>
        <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tagline</label><input value={data.tagline} onChange={e => setData({...data, tagline: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mt-1" /></div>
        <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Status</label><input value={data.status} onChange={e => setData({...data, status: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mt-1" /></div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
             <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Bio</label>
             <button 
               type="button" 
               onClick={handleEnhanceBio} 
               disabled={isEnhancing}
               className="text-xs font-bold text-cyan-400 flex items-center gap-1 hover:text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-md transition-colors"
             >
               {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} 
               {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
             </button>
          </div>
          <textarea value={data.bio} onChange={e => setData({...data, bio: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white h-32 mt-1 focus:border-cyan-500 outline-none" />
        </div>

        <div><label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Email</label><input value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mt-1" /></div>
        <button onClick={() => onSave(data)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl mt-4 transition-colors">Save Profile</button>
      </div>
    </ModalWrapper>
  );
};

const AdminLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  if (!isOpen) return null;
  return (
    <ModalWrapper title="Admin Access" onClose={onClose}>
      <p className="text-slate-400 text-sm mb-4">Enter the access code to edit portfolio data.</p>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white mb-4 focus:border-cyan-500 outline-none" placeholder="Enter code..." />
      <button onClick={() => onLogin(password)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-colors">Unlock</button>
    </ModalWrapper>
  );
};

const CertificateModal = ({ cert, onClose }) => {
  if (!cert) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#0F1117] border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl animate-fade-in-up p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
        <div className="flex items-center gap-6 mb-8">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg bg-blue-500/20 text-blue-400 border border-blue-500/20`}><Award size={40} /></div>
          <div><h3 className="text-2xl font-bold text-white leading-tight mb-2">{cert.title}</h3><div className="text-slate-400 flex items-center gap-2 text-sm"><span className="font-bold text-cyan-400">{cert.issuer}</span><span>•</span><span className="flex items-center gap-1"><Calendar size={14} /> {cert.date}</span></div></div>
        </div>
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800"><h4 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">About Certification</h4><p className="text-slate-300 leading-relaxed">{cert.description || 'No description available.'}</p></div>
          <div><h4 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Skills Earned</h4><div className="flex flex-wrap gap-2">{cert.skills?.map(skill => <span key={skill} className="px-3 py-1 bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 rounded-lg text-sm font-medium">{skill}</span>)}</div></div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Selection States
  const [selectedCert, setSelectedCert] = useState(null);
  
  // Editor States
  const [editorState, setEditorState] = useState({ type: null, data: null });

  const { data, loading, addItem, updateItem, deleteItem } = usePortfolioData();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [scrolled, setScrolled] = useState(false);

  const scrollToSection = (id) => { const el = document.getElementById(id); if (el) { el.scrollIntoView({ behavior: 'smooth' }); setActiveTab(id); setIsMobileMenuOpen(false); } };
  
  const handleAdminLogin = (code) => { 
    if (code === 'Maher@2007&26') { 
      setIsAdmin(true); 
      setShowLoginModal(false); 
    } else { 
      alert('Incorrect Access Code'); 
    } 
  };

  // Generic Save Handlers
  const handleSaveProject = async (projData) => {
    if (editorState.data?.id) await updateItem('projects', editorState.data.id, projData);
    else await addItem('projects', { ...projData, stars: 0, isWinner: false, color: 'from-blue-600 to-cyan-500' });
    setEditorState({ type: null, data: null });
  };
  const handleSaveSkill = async (skillData) => {
    if (editorState.data?.id) await updateItem('skills', editorState.data.id, skillData);
    else await addItem('skills', skillData);
    setEditorState({ type: null, data: null });
  };
  const handleSaveCert = async (certData) => {
    if (editorState.data?.id) await updateItem('certifications', editorState.data.id, certData);
    else await addItem('certifications', certData);
    setEditorState({ type: null, data: null });
  };
  const handleSaveProfile = async (profileData) => {
    await updateItem('profile', null, profileData);
    setEditorState({ type: null, data: null });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-cyan-500"><Loader2 size={48} className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative">
      <Navbar activeTab={activeTab} scrollToSection={scrollToSection} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div id="home"><Hero profile={data.profile} isAdmin={isAdmin} onEdit={() => setEditorState({ type: 'profile', data: data.profile })} /></div>
        <div id="projects"><Projects projects={data.projects} isAdmin={isAdmin} onAdd={() => setEditorState({ type: 'project', data: null })} onDelete={(id) => deleteItem('projects', id)} onEdit={(p) => setEditorState({ type: 'project', data: p })} /></div>
        <div id="skills"><Skills skills={data.skills} isAdmin={isAdmin} onAdd={() => setEditorState({ type: 'skill', data: null })} onDelete={(id) => deleteItem('skills', id)} onEdit={(s) => setEditorState({ type: 'skill', data: s })} /></div>
        <div id="certifications"><Certifications certifications={data.certifications} onCertClick={setSelectedCert} isAdmin={isAdmin} onAdd={() => setEditorState({ type: 'cert', data: null })} onDelete={(id) => deleteItem('certifications', id)} onEdit={(c) => setEditorState({ type: 'cert', data: c })} /></div>
        <Contact profile={data.profile} />
      </main>
      
      {/* Widgets & Modals */}
      <AIChatWidget data={data} />
      <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      <AdminLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleAdminLogin} />
      
      {/* Editor Modals */}
      <ProjectEditorModal isOpen={editorState.type === 'project'} onClose={() => setEditorState({ type: null, data: null })} project={editorState.data} onSave={handleSaveProject} />
      <SkillEditorModal isOpen={editorState.type === 'skill'} onClose={() => setEditorState({ type: null, data: null })} skill={editorState.data} onSave={handleSaveSkill} />
      <CertEditorModal isOpen={editorState.type === 'cert'} onClose={() => setEditorState({ type: null, data: null })} cert={editorState.data} onSave={handleSaveCert} />
      <ProfileEditorModal isOpen={editorState.type === 'profile'} onClose={() => setEditorState({ type: null, data: null })} profile={editorState.data} onSave={handleSaveProfile} />

      <footer className="border-t border-slate-900 py-12 bg-slate-950 relative z-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-500 text-sm">© 2025. Built with React & Firebase.</p>
          <button onClick={() => isAdmin ? setIsAdmin(false) : setShowLoginModal(true)} className="text-xs text-slate-600 hover:text-white flex items-center gap-1 mx-auto">{isAdmin ? <Unlock size={12} /> : <Lock size={12} />}</button>
        </div>
      </footer>
      <style>{`@tailwind base; @tailwind components; @tailwind utilities;`}</style>
    </div>
  );
}