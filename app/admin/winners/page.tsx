"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Search, 
  Grid, 
  List, 
  Loader2, 
  X, 
  Save, 
  ImageIcon, 
  Upload, 
  Trophy,
  Medal,
  School
} from "lucide-react";
import { apiFetch } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { IMAGE_URL } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface Winner {
  _id: string;
  team: string;
  event: string;
  position: string;
  school: string;
  category: string;
  description: string;
  image: string;
}

interface FormState {
  _id?: string;
  team: string;
  event: string;
  position: string;
  school: string;
  category: string;
  description: string;
}

export default function WinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form & File State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    team: "",
    event: "",
    position: "",
    school: "",
    category: "",
    description: "",
  });

  /* ---------------- FETCH DATA ---------------- */
  const fetchWinners = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/winners");
      setWinners(res);
    } catch {
      toast({ title: "Failed to load winners", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredWinners = useMemo(() => {
    return winners.filter(
      (w) =>
        w.team.toLowerCase().includes(search.toLowerCase()) ||
        w.event.toLowerCase().includes(search.toLowerCase()) ||
        w.school.toLowerCase().includes(search.toLowerCase())
    );
  }, [winners, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Image too large (max 5MB)", variant: "destructive" });
        return;
      }
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setForm({
      team: "",
      event: "",
      position: "",
      school: "",
      category: "",
      description: "",
    });
    setImageFile(null);
    setPreview(null);
  };

  const handleEdit = (winner: Winner) => {
    setForm({
      _id: winner._id,
      team: winner.team,
      event: winner.event,
      position: winner.position,
      school: winner.school,
      category: winner.category,
      description: winner.description,
    });
    setPreview(winner.image ? IMAGE_URL + winner.image : null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this winner?")) return;
    try {
      await apiFetch(`/winners`, { method: "DELETE", data: { id } });
      setWinners(winners.filter((w) => w._id !== id));
      toast({ title: "Winner deleted successfully" });
    } catch {
      toast({ title: "Failed to delete winner", variant: "destructive" });
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.team.trim()) return toast({ title: "Team name is required", variant: "destructive" });
    if (!form.position.trim()) return toast({ title: "Position is required", variant: "destructive" });
    if (!form._id && !imageFile) return toast({ title: "Image is required", variant: "destructive" });

    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "_id") data.append(key, value);
    });

    if (imageFile) data.append("image", imageFile);
    if (form._id) data.append("id", form._id);

    try {
      let res: Winner;
      if (form._id) {
        res = await apiFetch(`/winners`, { method: "PUT", data });
        setWinners(winners.map((w) => (w._id === form._id ? res : w)));
        toast({ title: "Winner updated successfully" });
      } else {
        res = await apiFetch("/winners", { method: "POST", data });
        setWinners([res, ...winners]);
        toast({ title: "Winner added successfully" });
      }
      handleCloseForm();
    } catch {
      toast({ title: "Failed to save winner", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Winners Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showcase winning teams, their positions, and achievements.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={showForm}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-[10px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Add Winner
        </button>
      </div>

      {/* FORM AREA */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-[10px] shadow-md border border-gray-200 overflow-hidden mb-8">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex justify-between items-center">
                <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  {form._id ? <Pencil className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  {form._id ? "Edit Winner" : "Add New Winner"}
                </h2>
                <button onClick={handleCloseForm} className="p-1 text-gray-400 hover:text-gray-600 rounded-[10px]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left Column: Inputs */}
                  <div className="md:col-span-2 space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Team Name</label>
                        <input
                          name="team"
                          value={form.team}
                          onChange={handleChange}
                          placeholder="e.g. RoboWarriors"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Name</label>
                        <input
                          name="event"
                          value={form.event}
                          onChange={handleChange}
                          placeholder="e.g. National Science Olympiad"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Position/Rank</label>
                        <input
                          name="position"
                          value={form.position}
                          onChange={handleChange}
                          placeholder="e.g. 1st Place / Gold Medal"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">School/Institution</label>
                        <input
                          name="school"
                          value={form.school}
                          onChange={handleChange}
                          placeholder="e.g. Springfield High"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                        <input
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          placeholder="e.g. Robotics, Coding"
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Brief details about the achievement..."
                        className="w-full border border-gray-300 rounded-[10px] px-3 py-2.5 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Right Column: Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Winner Image</label>
                    <label className="block border-2 border-dashed border-gray-300 rounded-[10px] p-4 cursor-pointer hover:bg-gray-50 transition-colors h-64 md:h-full max-h-[350px] relative group">
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                      
                      {preview ? (
                        <div className="w-full h-full flex items-center justify-center relative">
                          <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-[10px]" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]">
                            <span className="text-white text-sm font-medium flex items-center gap-2">
                              <Pencil className="w-4 h-4" /> Change
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                          <Upload className="w-10 h-10 opacity-50" />
                          <span className="text-sm font-medium">Upload Image</span>
                          <span className="text-xs text-gray-300 text-center">PNG, JPG up to 5MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-[10px] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-[10px] font-medium transition-colors disabled:opacity-70 shadow-sm"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {form._id ? "Update Winner" : "Save Winner"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[10px] border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search winners, events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-[10px] border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex bg-gray-100 p-1 rounded-[10px] border border-gray-200">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-[10px] transition-all ${
              view === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-[10px] transition-all ${
              view === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-[10px] overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-100"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded-[10px] w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded-[10px] w-full"></div>
                <div className="h-3 bg-gray-100 rounded-[10px] w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredWinners.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed border-gray-200">
          <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No winners found</p>
          <p className="text-sm text-gray-400">Try creating a new one or adjust your search.</p>
        </div>
      ) : view === "grid" ? (
        // GRID VIEW
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWinners.map((winner) => (
            <div
              key={winner._id}
              className="group bg-white rounded-[10px] border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {winner.image ? (
                  <img
                    src={IMAGE_URL + winner.image}
                    alt={winner.team}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-[10px] text-xs font-bold shadow-sm border border-yellow-200 flex items-center gap-1">
                    <Medal className="w-3 h-3" />
                    {winner.position}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-[10px] border border-blue-100">
                    {winner.category}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{winner.team}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <School className="w-3 h-3" /> {winner.school}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                  {winner.description}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">{winner.event}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(winner)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-[10px] transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(winner._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-[10px] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // LIST VIEW
        <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm divide-y divide-gray-100">
          {filteredWinners.map((winner) => (
            <div
              key={winner._id}
              className="p-4 flex flex-col md:flex-row md:items-center gap-6 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-full md:w-24 h-24 shrink-0 bg-gray-100 rounded-[10px] overflow-hidden border border-gray-200">
                {winner.image ? (
                  <img
                    src={IMAGE_URL + winner.image}
                    alt={winner.team}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{winner.team}</h3>
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-[10px] border border-yellow-200 font-bold flex items-center gap-1">
                    <Medal className="w-3 h-3" /> {winner.position}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                  <span className="flex items-center gap-1"><School className="w-3 h-3" /> {winner.school}</span>
                  <span className="text-gray-300">|</span>
                  <span>{winner.event}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{winner.description}</p>
              </div>
              <div className="flex gap-2 self-start md:self-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(winner)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-[10px] transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(winner._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[10px] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}