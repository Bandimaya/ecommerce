"use client";

import { IMAGE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import AdminButton from "@/components/admin/AdminButton";

type Project = {
  _id: string;
  student: string;
  title: string;
  image: string;
  views: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const [form, setForm] = useState({
    student: "",
    title: "",
    views: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    setProjects(await res.json());
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    // validations
    if (file && file.size > 5 * 1024 * 1024) {
      alert("Image too large (max 5MB)");
      return;
    }

    setSubmitting(true);
    try {
      if (file) {
        const fd = new FormData();
        fd.append("student", form.student);
        fd.append("title", form.title);
        fd.append("views", form.views);
        fd.append("image", file);

        await fetch("/api/projects", {
          method: "POST",
          body: fd,
        });
      } else if (url) {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, image: url }),
        });
      }

      setForm({ student: "", title: "", views: "" });
      setUrl("");
      setFile(null);
      await fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const removeProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    setRemovingId(id);
    try {
      await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Student Projects</h1>

      {/* ADD */}
      <form onSubmit={addProject} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid md:grid-cols-3 gap-2">
          <input
            placeholder="Student Name"
            value={form.student}
            onChange={(e) =>
              setForm({ ...form, student: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Project Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Views (1.2k)"
            value={form.views}
            onChange={(e) =>
              setForm({ ...form, views: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-2"
        />

        <AdminButton type="submit" loading={submitting} className="mt-3 px-4 py-2 rounded">
          Add Project
        </AdminButton>
      </form>

      {/* LIST */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {projects.map((p) => (
          <div
            key={p._id}
            className="relative bg-white rounded shadow overflow-hidden"
          >
            <img
              src={IMAGE_URL+p.image}
              alt={p.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-3">
              <p className="font-semibold text-sm">{p.title}</p>
              <p className="text-xs text-gray-600">{p.student}</p>
              <p className="text-xs text-gray-500">{p.views} views</p>
            </div>
            <AdminButton
              variant="danger"
              loading={removingId === p._id}
              onClick={() => removeProject(p._id)}
              className="absolute top-1 right-1 text-xs px-2 py-1 rounded"
            >
              ✕
            </AdminButton>
          </div>
        ))}
      </div>
    </div>
  );
}
