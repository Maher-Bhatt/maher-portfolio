import { useState, useEffect } from "react";
import {
  Github, Linkedin, Send, Menu, X, Trophy, Layout, Cpu, Award, Plus, Trash2, Edit2,
  Lock, Unlock, Loader2, Sparkles
} from "lucide-react";

import { db, auth } from "./firebase";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";

import ProjectEditorModal from "./components/modals/ProjectEditorModal";
import SkillEditorModal from "./components/modals/SkillEditorModal";
import CertEditorModal from "./components/modals/CertEditorModal";
import ProfileEditorModal from "./components/modals/ProfileEditorModal";
import AdminLoginModal from "./components/modals/AdminLoginModal";
import CertificateModal from "./components/modals/CertificateModal";

// ---------- Helper: Call Gemini API Safely ----------
const callGemini = async (prompt, systemInstruction = "") => {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, systemInstruction }),
    });
    const data = await response.json();
    return data?.result || "";
  } catch {
    return "Gemini API error";
  }
};

// ---------- Firestore Data Loader ----------
const usePortfolioData = () => {
  const [data, setData] = useState({ profile: {}, projects: [], skills: [], certifications: [] });
  const [profileId, setProfileId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    signInAnonymously(auth).catch(() => {});
    return onAuthStateChanged(auth, u => setUser(u));
  }, []);

  useEffect(() => {
    const fetchDB = async () => {
      try {
        const [p, pr, sk, ce] = await Promise.all([
          getDocs(collection(db, "profile")),
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "skills")),
          getDocs(collection(db, "certifications")),
        ]);

        const profile = p.empty ? {} : p.docs[0].data();
        setProfileId(p.empty ? null : p.docs[0].id);

        setData({
          profile,
          projects: pr.docs.map(d => ({ id: d.id, ...d.data() })),
          skills: sk.docs.map(d => ({ id: d.id, ...d.data() })),
          certifications: ce.docs.map(d => ({ id: d.id, ...d.data() })),
        });
      } catch {}
    };
    fetchDB();
  }, [user]);

  const addItem = async (type, item) => {
    const ref = await addDoc(collection(db, type), item);
    setData(prev => ({ ...prev, [type]: [...prev[type], { ...item, id: ref.id }] }));
  };
  const updateItem = async (type, id, updates) => {
    if (type === "profile") await updateDoc(doc(db, "profile", profileId), updates);
    else await updateDoc(doc(db, type, id), updates);
    setData(prev => ({
      ...prev,
      [type]: type === "profile"
        ? { ...prev.profile, ...updates }
        : prev[type].map(i => (i.id === id ? { ...i, ...updates } : i)),
    }));
  };
  const deleteItem = async (type, id) => {
    await deleteDoc(doc(db, type, id));
    setData(prev => ({ ...prev, [type]: prev[type].filter(i => i.id !== id) }));
  };

  return { data, addItem, updateItem, deleteItem };
};

// ---------- MAIN APP ----------
export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [editor, setEditor] = useState({ type: null, data: null });
  const [selectedCert, setSelectedCert] = useState(null);

  const { data, addItem, updateItem, deleteItem } = usePortfolioData();

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveTab(id);
    setMobile(false);
  };

  const handleLogin = pass => {
    if (pass === import.meta.env.VITE_ADMIN_PASSWORD) setIsAdmin(true);
    setLoginModal(false);
  };

  const saveProject = async p =>
    editor.data ? updateItem("projects", editor.data.id, p) : addItem("projects", p);
  const saveSkill = async p =>
    editor.data ? updateItem("skills", editor.data.id, p) : addItem("skills", p);
  const saveCert = async p =>
    editor.data ? updateItem("certifications", editor.data.id, p) : addItem("certifications", p);
  const saveProfile = async p => updateItem("profile", null, p);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* NAVBAR */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-full flex items-center justify-between w-full max-w-5xl px-6 py-3">
          <button onClick={() => scrollTo("home")} className="font-bold text-white text-xl">
            &lt;Maher/&gt;
          </button>
          <div className="hidden md:flex gap-3">
            {["home", "projects", "skills", "certifications"].map(t => (
              <button key={t} onClick={() => scrollTo(t)}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeTab === t ? "bg-slate-800 text-cyan-400" : "text-slate-400"
                }`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => setMobile(!mobile)} className="md:hidden">
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home">
        <Hero profile={data.profile} isAdmin={isAdmin} onEdit={() => setEditor({ type: "profile", data: data.profile })} />
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <Projects
          projects={data.projects}
          isAdmin={isAdmin}
          onAdd={() => setEditor({ type: "project", data: null })}
          onEdit={p => setEditor({ type: "project", data: p })}
          onDelete={id => deleteItem("projects", id)}
        />
      </section>

      {/* SKILLS */}
      <section id="skills">
        <Skills
          skills={data.skills}
          isAdmin={isAdmin}
          onAdd={() => setEditor({ type: "skill", data: null })}
          onEdit={s => setEditor({ type: "skill", data: s })}
          onDelete={id => deleteItem("skills", id)}
        />
      </section>

      {/* CERTIFICATIONS */}
      <section id="certifications">
        <Certifications
          certifications={data.certifications}
          onCertClick={setSelectedCert}
          isAdmin={isAdmin}
          onAdd={() => setEditor({ type: "cert", data: null })}
          onEdit={c => setEditor({ type: "cert", data: c })}
          onDelete={id => deleteItem("certifications", id)}
        />
      </section>

      {/* CONTACT */}
      <Contact profile={data.profile} />

      {/* FOOTER */}
      <footer className="text-center border-t border-slate-900 py-10 text-slate-600">
        <p>© 2025. Built by Maher.</p>
        <button
          onClick={() => (isAdmin ? setIsAdmin(false) : setLoginModal(true))}
          className="mx-auto mt-3 text-xs flex items-center gap-1">
          {isAdmin ? <Unlock size={12} /> : <Lock size={12} />}
        </button>
      </footer>

      {/* MODALS */}
      <AdminLoginModal isOpen={loginModal} onClose={() => setLoginModal(false)} onLogin={handleLogin} />
      <ProjectEditorModal isOpen={editor.type === "project"} project={editor.data} onSave={saveProject} onClose={() => setEditor({ type: null, data: null })} />
      <SkillEditorModal isOpen={editor.type === "skill"} skill={editor.data} onSave={saveSkill} onClose={() => setEditor({ type: null, data: null })} />
      <CertEditorModal isOpen={editor.type === "cert"} cert={editor.data} onSave={saveCert} onClose={() => setEditor({ type: null, data: null })} />
      <ProfileEditorModal isOpen={editor.type === "profile"} profile={editor.data} onSave={saveProfile} onClose={() => setEditor({ type: null, data: null })} />
      <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
    </div>
  );
}
