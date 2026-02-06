"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Terminal, Fingerprint, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`ERROR: ${error.message}`);
      setLoading(false);
    } else {
      setMessage("IDENTITY_VERIFIED. REDIRECTING...");
      setTimeout(() => router.push("/admin/dashboard"), 1500);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-mono overflow-hidden relative">
      
      {/* 🌌 BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-500/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/2 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl"
      >
        {/* LOGO & TITLE */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 mb-4 animate-pulse">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em]">
            Admin_Login
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 font-bold">
            Restricted Access // Council Personnel Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[12px] font-black text-emerald-500/60 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@council.sys"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-black text-emerald-500/60 uppercase tracking-widest ml-1">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-emerald-500 text-black rounded-xl font-black uppercase tracking-[0.2em] text-[16px] flex items-center justify-center gap-2 hover:bg-white transition-all group active:scale-95 disabled:opacity-50"
          >
            {loading ? "Decrypting..." : "LOGIN"}
            <Fingerprint size={16} className="group-hover:animate-pulse" />
          </button>
        </form>

        {message && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-[9px] font-black uppercase tracking-widest text-emerald-400"
          >
            {message}
          </motion.p>
        )}

        
      </motion.div>
    </main>
  );
}