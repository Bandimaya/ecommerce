"use client";

import { useEffect, useState } from "react";

type Winner = {
  _id: string;
  team: string;
  event: string;
  position: string;
  school: string;
  category: string;
  description: string;
  image: string;
};

export default function WinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    team: "",
    event: "",
    position: "",
    school: "",
    category: "",
    description: "",
  });

  const [image, setImage] = useState<File | null>(null);

  /* ================= FETCH ================= */
  const fetchWinners = async () => {
    const res = await fetch("/api/winners");
    const data = await res.json();
    setWinners(data);
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (image) formData.append("image", image);

    let method: "POST" | "PUT" = "POST";

    if (editingId) {
      formData.append("id", editingId);
      method = "PUT";
    }

    await fetch("/api/winners", {
      method,
      body: formData,
    });

    resetForm();
    fetchWinners();
  };

  /* ================= HELPERS ================= */
  const resetForm = () => {
    setForm({
      team: "",
      event: "",
      position: "",
      school: "",
      category: "",
      description: "",
    });
    setImage(null);
    setEditingId(null);
  };

  const handleEdit = (winner: Winner) => {
    setEditingId(winner._id);
    setForm({
      team: winner.team,
      event: winner.event,
      position: winner.position,
      school: winner.school,
      category: winner.category,
      description: winner.description,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this winner?")) return;

    await fetch("/api/winners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchWinners();
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Winners Management</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow p-5 mb-8"
      >
        <h2 className="font-semibold mb-4">
          {editingId ? "Edit Winner" : "Add Winner"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Team"
            value={form.team}
            onChange={(e) => setForm({ ...form, team: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Event"
            value={form.event}
            onChange={(e) => setForm({ ...form, event: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="School"
            value={form.school}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded w-full mt-4"
          rows={3}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="border p-2 rounded w-full mt-4"
        />

        <div className="flex gap-3 mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? "Update" : "Create"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      <div className="grid gap-4">
        {winners.map((winner) => (
          <div
            key={winner._id}
            className="bg-white rounded shadow p-4 flex gap-4 items-start"
          >
            <img
              src={winner.image}
              alt={winner.team}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-semibold">
                {winner.team} – {winner.position}
              </h3>
              <p className="text-sm text-gray-600">
                {winner.event} | {winner.school}
              </p>
              <p className="text-sm mt-1">{winner.description}</p>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded inline-block mt-2">
                {winner.category}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleEdit(winner)}
                className="text-blue-600 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(winner._id)}
                className="text-red-600 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
