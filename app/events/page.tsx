"use client";

import { supabase } from "@/utils/supabase/client"; 
import { Calendar, MapPin, Tag, ArrowUpRight, Clock, Sparkles, History, Zap, FileText } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);

  // 📡 Unified Fetch Function
  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: filter === "upcoming" });
      
      if (error) throw error;
      if (data) setEvents(data);
    } catch (err) {
      console.warn("Sync_Error: Database handshake failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();

    // ⚡ Realtime Subscription: Update UI instantly when DB changes
    const channel = supabase
      .channel('realtime_events')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  const filteredEvents = events.filter(event => {
    const isPast = new Date(event.event_date) < new Date();
    return filter === "past" ? isPast : !isPast;
  });

  return (
    <main className="relative min-h-screen text-slate-200 selection:bg-emerald-500/30 overflow-hidden bg-[#020617] font-mono">
      
      {/* 🌌 CYBER BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b98108_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12">
        
        {/* 📟 HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-4 border-emerald-500 pl-6"
          >
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              Council <span className="text-emerald-500 text-glow">Events.</span>
            </h1>
          </motion.div>

          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
            {["upcoming", "past"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-black uppercase tracking-widest transition-all ${
                  filter === type 
                    ? "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.4)]" 
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {type === "upcoming" ? <Sparkles size={16} /> : <History size={16} />}
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* ⚡ EVENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-125 rounded-[2.5rem] bg-white/2 animate-pulse border border-white/5" />
              ))
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event, idx) => {
                
                // CORE LOGIC: Link to reg_link for upcoming, summary_link for past
                const activeLink = filter === "upcoming" ? event.reg_link : event.summary_link;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={event.id}
                    className="group relative bg-white/2 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/40 transition-all duration-700 shadow-2xl backdrop-blur-sm"
                  >
                    <a 
                      href={activeLink || "#"} 
                      target={activeLink ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className={`block h-full ${!activeLink && 'cursor-default'}`}
                    >
                      {/* Image Module */}
                      <div className="h-64 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                        {event.image_url ? (
                          <Image 
                            src={event.image_url} 
                            alt={event.title} 
                            fill 
                            className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-700 gap-2">
                            <Tag size={32} strokeWidth={1} />
                            <span className="text-[8px] uppercase tracking-widest">No_Media_Payload</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent opacity-90" />
                        
                        {/* Summary Available Indicator */}
                        {filter === "past" && event.summary_link && (
                          <div className="absolute top-6 right-6 bg-emerald-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full flex items-center gap-2 uppercase tracking-tighter shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <FileText size={12} /> RECAP_READY
                          </div>
                        )}
                      </div>

                      <div className="p-8 relative -mt-12 bg-[#020617]/95 backdrop-blur-xl rounded-t-[2.5rem] border-t border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            <Calendar size={14} />
                            {new Date(event.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                          <span className="text-[8px] text-slate-700 font-black uppercase tracking-[0.2em]">ID_{event.id.slice(0, 4)}</span>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors uppercase leading-none">
                          {event.title}
                        </h3>

                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold mb-6 uppercase tracking-widest italic">
                          <MapPin size={12} className="text-emerald-500" /> {event.location || 'REC_CAMPUS_GROUNDS'}
                        </div>

                        <p className="text-slate-400 text-xs leading-relaxed mb-10 line-clamp-2 uppercase tracking-tight opacity-60 group-hover:opacity-100 transition-opacity">
                          {event.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${activeLink ? 'text-emerald-500' : 'text-slate-700'}`}>
                            {filter === "upcoming" ? (
                              activeLink ? <><Zap size={14} className="animate-pulse" /> Register_Entry</> : "Closed_Registration"
                            ) : (
                              activeLink ? <><FileText size={14} /> View_Debrief</> : "No_Report_Attached"
                            )}
                          </div>
                          {activeLink && <ArrowUpRight size={20} className="text-emerald-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                        </div>
                      </div>
                    </a>
                  </motion.div>
                )
              })
            ) : (
              <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[3rem] bg-white/1">
                <Clock className="mx-auto text-slate-800 mb-6 animate-spin-slow" size={48} />
                <p className="text-slate-600 font-black text-[12px] uppercase tracking-[0.5em]">Null_Events_In_This_Timeframe</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}