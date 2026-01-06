"use client";

import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { PlusCircle, Pencil, Trash2, Search, Grid, List, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { IMAGE_URL } from "@/lib/constants";
import { Skeleton, SkeletonText, SkeletonLine } from '@/components/ui/skeleton'

interface SectionCourse {
  _id: string;
  title: string;
  description: string;
  image: string;
  ageRange: string;
  duration: string;
  level: string;
  skills: string[];
  rating: number;
  sectionId: string;
}

interface Section {
  _id: string;
  name: string;
}

interface FormState {
  title: string;
  _id?: string;
  description: string;
  ageRange: string;
  duration: string;
  enrolled: string;
  alt: string;
  level: string;
  image: File | null;
  sectionId: string; // For section selection
  skills: string[]; // For storing skills
  rating: number; // For storing rating
}

export default function SectionCoursesPage({
  sectionId,
}: {
  sectionId: string;
}) {
  const [courses, setCourses] = useState<SectionCourse[]>([]);
  const [sections, setSections] = useState<Section[]>([]); // For storing sections
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    ageRange: "",
    duration: "",
    level: "",
    image: null,
    enrolled: "",
    alt: "",
    sectionId: "",
    skills: [],
    rating: 0, // Default rating is 0
  });

  /* ---------------- FETCH COURSES ---------------- */
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/section-courses?sectionId=${sectionId}`);
      setCourses(res);
    } catch {
      toast({ title: "Failed to load courses", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH SECTIONS ---------------- */
  const fetchSections = async () => {
    try {
      const res = await apiFetch(`/sections`);
      setSections(res); // Set fetched sections
    } catch {
      toast({ title: "Failed to load sections", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchSections(); // Fetch sections when the component mounts
  }, [sectionId]);

  /* ---------------- FILTER ---------------- */
  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, search]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSkillsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prev) => {
      const updatedSkills = value.split(",").map((skill) => skill.trim());
      return { ...prev, skills: updatedSkills };
    });
  };

  const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, rating: Number(value) }));
  };

  const resetForm = () => {
    setShowForm(false);
    setForm({
      title: "",
      description: "",
      ageRange: "",
      duration: "",
      level: "",
      enrolled: "",
      alt: "",
      image: null,
      sectionId: "",
      skills: [],
      rating: 0,
    });
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!form.title.trim()) {
      return toast({
        title: "Title is required",
        variant: "destructive",
      });
    }

    if (!form.image) {
      return toast({
        title: "Image is required",
        variant: "destructive",
      });
    }

    if (!form.sectionId) {
      return toast({
        title: "Section is required",
        variant: "destructive",
      });
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("ageRange", form.ageRange);
    data.append("duration", form.duration);
    data.append("level", form.level);
    if (typeof form.image !== 'string')
      data.append("image", form.image);
    data.append("alt", form.alt);
    data.append("enrolled", form.enrolled);
    data.append("sectionId", form.sectionId);

    setIsSubmitting(true)
    try {
      let res;
      if (form._id) {
        // Update existing course
        data.append("id", form._id);
        res = await apiFetch(`/section-courses`, {
          method: "PUT",
          data: data,
        });
      } else {
        // Create new course
        res = await apiFetch("/section-courses", {
          method: "POST",
          data: data,
        });
      }

      if (res) {
        toast({ title: "Course saved successfully!", variant: "success" });
        resetForm();
        await fetchCourses(); // Refresh the courses list
      }
    } catch (error) {
      toast({ title: "Failed to save course", variant: "destructive" });
    } finally {
      setIsSubmitting(false)
    }
  };


  const handleEdit = async (courseId: string) => {
    try {
      // Fetch the existing course data from your backend
      const res = await apiFetch(`/section-courses/${courseId}`);
      const course = res; // Assuming the response contains the course data

      // Populate the form with the existing data
      setForm({
        _id: course._id,
        title: course.title,
        description: course.description,
        ageRange: course.ageRange,
        duration: course.duration,
        level: course.level,
        enrolled: course.enrolled,
        alt: course.alt,
        image: course.image,
        skills: course.skills,
        rating: course.rating,
        sectionId: course.sectionId,
      });

      // Set showForm to true to display the form in edit mode
      setShowForm(true);
    } catch (err) {
      toast({ title: "Failed to load course details", variant: "destructive" });
    }
  };

  function handleDelete(id: string) {
    if (!confirm("Delete this course?")) return;
    apiFetch(`/section-courses`, { method: "DELETE", data: { id } })
      .then(() => {
        setCourses(courses.filter(c => c._id !== id));
        toast({ title: "Course deleted" });
      }
      ).catch(() => {
        toast({ title: "Failed to delete course", variant: "destructive" });
      });
  }


  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <Search className="mr-2" size={16} onChange={(e: any) => setSearch(e.target.value)} />
          <input
            type="text"
            placeholder="Search courses"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center text-blue-500"
        >
          <PlusCircle className="mr-2" size={18} />
          Add Course
        </button>
      </div>

      {showForm && (
        <div className="p-4 border rounded mb-4">
          <h2 className="text-lg font-semibold">Add Course</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Title Input */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                placeholder="Course Title"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                placeholder="Course Description"
              />
            </div>

            {/* Age Range Input */}
            <div className="mb-4">
              <label htmlFor="ageRange" className="block text-sm font-medium">
                Age Range
              </label>
              <input
                type="number"
                min={0}
                id="ageRange"
                name="ageRange"
                value={form.ageRange}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                placeholder="Age Range"
              />
            </div>

            {/* Duration Input */}
            <div className="mb-4">
              <label htmlFor="duration" className="block text-sm font-medium">
                Duration
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                min={1}
                value={form.duration}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                placeholder="Duration"
              />
            </div>

            {/* Level Input */}
            <div className="mb-4">
              <label htmlFor="level" className="block text-sm font-medium">
                Level
              </label>
              <input
                type="text"
                id="level"
                name="level"
                value={form.level}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                placeholder="Level"
              />
            </div>

            {/* Enrolled Input */}
            <div className="mb-4">
              <label htmlFor="enrolled" className="block text-sm font-medium">
                Enrolled
              </label>
              <input
                type="number"
                id="enrolled"
                name="enrolled"
                min={0}
                value={form.enrolled}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                placeholder="Enrolled"
              />
            </div>

            {/* Alt Input */}
            <div className="mb-4">
              <label htmlFor="alt" className="block text-sm font-medium">
                Alt Text
              </label>
              <input
                type="text"
                id="alt"
                name="alt"
                value={form.alt}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                placeholder="Alt Text"
              />
            </div>

            {/* Skills Input */}
            <div className="mb-4">
              <label htmlFor="skills" className="block text-sm font-medium">
                Skills
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={form.skills.join(", ")} // Display skills as a comma-separated string
                onChange={handleSkillsChange}
                className="p-2 border rounded w-full"
                placeholder="Enter skills separated by commas"
              />
            </div>

            {/* Rating Input */}
            <div className="mb-4">
              <label htmlFor="rating" className="block text-sm font-medium">
                Rating
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={form.rating}
                onChange={handleRatingChange}
                className="p-2 border rounded w-full"
                placeholder="Course Rating (1-5)"
                min={1}
                max={5}
              />
            </div>

            {/* Section Select */}
            <div className="mb-4">
              <label htmlFor="sectionId" className="block text-sm font-medium">
                Section
              </label>
              <select
                id="sectionId"
                name="sectionId"
                value={form.sectionId}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="">Select a section</option>
                {sections.map((section: any) => (
                  <option key={section._id} value={section._id}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Input */}
            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium">
                Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="p-2"
              />
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Course
              </button>
              <button
                onClick={resetForm}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Course Grid/List View */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setView(view === "grid" ? "list" : "grid")}
          className="bg-gray-200 p-2 rounded"
        >
          {view === "grid" ? <List size={20} /> : <Grid size={20} />}
        </button>
      </div>

      <div className={view === "grid" ? "grid grid-cols-3 gap-4" : ""}>
        {loading ? (
          Array.from({length: 6}).map((_, i) => (
            <div key={i} className="border p-4 rounded">
              <Skeleton className="w-full h-40 mb-3 rounded" />
              <SkeletonText className="w-3/4 mb-2" />
              <SkeletonLine className="w-full mb-2" />
              <div className="mt-2 flex justify-between items-center">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="w-6 h-6 rounded" />
              </div>
            </div>
          ))
        ) : (
          filteredCourses.map((course) => (
            <div key={course._id} className="border p-4 rounded">
              <img
                src={IMAGE_URL+course.image}
                alt={course.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm">{course.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <button
                  className="text-yellow-500"
                  onClick={() => handleEdit(course._id)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => { handleDelete(course._id); }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
