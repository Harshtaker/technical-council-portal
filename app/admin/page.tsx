"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`AUTH_ERROR: ${error.message}`);
      setLoading(false);
    } else {
      setMessage("Login successful. Accessing dashboard...");
      setTimeout(() => router.push("/admin/dashboard"), 1500);
    }
  };

  return (
    /* ✅ FIXED: Bound root background canvas to responsive design tokens */
    <main className="min-h-screen text-theme-text bg-theme-bg flex items-center justify-center p-6 font-sans overflow-hidden relative transition-colors duration-300">
      
      {/* 🌌 BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* ✅ FIXED: Translucent responsive card container supporting light/dark theme grids */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-theme-text/5 border border-theme-grid/20 p-8 md:p-10 rounded-3xl backdrop-blur-xl shadow-2xl"
      >
        {/* LOGO & TITLE */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 mb-5 shadow-inner">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-2xl font-bold text-theme-text tracking-tight uppercase">
            Administrator Login
          </h1>
          <p className="text-[11px] text-council-slate uppercase tracking-[0.2em] mt-2 font-semibold">
            College Council Management Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-council-slate uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-council-slate/60" size={18} />
              {/* ✅ FIXED: Updated dark inputs to accept system variables gracefully */}
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@college.edu"
                className="w-full bg-theme-bg/50 border border-theme-grid/10 rounded-xl py-4 pl-12 pr-4 text-theme-text focus:outline-none focus:border-emerald-500 transition-all placeholder:text-council-slate/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-council-slate uppercase tracking-wider ml-1">Account Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-council-slate/60" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-theme-bg/50 border border-theme-grid/10 rounded-xl py-4 pl-12 pr-4 text-theme-text focus:outline-none focus:border-emerald-500 transition-all placeholder:text-council-slate/40"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-wider text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-900/20"
          >
            {loading ? "Authenticating..." : "Sign In"}
            <Fingerprint size={20} />
          </button>
        </form>

        {message && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 text-center text-xs font-semibold tracking-wide ${
              message.includes("AUTH_ERROR") ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </main>
  );
}