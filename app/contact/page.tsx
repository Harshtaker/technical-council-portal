"use client";

import { useEffect } from "react";
import { 
  Mail, Phone, MapPin, Send, MessageSquare,
  Instagram, Linkedin, Github, Youtube 
} from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  
  // 🌍 CLIENT RECONCILIATION: Hotfix favicon trigger mechanism for system syncing
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

    updateFavicon();
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    matcher.addEventListener("change", updateFavicon);
    return () => matcher.removeEventListener("change", updateFavicon);
  }, []);

  return (
    /* ✅ FIXED: Bound root background canvas to responsive design tokens */
    <main className="relative min-h-screen text-theme-text bg-theme-bg overflow-hidden font-sans transition-colors duration-300">
      
      {/* 🌌 HUD BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b98105_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* 📟 HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-4 border-emerald-500 pl-6"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-theme-text tracking-tight leading-none uppercase">
              Get in <span className="text-emerald-500">Touch</span>
            </h1>
            <p className="text-council-slate mt-3 text-sm md:text-base font-medium tracking-wide">
              Direct Uplink to the Technical Council Executive Lead
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          
          {/* 📩 CONTACT FORM: Functional via Web3Forms */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-theme-text/5 border border-theme-grid/10 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-xl"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500" />

            <h2 className="text-xl font-bold text-theme-text mb-8 flex items-center gap-3 uppercase tracking-wider">
              <MessageSquare className="text-emerald-500" size={24} /> Send Message
            </h2>
            
            <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6">
              <input type="hidden" name="access_key" value="31e0e3b9-e837-4ece-9a12-e857d2297897" />
              <input type="hidden" name="from_name" value="Council Web Uplink" />
              <input type="checkbox" name="botcheck" className="hidden" />
              <input type="hidden" name="_next" value="https://techcouncil.recabn.ac.in/contact" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">User_Name</label>
                  {/* ✅ FIXED: Remapped static input layers to work with canvas background variables */}
                  <input name="name" type="text" required placeholder="John Doe" className="w-full px-5 py-4 bg-theme-bg/50 border border-theme-grid/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-theme-text placeholder:text-council-slate/40 font-sans text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">User_Email</label>
                  <input name="email" type="email" required placeholder="john@domain.com" className="w-full px-5 py-4 bg-theme-bg/50 border border-theme-grid/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-theme-text placeholder:text-council-slate/40 font-sans text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Subject</label>
                <input name="subject" type="text" required placeholder="Inquiry Type" className="w-full px-5 py-4 bg-theme-bg/50 border border-theme-grid/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-theme-text placeholder:text-council-slate/40 font-sans text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Message</label>
                <textarea name="message" rows={4} required placeholder="How can we help you?" className="w-full px-5 py-4 bg-theme-bg/50 border border-theme-grid/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-theme-text placeholder:text-council-slate/40 resize-none font-sans text-sm"></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-emerald-500 text-white dark:text-black rounded-xl font-extrabold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 active:scale-[0.99] transition-all group shadow-lg shadow-emerald-500/10">
                Send <Send size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          {/* 📍 CONTACT DETAILS, SOCIAL LINKS & LIVE MAP */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-4">
              {[
                { icon: <Mail size={20}/>, title: "Protocol_Email", detail: "technicalcouncil@recabn.ac.in" },
                { icon: <Phone size={20}/>, title: "Phone", detail: "+91 79052 21160" },
                { icon: <MapPin size={20}/>, title: "Location", detail: "Student Activity Center, REC Ambedkar Nagar" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-5 bg-theme-text/5 rounded-2xl border border-theme-grid/10 hover:border-emerald-500/20 transition-all group shadow-sm">
                  <div className="w-11 h-11 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-black transition-all shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">{item.title}</h3>
                    <p className="text-sm font-semibold text-theme-text tracking-wide mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 🌐 SOCIAL MEDIA STRIP */}
            <div className="p-5 bg-theme-text/5 rounded-2xl border border-theme-grid/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Digital_Handles</h3>
                <p className="text-xs text-council-slate mt-0.5 font-medium">Connect with Council's official networks</p>
              </div>
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/technicalcouncil_recabn?igsh=MTQyb3ZqazMxMnRoMg==" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-theme-bg border border-theme-grid/10 rounded-xl text-council-slate hover:text-pink-500 hover:border-pink-500/20 transition-all">
                  <Instagram size={18} />
                </a>
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-theme-bg border border-theme-grid/10 rounded-xl text-council-slate hover:text-blue-500 hover:border-blue-500/20 transition-all">
                  <Linkedin size={18} />
                </a>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-theme-bg border border-theme-grid/10 rounded-xl text-council-slate hover:text-theme-text hover:border-theme-text/20 transition-all">
                  <Github size={18} />
                </a>
                <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-theme-bg border border-theme-grid/10 rounded-xl text-council-slate hover:text-red-500 hover:border-red-500/20 transition-all">
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            {/* 🗺️ LIVE GOOGLE MAP: REC Ambedkar Nagar Campus */}
            <div className="flex-1 min-h-64 rounded-3xl overflow-hidden border border-theme-grid/20 grayscale dark:contrast-125 dark:brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700 shadow-xl">
              <iframe 
                src="https://maps.google.com/maps?q=Rajkiya%20Engineering%20College%20Ambedkar%20Nagar&t=&z=13&ie=UTF-8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}