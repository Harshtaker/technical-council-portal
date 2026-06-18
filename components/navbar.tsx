"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
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
    /* ✅ FIXED: Replaced hardcoded bg-[#020617] with transparent adaptive theme colors */
    <nav className="fixed top-0 left-0 right-0 z-50 bg-theme-bg/85 backdrop-blur-2xl border-b border-theme-grid/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* 📟 Brand Area */}
        <Link href="/" className="flex items-center gap-5 group">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-14 md:w-16 md:h-16 p-0.5 rounded-full bg-linear-to-tr from-emerald-500/40 to-blue-500/40 group-hover:from-emerald-400 group-hover:to-blue-400 transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] overflow-hidden"
          >
            {/* ✅ FIXED: Swapped pure bg-white container with automated inversion contrast frame */}
            <div className="w-full h-full bg-theme-text/5 dark:bg-white rounded-full flex items-center justify-center overflow-hidden p-1 backdrop-blur-md">
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
            {/* ✅ FIXED: Mapped text to theme token */}
            <span className="font-black text-theme-text text-lg md:text-2xl tracking-tighter uppercase leading-none group-hover:text-emerald-500 transition-colors">
              Technical <span className="text-emerald-500 group-hover:text-theme-text transition-colors">Council</span>
            </span>
            <span className="text-[8px] md:text-[10px] font-mono text-council-slate tracking-[0.4em] uppercase mt-1 md:mt-1.5">
              REC_Ambedkar_Nagar
            </span>
          </div>
        </Link>

        {/* 💻 Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          {/* ✅ FIXED: Border lines map cleanly to theme variables */}
          <div className="flex items-center gap-10 border-r border-theme-grid/20 pr-10 font-mono">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-[14px] uppercase tracking-[0.25em] transition-all hover:text-emerald-500 relative group/link ${
                  pathname === link.href ? "text-emerald-500 font-bold" : "text-council-slate"
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

          {/* ✅ FIXED: Translucent modern button container */}
          <Link 
            href="/admin" 
            className="group flex items-center gap-3 px-6 py-3 bg-theme-text/5 dark:bg-slate-900/80 border border-theme-grid/20 text-theme-text rounded-2xl text-[11px] font-mono tracking-widest hover:bg-theme-text hover:text-theme-bg hover:border-theme-text transition-all duration-500 shadow-2xl"
          >
            <ShieldCheck size={14} className="text-emerald-500 group-hover:text-theme-bg transition-colors" />
            ADMIN_LOGIN
          </Link>
        </div>

        {/* 📱 Mobile Toggle */}
        <button 
          className="md:hidden text-theme-text p-2 hover:bg-theme-text/5 rounded-full transition-colors relative z-70"
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
            className="fixed inset-0 w-full h-screen bg-theme-bg md:hidden z-60 px-8 flex flex-col justify-center"
          >
            <button 
              className="absolute top-8 right-8 text-theme-text p-2"
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
                    pathname === link.href ? "text-emerald-500" : "text-theme-text hover:text-emerald-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-10 mt-6 border-t border-theme-grid/20">
                <Link 
                  href="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-4 w-full py-6 bg-emerald-500 text-black rounded-3xl text-sm font-mono font-black tracking-widest hover:bg-theme-text hover:text-theme-bg transition-all shadow-lg shadow-emerald-500/20"
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