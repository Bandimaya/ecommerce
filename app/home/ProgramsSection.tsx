"use client"

import { ArrowRight, Sparkles, Users, BookOpen, Target, Zap, Globe, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import BackgroundDecorations from "./BackgroundDecorations"
import { useI18n } from "@/contexts/I18nContext"

interface ProgramsSectionProps {
  getCSSVar: (varName: string, fallback?: string) => string
}

const ProgramsSection = ({ getCSSVar }: ProgramsSectionProps) => {
  const { t } = useI18n()

  const cssVars = {
    accent: () => getCSSVar('--accent', '#8b5cf6'),
    warning: () => getCSSVar('--warning', '#f59e0b'),
    foreground: () => getCSSVar('--foreground', '#020817'),
    fontDisplay: () => getCSSVar('--font-display', 'system-ui, sans-serif'),
    mutedForeground: () => getCSSVar('--muted-foreground', '#64748b'),
    background: () => getCSSVar('--background', '#ffffff'),
    primaryForeground: () => getCSSVar('--primary-foreground', '#ffffff'),
    border: () => getCSSVar('--border', '#e2e8f0'),
    primary: () => getCSSVar('--primary', '#3b82f6'),
  }

  const programs = [
    {
      id: 'stemClubs',
      title: t('programs.list.stemClubs.title'),
      subtitle: t('programs.list.stemClubs.subtitle'),
      description: t('programs.list.stemClubs.description'),
      icon: Rocket,
      color: cssVars.accent(),
      gradient: "from-purple-600 to-indigo-600",
      stats: [
        { label: t('programs.list.stemClubs.stats.activeClubs'), value: t('programs.list.stemClubs.stats.activeClubsValue') },
        { label: t('programs.list.stemClubs.stats.projects'), value: t('programs.list.stemClubs.stats.projectsValue') },
        { label: t('programs.list.stemClubs.stats.ageGroups'), value: t('programs.list.stemClubs.stats.ageGroupsValue') }
      ],
      features: t('programs.list.stemClubs.features').split('|'),
      image: "/assets/stem-club.jpg"
    },
    {
      id: 'academicSupport',
      title: t('programs.list.academicSupport.title'),
      subtitle: t('programs.list.academicSupport.subtitle'),
      description: t('programs.list.academicSupport.description'),
      icon: BookOpen,
      color: cssVars.warning(),
      gradient: "from-amber-500 to-orange-500",
      stats: [
        { label: t('programs.list.academicSupport.stats.subjects'), value: t('programs.list.academicSupport.stats.subjectsValue') },
        { label: t('programs.list.academicSupport.stats.successRate'), value: t('programs.list.academicSupport.stats.successRateValue') },
        { label: t('programs.list.academicSupport.stats.tutors'), value: t('programs.list.academicSupport.stats.tutorsValue') }
      ],
      features: t('programs.list.academicSupport.features').split('|'),
      image: "/assets/academic-support.jpg"
    },
    {
      id: 'summerCamps',
      title: t('programs.list.summerCamps.title'),
      subtitle: t('programs.list.summerCamps.subtitle'),
      description: t('programs.list.summerCamps.description'),
      icon: Globe,
      color: cssVars.primary(),
      gradient: "from-blue-600 to-cyan-600",
      stats: [
        { label: t('programs.list.summerCamps.stats.campWeeks'), value: t('programs.list.summerCamps.stats.campWeeksValue') },
        { label: t('programs.list.summerCamps.stats.participants'), value: t('programs.list.summerCamps.stats.participantsValue') },
        { label: t('programs.list.summerCamps.stats.locations'), value: t('programs.list.summerCamps.stats.locationsValue') }
      ],
      features: t('programs.list.summerCamps.features').split('|'),
      image: "/assets/summer-camp.jpg"
    },
    {
      id: 'teacherTraining',
      title: t('programs.list.teacherTraining.title'),
      subtitle: t('programs.list.teacherTraining.subtitle'),
      description: t('programs.list.teacherTraining.description'),
      icon: Users,
      color: "#10b981",
      gradient: "from-emerald-500 to-teal-500",
      stats: [
        { label: t('programs.list.teacherTraining.stats.teachersTrained'), value: t('programs.list.teacherTraining.stats.teachersTrainedValue') },
        { label: t('programs.list.teacherTraining.stats.schools'), value: t('programs.list.teacherTraining.stats.schoolsValue') },
        { label: t('programs.list.teacherTraining.stats.certifications'), value: t('programs.list.teacherTraining.stats.certificationsValue') }
      ],
      features: t('programs.list.teacherTraining.features').split('|'),
      image: "/assets/teacher-training.jpg"
    }
  ]

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-white to-slate-50/50">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container px-4 mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-5xl mx-auto mb-20"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-3 mb-3 sm:mb-4"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '40px' }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="h-[2px] bg-[var(--accent)]"
            />
            <span className="text-sm sm:text-base font-semibold uppercase tracking-wider text-[var(--accent)]">
              {t('programs.badge')}
            </span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '40px' }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="h-[2px] bg-[var(--accent)]"
            />
          </motion.div>


          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 block">
              {t('programs.title.part1')}
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 block">
              {t('programs.title.part2')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
            {t('programs.description')}
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: t('programs.header.stats.learnersValue'), label: t('programs.header.stats.learnersLabel'), icon: Users },
              { value: t('programs.header.stats.programsValue'), label: t('programs.header.stats.programsLabel'), icon: BookOpen },
              { value: t('programs.header.stats.schoolsValue'), label: t('programs.header.stats.schoolsLabel'), icon: Target },
              { value: t('programs.header.stats.satisfactionValue'), label: t('programs.header.stats.satisfactionLabel'), icon: Zap }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Card background effect */}
              <div className={`absolute -inset-4 bg-gradient-to-br ${program.gradient}/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300`} />

              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                {/* Image container */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-6 left-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${program.gradient} shadow-lg`}>
                      <program.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-8 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
                      <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">
                        {program.subtitle}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                      {program.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      {program.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {program.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 py-4 border-t border-slate-100">
                      {program.stats.map((stat, i) => (
                        <div key={i} className="text-center">
                          <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                          <div className="text-xs text-slate-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="flex justify-between items-center">
                    <Link href={`/programs/${program.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Button
                        variant="ghost"
                        className="group/btn gap-2 hover:bg-slate-50"
                      >
                        {t('programs.buttons.learnMore')}
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Button
                      className={`gap-2 rounded-full px-6 font-semibold bg-gradient-to-r ${program.gradient} hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300`}
                    >
                      {t('programs.buttons.enrollNow')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl" />

          <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-200/50 shadow-xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full translate-y-32 -translate-x-32" />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex justify-center items-center gap-3 mb-3 sm:mb-4"
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '40px' }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="h-[2px]"
                  style={{ backgroundColor: cssVars.accent() }}
                />
                <span
                  className="text-sm sm:text-base font-semibold uppercase tracking-wider"
                  style={{ color: cssVars.accent() }}
                >
                  {t('programs.cta.badge')}
                </span>
              </motion.div>

              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {t('programs.cta.titlePrefix')}
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {t('programs.cta.titleEmphasis')}
                </span>
              </h3>

              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                {t('programs.cta.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/programs">
                  <Button
                    size="lg"
                    className="gap-3 rounded-full px-8 py-7 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
                  >
                    {t('programs.buttons.exploreAll')}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-3 rounded-full px-8 py-7 text-lg font-semibold border-2 border-slate-300 hover:border-slate-400 hover:bg-white/50 transition-all duration-300"
                  >
                    {t('programs.buttons.scheduleDemo')}
                    <Users className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <p className="mt-8 text-sm text-slate-500">
                {t('programs.cta.note')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProgramsSection