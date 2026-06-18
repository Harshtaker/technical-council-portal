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
          limit: 1000,
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
              isVideo: /\.(mp4|webm|ogg|mov|m4v|3gp|heic)$/i.test(file.name),
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
    /* ✅ FIXED: Bound canvas to adaptive tokens to eliminate creepy dark patches */
    <main className="relative min-h-screen text-theme-text bg-theme-bg overflow-hidden font-sans transition-colors duration-300">
      
      {/* 🌌 INSTITUTIONAL BACKGROUND GRID */}
      {/* ✅ FIXED: Embedded the custom global grid pattern variable rule */}
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-40" />
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-emerald-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto pt-32 pb-20 px-6">
        
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-theme-text leading-none uppercase">
              Council <span className="text-emerald-500">Archives</span>
            </h1>
            <p className="text-council-slate mt-4 text-sm md:text-base font-medium">
              Official visual records and event media of Rajkiya Engineering College
            </p>
          </div>

          {/* ✅ FIXED: Translucent counter layout */}
          <div className="flex items-center gap-4 bg-theme-text/5 border border-theme-grid/20 px-6 py-3 rounded-2xl backdrop-blur-md">
            <Camera size={20} className="text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-theme-text/80">
              {media.length} Published Entries
            </span>
          </div>
        </header>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="mt-4 text-xs font-medium text-council-slate uppercase tracking-widest">Loading Media...</p>
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
                className="relative aspect-4/5 cursor-pointer overflow-hidden rounded-2xl bg-theme-text/5 border border-theme-grid/10 hover:border-emerald-500/50 transition-all duration-300 group shadow-lg"
              >
                {item.isVideo ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <video 
                      src={`${item.path}#t=0.1`}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-500"
                      muted
                      playsInline
                      preload="metadata"
                      onClick={(e) => e.preventDefault()}
                    >
                      <source src={`${item.path}#t=0.1`} type="video/mp4" />
                      <source src={`${item.path}#t=0.1`} type="video/quicktime" />
                    </video>
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-emerald-950/10 backdrop-blur-[1px] opacity-40 group-hover:opacity-0 transition-opacity duration-300" />

                    <div className="absolute w-10 h-10 bg-emerald-500/20 group-hover:bg-emerald-500 border border-emerald-500/40 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-emerald-500/10 z-10">
                      <Play size={16} className="text-white group-hover:text-black fill-current translate-x-0.5" />
                    </div>
                    <p className="absolute bottom-3 left-3 right-3 text-[10px] font-bold text-white uppercase tracking-wider truncate z-10">
                      {item.name}
                    </p>
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
      {/* ✅ FIXED: Standard fallback layer optimized for responsive lighting */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
                <div className="flex flex-col">
                  <span className="text-emerald-500 font-bold text-xs tracking-wider uppercase">Archival Viewer</span>
                  <span className="text-slate-400 font-medium text-[10px] uppercase">Record {selectedIndex + 1} of {media.length}</span>
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
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <video 
                      key={selectedIndex}
                      src={media[selectedIndex].path} 
                      controls 
                      autoPlay 
                      playsInline
                      preload="auto"
                      crossOrigin="anonymous"
                      className="w-full max-w-full max-h-[70vh] object-contain rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                      onError={(e) => {
                        const container = e.currentTarget.parentElement;
                        if (container && !container.querySelector('.fallback-link')) {
                          const alertDiv = document.createElement('div');
                          alertDiv.className = 'fallback-link absolute inset-0 bg-[#020617]/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-white/10 z-20 font-sans';
                          alertDiv.innerHTML = `
                            <p class="text-sm font-bold text-white uppercase tracking-wider mb-2">Browser Codec Mismatch</p>
                            <p class="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">This video container cannot be processed natively by your browser's default player codecs.</p>
                            <a href="${media[selectedIndex].path}" target="_blank" rel="noopener noreferrer" class="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/10">
                              Open Video In New Tab 🚀
                            </a>
                          `;
                          container.appendChild(alertDiv);
                        }
                      }}
                    >
                      <source src={media[selectedIndex].path} type="video/mp4" />
                      <source src={media[selectedIndex].path} type="video/quicktime" />
                    </video>
                  </div>
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