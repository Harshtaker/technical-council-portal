"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase/client";
import { 
  UserCircle, ShieldCheck, Zap, Code, 
  GraduationCap, Terminal, Orbit, Activity, Box
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('rank', { ascending: true });

        if (error) throw error;

        if (data) {
          const formattedMembers = data
            .filter(m => m.name) 
            .map(m => {
              // ✅ FIXED IMAGE LOGIC: 
              // Our Admin Dashboard saves the full Public URL. 
              // We use m.image_url directly as the avatar source.
              return { ...m, avatar: m.image_url };
            });
          setMembers(formattedMembers);
        }
      } catch (err) {
        console.warn("Database synchronization failure.");
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  // Split members based on the 'category' field added in the Admin Dashboard
  const administration = members?.filter(m => m.category === "administration");
  const studentCouncil = members?.filter(m => m.category === "student" || !m.category);

  // Sub-filters for the student council tiers
  const finalYear = studentCouncil?.filter(m => m.rank === 3 || m.rank === 4);
  const thirdYear = studentCouncil?.filter(m => m.rank === 5);
  const secondYear = studentCouncil?.filter(m => m.rank === 6);
  const firstYear = studentCouncil?.filter(m => m.rank === 7);

  const TacticalHeader = ({ icon: Icon, title, subtitle, color = "emerald" }: any) => (
    <div className="mb-10 relative group">
      <div className="flex items-center gap-4 mb-2">
        <div className={`p-2 bg-${color}-500/10 border border-${color}-500/20 rounded text-${color}-500`}>
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight uppercase">
            {title}
          </h2>
          <p className={`text-[10px] font-bold tracking-[0.4em] uppercase text-${color}-500 opacity-60`}>
            {subtitle}
          </p>
        </div>
      </div>
      <div className={`h-px w-full bg-linear-to-r from-${color}-500/50 via-${color}-500/10 to-transparent`} />
    </div>
  );

  return (
    <main className="relative min-h-screen text-slate-300 bg-[#020617] selection:bg-emerald-500/30 overflow-hidden font-sans">
      
      {/* HUD BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b98108_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="border-l-4 border-emerald-500 pl-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
              The <span className="text-emerald-500">Council</span>
            </h1>
            <p className="text-slate-500 mt-3 text-sm md:text-base font-medium">
              Official Leadership and Administrative Body of REC Ambedkar Nagar
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Orbit className="text-emerald-500 animate-spin" size={32} />
            <div className="text-[10px] tracking-[0.4em] text-emerald-500 uppercase animate-pulse">Syncing Personnel Records...</div>
          </div>
        ) : (
          <div className="space-y-24">
            
            {/* 🏛️ TIER 01: ADMINISTRATION */}
            {administration.length > 0 && (
              <section>
                <TacticalHeader icon={ShieldCheck} title="Institutional Leadership" subtitle="Faculty Administration" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {administration.map((m) => (
                    <div key={m.id} className="relative p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col md:flex-row gap-8 items-center md:items-start group transition-all hover:bg-emerald-500/10">
                      <div className="w-40 h-52 relative shadow-2xl shrink-0 overflow-hidden rounded-xl border border-emerald-500/10">
                        {m.avatar ? (
                          <Image src={m.avatar} alt={m.name} fill className="object-cover object-top" unoptimized />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center"><UserCircle size={60} strokeWidth={0.5}/></div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3 pt-2 text-center md:text-left">
                         <h3 className="text-2xl font-bold text-white leading-tight">{m.name}</h3>
                         <p className="text-emerald-500 text-xs font-bold tracking-[0.2em] uppercase">{m.role}</p>
                         <div className="pt-4 border-t border-white/5 flex gap-3 opacity-30 justify-center md:justify-start">
                            <Activity size={14} /> <Terminal size={14} />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 🎓 TIER 02: FINAL YEAR CORE */}
            <section>
              <TacticalHeader icon={GraduationCap} title="Executive Body" subtitle="Final Year Core" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {finalYear?.map((m) => (
                  <div key={m.id} className="group relative bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-6 hover:border-emerald-500/40 transition-all">
                    <div className="w-20 h-20 bg-slate-900 border border-white/10 overflow-hidden rounded-xl relative shrink-0">
                       {m.avatar && <Image src={m.avatar} alt={m.name} fill className="object-cover object-top" unoptimized />}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white tracking-tight">{m.name}</h4>
                      <p className="text-[11px] text-emerald-500 uppercase tracking-widest mt-1 font-bold">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ⚡ TIER 03: SECRETARIES */}
            <section className="bg-emerald-500/5 p-8 rounded-4x1 border border-white/5">
              <div className="mb-10">
                <TacticalHeader icon={Zap} title="Secretaries" subtitle="Core Operations" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {thirdYear?.map((m) => (
                  <div key={m.id} className="text-center group">
                    <div className="w-24 h-24 mx-auto mb-4 relative p-1">
                       <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-2xl group-hover:rotate-6 transition-transform" />
                       <div className="w-full h-full relative overflow-hidden bg-slate-900 rounded-xl border border-white/10">
                          {m.avatar && <Image src={m.avatar} alt={m.name} fill className="object-cover object-top" unoptimized />}
                       </div>
                    </div>
                    <h5 className="font-bold text-white text-base tracking-tight">{m.name}</h5>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Secretary</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 💻 TIER 04: CO-SECRETARIES */}
            <section>
              <TacticalHeader icon={Code} title="Co-Secretaries" subtitle="Technical Support" color="blue" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {secondYear?.map((m) => (
                  <div key={m.id} className="group text-center">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-2xl border border-white/10 overflow-hidden relative shadow-lg transition-transform group-hover:scale-105">
                       {m.avatar && <Image src={m.avatar} alt={m.name} fill className="object-cover object-top" unoptimized />}
                    </div>
                    <h5 className="font-bold text-slate-300 text-sm tracking-tight">{m.name}</h5>
                    <p className="text-[9px] text-blue-500 font-bold uppercase mt-1">Co-Secretary</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 🛠️ TIER 05: GENERAL COUNCIL */}
            <section>
              <TacticalHeader icon={Box} title="General Council" subtitle="Technical Associates" />
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3">
                {firstYear?.map((m) => (
                  <div key={m.id} className="group relative">
                    <div className="aspect-square bg-white/5 border border-white/5 rounded-xl flex items-center justify-center group-hover:border-emerald-500/30 transition-all overflow-hidden">
                       {m.avatar ? (
                         <Image src={m.avatar} alt={m.name} fill className="object-cover object-top opacity-70 group-hover:opacity-100 transition-opacity" unoptimized />
                       ) : (
                         <span className="text-sm text-slate-700 font-bold uppercase">{m.name.charAt(0)}</span>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}
      </div>
    </main>
  );
}