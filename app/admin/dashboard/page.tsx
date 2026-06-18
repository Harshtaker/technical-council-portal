"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { 
  Megaphone, Calendar, Users, LogOut, Image as ImageIcon,
  Trash2, Send, Plus, RefreshCcw, Globe, Shield, Upload, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"notices" | "events" | "members" | "media">("notices");
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const [notice, setNotice] = useState({ content: "", link_url: "", is_active: true });
  
  const [event, setEvent] = useState({ 
    title: "", 
    event_date: "", 
    description: "", 
    image_url: "", 
    location: "", 
    reg_link: "", 
    summary_text: "",
    is_registration_open: false,
    custom_fields: [] as { label: string; type: string; required: boolean }[]
  });
  
  const [member, setMember] = useState({ name: "", role: "", rank: 1, image_url: "", category: "student" });

  // 🌍 CLIENT RECONCILIATION: Runtime dynamic layout tab tab icon handler
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

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      const currentTab = activeTab as string;
      if (currentTab === "media") {
        const { data, error } = await supabase.storage.from('Gallery').list('EVENT PHOTOS');
        if (error) throw error;
        if (data) setDataList(data.filter(f => f.name !== ".emptyFolderPlaceholder"));
      } else {
        const { data, error } = await supabase.from(activeTab as any).select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (data) setDataList(data);
      }
    } catch (err) {
      console.error("Fetch_Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSystemUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'media' | 'member' | 'event') => {
    try {
      setUploading(true);
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const bucket = 'Gallery'; 
      let folder = '';
      if (type === 'media')  folder = 'EVENT PHOTOS'; 
      if (type === 'event')  folder = 'EVENT';        
      if (type === 'member') folder = 'TEAM_PROFILE'; 

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
        if (uploadError) throw uploadError;

        if (type !== 'media') {
          const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
          if (type === 'member') setMember(prev => ({ ...prev, image_url: publicUrl }));
          if (type === 'event') setEvent(prev => ({ ...prev, image_url: publicUrl }));
        }
      }
      alert("Upload Successful");
      if((activeTab as string) === "media") fetchData();
    } catch (error: any) {
      alert("Upload Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = activeTab === "notices" ? notice : activeTab === "events" ? event : member;
    const { error } = await supabase.from(activeTab as any).insert([payload]);
    if (!error) {
      alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Published Successfully`);
      fetchData();
      setNotice({ content: "", link_url: "", is_active: true });
      setEvent({ 
        title: "", 
        event_date: "", 
        description: "", 
        image_url: "", 
        location: "", 
        reg_link: "", 
        summary_text: "",
        is_registration_open: false,
        custom_fields: []
      });
      setMember({ name: "", role: "", rank: 1, image_url: "", category: "student" });
    } else {
      alert("Database Error: " + error.message);
    }
  };

  const handleDelete = async (id: string, fileName?: string) => {
    if (confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      try {
        if ((activeTab as string) === "media" && fileName) {
          await supabase.storage.from('Gallery').remove([`EVENT PHOTOS/${fileName}`]);
        } 
        else {
          const { data: itemToDelete } = await supabase
            .from(activeTab as any)
            .select("image_url")
            .eq("id", id)
            .single();

          if (itemToDelete?.image_url) {
            const fileNameFromUrl = itemToDelete.image_url.split('/').pop();
            const folder = activeTab === 'members' ? 'TEAM_PROFILE' : 'EVENT';
            
            await supabase.storage.from('Gallery').remove([`${folder}/${fileNameFromUrl}`]);
          }

          await supabase.from(activeTab as any).delete().eq("id", id);
        }

        fetchData();
      } catch (error) {
        console.error("Deletion Error:", error);
      }
    }
  };

  const addDynamicField = () => {
    setEvent(prev => ({
      ...prev,
      custom_fields: [...prev.custom_fields, { label: "", type: "text", required: true }]
    }));
  };

  const removeDynamicField = (index: number) => {
    setEvent(prev => ({
      ...prev,
      custom_fields: prev.custom_fields.filter((_, i) => i !== index)
    }));
  };

  const updateDynamicField = (index: number, key: "label" | "type" | "required", value: any) => {
    setEvent(prev => {
      const updated = [...prev.custom_fields];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, custom_fields: updated };
    });
  };

  return (
    /* ✅ FIXED: Swapped static bg-#020617 codes with custom responsive token references */
    <main className="min-h-screen text-theme-text bg-theme-bg font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* BACKGROUND MATRIX PATTERN */}
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* STICKY CONTROL HEADER */}
      <nav className="relative z-50 border-b border-theme-grid/20 bg-theme-bg/80 backdrop-blur-xl p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white shrink-0"><Shield size={18} /></div>
            <h1 className="text-theme-text font-bold tracking-tight text-sm md:text-lg">College Council Management System</h1>
          </div>
          <button 
            onClick={async () => { await supabase.auth.signOut(); router.push("/admin"); }} 
            className="text-council-slate hover:text-red-500 text-[10px] font-semibold uppercase border border-theme-grid/20 hover:border-red-500/30 px-3 py-2 rounded-lg transition-all"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-12 flex flex-col lg:grid lg:grid-cols-4 gap-8 pb-16">
        
        {/* APP CONTROLS SWITCH PANEL */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {[
            { id: "notices", label: "Notice Board", icon: Megaphone },
            { id: "events", label: "Campus Events", icon: Calendar },
            { id: "members", label: "Council Members", icon: Users },
            { id: "media", label: "Photo Gallery", icon: ImageIcon }
          ].map((t) => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id as any)} 
              className={`p-4 rounded-xl border text-xs md:text-sm font-semibold flex items-center gap-4 transition-all ${
                activeTab === t.id 
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-900/20" 
                  : "bg-theme-text/5 border-theme-grid/10 hover:bg-theme-text/10"
              }`}
            >
              <t.icon size={18}/> {t.label}
            </button>
          ))}
        </div>

        {/* ACTIVE MODULE CONTAINER VIEW */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-theme-text/5 border border-theme-grid/10 p-6 md:p-8 rounded-3xl backdrop-blur-md">
            <h2 className="text-theme-text font-bold text-xl mb-6 flex items-center gap-3">
              <Plus size={22} className="text-emerald-500" /> 
              {activeTab === "media" ? "Upload Gallery Photos" : `Create New ${activeTab.slice(0, -1)}`}
            </h2>

            {(activeTab as string) === "media" ? (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-theme-grid/20 rounded-2xl bg-theme-text/2 hover:border-emerald-500/50 transition-all">
                <input type="file" id="bulk-media" multiple hidden onChange={(e) => handleSystemUpload(e, 'media')} disabled={uploading} accept="image/*" />
                <label htmlFor="bulk-media" className="cursor-pointer flex flex-col items-center gap-4 group">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    {uploading ? <RefreshCcw className="animate-spin" /> : <Upload size={28} />}
                  </div>
                  <div className="text-center">
                    <p className="text-theme-text font-semibold text-sm">Click to select files</p>
                    <p className="text-council-slate text-xs mt-1 font-medium italic">Photos will be added to the public gallery</p>
                  </div>
                </label>
              </div>
            ) : (
              <form onSubmit={handleAdd} className="space-y-5">
                {activeTab === "notices" && (
                  <div className="space-y-4">
                    <textarea className="w-full bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-theme-text placeholder:text-council-slate/40 outline-none focus:border-emerald-500/50 min-h-30" placeholder="Enter notice description..." value={notice.content} onChange={(e)=>setNotice({...notice, content: e.target.value})} required />
                    <input className="w-full bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-theme-text placeholder:text-council-slate/40 outline-none focus:border-emerald-500/50" placeholder="Optional Link" value={notice.link_url} onChange={(e)=>setNotice({...notice, link_url: e.target.value})} />
                  </div>
                )}

                {activeTab === "events" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-theme-text placeholder:text-council-slate/40 outline-none focus:border-emerald-500/50" placeholder="Event Title" value={event.title} onChange={(e)=>setEvent({...event, title: e.target.value})} required />
                    <input type="date" className="bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-theme-text outline-none focus:border-emerald-500/50" value={event.event_date} onChange={(e)=>setEvent({...event, event_date: e.target.value})} required />
                    <div className="flex gap-2">
                      <input className="flex-1 bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-xs text-council-slate italic outline-none" placeholder="Upload Banner Image" value={event.image_url} readOnly />
                      <label className="p-4 bg-emerald-500/10 text-emerald-500 rounded-xl cursor-pointer hover:bg-emerald-600 hover:text-white transition-all">
                        <Upload size={18} /><input type="file" hidden accept="image/*" onChange={(e) => handleSystemUpload(e, 'event')} />
                      </label>
                    </div>
                    <input className="bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-theme-text placeholder:text-council-slate/40 outline-none focus:border-emerald-500/50" placeholder="Location" value={event.location} onChange={(e)=>setEvent({...event, location: e.target.value})} />
                    <input className="bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-theme-text placeholder:text-council-slate/40 outline-none focus:border-emerald-500/50" placeholder="External Registration Link (Optional)" value={event.reg_link} onChange={(e)=>setEvent({...event, reg_link: e.target.value})} />
                    
                    <div className="bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-theme-text/80">Open In-House Portal Registrations</span>
                      <input 
                        type="checkbox" 
                        checked={event.is_registration_open} 
                        onChange={(e) => setEvent({ ...event, is_registration_open: e.target.checked })}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    <textarea className="md:col-span-2 bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-theme-text placeholder:text-council-slate/40 outline-none focus:border-emerald-500/50 min-h-24" placeholder="Event Summary & Top Performers " value={event.summary_text} onChange={(e)=>setEvent({...event, summary_text: e.target.value})} />
                    <textarea className="md:col-span-2 bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-theme-text placeholder:text-council-slate/40 outline-none focus:border-emerald-500/50 min-h-32" placeholder="Full Event Description..." value={event.description} onChange={(e)=>setEvent({...event, description: e.target.value})} />
                  
                    {event.is_registration_open && (
                      <div className="md:col-span-2 border border-dashed border-theme-grid/20 rounded-2xl p-5 bg-theme-text/2 space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">Custom Form Fields Creator</h4>
                            <p className="text-[11px] text-council-slate font-medium">Add required inputs for the registration sheet data model</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={addDynamicField}
                            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2"
                          >
                            <Plus size={14} /> Add Input
                          </button>
                        </div>

                        {event.custom_fields.length === 0 ? (
                          <p className="text-xs text-council-slate/60 italic py-4 text-center">No custom inputs mapped. Add fields to render the terminal form view.</p>
                        ) : (
                          <div className="space-y-3">
                            {event.custom_fields.map((field, index) => (
                              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-theme-bg/60 p-3 rounded-xl border border-theme-grid/10">
                                <input 
                                  type="text" 
                                  placeholder="Question / Label (e.g., Roll Number)" 
                                  value={field.label}
                                  required
                                  onChange={(e) => updateDynamicField(index, "label", e.target.value)}
                                  className="flex-1 bg-theme-bg border border-theme-grid/10 rounded-lg p-2.5 text-xs text-theme-text outline-none focus:border-emerald-500/40"
                                />
                                <div className="flex items-center justify-between gap-4 grow sm:grow-0">
                                  <select
                                    value={field.type}
                                    onChange={(e) => updateDynamicField(index, "type", e.target.value)}
                                    className="bg-theme-bg border border-theme-grid/10 rounded-lg p-2.5 text-xs text-theme-text outline-none cursor-pointer"
                                  >
                                    <option value="text" className="bg-theme-bg text-theme-text">Text / String</option>
                                    <option value="number" className="bg-theme-bg text-theme-text">Number</option>
                                    <option value="email" className="bg-theme-bg text-theme-text">Email</option>
                                  </select>
                                  <label className="flex items-center gap-2 text-xs text-council-slate font-medium cursor-pointer select-none">
                                    <input 
                                      type="checkbox" 
                                      checked={field.required}
                                      onChange={(e) => updateDynamicField(index, "required", e.target.checked)}
                                      className="accent-emerald-500 w-3.5 h-3.5"
                                    /> Required
                                  </label>
                                  <button 
                                    type="button" 
                                    onClick={() => removeDynamicField(index)}
                                    className="p-2 text-council-slate hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "members" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-theme-text placeholder:text-council-slate/40 outline-none focus:border-emerald-500/50" placeholder="Full Name" value={member.name} onChange={(e)=>setMember({...member, name: e.target.value})} required />
                    <input className="bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-theme-text placeholder:text-council-slate/40 outline-none focus:border-emerald-500/50" placeholder="Designation" value={member.role} onChange={(e)=>setMember({...member, role: e.target.value})} required />
                    <div className="flex gap-2">
                      <input className="flex-1 bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-xs text-council-slate italic outline-none" placeholder="Upload Portrait" value={member.image_url} readOnly />
                      <label className="p-4 bg-emerald-500/10 text-emerald-500 rounded-xl cursor-pointer hover:bg-emerald-600 hover:text-white transition-all">
                        <Upload size={18} /><input type="file" hidden accept="image/*" onChange={(e) => handleSystemUpload(e, 'member')} />
                      </label>
                    </div>
                    <input 
                      type="number" 
                      className="bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-theme-text outline-none focus:border-emerald-500/50" 
                      placeholder="Display Rank" 
                      value={isNaN(member.rank) ? "" : member.rank} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setMember({ ...member, rank: val === "" ? NaN : parseInt(val) });
                      }} 
                    />
                    <select 
                      className="bg-theme-bg/50 border border-theme-grid/10 rounded-xl p-4 text-theme-text outline-none focus:border-emerald-500/50 cursor-pointer" 
                      value={member.category} 
                      onChange={(e)=>setMember({...member, category: e.target.value})}
                    >
                      <option value="student" className="bg-theme-bg text-theme-text">Student</option>
                      <option value="administration" className="bg-theme-bg text-theme-text">Administration</option>
                    </select>
                  </div>
                )}

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/10 transition-all">
                  Publish to Live Site <Send size={16}/>
                </button>
              </form>
            )}
          </div>

          {/* SYSTEM DATA FEED REGISTRY PANEL */}
          <div className="bg-theme-text/5 border border-theme-grid/10 rounded-3xl overflow-hidden backdrop-blur-md">
             <div className="p-5 bg-theme-text/2 border-b border-theme-grid/10 flex justify-between items-center text-council-slate">
                <div className="flex items-center gap-3"><Globe size={16} /><h3 className="text-xs font-bold uppercase tracking-wider">Current Registry</h3></div>
                <button onClick={fetchData} className={`text-emerald-500 hover:text-emerald-400 ${loading ? 'animate-spin' : ''}`}><RefreshCcw size={16}/></button>
             </div>
             <div className="divide-y divide-theme-grid/10 max-h-125 overflow-y-auto">
                <AnimatePresence>
                {dataList.map((item) => (
                    <motion.div key={item.id || item.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 flex items-center justify-between hover:bg-theme-text/5 transition-all group gap-4">
                        <div className="space-y-1 min-w-0">
                            <p className="text-theme-text font-semibold text-sm md:text-base truncate">{item.content || item.title || item.name}</p>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-council-slate/60 font-medium">ID: {(item.id || item.name).slice(0,8)}</span>
                                <span className="text-[10px] text-emerald-600 font-bold uppercase">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Storage'}</span>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(item.id, item.name)} className="p-3 text-council-slate hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shrink-0"><Trash2 size={18} /></button>
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