"use client";

import { supabase } from "@/utils/supabase/client"; 
import { Calendar, MapPin, Sparkles, History, Zap, FileText, ChevronLeft, Award, Image as ImageIcon, Clock, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 📝 STATES FOR IN-HOUSE REGISTRATION SYSTEM
  const [activeRegEvent, setActiveRegEvent] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [regStatus, setRegStatus] = useState<{ type: "idle" | "success" | "error"; msg: string }>({ type: "idle", msg: "" });

  // 🌍 CLIENT RECONCILIATION: Dynamic Tab Icon Hotfix for Route Segments
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

    // Run on Mount
    updateFavicon();

    // Listen for real-time system theme changes
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    matcher.addEventListener("change", updateFavicon);
    return () => matcher.removeEventListener("change", updateFavicon);
  }, []);

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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setRegStatus({ type: "idle", msg: "" });

    const MASTER_WEBHOOK_URL = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL;

    const payload = {
      eventName: activeRegEvent.title,
      responses: answers
    };

    try {
      await fetch(MASTER_WEBHOOK_URL!, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setRegStatus({ type: "success", msg: "Registration logged directly into the council database!" });
      setAnswers({});
      setTimeout(() => {
        setActiveRegEvent(null);
        setRegStatus({ type: "idle", msg: "" });
      }, 2500);
    } catch (err) {
      setRegStatus({ type: "error", msg: "Transmission failure. Token mismatch or offline handshake." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen text-theme-text bg-theme-bg font-sans flex flex-col overflow-x-hidden transition-colors duration-300">
      
      {/* PROFESSIONAL BACKGROUND GRID */}
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-40" />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b98105_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-12 w-full grow flex flex-col">
        
        {/* INSTITUTIONAL HEADER */}
        <div className="flex flex-col gap-6 mb-16 shrink-0">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-emerald-500 font-bold hover:text-theme-text transition-all group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Homepage
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-theme-text tracking-tight leading-none uppercase">
                Council <span className="text-emerald-500">Events</span>
              </h1>
              <p className="text-council-slate mt-2 text-sm md:text-base font-medium">Official schedule and event archives of the College Council</p>
            </motion.div>

            <div className="flex bg-theme-text/5 p-1 rounded-xl border border-theme-grid/20 backdrop-blur-md w-full md:w-auto">
              {["upcoming", "past"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type as any)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === type 
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                      : "text-council-slate hover:text-theme-text"
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
                  <div key={i} className="h-96 rounded-3xl bg-theme-text/5 animate-pulse" />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, idx) => {
                  const hasSummary = event.summary_text && event.summary_text.trim().length > 0;
                  const isExpanded = expandedId === event.id;

                  const isExternalReg = event.reg_link && event.reg_link.startsWith("http");
                  const isInHouseReg = event.is_registration_open && event.custom_fields;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={event.id}
                      className="group relative bg-theme-text/5 border border-theme-grid/10 rounded-3xl overflow-hidden flex flex-col h-full hover:border-emerald-500/30 transition-all duration-300 shadow-xl"
                    >
                      {/* Event Banner */}
                      <div className="h-52 relative overflow-hidden bg-black/10 dark:bg-slate-900">
                        {event.image_url ? (
                          <Image 
                            src={event.image_url} 
                            alt={event.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                            unoptimized 
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-council-slate/50">
                            <ImageIcon size={40} strokeWidth={1.5} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
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
                        
                        <h3 className="text-xl font-bold text-theme-text mb-2 leading-snug group-hover:text-emerald-500 transition-colors">{event.title}</h3>
                        
                        <div className="flex items-center gap-2 text-council-slate text-xs font-medium mb-4">
                          <MapPin size={14} className="text-emerald-500" /> {event.location || 'College Campus'}
                        </div>

                        <p className="text-council-slate dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                          {event.description}
                        </p>

                        <div className="mt-auto pt-6 border-t border-theme-grid/10">
                          {filter === "upcoming" ? (
                            isExternalReg ? (
                              <a 
                                href={event.reg_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
                              >
                                <Zap size={14} /> Register for Event
                              </a>
                            ) : isInHouseReg ? (
                              <button 
                                onClick={() => {
                                  setActiveRegEvent(event);
                                  setAnswers({});
                                }}
                                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
                              >
                                <Zap size={14} /> Register Custom Form
                              </button>
                            ) : (
                              <div className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-theme-text/5 text-council-slate/40 cursor-not-allowed">
                                <Zap size={14} /> Registration Closed
                              </div>
                            )
                          ) : (
                            <div className="space-y-4">
                              <button 
                                onClick={() => setExpandedId(isExpanded ? null : event.id)}
                                className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                                  hasSummary 
                                    ? "bg-theme-text/10 text-theme-text hover:bg-theme-text/20" 
                                    : "bg-theme-text/5 text-council-slate/40 cursor-not-allowed"
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
                                    className="overflow-hidden bg-theme-text/5 rounded-2xl border border-theme-grid/10"
                                  >
                                    <div className="p-4">
                                      <div className="flex items-center gap-2 text-emerald-500 mb-3 text-[10px] font-bold uppercase tracking-wider">
                                        <Award size={16} /> Key Achievements
                                      </div>
                                      <p className="text-council-slate dark:text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
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
                className="grow flex flex-col items-center justify-center py-20 px-6 text-center border border-dashed border-theme-grid/20 rounded-[2.5rem] bg-theme-text/2"
              >
                <Clock className="text-council-slate/40 mb-4" size={56} />
                <h3 className="text-theme-text font-bold text-lg uppercase tracking-widest">No Records Found</h3>
                <p className="text-council-slate text-xs mt-2 font-medium">There are currently no {filter} events to display in this category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 📟 DYNAMIC REGISTRATION OVERLAY SCREEN */}
      <AnimatePresence>
        {activeRegEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-theme-bg border border-theme-grid/20 w-full max-w-lg rounded-4xl p-6 md:p-8 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />

              <button 
                onClick={() => setActiveRegEvent(null)}
                className="absolute top-6 right-6 text-council-slate hover:text-theme-text p-2.5 bg-theme-text/5 border border-theme-grid/10 hover:border-theme-grid/20 rounded-xl transition-all"
              >
                <X size={14} />
              </button>

              <div className="border-b border-theme-grid/10 pb-4 mb-6">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Event Registration Form</span>
                <h2 className="text-2xl font-extrabold text-theme-text tracking-tight mt-1 pr-8 leading-tight">{activeRegEvent.title}</h2>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-4 custom-scrollbar">
                  {activeRegEvent.custom_fields?.map((field: any, idx: number) => (
                    <div key={idx} className="flex flex-col">
                      <label className="text-xs font-bold uppercase tracking-widest text-council-slate mb-2 flex items-center gap-1.5">
                        {field.label} {field.required && <span className="text-emerald-500 font-bold">*</span>}
                      </label>
                      <input 
                        type={field.type || "text"}
                        required={field.required}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        value={answers[field.label] || ""}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [field.label]: e.target.value }))}
                        className="w-full px-4 py-3.5 bg-theme-text/5 border border-theme-grid/10 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-theme-text/10 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all text-theme-text font-sans text-sm placeholder:text-council-slate/40"
                      />
                    </div>
                  ))}
                </div>

                {/* Status Logs View */}
                {regStatus.type !== "idle" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border text-xs font-semibold tracking-wide ${
                      regStatus.type === "success" 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                        : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {regStatus.msg}
                  </motion.div>
                )}

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={submitting || regStatus.type === "success"}
                    className="w-full py-4 bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-black font-extrabold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 active:scale-[0.99] transition-all shadow-lg shadow-emerald-500/10 group"
                  >
                    {submitting ? (
                      <>Processing Uplink... <Loader2 size={16} className="animate-spin" /></>
                    ) : regStatus.type === "success" ? (
                      "Securely Registered ✓"
                    ) : (
                      <>
                        Complete Registration 
                        <Zap size={14} className="group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}