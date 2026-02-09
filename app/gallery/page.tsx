"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Camera, ImageIcon } from "lucide-react";
import { supabase } from "../../utils/supabase/client";

export default function GalleryPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const fetchFromFolder = async () => {
    try {
      setLoading(true);
      // Fetching directly from the storage bucket folder
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
      console.warn("Gallery synchronization notice: Verify storage bucket paths.");
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
    <main className="relative min-h-screen bg-[#020617] overflow-hidden font-sans">
      
      {/* 🌌 INSTITUTIONAL BACKGROUND GRID */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-5" />
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-emerald-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-6">
        
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-none">
              Council <span className="text-emerald-500">Archives</span>
            </h1>
            <p className="text-slate-500 mt-4 text-sm md:text-base font-medium">
              Official visual records and event media of Rajkiya Engineering College
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
            <Camera size={20} className="text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {media.length} Published Entries
            </span>
          </div>
        </header>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="mt-4 text-xs font-medium text-slate-500 uppercase tracking-widest">Loading Media...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {media.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedIndex(i)}
                className="relative aspect-4/5 cursor-pointer overflow-hidden rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/50 transition-all duration-300 group shadow-lg"
              >
                {item.isVideo ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800/30">
                    <Play size={24} className="text-emerald-500" />
                  </div>
                ) : (
                  <>
                    <Image 
                      src={item.path} 
                      alt="Gallery Item" 
                      fill 
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" 
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <p className="absolute bottom-3 left-3 right-3 text-[10px] font-bold text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 truncate">
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
            className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            {/* Navigation Controls */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
                <div className="flex flex-col">
                  <span className="text-emerald-500 font-bold text-xs tracking-wider uppercase">Archival Viewer</span>
                  <span className="text-slate-500 font-medium text-[10px] uppercase">Record {selectedIndex + 1} of {media.length}</span>
                </div>
                <button onClick={() => setSelectedIndex(null)} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-red-500 transition-colors">
                  <X size={20} className="text-white" />
                </button>
            </div>

            <button onClick={prevMedia} className="absolute left-4 md:left-8 w-12 h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-emerald-600 transition-colors z-10">
              <ChevronLeft size={24} className="text-white" />
            </button>
            <button onClick={nextMedia} className="absolute right-4 md:right-8 w-12 h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-emerald-600 transition-colors z-10">
              <ChevronRight size={24} className="text-white" />
            </button>

            <div className="max-w-5xl w-full flex flex-col items-center">
              <motion.div 
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-[75vh] flex items-center justify-center"
              >
                {media[selectedIndex].isVideo ? (
                  <video src={media[selectedIndex].path} controls autoPlay className="max-h-full rounded-xl shadow-2xl" />
                ) : (
                  <div className="relative w-full h-full">
                    <Image 
                      src={media[selectedIndex].path} 
                      alt="View" 
                      fill 
                      className="object-contain" 
                      priority 
                      unoptimized
                    />
                  </div>
                )}
              </motion.div>
              <h2 className="mt-8 text-lg md:text-2xl font-bold text-white uppercase tracking-tight text-center">
                {media[selectedIndex].name}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}