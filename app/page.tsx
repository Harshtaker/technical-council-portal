"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Instagram, MessageSquare, ShieldCheck, ExternalLink, 
  ArrowRight, Zap, Target, Rocket, AlertCircle, Terminal 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";

// Define Types for better DX
interface Photo {
  path: string;
  label: string;
}

interface Notice {
  title: string;
  date: string;
}

export default function Home() {
  const [latestPhotos, setLatestPhotos] = useState<Photo[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connError, setConnError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      try {
        // 1. FETCH FROM STORAGE
        const { data: storageData, error: storageError } = await supabase.storage
          .from("Gallery")
          .list("EVENT PHOTOS", {
            limit: 15, 
            sortBy: { column: "name", order: "desc" },
          });

        if (storageError) {
          console.warn("Storage_Log:", storageError.message);
        } else if (storageData && isMounted) {
          const formattedPhotos = storageData
            .filter((file) => 
              file.name !== ".emptyFolderPlaceholder" && 
              file.metadata !== null &&
              /\.(jpg|jpeg|png|webp)$/i.test(file.name)
            )
            .slice(0, 5) 
            .map((file) => ({
              path: supabase.storage.from("Gallery").getPublicUrl(`EVENT PHOTOS/${file.name}`).data.publicUrl,
              label: file.name.split(".")[0].replace(/_/g, " "),
            }));
          setLatestPhotos(formattedPhotos);
        }

        // 2. FETCH NOTICES (Updated to match your new schema)
        const { data: noticeData, error: noticeError } = await supabase
          .from('notices')
          .select('content, updated_at')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(3);
        
        if (noticeError) throw noticeError;
        
        if (noticeData && isMounted) {
          // Map database 'content' to UI 'title'
          const formattedNotices = noticeData.map(n => ({
            title: n.content,
            date: new Date(n.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
          }));
          setNotices(formattedNotices);
          setConnError(false);
        }

      } catch (err) {
        console.warn("Data Sync: Verify Supabase connection or folder paths.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Auto-Slide Logic
  useEffect(() => {
    if (latestPhotos.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % latestPhotos.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [latestPhotos]);

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden bg-[#020617]">
      
      {/* 📡 REGIONAL CONNECTION ALERT */}
      <AnimatePresence>
        {connError && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-6 flex justify-center items-center gap-3 overflow-hidden"
          >
            <AlertCircle size={14} className="text-amber-500" />
            <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-black">
              System_Notice: Local ISP issues detected. Some media logs may require a VPN for access.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌌 HERO SECTION */}
      <section className="relative h-[95vh] flex flex-col items-center justify-center px-6 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/bg.jpg" 
            alt="Circuit board technical background" 
            fill 
            className="object-cover opacity-30 grayscale" 
            priority 
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#020617]/60 to-[#020617]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center md:text-left shrink-0">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-8 uppercase">
              Technical <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-blue-400 to-blue-600">Council</span>
            </h1>
            <p className="max-w-xs md:max-w-sm text-slate-400 text-xl md:text-2xl font-medium leading-relaxed italic border-l-4 border-emerald-500/30 pl-8">
              Fueling future tech leaders through structured excellence.
            </p>
          </motion.div>

          <motion.div 
            animate={{ y: [0, -25, 0] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
            className="relative shrink-0 flex justify-center md:justify-start"
          >
            <div className="absolute inset-0 bg-emerald-500/15 blur-[120px] rounded-full" />
            <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full translate-x-10" />
            <Image 
              src="/bot.png" 
              alt="Technical Council Assistant Mascot" 
              width={420} 
              height={420} 
              className="relative z-10 drop-shadow-[0_0_50px_rgba(16,185,129,0.2)] filter brightness-110" 
            />
          </motion.div>
        </div>
      </section>

      {/* 🏛️ ABOUT US SECTION */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-8 space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter border-b-2 border-emerald-500/30 pb-3 inline-block mb-6 text-slate-200">Who We Are.</h2>
              <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
                The Technical Council is the supreme student body of Rajkiya Engineering College Ambedkar Nagar. We serve as a vital ecosystem that bridges the gap between traditional academic theory and the rapidly evolving demands of the global tech industry.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3 text-left">
                <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                  <Target size={16} /> Our Core Mission
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed italic">
                  To cultivate a culture of relentless innovation, research, and project-based learning across all departments.
                </p>
              </div>
              <div className="space-y-3 text-left">
                <h4 className="text-blue-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                  <ShieldCheck size={16} /> Student Leadership
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed italic">
                  Empowering students to take ownership of large-scale technical projects and administrative responsibilities.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center md:justify-end items-center h-full">
            <div className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center">
              <div className="absolute inset-0">
                <svg className="w-full h-full">
                  <motion.circle cx="50%" cy="50%" r="46%" stroke="#10b981" strokeWidth="1.5" fill="transparent" strokeDasharray="2 12" strokeLinecap="round" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
                  <motion.circle cx="50%" cy="50%" r="42%" stroke="#3b82f6" strokeWidth="1" fill="transparent" strokeDasharray="1 10" strokeLinecap="round" animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                </svg>
              </div>
              <div className="relative w-[75%] h-[75%] bg-white rounded-full p-6 border-8 border-slate-900 shadow-2xl flex items-center justify-center z-10 shrink-0">
                <Image src="/logo.png" alt="REC Council Logo" width={180} height={180} className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📱 DUAL VIEW: GALLERY & NOTICES */}
      <section className="relative z-10 py-12 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          
          {/* Photo Gallery Column */}
          <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-6 flex flex-col min-h-112.5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[20px] font-mono tracking-[0.2em] uppercase text-slate-200 font-black">Photo Gallery</h3>
              <Link href="/gallery" className="text-[12px] font-mono text-slate-500 hover:text-white uppercase transition-colors font-bold tracking-widest">Explore</Link>
            </div>
            <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/10 bg-slate-800/20">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {latestPhotos.length > 0 ? (
                    <motion.div 
                      key={currentSlide} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      transition={{ duration: 0.8 }} 
                      className="absolute inset-0"
                    >
                      <Image 
                        src={latestPhotos[currentSlide].path} 
                        alt={latestPhotos[currentSlide].label} 
                        fill 
                        className="object-cover" 
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 to-transparent" />
                      <p className="absolute bottom-6 left-6 text-[10px] font-mono text-emerald-400 font-bold tracking-[0.3em] uppercase">
                        {latestPhotos[currentSlide].label}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-600 font-mono text-[10px] uppercase tracking-widest">No_Media_Found</div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Notice Board Column */}
          <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col min-h-125 group hover:border-blue-500/20 transition-all backdrop-blur-sm">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 animate-pulse">
                  <Zap size={18} />
                </div>
                <h3 className="text-[20px] font-mono tracking-[0.2em] uppercase text-slate-200 font-black">
                  Broadcast_Center
                </h3>
              </div>
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-pulse" />
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {notices.length > 0 ? (
                notices.map((notice, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="p-5 bg-white/5 border-l-2 border-white/10 hover:border-blue-500 hover:bg-white/3 transition-all cursor-pointer group/item rounded-r-2xl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest font-mono">
                        {notice.date}
                      </span>
                    </div>
                    <p className="text-xs font-bold uppercase leading-relaxed text-slate-300 group-hover/item:text-white transition-colors line-clamp-2">
                      {notice.title}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4">
                  <Terminal size={32} className="opacity-20" />
                  <p className="font-mono text-[10px] uppercase font-black tracking-widest">No_Active_Signals_Found</p>
                </div>
              )}
            </div>

            <Link 
              href="/notices" 
              className="mt-8 py-4 border border-white/5 rounded-2xl text-center text-[12px] font-mono text-slate-500 hover:text-white hover:bg-white/5 uppercase tracking-[0.3em] font-black transition-all"
            >
              Access_Full_Archive
            </Link>
          </div>
        </div>
      </section>

      {/* 🔗 INSTITUTIONAL STRIP */}
      <section className="relative z-10 py-12 border-y border-white/10 bg-white/3">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 md:gap-32">
          {[
            { name: "REC Ambedkar Nagar", url: "https://recabn.ac.in/", logo: "/REC.png" },
            { name: "AKTU", url: "https://aktu.ac.in/", logo: "/aktu.png" },
          ].map((site, i) => (
            <a key={i} href={site.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4 transition-transform hover:scale-105">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center border-4 border-slate-800 group-hover:border-emerald-500 transition-all shadow-[0_0_30px_rgba(0,0,0,0.3)] overflow-hidden">
                <Image src={site.logo} alt={`${site.name} official logo`} width={96} height={96} className="w-full h-full object-contain p-2" />
              </div>
              <span className="text-[12px] md:text-[14px] font-mono tracking-[0.2em] uppercase text-slate-200 group-hover:text-emerald-400 font-black transition-colors">
                {site.name}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 📡 CONTACT & FOOTER */}
      <footer className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full p-0.5 shrink-0 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg">
                <Image src="/logo.png" alt="Technical Council Logo" width={48} height={48} className="w-full h-full object-contain rounded-full" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-200 leading-tight">
                Technical Council <br /> <span className="text-emerald-500">REC Ambedkar Nagar</span>
              </h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed uppercase tracking-tighter">
              The apex technical body of Rajkiya Engineering College, Ambedkar Nagar, dedicated to fostering innovation and engineering excellence.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-emerald-500 border-l-2 border-emerald-500 pl-4">Quick_Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Official REC Website", href: "https://recabn.ac.in/" },
                { name: "Notice Bulletin", href: "/notices" },
                { name: "Event Archive", href: "/gallery" },
                { name: "Council Team", href: "/team" }
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 group">
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-white/3 border border-white/5 rounded-2xl">
              <p className="text-[10px] font-mono text-slate-500 uppercase mb-2 font-black">Mailing_Address</p>
              <p className="text-xs text-slate-300 leading-relaxed font-medium uppercase tracking-tight">
                Rajkiya Engineering College, Ambedkar Nagar, UP - 224122
              </p>
            </div>
            <Link href="/contact" className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2">
              Initiate Contact <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            © 2026 Technical Council // REC Ambedkar Nagar
          </p>
        </div>
      </footer>
    </main>
  );
}