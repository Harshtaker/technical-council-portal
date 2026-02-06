"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShieldCheck, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Gallery", href: "/gallery" },
    { name: "Events", href: "/events" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/95 md:bg-[#020617]/90 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* 📟 Brand Area */}
        <Link href="/" className="flex items-center gap-5 group">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-14 md:w-16 md:h-16 p-0.5 rounded-full bg-linear-to-tr from-emerald-500/40 to-blue-500/40 group-hover:from-emerald-400 group-hover:to-blue-400 transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] overflow-hidden"
          >
            {/* White Circular Frame with absolute centering and overflow hidden */}
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
              <Image 
                src="/logo.png" 
                alt="Technical Council Logo" 
                width={48} 
                height={48} 
                className="object-contain rounded-full"
                priority 
              />
            </div>
          </motion.div>

          <div className="flex flex-col">
            <span className="font-black text-white text-lg md:text-2xl tracking-tighter uppercase leading-none group-hover:text-emerald-400 transition-colors">
              Technical <span className="text-emerald-500 group-hover:text-white transition-colors">Council</span>
            </span>
            <span className="text-[8px] md:text-[10px] font-mono text-slate-500 tracking-[0.4em] uppercase mt-1 md:mt-1.5">
              REC_Ambedkar_Nagar
            </span>
          </div>
        </Link>

        {/* 💻 Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          <div className="flex items-center gap-10 border-r border-white/10 pr-10 font-mono">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-[14px] uppercase tracking-[0.25em] transition-all hover:text-emerald-400 relative group/link ${
                  pathname === link.href ? "text-emerald-500 font-bold" : "text-slate-400"
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.span 
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 w-full h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" 
                  />
                )}
              </Link>
            ))}
          </div>

          <Link 
            href="/admin" 
            className="group flex items-center gap-3 px-6 py-3 bg-slate-900/80 border border-white/10 text-white rounded-2xl text-[11px] font-mono tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-500 shadow-2xl"
          >
            <ShieldCheck size={14} className="text-emerald-500 group-hover:text-black transition-colors" />
            ADMIN_LOGIN
          </Link>
        </div>

        {/* 📱 Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2 hover:bg-white/5 rounded-full transition-colors relative z-70"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 w-full h-screen bg-[#020617] md:hidden z-60 px-8 flex flex-col justify-center"
          >
            {/* Close button inside menu for safety */}
            <button 
              className="absolute top-8 right-8 text-white p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            
            <div className="flex flex-col gap-8">
              <p className="text-emerald-500 font-mono text-[10px] tracking-widest uppercase mb-4 opacity-50">{">"} Navigation_Menu</p>
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-5xl font-black uppercase tracking-tighter transition-colors ${
                    pathname === link.href ? "text-emerald-500" : "text-white hover:text-emerald-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-10 mt-6 border-t border-white/10">
                <Link 
                  href="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-4 w-full py-6 bg-emerald-500 text-black rounded-3xl text-sm font-mono font-black tracking-widest hover:bg-white transition-all shadow-lg shadow-emerald-500/20"
                >
                  <ShieldCheck size={20} /> ADMIN_LOGIN
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}