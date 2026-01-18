"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, GraduationCap,
  BookOpen, Calendar, Upload, Link as LinkIcon, CheckCircle, Video
} from 'lucide-react';
import {
  INDIAN_STATES_CITIES,
  SUBJECTS,
  QUALIFICATIONS,
  GRADE_LEVELS,
  EXPERIENCE_LEVELS
} from '../../lib/Data';

const TutorRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', mobile: '', address: '', dob: '',
    courses: [
      {
        course: "",
        level: "",
        experience: ""
      }
    ],
    subjects: [
      {
        subject: "",
        grade: "",
        experience: ""
      }
    ],
    availability: {
      Monday: { enabled: false, from: "", to: "", hours: 0 },
      Tuesday: { enabled: false, from: "", to: "", hours: 0 },
      Wednesday: { enabled: false, from: "", to: "", hours: 0 },
      Thursday: { enabled: false, from: "", to: "", hours: 0 },
      Friday: { enabled: false, from: "", to: "", hours: 0 },
      Saturday: { enabled: false, from: "", to: "", hours: 0 },
      Sunday: { enabled: false, from: "", to: "", hours: 0 }
    },
    qualification: '', fieldOfStudy: '', institution: '', year: '',
    grades: [] as string[], experience: '',
    language: '', days: '', slots: '', hours: '',
    resume: null as File | null, portfolio: '', demoLink: '',
    whyJoin: '', strengths: '', consent: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // SANITIZED CHANGE HANDLER
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Handle Numeric Only Fields
    if (name === 'mobile' || name === 'age' || name === 'year' || name === 'hours') {
      const onlyNums = value.replace(/[^0-9]/g, '');

      // Specific length constraints
      if (name === 'mobile' && onlyNums.length > 10) return;
      if (name === 'age' && onlyNums.length > 2) return;
      if (name === 'year' && onlyNums.length > 4) return;

      setFormData(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
      if (errors.resume) setErrors(prev => ({ ...prev, resume: "" }));
    }
  };

  const handleCheckbox = (name: 'subjects' | 'grades', value: string) => {
    setFormData(prev => {
      const current: any = prev[name];
      const updated = current.includes(value)
        ? current.filter((i: any) => i !== value)
        : [...current, value];

      if (errors[name]) setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
      return { ...prev, [name]: updated };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email address";
    if (formData.mobile.length !== 10) newErrors.mobile = "Enter exactly 10 digits";
    if (!formData.address) newErrors.state = "Address is mandatory";
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        newErrors.dob = "Must be 18+";
      }
    }
    if (!formData.qualification) newErrors.qualification = "Required";
    if (!formData.fieldOfStudy) newErrors.fieldOfStudy = "Required";
    if (!formData.institution) newErrors.institution = "Required";
    if (formData.year.length !== 4) newErrors.year = "Enter valid year";

    if (formData.subjects.length === 0) newErrors.subjects = "Select at least one";
    if (formData.grades.length === 0) newErrors.grades = "Select at least one";
    if (!formData.experience) newErrors.experience = "Required";
    if (!formData.language) newErrors.language = "Required";

    if (!formData.days) newErrors.days = "Required";
    if (!formData.slots) newErrors.slots = "Required";
    if (!formData.hours) newErrors.hours = "Required";

    if (!formData.resume) newErrors.resume = "PDF resume required";
    if (!formData.whyJoin.trim()) newErrors.whyJoin = "Required";
    if (!formData.strengths.trim()) newErrors.strengths = "Required";
    if (!formData.consent) newErrors.consent = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addCourse = () =>
    setFormData({
      ...formData,
      courses: [...formData.courses, { course: "", level: "", experience: "" }]
    });

  const removeCourse = (index: any) =>
    setFormData({
      ...formData,
      courses: formData.courses.filter((_, i) => i !== index)
    });

  const handleCourseChange = (index: any, field: any, value: any) => {
    const updated: any = [...formData.courses];
    updated[index][field] = value;
    setFormData({ ...formData, courses: updated });
  };

  // -------------------

  const addSubject = () =>
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { subject: "", grade: "", experience: "" }]
    });

  const removeSubject = (index: any) =>
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_: any, i: any) => i !== index)
    });

  const handleSubjectChange = (index: any, field: any, value: any) => {
    const updated: any = [...formData.subjects];
    updated[index][field] = value;
    setFormData({ ...formData, subjects: updated });
  };

  const toggleDay = (day: any) => {
    const updated: any = { ...formData.availability };

    updated[day].enabled = !updated[day].enabled;

    if (!updated[day].enabled) {
      updated[day].from = "";
      updated[day].to = "";
      updated[day].hours = 0;
    }

    setFormData({ ...formData, availability: updated });
  };



  const handleTime = (day: any, field: any, value: any) => {
    const updated: any = { ...formData.availability };
    updated[day][field] = value;

    const { from, to } = updated[day];

    if (from && to) {
      const [fh, fm] = from.split(":").map(Number);
      const [th, tm] = to.split(":").map(Number);

      const diff = (th + tm / 60) - (fh + fm / 60);
      updated[day].hours = diff > 0 ? Math.round(diff * 10) / 10 : 0;
    }

    setFormData({ ...formData, availability: updated });
  };

  const calculateTotalHours = () => {
    return Object.values(formData.availability)
      .reduce((sum, d: any) => sum + (d.hours || 0), 0);
  };

  return (
    <div className="flex justify-center py-12 px-4 bg-[var(--background)] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[95%] md:w-[90%] max-w-5xl bg-white shadow-2xl overflow-hidden border border-gray-100"
        style={{ borderRadius: '12px' }}
      >
        <div className="bg-[var(--primary)] p-8 text-white">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="w-8 h-8" /> Join As Tutor
          </h1>
          {/* <p className="opacity-90 mt-2">Empower students through STEM excellence.</p> */}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-12">

          {/* 1. BASIC INFORMATION */}
          <section>
            <h2 className="text-xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2 border-b pb-2">
              <User className="w-5 h-5" /> 1. Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputGroup required label="Full Name" name="fullName" value={formData.fullName} error={errors.fullName} onChange={handleChange} placeholder="Full Name" />
              <InputGroup required label="Email Address" name="email" type="email" value={formData.email} error={errors.email} onChange={handleChange} placeholder="email@example.com" />

              <InputGroup
                required
                label="Mobile (WhatsApp)"
                name="mobile"
                inputMode="numeric"
                value={formData.mobile}
                error={errors.mobile}
                onChange={handleChange}
                placeholder="10-digit number"
              />

              <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-3">
                <label className="text-sm font-semibold">
                  Address <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={4}
                  placeholder="House No, Street, Area, City, State, Pincode"
                  className={`p-3 border rounded-lg outline-none resize-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${errors.address
                    ? "border-red-500 bg-red-50/10"
                    : "border-gray-200 focus:border-[var(--primary)]"
                    }`}
                />

                {errors.address && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.address}
                  </span>
                )}
              </div>

              <InputGroup
                required
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                error={errors.dob}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* 2. EDUCATION */}
          <section>
            <h2 className="text-xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2 border-b pb-2">
              <GraduationCap className="w-5 h-5" /> 2. Educational Background
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Highest Qualification <span className="text-red-500">*</span></label>
                <select name="qualification" value={formData.qualification} onChange={handleChange} className={`p-2.5 border rounded-lg ${errors.qualification ? 'border-red-500' : 'border-gray-200'}`}>
                  <option value="">Select</option>
                  {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                {errors.qualification && <span className="text-red-500 text-xs mt-1">{errors.qualification}</span>}
              </div>
              <InputGroup required label="Field of Study" name="fieldOfStudy" value={formData.fieldOfStudy} error={errors.fieldOfStudy} onChange={handleChange} placeholder="e.g. Robotics" />
              <InputGroup required label="University" name="institution" value={formData.institution} error={errors.institution} onChange={handleChange} placeholder="College Name" />
              <InputGroup required label="Year" name="year" inputMode="numeric" value={formData.year} error={errors.year} onChange={handleChange} placeholder="YYYY" />
            </div>
          </section>

          {/* 3. TEACHING PROFILE */}
          <section>
            <h2 className="text-xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2 border-b pb-2">
              <BookOpen className="w-5 h-5" /> 3. Teaching Profile
            </h2>

            <div className="space-y-10">

              {/* COURSES SECTION */}
              <div className="p-6 border rounded-xl bg-gray-50/40 space-y-6">
                <h3 className="text-lg font-bold text-[var(--primary)]">
                  Courses You Can Teach
                </h3>

                {formData.courses.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                  >
                    {/* Course */}
                    <select
                      value={item.course}
                      onChange={(e) =>
                        handleCourseChange(index, "course", e.target.value)
                      }
                      className="p-2.5 border rounded-lg"
                    >
                      <option value="">Course</option>
                      <option value="Robotics">Robotics</option>
                      <option value="Coding">Coding</option>
                      <option value="Internet of Things">Internet of Things (IoT)</option>
                      <option value="Data Analysis">Data Analysis</option>
                      <option value="Machine Learning">Machine Learning (ML)</option>
                      <option value="Artificial Intelligence">Artificial Intelligence (AI)</option>
                      <option value="Digital Design">Digital Design</option>
                      <option value="Cyber Security">Cyber Security</option>
                      <option value="Basics of Mechatronics">Basics of Mechatronics</option>
                      <option value="Mobile App Development">Mobile App Development</option>

                    </select>

                    {/* Level */}
                    <select
                      value={item.level}
                      onChange={(e) =>
                        handleCourseChange(index, "level", e.target.value)
                      }
                      className="p-2.5 border rounded-lg"
                    >
                      <option value="">Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>

                    {/* Experience */}
                    <select
                      value={item.experience}
                      onChange={(e) =>
                        handleCourseChange(index, "experience", e.target.value)
                      }
                      className="p-2.5 border rounded-lg"
                    >
                      <option value="">Experience</option>
                      <option value="0-1 years">0–1 years</option>
                      <option value="1-3 years">1–3 years</option>
                      <option value="3-5 years">3–5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>

                    {/* Remove */}
                    {formData.courses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCourse(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCourse}
                  className="text-sm font-semibold text-[var(--primary)]"
                >
                  + Add Another Course
                </button>
              </div>
            </div>

            {/* SUBJECTS */}
            <div className="p-6 border rounded-xl bg-gray-50/40 space-y-6">
              <h3 className="text-lg font-bold text-[var(--primary)]">
                Subjects You Can Teach
              </h3>

              {formData.subjects.map((item: any, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                >
                  {/* Subject */}
                  <select
                    value={item.subject}
                    onChange={(e) =>
                      handleSubjectChange(index, "subject", e.target.value)
                    }
                    className="p-2.5 border rounded-lg"
                  >
                    <option value="">Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>

                  {/* Grade */}
                  <select
                    value={item.grade}
                    onChange={(e) =>
                      handleSubjectChange(index, "grade", e.target.value)
                    }
                    className="p-2.5 border rounded-lg"
                  >
                    <option value="">Grade</option>
                    <option value="1st - 5th">1st–5th</option>
                    <option value="6th - 10th">6th–10th</option>
                    <option value="11th - 12th">11th–12th</option>
                  </select>

                  {/* Experience */}
                  <select
                    value={item.experience}
                    onChange={(e) =>
                      handleSubjectChange(index, "experience", e.target.value)
                    }
                    className="p-2.5 border rounded-lg"
                  >
                    <option value="">Experience</option>
                    <option value="0-1 years">0–1 years</option>
                    <option value="1-3 years">1–3 years</option>
                    <option value="3-5 years">3–5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>

                  {/* Remove */}
                  {formData.subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addSubject}
                className="text-sm font-semibold text-[var(--primary)]"
              >
                + Add Another Subject
              </button>
            </div>
          </section>

          {/* 5. AVAILABILITY */}
          <section className="bg-gray-50/50 p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> 5. Availability
            </h2>

            <div className="space-y-4">

              {Object.keys(formData.availability).map((day: any) => {
                //@ts-ignore
                const dayData = formData.availability[day];

                return (
                  <div
                    key={day}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center bg-white p-4 rounded-xl border"
                  >
                    {/* ENABLE DAY */}
                    <label className="flex items-center gap-2 font-semibold">
                      <input
                        type="checkbox"
                        checked={dayData.enabled}
                        onChange={() => toggleDay(day)}
                        className="accent-[var(--primary)]"
                      />
                      {day}
                    </label>

                    {/* FROM */}
                    <input
                      type="time"
                      disabled={!dayData.enabled}
                      value={dayData.from}
                      onChange={(e) => handleTime(day, "from", e.target.value)}
                      className="p-2 border rounded-lg disabled:bg-gray-100"
                    />

                    {/* TO */}
                    <input
                      type="time"
                      disabled={!dayData.enabled}
                      value={dayData.to}
                      onChange={(e) => handleTime(day, "to", e.target.value)}
                      className="p-2 border rounded-lg disabled:bg-gray-100"
                    />

                    {/* DAILY HOURS */}
                    <input
                      type="text"
                      disabled
                      value={dayData.hours ? `${dayData.hours} hrs` : ""}
                      className="p-2 border rounded-lg bg-gray-100 text-gray-700"
                    />

                    <span className="text-sm text-gray-500">per day</span>
                  </div>
                );
              })}

              {/* TOTAL HOURS */}
              <div className="flex justify-end pt-4 border-t">
                <div className="text-lg font-bold text-[var(--primary)]">
                  Total Hours / Week: {calculateTotalHours()} hrs
                </div>
              </div>

            </div>
          </section>

          {/* 6. DOCUMENTS */}
          <section>
            <h2 className="text-xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2 border-b pb-2">
              <Upload className="w-5 h-5" /> 6. Documents & Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Resume (PDF Only) <span className="text-red-500">*</span></label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${errors.resume ? 'border-red-500 bg-red-50/30' : 'border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5'}`}>
                  <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="resume-upload" />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <span className="text-sm font-medium text-gray-600 block">{formData.resume ? formData.resume.name : "Choose File or Drag & Drop"}</span>
                    <span className="text-xs text-gray-400 mt-1 block">Max size: 5MB</span>
                  </label>
                </div>
                {errors.resume && <span className="text-red-500 text-xs mt-2">{errors.resume}</span>}
              </div>
              <div className="space-y-5">
                <InputGroup label="Portfolio / LinkedIn" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                <InputGroup label="Demo Video Link" name="demoLink" value={formData.demoLink} onChange={handleChange} placeholder="YouTube/G-Drive Link" />
              </div>
            </div>
          </section>

          {/* 7. WHY JOIN */}
          {/* <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-800">Why STEMPARK? <span className="text-red-500">*</span></label>
              <textarea name="whyJoin" value={formData.whyJoin} onChange={handleChange} className={`p-4 border rounded-xl h-36 resize-none outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${errors.whyJoin ? 'border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-[var(--primary)]'}`} placeholder="Your motivation to join us..." />
              {errors.whyJoin && <span className="text-red-500 text-xs mt-1">{errors.whyJoin}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-800">Your Strengths? <span className="text-red-500">*</span></label>
              <textarea name="strengths" value={formData.strengths} onChange={handleChange} className={`p-4 border rounded-xl h-36 resize-none outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${errors.strengths ? 'border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-[var(--primary)]'}`} placeholder="What makes you a great tutor?" />
              {errors.strengths && <span className="text-red-500 text-xs mt-1">{errors.strengths}</span>}
            </div>
          </section> */}

          {/* 8. SUBMIT */}
          <section className="pt-8 border-t border-gray-100">
            <div className="bg-blue-50/40 p-6 rounded-2xl border border-blue-100/50 mb-10">
              <label className="flex items-start gap-4 cursor-pointer group">
                <input type="checkbox" checked={formData.consent} onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))} className="mt-1.5 w-5 h-5 accent-[var(--primary)] rounded shadow-sm" />
                <div className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-bold text-gray-900 block mb-1">Declaration & Privacy <span className="text-red-500">*</span></span>
                  I hereby declare that the information provided is true to the best of my knowledge. I understand that any false statement will disqualify me from the selection process. I agree to the <span className="text-[var(--primary)] font-semibold underline">Terms & Conditions</span>.
                </div>
              </label>
              {errors.consent && <p className="text-red-500 text-xs mt-3 font-medium pl-9">{errors.consent}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.01, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold py-4.5 rounded-xl shadow-xl transition-all text-lg tracking-wide uppercase"
            >
              Submit Application
            </motion.button>
          </section>
        </form>

        {/* SUCCESS POPUP */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[10000] flex items-center justify-center p-4"
            >
              <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-3xl text-center max-w-md shadow-2xl relative">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-14 h-14 text-green-600" />
                </div>
                <h3 className="text-3xl font-extrabold mb-3 text-gray-900">Application Sent!</h3>
                <p className="text-gray-600 mb-10 text-lg leading-relaxed">Your profile has been submitted successfully. Our academic team will review your application and reach out within 48 hours.</p>
                <button onClick={() => setIsSubmitted(false)} className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-2xl hover:bg-[var(--primary)]/90 transition-colors shadow-lg">Done</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div >
  );
};

// HELPER COMPONENT
const InputGroup = ({ label, name, type = "text", value, error, onChange, placeholder, required, inputMode }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      inputMode={inputMode}
      className={`p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-medium ${error ? 'border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-[var(--primary)] text-gray-900'
        }`}
    />
    {error && <span className="text-red-500 text-xs font-semibold mt-0.5">{error}</span>}
  </div>
);

export default TutorRegistrationForm;