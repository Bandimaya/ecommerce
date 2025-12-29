"use client"
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/axios";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactDetails = {
    email: "info@stempark.com",
    phone: "+1 (555) 123-4567",
    address: "123 Innovation Drive, Visakhapatnam, AP 530003",
    hours: "Mon - Fri: 9AM - 6PM"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch(`/contacts/submit`, {
        method: "POST",
        data: formData,
      });
      toast({
        title: "Message Transmitted!",
        description: "Our team in Vizag has received your inquiry."
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Signal Interrupted",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen overflow-hidden"
      style={{ '--bg-color': 'hsl(var(--background))' } as React.CSSProperties}>

      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse"
          style={{ '--bg-color': 'hsl(var(--primary) / 0.2)' } as React.CSSProperties} />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ '--bg-color': 'hsl(var(--accent) / 0.2)' } as React.CSSProperties} />
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-12 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border"
            style={{
              '--badge-bg': 'hsl(var(--primary) / 0.1)',
              '--badge-color': 'hsl(var(--primary))',
              '--badge-border': 'hsl(var(--primary) / 0.2)',
            } as React.CSSProperties}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Innovation Hub : Vizag</span>
          </motion.div>
          <h1
            className="text-5xl md:text-8xl font-black tracking-tighter mb-6"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Get in <span style={{ color: "hsl(var(--primary))" }}>Touch</span>
          </h1>

          <p className="text-lg max-w-xl mx-auto leading-relaxed"
            style={{ '--text-color': 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
            Have a project in mind? Visit our lab in <span className="font-bold" style={{ color: 'hsl(var(--foreground))' }}>Visakhapatnam</span> or send us a digital transmission below.
          </p>
        </div>
      </section>

      <section className="pb-24 relative">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Quick-Info Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Mail, label: "Email", value: contactDetails.email, href: `mailto:${contactDetails.email}` },
              { icon: Phone, label: "Phone", value: contactDetails.phone, href: `tel:${contactDetails.phone}` },
              { icon: MapPin, label: "Lab Location", value: "Visakhapatnam, India" },
              { icon: Clock, label: "Lab Hours", value: contactDetails.hours },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-[1.5rem] border backdrop-blur-sm shadow-sm flex items-center gap-4 group transition-all"
                style={{
                  '--card-bg': 'hsl(var(--card) / 0.5)',
                  '--card-border': 'hsl(var(--border) / 0.5)',
                  '--card-hover-bg': 'hsl(var(--card))',
                } as React.CSSProperties}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    '--icon-bg': 'hsl(var(--primary) / 0.1)',
                    '--icon-hover-bg': 'hsl(var(--primary))',
                    '--icon-hover-color': 'hsl(var(--primary-foreground))',
                  } as React.CSSProperties}>
                  <item.icon className="w-4 h-4"
                    style={{ color: 'hsl(var(--primary))' } as React.CSSProperties} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-widest"
                    style={{ '--label-color': 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a href={item.href}
                      className="text-sm font-bold truncate block transition-colors"
                      style={{
                        '--link-color': 'hsl(var(--foreground))',
                        '--link-hover': 'hsl(var(--primary))',
                      } as React.CSSProperties}>
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-bold truncate"
                      style={{ color: 'hsl(var(--foreground))' } as React.CSSProperties}>
                      {item.value}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Contact Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
              style={{
                '--form-bg': 'hsl(var(--card))',
                '--form-border': 'hsl(var(--border))',
                '--form-shadow': 'hsl(var(--primary) / 0.05)',
              } as React.CSSProperties}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-1.5 h-10 rounded-full"
                  style={{ '--accent-color': 'hsl(var(--primary))' } as React.CSSProperties} />
                <h2 className="text-3xl font-black tracking-tight"
                  style={{ color: 'hsl(var(--foreground))' } as React.CSSProperties}>
                  Transmit Message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider ml-1"
                      style={{ color: 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Isaac Newton"
                      className="w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none"
                      style={{
                        '--input-bg': 'hsl(var(--background))',
                        '--input-border': 'transparent',
                        '--input-focus': 'hsl(var(--primary) / 0.3)',
                      } as React.CSSProperties}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-wider ml-1"
                      style={{ color: 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                      Email Protocol
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="name@science.com"
                      className="w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none"
                      style={{
                        '--input-bg': 'hsl(var(--background))',
                        '--input-border': 'transparent',
                        '--input-focus': 'hsl(var(--primary) / 0.3)',
                      } as React.CSSProperties}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider ml-1"
                    style={{ color: 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                    Inquiry Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none appearance-none cursor-pointer"
                    style={{
                      '--input-bg': 'hsl(var(--background))',
                      '--input-border': 'transparent',
                      '--input-focus': 'hsl(var(--primary) / 0.3)',
                    } as React.CSSProperties}
                  >
                    <option value="">Select Department</option>
                    <option value="products">STEM Kits & Hardware</option>
                    <option value="3d-printing">3D Fabrication Services</option>
                    <option value="programs">Academic Programs</option>
                    <option value="other">General Exploration</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider ml-1"
                    style={{ color: 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                    Message Content
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Describe your inquiry in detail..."
                    className="w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none resize-none"
                    style={{
                      '--input-bg': 'hsl(var(--background))',
                      '--input-border': 'transparent',
                      '--input-focus': 'hsl(var(--primary) / 0.3)',
                    } as React.CSSProperties}
                  />
                </div>

                <Button type="submit" variant="cta"
                  className="w-full py-8 rounded-2xl text-lg font-black shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
                  style={{
                    '--button-shadow': 'hsl(var(--primary) / 0.2)',
                  } as React.CSSProperties}>
                  <Send className="w-5 h-5 mr-3" />
                  Push to Pipeline
                </Button>
              </form>
            </motion.div>

            {/* Visual Sidebar */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Vizag Map Card */}
              <div className="flex-1 rounded-[2.5rem] overflow-hidden relative border group min-h-[400px]"
                style={{
                  '--map-bg': 'hsl(var(--muted))',
                  '--map-border': 'hsl(var(--border))',
                } as React.CSSProperties}>
                <iframe
                  title="Visakhapatnam STEM Park Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121633.51860368159!2d83.15582962137021!3d17.73860477038799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39431389e6973f%3A0x92d9d20395498468!2sVisakhapatnam%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="absolute inset-0 w-full h-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />

                {/* Floating Map Label */}
                <div className="absolute bottom-6 left-6 right-6 p-5 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border flex justify-between items-center group-hover:translate-y-[-8px] transition-transform duration-500"
                  style={{
                    '--label-bg': 'hsl(var(--background) / 0.95)',
                    '--label-border': 'hsl(var(--border) / 0.2)',
                  } as React.CSSProperties}>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black flex items-center gap-2 mb-1"
                      style={{ color: 'hsl(var(--foreground))' } as React.CSSProperties}>
                      <div className="w-2 h-2 rounded-full animate-ping"
                        style={{ backgroundColor: 'hsl(var(--primary))' } as React.CSSProperties} />
                      HQ: VISAKHAPATNAM
                    </h3>
                    <p className="text-[10px] truncate font-medium"
                      style={{ color: 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                      {contactDetails.address}
                    </p>
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl shadow-lg hover:scale-105 transition-all"
                    style={{
                      '--button-bg': 'hsl(var(--primary))',
                      '--button-shadow': 'hsl(var(--primary) / 0.3)',
                      color: 'hsl(var(--primary-foreground))',
                    } as React.CSSProperties}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Status Indicator Card */}
              <div className="p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl border"
                style={{
                  '--status-bg': 'hsl(var(--card))',
                  '--status-border': 'hsl(var(--border) / 0.1)',
                } as React.CSSProperties}>
                <div className="absolute top-0 right-0 p-6">
                  <div className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_20px]"
                    style={{
                      backgroundColor: 'hsl(var(--success))',
                      boxShadow: '0 0 20px hsl(var(--success) / 0.8)',
                    } as React.CSSProperties} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-5 h-5"
                    style={{ color: 'hsl(var(--primary))' } as React.CSSProperties} />
                  <span className="text-xs font-black uppercase tracking-widest"
                    style={{ color: 'hsl(var(--primary))' } as React.CSSProperties}>
                    Live Status
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 italic"
                  style={{ color: 'hsl(var(--foreground))' } as React.CSSProperties}>
                  "City of Destiny" Support
                </h3>
                <p className="text-sm mb-6 leading-relaxed font-medium"
                  style={{ color: 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                  Our lab is currently operational. Engineering inquiries are handled within 2-4 cycles (hours).
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter"
                    style={{ color: 'hsl(var(--foreground))' } as React.CSSProperties}>
                    IST
                  </span>
                  <span className="text-sm font-bold tracking-[0.3em]"
                    style={{ color: 'hsl(var(--muted-foreground))' } as React.CSSProperties}>
                    GMT+5:30
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;