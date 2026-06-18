"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Terminal, Calendar, ChevronLeft, ExternalLink, Link2Off } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Notice {
  id: string;
  content: string;
  updated_at: string;
  link_url?: string; 
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // 🌍 CLIENT RECONCILIATION: Hotfix favicon trigger mechanism for system syncing
  useEffect(() => {
    const updateFavicon = () => {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      
      link.href = isDarkMode ? "/favicon-light.png" : "/favicon-dark.png";
    };

    updateFavicon();
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    matcher.addEventListener("change", updateFavicon);
    return () => matcher.removeEventListener("change", updateFavicon);
  }, []);

  async function fetchAllNotices() {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      if (data) setNotices(data);
    } catch (err) {
      console.error("Archive_Fetch_Failure:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllNotices();
    const channel = supabase
      .channel('realtime_notices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => fetchAllNotices())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    /* ✅ FIXED: Bound core body container to responsive dynamic theme tokens */
    <main className="relative min-h-screen text-theme-text bg-theme-bg font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* 🌌 HUD BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b98108_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        
        {/* 📟 HEADER */}
        <div className="mb-20">
          <Link href="/" className="inline-flex items-center gap-3 text-sm text-emerald-500 uppercase tracking-[0.4em] font-black hover:text-theme-text transition-all group mb-10">
            <ChevronLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> 
            <span>HOME_SCREEN</span>
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-8 border-emerald-500 pl-6"
          >
            <h1 className="text-4xl md:text-7xl font-black text-theme-text tracking-tighter uppercase leading-none mb-4 ">
              NOTICES<span className="text-emerald-500">.</span>
            </h1>
          </motion.div>
        </div>

        {/* 📊 TABULAR DATA LOGS */}
        {/* ✅ FIXED: Remapped row backgrounds and divider bounds to support fluid theme inversion scaling */}
        <div className="w-full overflow-x-auto rounded-[2.5rem] border border-theme-grid/20 bg-theme-text/5 backdrop-blur-2xl shadow-2xl">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="border-b border-theme-grid/20 bg-theme-text/5">
                <th className="p-6 text-sm font-black uppercase tracking-[0.3em] text-emerald-500 ">SR_NO.</th>
                <th className="p-6 text-sm font-black uppercase tracking-[0.3em] text-emerald-500 ">Message</th>
                <th className="p-6 text-sm font-black uppercase tracking-[0.3em] text-emerald-500 ">Date</th>
                <th className="p-6 text-sm font-black uppercase tracking-[0.3em] text-emerald-500  text-center">Attachment</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-theme-grid/10"><td colSpan={4} className="p-12 bg-theme-text/5" /></tr>
                ))
              ) : notices.length > 0 ? (
                <AnimatePresence>
                  {notices.map((notice, idx) => (
                    <motion.tr 
                      key={notice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="border-b border-theme-grid/10 hover:bg-emerald-500/5 transition-all group"
                    >
                      <td className="p-8 font-black text-council-slate/40 text-xl group-hover:text-emerald-500/50 transition-colors">
                        {String(notices.length - idx).padStart(2, '0')}
                      </td>
                      <td className="p-8">
                        <p className="text-xl md:text-2xl font-bold text-theme-text/90 uppercase tracking-tight group-hover:text-theme-text transition-colors leading-snug max-w-2xl">
                          {notice.content}
                        </p>
                      </td>
                      <td className="p-8 text-sm text-council-slate font-bold tracking-widest whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-emerald-500/40" />
                          {new Date(notice.updated_at).toLocaleDateString('en-GB', { 
                            day: '2-digit', month: 'short', year: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="p-8 text-center">
                        {notice.link_url ? (
                          <a 
                            href={notice.link_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 hover:scale-105 transition-all shadow-lg shadow-emerald-500/10"
                          >
                            View_Doc <ExternalLink size={12} />
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-6 py-3 bg-theme-text/5 text-council-slate/40 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-theme-grid/10 cursor-not-allowed italic">
                            No_Link <Link2Off size={12} />
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={4} className="p-40 text-center text-council-slate/40 font-black uppercase tracking-widest italic">
                    <Terminal size={80} className="mx-auto opacity-10 mb-6" />
                    Null_Data_Retrieved
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}