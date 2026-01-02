"use client"
import { useState } from "react";
import {
  Mail, Phone, MapPin, Send, Clock, MessageSquare, Sparkles,
  Building2, Users, Zap, Shield, CheckCircle,
  Loader2, Globe, ChevronRight, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    department: "",
    priority: "normal"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const contactDetails = {
    email: "info@stempark.com",
    phone: "+1 (555) 123-4567",
    whatsapp: "+1 (555) 987-6543",
    address: "123 Innovation Drive, Tech Park, Visakhapatnam, AP 530003",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM",
    weekendHours: "Saturday: 10:00 AM - 4:00 PM"
  };

  const departments = [
    { value: "products", label: "STEM Kits & Hardware", icon: Zap },
    { value: "3d-printing", label: "3D Fabrication", icon: Building2 },
    { value: "programs", label: "Academic Programs", icon: Users },
    { value: "partnerships", label: "Partnerships", icon: Shield },
    { value: "support", label: "Technical Support", icon: MessageSquare },
    { value: "other", label: "General Inquiry", icon: Sparkles },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:border-emerald-500" },
    { value: "normal", label: "Normal", color: "bg-blue-500/10 text-blue-600 border-blue-200 hover:border-blue-500" },
    { value: "high", label: "High", color: "bg-amber-500/10 text-amber-600 border-amber-200 hover:border-amber-500" },
    { value: "urgent", label: "Urgent", color: "bg-red-500/10 text-red-600 border-red-200 hover:border-red-500" },
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    if (formData.message.length < 10) errors.message = "Message must be at least 10 characters";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast({ title: "Validation Error", description: "Please check the form.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      await apiFetch(`/contacts/submit`, { method: "POST", data: formData });
      setSubmitSuccess(true);
      toast({ title: "Message Sent!", description: "We'll get back to you shortly.", variant: "default" });
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", subject: "", message: "", department: "", priority: "normal" });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error: any) {
      toast({ title: "Failed", description: error.message || "Try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]">
      
      {/* Background Decor - Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      {/* Header Section */}
      <div className="relative pt-20 pb-16 lg:pt-28 lg:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* --- DO NOT REMOVE OR CHANGE THIS ELEMENT BLOCK --- */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center items-center gap-3 mb-6"
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '48px' }}
                transition={{ duration: 0.5 }}
                className="h-[2px]"
                style={{ backgroundColor: `var(--accent)` }}
              />

              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: `var(--accent)` }}
              >
                Connect With Innovation
              </span>

              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '48px' }}
                transition={{ duration: 0.5 }}
                className="h-[2px]"
                style={{ backgroundColor: `var(--accent)` }}
              />
            </motion.div>
            {/* -------------------------------------------------- */}

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-extrabold tracking-tight"
            >
              Let's Build The <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
                Future Together
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed"
            >
              Have an idea, question, or collaboration opportunity? Our team in Visakhapatnam is ready to turn your vision into reality.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Left Column: Form (Span 7-8) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 xl:col-span-8"
          >
            <div className="bg-[var(--card)]/50 backdrop-blur-xl rounded-3xl border border-[var(--border)] shadow-2xl shadow-[var(--primary)]/5 p-8 sm:p-10 relative overflow-hidden group">
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center gap-4 mb-10">
                <div className="h-12 w-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Send Your Message</h2>
                  <p className="text-[var(--muted-foreground)] text-sm">We typically respond within 2 hours.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name & Email Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Full Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="John Doe"
                      className={cn("h-12 bg-[var(--background)] border-[var(--border)] focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 transition-all", formErrors.name && "border-red-500 focus-visible:ring-red-500")}
                    />
                    {formErrors.name && <span className="text-xs text-red-500">{formErrors.name}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Email Address</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="name@company.com"
                      className={cn("h-12 bg-[var(--background)] border-[var(--border)] focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0 transition-all", formErrors.email && "border-red-500 focus-visible:ring-red-500")}
                    />
                    {formErrors.email && <span className="text-xs text-red-500">{formErrors.email}</span>}
                  </div>
                </div>

                {/* Phone & Dept Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Phone Number</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="h-12 bg-[var(--background)] border-[var(--border)] focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Department</Label>
                    <div className="relative">
                      <select
                        value={formData.department}
                        onChange={(e) => handleChange("department", e.target.value)}
                        className="w-full h-12 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm ring-offset-background placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.value} value={dept.value}>{dept.label}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-[var(--muted-foreground)]">
                        <ChevronRight className="h-4 w-4 rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Subject</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    placeholder="What is this regarding?"
                    className={cn("h-12 bg-[var(--background)] border-[var(--border)] focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0", formErrors.subject && "border-red-500")}
                  />
                  {formErrors.subject && <span className="text-xs text-red-500">{formErrors.subject}</span>}
                </div>

                {/* Priority Selection */}
                {/* <div className="space-y-3">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Priority Level</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {priorities.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => handleChange("priority", priority.value)}
                        className={cn(
                          "flex items-center justify-center py-2.5 px-3 rounded-lg text-sm font-medium border transition-all duration-200",
                          formData.priority === priority.value
                            ? `${priority.color} ring-1 ring-offset-1 ring-[var(--ring)]`
                            : "bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]/10"
                        )}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div> */}

                {/* Message */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Message</Label>
                    <span className="text-xs text-[var(--muted-foreground)]">{formData.message.length}/1000</span>
                  </div>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Tell us about your project or inquiry..."
                    className={cn("min-h-[150px] resize-none bg-[var(--background)] border-[var(--border)] focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0", formErrors.message && "border-red-500")}
                    maxLength={1000}
                  />
                  {formErrors.message && <span className="text-xs text-red-500">{formErrors.message}</span>}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-base font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/25 rounded-xl"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send Message <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                  <p className="text-center text-xs text-[var(--muted-foreground)] mt-4">
                    By submitting this form, you agree to our <span className="text-[var(--primary)] underline cursor-pointer">Privacy Policy</span>.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Right Column: Sidebar Info (Span 4-5) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            
            {/* Contact Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[var(--card)] rounded-3xl border border-[var(--border)] p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Contact Info</h3>
              </div>
              
              <div className="space-y-6">
                <a href={`mailto:${contactDetails.email}`} className="flex group items-start gap-4">
                  <div className="mt-1 p-2 rounded-lg bg-[var(--primary)]/5 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--muted-foreground)]">Email Us</p>
                    <p className="text-base font-semibold">{contactDetails.email}</p>
                  </div>
                </a>

                <a href={`tel:${contactDetails.phone}`} className="flex group items-start gap-4">
                  <div className="mt-1 p-2 rounded-lg bg-[var(--primary)]/5 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--muted-foreground)]">Call Us</p>
                    <p className="text-base font-semibold">{contactDetails.phone}</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 rounded-lg bg-[var(--primary)]/5 text-[var(--primary)]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--muted-foreground)]">Visit Us</p>
                    <p className="text-sm font-medium mt-1 leading-snug">{contactDetails.address}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--border)]">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <div>
                      <p className="font-medium">{contactDetails.hours}</p>
                      <p className="text-[var(--muted-foreground)] text-xs mt-0.5">{contactDetails.weekendHours}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map Preview */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
               className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-sm group cursor-pointer"
               onClick={() => window.open("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30451.667394333985!2d83.30681399216982!3d17.728189197372308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39431389e6973f%3A0x92d9d20395498468!2sVisakhapatnam%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin", "_blank")}
            >
              <div className="relative h-48 w-full bg-[var(--muted)]">
                <iframe
                  title="Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30451.667394333985!2d83.30681399216982!3d17.728189197372308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39431389e6973f%3A0x92d9d20395498468!2sVisakhapatnam%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-300" 
                  style={{ border: 0 }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  Open Maps
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSubmitSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--card)] rounded-3xl p-8 max-w-sm w-full text-center border border-[var(--border)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Received!</h3>
              <p className="text-[var(--muted-foreground)] mb-8">
                Your message has been securely transmitted. A team member will review it shortly.
              </p>
              <Button onClick={() => setSubmitSuccess(false)} className="w-full rounded-xl">
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;