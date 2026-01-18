"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  X,
  HelpCircle,
  AlignLeft,
  Type,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import AdminButton from "@/components/admin/AdminButton";

type FAQ = {
  _id: string;
  question: string;
  answer: string;
};

const emptyForm = {
  question: "",
  answer: "",
};

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // Form State
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* ---------------- FETCH ---------------- */
  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/faq");
      const data = Array.isArray(res) ? res : res.data || [];
      setFaqs(data);
    } catch {
      toast({ title: "Failed to load FAQs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
    );
  }, [faqs, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (f: FAQ) => {
    setEditingId(f._id);
    setForm({
      question: f.question,
      answer: f.answer,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.question.trim() || !form.answer.trim()) {
      return toast({
        title: "Question and answer are required",
        variant: "destructive",
      });
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const updated = await apiFetch(`/faq/${editingId}`, {
          method: "PUT",
          data: form,
        });
        setFaqs(faqs.map((f) => (f._id === editingId ? updated : f)));
        toast({ title: "FAQ updated" });
      } else {
        const created = await apiFetch("/faq", {
          method: "POST",
          data: form,
        });
        setFaqs([created, ...faqs]);
        toast({ title: "FAQ added" });
      }
      handleCloseForm();
    } catch {
      toast({ title: "Failed to save FAQ", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    setRemovingId(id);
    try {
      await apiFetch(`/faq/${id}`, { method: "DELETE" });
      setFaqs(faqs.filter((f) => f._id !== id));
      toast({ title: "FAQ deleted" });
    } catch {
      toast({ title: "Failed to delete FAQ", variant: "destructive" });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage frequently asked questions shown on the website.
          </p>
        </div>
        <AdminButton onClick={() => setShowForm(true)} disabled={showForm}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add FAQ
        </AdminButton>
      </div>

      {/* FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-gray-200 rounded-[10px] shadow-md mb-8">
              <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
                <h2 className="font-semibold flex items-center gap-2">
                  {editingId ? <Pencil className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  {editingId ? "Edit FAQ" : "Add FAQ"}
                </h2>
                <AdminButton variant="ghost" onClick={handleCloseForm}>
                  <X className="w-5 h-5" />
                </AdminButton>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-medium flex items-center gap-1 mb-1">
                    <Type className="w-3.5 h-3.5" /> Question
                  </label>
                  <input
                    name="question"
                    value={form.question}
                    onChange={handleChange}
                    className="w-full border rounded-[10px] px-3 py-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-1 mb-1">
                    <AlignLeft className="w-3.5 h-3.5" /> Answer
                  </label>
                  <textarea
                    name="answer"
                    value={form.answer}
                    onChange={handleChange}
                    className="w-full h-28 border rounded-[10px] px-3 py-2.5 resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 border-t pt-4">
                  <AdminButton variant="ghost" type="button" onClick={handleCloseForm}>
                    Cancel
                  </AdminButton>
                  <AdminButton type="submit" loading={submitting}>
                    Save FAQ
                  </AdminButton>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-[10px] border shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-[10px] border"
          />
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white border rounded-[10px] animate-pulse" />
          ))}
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-[10px] border border-dashed">
          <HelpCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No FAQs found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((f) => {
            const isDeleting = removingId === f._id;
            return (
              <div
                key={f._id}
                className="group bg-white p-5 rounded-[10px] border shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{f.question}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {f.answer}
                    </p>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleEdit(f)} className="icon-btn">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(f._id)}
                      disabled={isDeleting}
                      className="icon-btn text-red-500 border-red-500"
                    >
                      {isDeleting ? (
                        <Skeleton className="w-4 h-4 rounded-full" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
