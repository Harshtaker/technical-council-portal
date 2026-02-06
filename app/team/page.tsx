"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase/client";
import { 
  UserCircle, ShieldCheck, Zap, Code, Cpu, 
  GraduationCap, Hexagon, Terminal, Orbit,
  Fingerprint, Activity, Box
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
              let publicUrl = null;
              if (m.image_url) {
                const path = `TEAM_PROFILES/${m.image_url}`;
                const { data: urlData } = supabase.storage
                  .from("Gallery")
                  .getPublicUrl(path);
                publicUrl = urlData.publicUrl;
              }
              return { ...m, avatar: publicUrl };
            });
          setMembers(formattedMembers);
        }
      } catch (err) {
        console.warn("System_Sync_Failure");
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  const admin = members?.filter(m => m.rank <= 2);
  const finalYear = members?.filter(m => m.rank === 3 || m.rank === 4);
  const thirdYear = members?.filter(m => m.rank === 5);
  const secondYear = members?.filter(m => m.rank === 6);
  const firstYear = members?.filter(m => m.rank === 7);

  const TacticalHeader = ({ icon: Icon, title, subtitle, color = "emerald" }: any) => (
    <div className="mb-10 relative group">
      <div className="flex items-center gap-4 mb-2">
        <div className={`p-2 bg-${color}-500/10 border border-${color}-500/20 rounded text-${color}-500`}>
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">
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
    <main className="relative min-h-screen text-slate-300 bg-[#020617] selection:bg-emerald-500/30 overflow-hidden font-mono">
      
      {/* 🌌 HUD BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b98108_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10" />
        
        {/* Sync Scanline Effect to Events page */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-size-[100%_4px] opacity-[0.05]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* 📟 HEADER: Sync to Events Page Terminal Style */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-4 border-emerald-500 pl-6"
          >
            
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              The <span className="text-emerald-500">Council.</span>
            </h1>
            
            <p className="text-slate-500 font-mono mt-3 uppercase tracking-[0.2em] text-[10px]">
              Archiving Technical Leadership & Strategic Deployments
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <Orbit className="text-emerald-500 animate-spin" size={32} />
            <div className="text-[10px] tracking-[0.4em] text-emerald-500 uppercase animate-pulse">Linking_Neural_Network...</div>
          </div>
        ) : (
          <div className="space-y-24">
            
            {/* 🏛️ TIER 01: INSTITUTIONAL LEAD */}
            <section>
              <TacticalHeader icon={ShieldCheck} title="Institutional Lead" subtitle="Command_Authority" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {admin?.map((m) => (
                  <motion.div 
                    key={m.id} 
                    whileHover={{ scale: 1.01 }}
                    className="relative p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-sm flex flex-col md:flex-row gap-8 items-center md:items-start group transition-all"
                  >
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500" />
                    
                    <div className="w-40 h-52 relative shadow-2xl shrink-0 overflow-hidden border border-emerald-500/10">
                      {m.avatar ? (
                        <Image src={m.avatar} alt={m.name} fill className="object-cover object-top transition-transform duration-500 group-hover:scale-105" unoptimized />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center"><UserCircle size={60} strokeWidth={0.5}/></div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-3 pt-2">
                       <h3 className="text-3xl font-black text-white leading-none uppercase tracking-tighter">{m.name}</h3>
                       <p className="text-emerald-500 text-[12px] font-bold tracking-[0.3em] uppercase">{m.role}</p>
                       <div className="pt-4 border-t border-white/5 flex gap-3 opacity-30">
                          <Activity size={12} /> <Terminal size={12} />
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 🎓 TIER 02: FINAL YEAR CORE */}
            <section>
              <TacticalHeader icon={GraduationCap} title="Final Year Core" subtitle="Project_Execution" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {finalYear?.map((m) => (
                  <div key={m.id} className="group relative bg-white/5 border border-white/5 p-4 flex items-center gap-6 hover:border-emerald-500/40 transition-all">
                    <div className="w-20 h-20 bg-slate-900 border border-white/10 overflow-hidden relative shrink-0">
                       {m.avatar && <Image src={m.avatar} alt={m.name} fill className="object-cover object-top transition-transform group-hover:scale-105" unoptimized />}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white uppercase tracking-tighter">{m.name}</h4>
                      <p className="text-[11px] text-emerald-500 uppercase tracking-widest mt-1 font-black">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ⚡ TIER 03: SECRETARIES */}
            <section className="bg-emerald-500/5 p-8 border-y border-white/5">
              <div className="mb-12">
                <TacticalHeader icon={Zap} title="Secretaries" subtitle="Operations_Management" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {thirdYear?.map((m) => (
                  <div key={m.id} className="text-center group">
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                       <div className="absolute inset-0 border border-emerald-500/30 rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                       <div className="absolute inset-1 overflow-hidden bg-slate-900 border border-white/10">
                          {m.avatar && <Image src={m.avatar} alt={m.name} fill className="object-cover object-top" unoptimized />}
                       </div>
                    </div>
                    <h5 className="font-bold text-white text-[16px] uppercase tracking-tight leading-tight">{m.name}</h5>
                  </div>
                ))}
              </div>
            </section>

            {/* 💻 TIER 04: CO-SECRETARIES */}
            <section>
              <TacticalHeader icon={Code} title="Co-Secretaries" subtitle="Technical_Support" color="blue" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {secondYear?.map((m) => (
                  <div key={m.id} className="group text-center">
                    <div className="w-18 h-18 mx-auto mb-3 rounded-full border border-white/10 overflow-hidden relative shadow-lg transition-transform group-hover:scale-110">
                       {m.avatar && <Image src={m.avatar} alt={m.name} fill className="object-cover object-top" unoptimized />}
                    </div>
                    <h5 className="font-bold text-slate-300 text-[14px] uppercase tracking-tighter">{m.name}</h5>
                  </div>
                ))}
              </div>
            </section>

            {/* 🛠️ TIER 05: GENERAL COUNCIL */}
            <section>
              <TacticalHeader icon={Box} title="General Council" subtitle="Technical_Assets" />
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2">
                {firstYear?.map((m) => (
                  <div key={m.id} className="group relative">
                    <div className="aspect-square bg-slate-900 border border-white/5 flex items-center justify-center group-hover:border-emerald-500/40 transition-all overflow-hidden">
                       {m.avatar ? (
                         <Image src={m.avatar} alt={m.name} fill className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity" unoptimized />
                       ) : (
                         <span className="text-[12px] text-white/20 uppercase font-black">{m.name.charAt(0)}</span>
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