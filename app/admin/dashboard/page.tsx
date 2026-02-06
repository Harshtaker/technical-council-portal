"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { 
  Megaphone, Calendar, Users, LogOut, 
  Trash2, Send, Plus, RefreshCcw, LayoutDashboard, Link2, Globe, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"notices" | "events" | "members">("notices");
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [notice, setNotice] = useState({ content: "", link_url: "", is_active: true });
  const [event, setEvent] = useState({ title: "", event_date: "", description: "", image_url: "", location: "", reg_link: "", summary_link: "" });
  const [member, setMember] = useState({ name: "", role: "", rank: 1, image_url: "" });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    const { data } = await supabase.from(activeTab).select("*").order("created_at", { ascending: false });
    if (data) setDataList(data);
    setLoading(false);
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = activeTab === "notices" ? notice : activeTab === "events" ? event : member;
    
    const { error } = await supabase.from(activeTab).insert([payload]);
    if (!error) {
      alert(`${activeTab.toUpperCase()}_UPLINK_SUCCESSFUL`);
      fetchData();
      setNotice({ content: "", link_url: "", is_active: true });
      setEvent({ title: "", event_date: "", description: "", image_url: "", location: "", reg_link: "", summary_link: "" });
      setMember({ name: "", role: "", rank: 1, image_url: "" });
    } else {
      alert("SYSTEM_ERROR: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("TERMINATE_DATA_ROW? This action is irreversible.")) {
      const { error } = await supabase.from(activeTab).delete().eq("id", id);
      if (!error) fetchData();
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-300 font-mono selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* 📡 HEADER NAVIGATION - Fixed for Mobile */}
      <nav className="border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg text-black animate-pulse shrink-0">
              <Shield size={18} />
            </div>
            <h1 className="text-white font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm truncate">
              Council_OS <span className="hidden sm:inline">// Root_Access</span>
            </h1>
          </div>
          <button 
            onClick={async () => { await supabase.auth.signOut(); router.push("/admin"); }} 
            className="text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors border border-red-500/20 px-3 py-2 md:px-4 md:py-2 rounded-lg shrink-0"
          >
            Terminate
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-12 flex flex-col lg:grid lg:grid-cols-4 gap-8 md:gap-10">
        
        {/* 🕹️ SIDEBAR CONTROLS - Stacked on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          {[
            { id: "notices", label: "Notices", icon: Megaphone },
            { id: "events", label: "Events", icon: Calendar },
            { id: "members", label: "Team", icon: Users }
          ].map((t) => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id as any)} 
              className={`w-full p-4 md:p-5 rounded-2xl border text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center lg:justify-start gap-3 md:gap-4 transition-all ${activeTab === t.id ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "bg-white/5 border-white/5 hover:border-emerald-500/50"}`}
            >
              <t.icon size={16}/>
              {t.label}
            </button>
          ))}
        </div>

        {/* ⚡ MAIN COMMAND CONSOLE */}
        <div className="lg:col-span-3 space-y-8 md:space-y-12">
          
          <div className="bg-white/3 border border-white/10 p-6 md:p-10 rounded-4x1 md:rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            <h2 className="text-white font-black uppercase mb-8 md:mb-10 italic flex items-center gap-3 text-lg md:text-xl relative z-10">
                <Plus size={20} className="text-emerald-500" /> New_Entry::{activeTab}
            </h2>

            <form onSubmit={handleAdd} className="space-y-5 md:space-y-6 relative z-10">
              {activeTab === "notices" && (
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  <textarea 
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded-2xl p-5 md:p-6 text-white focus:border-emerald-500 outline-none min-h-30 md:min-h-37.5 transition-all text-sm" 
                    placeholder="Input broadcast message..." 
                    value={notice.content} 
                    onChange={(e)=>setNotice({...notice, content: e.target.value})} 
                    required 
                  />
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input className="w-full bg-[#0a0f1d] border border-white/10 rounded-2xl py-4 md:py-5 pl-12 pr-6 text-white focus:border-emerald-500 outline-none text-sm" placeholder="Direct_Link_URL (Optional)" value={notice.link_url} onChange={(e)=>setNotice({...notice, link_url: e.target.value})} />
                  </div>
                </div>
              )}

              {activeTab === "events" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <input className="bg-[#0a0f1d] border border-white/10 rounded-xl p-4 md:p-5 outline-none focus:border-emerald-500 text-sm" placeholder="Operation Title" value={event.title} onChange={(e)=>setEvent({...event, title: e.target.value})} required />
                  <input type="date" className="bg-[#0a0f1d] border border-white/10 rounded-xl p-4 md:p-5 outline-none focus:border-emerald-500 text-white text-sm" value={event.event_date} onChange={(e)=>setEvent({...event, event_date: e.target.value})} required />
                  <input className="bg-[#0a0f1d] border border-white/10 rounded-xl p-4 md:p-5 outline-none focus:border-emerald-500 text-sm" placeholder="Image_Bucket_URL" value={event.image_url} onChange={(e)=>setEvent({...event, image_url: e.target.value})} />
                  <input className="bg-[#0a0f1d] border border-white/10 rounded-xl p-4 md:p-5 outline-none focus:border-emerald-500 text-sm" placeholder="Deployment_Location" value={event.location} onChange={(e)=>setEvent({...event, location: e.target.value})} />
                  <input className="bg-[#0a0f1d] border border-white/10 rounded-xl p-4 md:p-5 outline-none focus:border-emerald-500 text-sm" placeholder="Registration_Link" value={event.reg_link} onChange={(e)=>setEvent({...event, reg_link: e.target.value})} />
                  <input className="bg-[#0a0f1d] border border-white/10 rounded-xl p-4 md:p-5 outline-none focus:border-emerald-500 text-sm" placeholder="Post_Event_Summary_Link" value={event.summary_link} onChange={(e)=>setEvent({...event, summary_link: e.target.value})} />
                  <textarea className="md:col-span-2 bg-[#0a0f1d] border border-white/10 rounded-xl p-4 md:p-5 outline-none focus:border-emerald-500 min-h-25 text-sm" placeholder="Brief Description..." value={event.description} onChange={(e)=>setEvent({...event, description: e.target.value})} />
                </div>
              )}

              {activeTab === "members" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <input className="bg-[#0a0f1d] border border-white/10 rounded-xl p-4 md:p-5 outline-none focus:border-emerald-500 text-sm" placeholder="Personnel Name" value={member.name} onChange={(e)=>setMember({...member, name: e.target.value})} required />
                  <input className="bg-[#0a0f1d] border border-white/10 rounded-xl p-4 md:p-5 outline-none focus:border-emerald-500 text-sm" placeholder="Assigned Role" value={member.role} onChange={(e)=>setMember({...member, role: e.target.value})} required />
                  <input className="bg-[#0a0f1d] border border-white/10 rounded-xl p-4 md:p-5 outline-none focus:border-emerald-500 text-sm" placeholder="Portrait_URL" value={member.image_url} onChange={(e)=>setMember({...member, image_url: e.target.value})} />
                  <input type="number" className="bg-[#0a0f1d] border border-white/10 rounded-xl p-4 md:p-5 outline-none focus:border-emerald-500 text-sm" placeholder="Rank (Tier 1-5)" value={member.rank} onChange={(e)=>setMember({...member, rank: parseInt(e.target.value)})} />
                </div>
              )}

              <button className="w-full bg-emerald-500 text-black py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-emerald-500/10">
                Execute_Deployment <Send size={16}/>
              </button>
            </form>
          </div>

          {/* 📋 LIVE DATA REGISTRY - Mobile Scrollable */}
          <div className="bg-white/2 border border-white/5 rounded-4x1 md:rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
             <div className="p-6 md:p-8 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3 text-slate-500">
                    <Globe size={14} />
                    <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">Live_Registry</h3>
                </div>
                <button onClick={fetchData} className={`text-emerald-500 ${loading ? 'animate-spin' : ''}`}>
                    <RefreshCcw size={14}/>
                </button>
             </div>
             
             <div className="divide-y divide-white/5 max-h-100 md:max-h-125 overflow-y-auto">
                <AnimatePresence>
                {dataList.map((item) => (
                    <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="p-5 md:p-8 flex items-center justify-between hover:bg-white/3 transition-all group gap-4"
                    >
                        <div className="space-y-1 min-w-0">
                            <p className="text-white font-bold text-sm md:text-lg uppercase tracking-tight truncate group-hover:text-emerald-400 transition-colors">
                                {item.content || item.title || item.name}
                            </p>
                            <div className="flex flex-wrap gap-2 md:gap-4">
                                <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest bg-white/5 px-2 py-1 rounded">ID: {item.id.slice(0,8)}</span>
                                <span className="text-[8px] text-emerald-500/40 uppercase font-black tracking-widest px-2 py-1">{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDelete(item.id)} 
                            className="p-3 md:p-4 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl md:rounded-2xl transition-all shrink-0"
                        >
                            <Trash2 size={18} />
                        </button>
                    </motion.div>
                ))}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}