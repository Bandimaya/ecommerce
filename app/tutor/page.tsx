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
      fullName: '', email: '', mobile: '', state: '', city: '', age: '',
      qualification: '', fieldOfStudy: '', institution: '', year: '',
      subjects: [] as string[], grades: [] as string[], experience: '',
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
        const current = prev[name];
        const updated = current.includes(value)
          ? current.filter(i => i !== value)
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
      if (!formData.state) newErrors.state = "State is mandatory";
      if (!formData.city) newErrors.city = "City is mandatory";
      if (!formData.age || parseInt(formData.age) < 18) newErrors.age = "Must be 18+";

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
            <p className="opacity-90 mt-2">Empower students through STEM excellence.</p>
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

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">State <span className="text-red-500">*</span></label>
                  <select name="state" value={formData.state} onChange={handleChange} className={`p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${errors.state ? 'border-red-500 bg-red-50/10' : 'border-gray-200 focus:border-[var(--primary)]'}`}>
                    <option value="">Select State</option>
                    {Object.keys(INDIAN_STATES_CITIES).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="text-red-500 text-xs mt-1">{errors.state}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">City <span className="text-red-500">*</span></label>
                  <select name="city" value={formData.city} onChange={handleChange} disabled={!formData.state} className={`p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all ${errors.city ? 'border-red-500' : 'border-gray-200'} disabled:bg-gray-100`}>
                    <option value="">Select City</option>
                    {formData.state && INDIAN_STATES_CITIES[formData.state].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <span className="text-red-500 text-xs mt-1">{errors.city}</span>}
                </div>

                <InputGroup required label="Age" name="age" inputMode="numeric" value={formData.age} error={errors.age} onChange={handleChange} placeholder="Min 18" />
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
              <div className="space-y-8">
                <div>
                  <label className="text-sm font-semibold mb-4 block">
                    Subjects You Can Teach <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {SUBJECTS.map((sub) => {
                      const isSelected = formData.subjects.includes(sub);
                      return (
                        <button
                          type="button"
                          key={sub}
                          onClick={() => handleCheckbox('subjects', sub)}
                          className={`group flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 
              ${isSelected
                              ? 'bg-[var(--primary)] text-white shadow-lg border-[var(--primary)] scale-105'
                              : 'bg-white hover:border-[var(--primary)] text-gray-600 border-gray-200'
                            }`}
                        >
                          {/* The Tick Mark (renders only when selected) */}
                          {isSelected && (
                            <span className="animate-in fade-in zoom-in duration-300">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}

                          {sub}
                        </button>
                      );
                    })}
                  </div>
                  {errors.subjects && (
                    <p className="text-red-500 text-xs mt-3 font-medium">{errors.subjects}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-5 border border-gray-100 rounded-xl bg-gray-50/30">
                    <label className="text-sm font-bold mb-4 block text-[var(--primary)]">Grade Levels <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {GRADE_LEVELS.map(g => (
                        <label key={g} className="flex items-center gap-3 text-sm cursor-pointer hover:bg-white p-2 rounded-md transition-colors">
                          <input type="checkbox" checked={formData.grades.includes(g)} onChange={() => handleCheckbox('grades', g)} className="w-4 h-4 rounded accent-[var(--primary)]" /> {g}
                        </label>
                      ))}
                    </div>
                    {errors.grades && <p className="text-red-500 text-xs mt-3">{errors.grades}</p>}
                  </div>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold">Teaching Experience <span className="text-red-500">*</span></label>
                      <select name="experience" value={formData.experience} onChange={handleChange} className={`p-2.5 border rounded-lg ${errors.experience ? 'border-red-500' : 'border-gray-200'}`}>
                        <option value="">Select Range</option>
                        {EXPERIENCE_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                      {errors.experience && <span className="text-red-500 text-xs mt-1">{errors.experience}</span>}
                    </div>
                    <InputGroup required label="Teaching Language(s)" name="language" value={formData.language} error={errors.language} onChange={handleChange} placeholder="e.g. English, Telugu" />
                  </div>
                </div>
              </div>
            </section>

            {/* 5. AVAILABILITY */}
            <section className="bg-gray-50/50 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> 5. Availability
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Days <span className="text-red-500">*</span></label>
                  <select name="days" value={formData.days} onChange={handleChange} className={`p-2.5 border rounded-lg bg-white ${errors.days ? 'border-red-500' : 'border-gray-200'}`}>
                    <option value="">Select Days</option>
                    <option>Weekdays</option>
                    <option>Weekends</option>
                    <option>Both</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold">Time Slots <span className="text-red-500">*</span></label>
                  <select name="slots" value={formData.slots} onChange={handleChange} className={`p-2.5 border rounded-lg bg-white ${errors.slots ? 'border-red-500' : 'border-gray-200'}`}>
                    <option value="">Select Time</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                  </select>
                </div>
                <InputGroup required label="Hours/Week" name="hours" inputMode="numeric" value={formData.hours} error={errors.hours} onChange={handleChange} placeholder="Max 40" />
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
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            </section>

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
      </div>
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