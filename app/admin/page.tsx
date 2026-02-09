"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, Fingerprint } from "lucide-react";
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
      setMessage(`AUTH_ERROR: ${error.message}`);
      setLoading(false);
    } else {
      setMessage("Login successful. Accessing dashboard...");
      setTimeout(() => router.push("/admin/dashboard"), 1500);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans overflow-hidden relative">
      
      {/* 🌌 BACKGROUND EFFECTS */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-emerald-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl backdrop-blur-xl shadow-2xl"
      >
        {/* LOGO & TITLE */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-emerald-600/10 rounded-2xl text-emerald-500 mb-5">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Administrator Login
          </h1>
          <p className="text-[11px] text-slate-500 uppercase tracking-[0.2em] mt-2 font-semibold">
            College Council Management Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@college.edu"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Account Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold tracking-wider text-base flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-900/20"
          >
            {loading ? "Authenticating..." : "Sign In"}
            <Fingerprint size={20} />
          </button>
        </form>

        {message && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-xs font-semibold tracking-wide text-emerald-400"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </main>
  );
}