"use client";

import { Mail, Phone, MapPin, Send, MessageSquare, Fingerprint, Orbit } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen text-slate-300 bg-[#020617] selection:bg-emerald-500/30 overflow-hidden font-mono">
      
      {/* 🌌 HUD BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#10b98108_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10" />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-size-[100%_4px] opacity-[0.05]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* 📟 HEADER: Terminal Style */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-4 border-emerald-500 pl-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none">
              Get in <span className="text-emerald-500">Touch</span>
            </h1>
            <p className="text-slate-500 mt-3 text-sm md:text-base font-medium">
              Direct Uplink to the Technical Council Executive Lead
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          
          {/* 📩 CONTACT FORM: Functional via Web3Forms */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500" />

            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
              <MessageSquare className="text-emerald-500" size={24} /> Send Message
            </h2>
            
            {/* ACTION: Sends data to harshshukla0303@gmail.com */}
            <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6">
              {/* IMPORTANT: PASTE YOUR ACCESS KEY BELOW */}
              <input type="hidden" name="access_key" value="9dce9832-d6a9-4b23-95f3-1731462585cf" />
              <input type="hidden" name="from_name" value="Council Web Uplink" />
              <input type="checkbox" name="botcheck" className="hidden" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[14px] font-bold uppercase tracking-widest text-emerald-500/60 mb-2">User_Name</label>
                  <input name="name" type="text" required placeholder="John Doe" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-700 font-mono" />
                </div>
                <div>
                  <label className="block text-[14px] font-bold uppercase tracking-widest text-emerald-500/60 mb-2">User_Email</label>
                  <input name="email" type="email" required placeholder="john@domain.com" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-700 font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-[14px] font-bold uppercase tracking-widest text-emerald-500/60 mb-2">Subject</label>
                <input name="subject" type="text" required placeholder="Inquiry Type" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-700 font-mono" />
              </div>
              <div>
                <label className="block text-[14px] font-bold uppercase tracking-widest text-emerald-500/60 mb-2">Message</label>
                <textarea name="message" rows={4} required placeholder="How can we help you?" className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-white placeholder:text-slate-700 resize-none font-mono"></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-emerald-500 text-black rounded-xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-2 hover:bg-white transition-all group">
                Send <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          {/* 📍 CONTACT DETAILS & LIVE MAP */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-4">
              {[
                { icon: <Mail size={20}/>, title: "Protocol_Email", detail: "harshshukla0303@gmail.com" },
                { icon: <Phone size={20}/>, title: "Phone", detail: "+91 79052 21160" },
                { icon: <MapPin size={20}/>, title: "Location", detail: "Student Activity Center, REC Ambedkar Nagar" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-5 bg-white/2 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all group">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500/40">{item.title}</h3>
                    <p className="text-sm font-bold text-white tracking-tight">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 🗺️ LIVE GOOGLE MAP: Student Activity Center */}
            <div className="flex-1 min-h-75 rounded-3xl overflow-hidden border border-white/10 grayscale contrast-125 brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700 shadow-2xl">
  <iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3574.685324747761!2d82.5585863753556!3d26.369018476974864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399092c62e65b5eb%3A0x646cb416c979e872!2sRajkiya%20Engineering%20College%2C%20Ambedkar%20Nagar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
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