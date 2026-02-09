"use client";

import { supabase } from "@/utils/supabase/client"; 
import { Calendar, MapPin, Sparkles, History, Zap, FileText, ChevronLeft, Award, Image as ImageIcon, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function fetchEvents() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: filter === "upcoming" });
      
      if (error) throw error;
      if (data) setEvents(data);
    } catch (err) {
      console.warn("Database sync error. Check connectivity.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
    setExpandedId(null);
  }, [filter]);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.event_date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return filter === "past" ? eventDate < now : eventDate >= now;
  });

  return (
    <main className="relative min-h-screen text-slate-200 bg-[#020617] font-sans flex flex-col overflow-x-hidden">
      
      {/* PROFESSIONAL BACKGROUND GRID */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b98105_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-12 w-full grow flex flex-col">
        
        {/* INSTITUTIONAL HEADER */}
        <div className="flex flex-col gap-6 mb-16 shrink-0">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-emerald-500 font-bold hover:text-white transition-all group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Homepage
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
                Council <span className="text-emerald-500">Events</span>
              </h1>
              <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">Official schedule and event archives of the College Council</p>
            </motion.div>

            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 backdrop-blur-md w-full md:w-auto">
              {["upcoming", "past"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type as any)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === type 
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  {type === "upcoming" ? <Sparkles size={14} /> : <History size={14} />}
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* EVENT LISTING */}
        <div className="grow flex flex-col">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, idx) => {
                  const hasSummary = event.summary_text && event.summary_text.trim().length > 0;
                  const isExpanded = expandedId === event.id;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={event.id}
                      className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col h-full hover:border-emerald-500/30 transition-all duration-300 shadow-xl"
                    >
                      {/* Event Banner */}
                      <div className="h-52 relative overflow-hidden bg-slate-900">
                        {event.image_url ? (
                          <Image 
                            src={event.image_url} 
                            alt={event.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                            unoptimized // Important if using external URLs or strict Supabase domains
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                            <ImageIcon size={40} strokeWidth={1.5} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />
                        {filter === "past" && hasSummary && (
                          <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Results Ready</div>
                        )}
                      </div>

                      {/* Event Content */}
                      <div className="p-6 flex flex-col grow">
                        <div className="flex items-center gap-2 text-emerald-500 text-[11px] font-bold uppercase tracking-widest mb-3">
                          <Calendar size={14} />
                          {new Date(event.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-emerald-400 transition-colors">{event.title}</h3>
                        
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-4">
                          <MapPin size={14} className="text-emerald-500" /> {event.location || 'College Campus'}
                        </div>

                        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                          {event.description}
                        </p>

                        <div className="mt-auto pt-6 border-t border-white/5">
                          {filter === "upcoming" ? (
                            <a 
                              href={event.reg_link || "#"} 
                              target={event.reg_link ? "_blank" : "_self"} 
                              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                                event.reg_link 
                                ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20" 
                                : "bg-white/5 text-slate-600 cursor-not-allowed"
                              }`}
                            >
                              <Zap size={14} /> {event.reg_link ? "Register for Event" : "Registration Closed"}
                            </a>
                          ) : (
                            <div className="space-y-4">
                              <button 
                                onClick={() => setExpandedId(isExpanded ? null : event.id)}
                                className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                                  hasSummary 
                                  ? "bg-white/10 text-white hover:bg-white/20" 
                                  : "bg-white/5 text-slate-600 cursor-not-allowed"
                                }`}
                              >
                                <FileText size={14} /> {isExpanded ? "Close Report" : "View Event Highlights"}
                              </button>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden bg-black/30 rounded-2xl border border-white/5"
                                  >
                                    <div className="p-4">
                                      <div className="flex items-center gap-2 text-emerald-500 mb-3 text-[10px] font-bold uppercase tracking-wider">
                                        <Award size={16} /> Key Achievements
                                      </div>
                                      <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                                        {event.summary_text}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grow flex flex-col items-center justify-center py-20 px-6 text-center border border-dashed border-white/10 rounded-[2.5rem] bg-white/2"
              >
                <Clock className="text-slate-700 mb-4" size={56} />
                <h3 className="text-white font-bold text-lg uppercase tracking-widest">No Records Found</h3>
                <p className="text-slate-500 text-xs mt-2 font-medium">There are currently no {filter} events to display in this category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}