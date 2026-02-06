"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Camera } from "lucide-react";
import { supabase } from "../../utils/supabase/client";

export default function GalleryPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const fetchFromFolder = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("Gallery")
        .list("EVENT PHOTOS", {
          limit: 100,
          sortBy: { column: "name", order: "desc" },
        });

      if (error) throw error;

      if (data) {
        const formatted = data
          .filter((file) => file.name !== ".emptyFolderPlaceholder")
          .map((file) => {
            const { data: { publicUrl } } = supabase.storage
              .from("Gallery")
              .getPublicUrl(`EVENT PHOTOS/${file.name}`);

            return {
              id: file.id,
              name: file.name.split(".")[0].replace(/_/g, " "),
              path: publicUrl,
              isVideo: file.name.toLowerCase().endsWith(".mp4"),
            };
          });
        setMedia(formatted);
      }
    } catch (err) {
      console.warn("Storage_Sync_Notice: Check folder paths.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFromFolder();
  }, []);

  const nextMedia = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % media.length : null));
  }, [media.length]);

  const prevMedia = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + media.length) % media.length : null));
  }, [media.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "ArrowLeft") prevMedia();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, nextMedia, prevMedia]);

  return (
    <main className="relative min-h-screen bg-[#020617] overflow-hidden selection:bg-emerald-500/30">
      
      {/* 🌌 UNIFIED CYBER BACKGROUND */}
      <div className="fixed inset-0 z-0">
        {/* Animated Grid Layer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        
        {/* Floating Glowing Orbs */}
        <motion.div 
          animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-emerald-500/10 blur-[100px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-blue-500/10 blur-[100px] rounded-full" 
        />

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-size-[100%_4px] opacity-[0.04]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-6">
        
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="border-l-4 border-emerald-500 pl-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white leading-none">
              Visual <span className="text-emerald-500">Archives.</span>
            </h1>
            <p className="text-slate-500 font-mono mt-4 uppercase tracking-[0.3em] text-[10px]">
              System Logs & Technical Recap @ REC Ambedkar Nagar
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md shadow-2xl">
            <Camera size={18} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              {media.length} Data Entries Found
            </span>
          </div>
        </header>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="mt-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest">Retrieving_Visual_Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {media.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => setSelectedIndex(i)}
                className="relative aspect-4/5 cursor-pointer overflow-hidden rounded-3x1 bg-slate-900/40 border border-white/5 hover:border-emerald-500/50 transition-all duration-500 group shadow-xl backdrop-blur-sm"
              >
                {item.isVideo ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800/50">
                    <Play size={24} className="text-emerald-500" />
                  </div>
                ) : (
                  <>
                    <Image 
                      src={item.path} 
                      alt="Gallery Thumbnail" 
                      fill 
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500" />
                    <p className="absolute bottom-4 left-4 text-[8px] font-mono text-emerald-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 font-bold">
                      {item.name}
                    </p>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 🖼️ LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-999 bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            {/* Control Bar */}
            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10">
                <div className="flex flex-col">
                  <span className="text-emerald-500 font-mono text-[10px] tracking-widest uppercase font-bold">Node_Status: Active</span>
                  <span className="text-slate-500 font-mono text-[10px] tracking-widest uppercase">Entry {selectedIndex + 1} / {media.length}</span>
                </div>
                <button onClick={() => setSelectedIndex(null)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-emerald-500 group transition-all">
                  <X size={24} className="text-white group-hover:text-black" />
                </button>
            </div>

            <button onClick={prevMedia} className="absolute left-4 md:left-12 w-14 h-14 flex items-center justify-center bg-white/5 rounded-full hover:bg-emerald-500 hover:text-black transition-all z-10">
              <ChevronLeft size={32} />
            </button>
            <button onClick={nextMedia} className="absolute right-4 md:right-12 w-14 h-14 flex items-center justify-center bg-white/5 rounded-full hover:bg-emerald-500 hover:text-black transition-all z-10">
              <ChevronRight size={32} />
            </button>

            <div className="max-w-6xl w-full flex flex-col items-center">
              <motion.div 
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-[70vh] flex items-center justify-center"
              >
                {media[selectedIndex].isVideo ? (
                  <video src={media[selectedIndex].path} controls autoPlay className="max-h-full rounded-2xl shadow-2xl border border-white/10" />
                ) : (
                  <div className="relative w-full h-full">
                    <Image src={media[selectedIndex].path} alt="Preview" fill className="object-contain" priority />
                  </div>
                )}
              </motion.div>
              <h2 className="mt-12 text-2xl md:text-3xl font-black uppercase text-white tracking-tighter text-center">
                {media[selectedIndex].name}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}