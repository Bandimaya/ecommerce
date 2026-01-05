"use client";

import { useEffect, useState } from "react";

type StemCourse = {
  _id: string;
  courseId: string;
  title: string;
  image: string;
  age: string;
  description: string;
  level: string;
  duration: string;
  enrolled: string;
};

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function StemCoursesPage() {
  const [courses, setCourses] = useState<StemCourse[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const [form, setForm] = useState({
    courseId: "",
    title: "",
    age: "",
    description: "",
    level: "Beginner",
    duration: "",
    enrolled: "",
  });

  const fetchCourses = async () => {
    const res = await fetch("/api/stem-courses");
    setCourses(await res.json());
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file) {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("image", file);

      await fetch("/api/stem-courses", { method: "POST", body: fd });
    } else if (url) {
      await fetch("/api/stem-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: url }),
      });
    }

    setForm({
      courseId: "",
      title: "",
      age: "",
      description: "",
      level: "Beginner",
      duration: "",
      enrolled: "",
    });
    setUrl("");
    setFile(null);
    fetchCourses();
  };

  const removeCourse = async (id: string) => {
    await fetch("/api/stem-courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCourses();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">STEM Courses</h1>

      {/* ADD */}
      <form onSubmit={addCourse} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid md:grid-cols-2 gap-2">
          <input
            placeholder="Course ID (MD-01)"
            value={form.courseId}
            onChange={(e) =>
              setForm({ ...form, courseId: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Age (8-12)"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <select
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            className="border p-2 rounded"
          >
            {LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="border p-2 rounded w-full mt-2"
          required
        />

        <div className="grid md:grid-cols-2 gap-2 mt-2">
          <input
            placeholder="Duration (24 Sessions)"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Enrolled (1.5k+)"
            value={form.enrolled}
            onChange={(e) =>
              setForm({ ...form, enrolled: e.target.value })
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

        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-3">
          Add Course
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {courses.map((c) => (
          <div
            key={c._id}
            className="relative bg-white rounded shadow p-4 flex gap-4"
          >
            <img
              src={c.image}
              alt={c.title}
              className="w-32 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">
                {c.title} ({c.courseId})
              </h3>
              <p className="text-sm">{c.description}</p>
              <p className="text-xs text-gray-500">
                Age {c.age} • {c.level} • {c.duration} • {c.enrolled}
              </p>
            </div>
            <button
              onClick={() => removeCourse(c._id)}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
