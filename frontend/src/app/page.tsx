"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  BarChart3,
  Clock,
  ArrowUpRight,
  Play,
  BookOpen,
  CheckCircle2,
  Lock,
  Activity,
  Zap,
  Building2,
  GraduationCap,
  FlaskConical,
  Award,
  MapPin,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ──────────────────────────────────────────────────────
   Reveal helper
────────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────
   Section label
────────────────────────────────────────────────────── */
function Label({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-blue-400/70">
      <span className="w-5 h-px bg-blue-400/50" />
      {children}
    </p>
  );
}

/* ══════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════ */
function Hero({ onStart }: { onStart: () => void }) {
  const [slide, setSlide] = useState(0);
  const images = [
    "/home_page_assets/secure_img1.jpg",
    "/home_page_assets/monitoring_img1.avif",
    "/home_page_assets/Enhanced_learning_img1.webp",
  ];

  useEffect(() => {
    const t = setInterval(() => setSlide((p) => (p + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-14 lg:px-20 pt-16 pb-20">

      {/* grid lines */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* watermark */}
      <span
        className="pointer-events-none select-none absolute right-[-2%] top-1/2 -translate-y-1/2 text-[20vw] font-black leading-none"
        style={{ color: "rgba(255,255,255,0.018)" }}
        aria-hidden
      >
        SRIT
      </span>

      {/* blobs */}
      <div className="pointer-events-none absolute top-[-12%] left-[-8%] w-[520px] h-[520px] rounded-full bg-blue-600/[0.07] blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[8%] w-[420px] h-[420px] rounded-full bg-purple-600/[0.06] blur-[120px]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">

        {/* counselling code badge */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-8 flex flex-wrap items-center gap-4"
        >
          <Label>TNEA Counselling Code: 2725</Label>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Phone className="w-3 h-3" />
            +91-75987 41852
          </span>
        </motion.div>

        {/* asymmetric two-col */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-14">

          {/* ── left: headline + CTA (58%) ── */}
          <div className="lg:w-[58%] lg:pr-16">
            <motion.h1
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
              className="text-[clamp(2.6rem,7.5vw,5.6rem)] font-black leading-[0.9] tracking-tight text-white"
            >
              Sri Ramakrishna
              <br />
              <span className="text-blue-400">Institute of</span>
              <br />
              Technology
              <br />
              <em className="font-light not-italic text-white/25 text-[0.62em]">
                Secure Quiz Platform
              </em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="mt-8 text-[1rem] text-slate-400 leading-[1.78] max-w-[420px]"
            >
              Accredited by NAAC with <strong className="text-white font-semibold">'A' Grade</strong>, approved
              by AICTE and permanently affiliated to Anna University, Chennai.
              An autonomous institution delivering quality engineering education since 2002.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-4 items-center"
            >
              <button
                onClick={onStart}
                className="group relative overflow-hidden flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-blue-500 text-white font-semibold text-sm shadow-[0_8px_32px_rgba(59,130,246,0.32)] hover:shadow-[0_8px_52px_rgba(59,130,246,0.5)] transition-shadow duration-300"
              >
                <Play className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Start Creating Quizzes</span>
                <ArrowUpRight className="w-4 h-4 relative z-10 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <span className="text-slate-600 text-xs">For SRIT faculty &amp; students</span>
            </motion.div>

            {/* accreditation chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.72 }}
              className="mt-9 flex flex-wrap gap-5"
            >
              {["NAAC 'A' Grade", "AICTE Approved", "Anna University Affiliated", "Autonomous Institution"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500/60" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── right: image panel (42%) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
            className="lg:w-[42%] relative"
          >
            <div className="relative rounded-[2.2rem] overflow-hidden aspect-[3/4] md:aspect-[4/5] shadow-[0_32px_80px_rgba(0,0,0,0.55)] border border-white/[0.055]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image src={images[slide]} alt="SRIT campus" fill className="object-cover" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a]/80 via-[#0b0f1a]/10 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* slide dots */}
              <div className="absolute bottom-5 left-6 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)}
                    className={`h-[3px] rounded-full transition-all duration-400 ${i === slide ? "w-6 bg-blue-400" : "w-2 bg-white/20"}`}
                  />
                ))}
              </div>

              {/* floating: campus area */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 -left-5 flex items-center gap-3 bg-[#0d1221]/90 backdrop-blur-xl border border-white/[0.07] rounded-2xl px-4 py-3 shadow-2xl"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white">Campus Area</p>
                  <p className="text-[10px] text-slate-500">49.99 acres, Coimbatore</p>
                </div>
              </motion.div>

              {/* floating: NAAC */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-16 -right-5 flex items-center gap-3 bg-[#0d1221]/90 backdrop-blur-xl border border-white/[0.07] rounded-2xl px-4 py-3 shadow-2xl"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white">NAAC Grade</p>
                  <p className="text-[10px] text-emerald-400 font-bold">CGPA 3.20 / A</p>
                </div>
              </motion.div>
            </div>

            {/* stats below image */}
            <div className="mt-5 flex justify-end gap-6">
              {[["2002", "Est. Year"], ["65,117 m²", "Built-up Area"]].map(([val, lbl]) => (
                <div key={lbl} className="text-right">
                  <p className="text-xl font-black text-white leading-none">{val}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5 uppercase tracking-wider">{lbl}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   MARQUEE — recruiters + important links
══════════════════════════════════════════════════════ */
const MARQUEE_TAGS = [
  "Zoho","City Union Bank","Payoda Technologies","Accenture","L&T Infotech",
  "Wipro","IVTL","Terralogic","Shanthi Gears","Mphasis","Inautix","Verticurl",
  "Torry Harris","CGI","Dhyan","Lucid Imaging","Odessa","Soliton","Newgen",
  "Maveric","Tech Mahindra",
];

function Marquee() {
  const doubled = [...MARQUEE_TAGS, ...MARQUEE_TAGS];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.04] py-5 bg-white/[0.008]">
      <p className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-semibold tracking-widest uppercase text-slate-700 z-10 hidden sm:block">
        Our Recruiters
      </p>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        className="flex gap-5 whitespace-nowrap w-max pl-36"
      >
        {doubled.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.055] bg-white/[0.025] text-slate-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ABOUT SECTION — vision + mission
══════════════════════════════════════════════════════ */
function About() {
  return (
    <section className="relative py-28 px-6 md:px-14 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* two-col: left text, right quote-style cards */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-start">

          {/* left */}
          <div>
            <Reveal>
              <Label>About the Institution</Label>
              <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight text-white">
                Engineering excellence
                <em className="block font-light not-italic text-white/25">since 2002.</em>
              </h2>
              <p className="mt-6 text-slate-400 leading-[1.8] text-[0.95rem]">
                Sri Ramakrishna Institute of Technology (SRIT), an Autonomous Institution affiliated
                to Anna University, is one of the most eminent educational institutions in Coimbatore
                district. Managed by <strong className="text-slate-300">SNR Sons Charitable Trust</strong>,
                the college has imprinted a lasting position in engineering education by creating
                graduates equipped for industry and society.
              </p>
              <p className="mt-4 text-slate-500 leading-[1.8] text-[0.9rem]">
                The institution is located in a tranquil environment spread over{" "}
                <strong className="text-slate-400">49.99 acres</strong> with a built-up area of{" "}
                <strong className="text-slate-400">65,117 sq.m</strong>, featuring state-of-the-art
                educational aids and well-constructed buildings.
              </p>
            </Reveal>

            {/* quick facts */}
            <Reveal delay={0.1} className="mt-10 grid grid-cols-2 gap-3">
              {[
                { label: "Est.", value: "2002" },
                { label: "Campus", value: "49.99 ac" },
                { label: "Built Area", value: "65,117 m²" },
                { label: "Trust Institutions", value: "17+" },
              ].map((f) => (
                <div key={f.label} className="rounded-2xl border border-white/[0.055] bg-white/[0.015] px-5 py-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">{f.label}</p>
                  <p className="text-xl font-black text-white mt-0.5">{f.value}</p>
                </div>
              ))}
            </Reveal>
          </div>

          {/* right: vision + mission cards */}
          <div className="flex flex-col gap-5">
            <Reveal delay={0.08}>
              <div className="relative rounded-3xl border border-blue-500/[0.18] bg-blue-500/[0.04] p-8 overflow-hidden">
                <span className="pointer-events-none select-none absolute top-3 right-5 text-[4.5rem] font-black leading-none" style={{ color: "rgba(255,255,255,0.03)" }}>V</span>
                <div className="inline-flex w-10 h-10 rounded-xl bg-blue-500/10 items-center justify-center mb-5">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Our Vision</h3>
                <p className="text-slate-400 text-sm leading-[1.8]">
                  To develop into a World Class Technological Institute with centres of excellence
                  in various disciplines by providing quality and value-based education with
                  continuous upgradation of infrastructure, human resources and teaching–learning process.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="relative rounded-3xl border border-purple-500/[0.18] bg-purple-500/[0.04] p-8 overflow-hidden">
                <span className="pointer-events-none select-none absolute top-3 right-5 text-[4.5rem] font-black leading-none" style={{ color: "rgba(255,255,255,0.03)" }}>M</span>
                <div className="inline-flex w-10 h-10 rounded-xl bg-purple-500/10 items-center justify-center mb-5">
                  <FlaskConical className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Our Mission</h3>
                <p className="text-slate-400 text-sm leading-[1.8]">
                  To produce Quality Engineers, Scientists and Managers equipped with unbounded
                  technical skills, domain knowledge and excellent moral values, for the advancement
                  of the industry, business and for the emancipation of society.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   FEATURES — Quiz platform features, SRIT context
══════════════════════════════════════════════════════ */
const FEATURES = [
  {
    icon: Shield,
    num: "01",
    title: "Secure Environment",
    body: "Advanced anti-cheating with fullscreen enforcement and automatic violation detection — designed for SRIT's academic integrity standards.",
    wide: true,
    borderCls: "border-blue-500/[0.18]",
    iconCls: "bg-blue-500/10 text-blue-400",
    glowCls: "bg-blue-500/[0.04]",
  },
  {
    icon: Users,
    num: "02",
    title: "Dual Role System",
    body: "Separate dashboards for SRIT faculty and students with granular, role-based permissions.",
    wide: false,
    borderCls: "border-purple-500/[0.18]",
    iconCls: "bg-purple-500/10 text-purple-400",
    glowCls: "bg-purple-500/[0.04]",
  },
  {
    icon: BarChart3,
    num: "03",
    title: "Advanced Analytics",
    body: "Question-level heatmaps, per-student performance curves, and instant report export.",
    wide: false,
    borderCls: "border-cyan-500/[0.18]",
    iconCls: "bg-cyan-500/10 text-cyan-400",
    glowCls: "bg-cyan-500/[0.04]",
  },
  {
    icon: Clock,
    num: "04",
    title: "Real-time Monitoring",
    body: "Socket.io-powered sync keeps every participant in perfect lockstep across devices.",
    wide: false,
    borderCls: "border-emerald-500/[0.18]",
    iconCls: "bg-emerald-500/10 text-emerald-400",
    glowCls: "bg-emerald-500/[0.04]",
  },
];

function Features() {
  return (
    <section id="features" className="relative py-24 px-6 md:px-14 lg:px-20 overflow-hidden">

      {/* separator */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-14 max-w-xl">
          <Label>Quiz Platform Features</Label>
          <h2 className="mt-4 text-[clamp(2rem,5vw,3.4rem)] font-black leading-tight text-white">
            Built for SRIT
            <em className="block font-light not-italic text-white/25">assessment integrity.</em>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={i} delay={i * 0.08} className={f.wide ? "lg:col-span-2" : ""}>
                <div className={`group relative h-full rounded-3xl border ${f.borderCls} bg-white/[0.015] overflow-hidden p-7 hover:bg-white/[0.03] transition-colors duration-300`}>
                  <span className="pointer-events-none select-none absolute top-4 right-5 text-[5rem] font-black leading-none" style={{ color: "rgba(255,255,255,0.03)" }} aria-hidden>{f.num}</span>
                  <div className={`inline-flex w-11 h-11 rounded-2xl items-center justify-center mb-5 ${f.iconCls}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`font-bold text-white mb-3 ${f.wide ? "text-2xl" : "text-lg"}`}>{f.title}</h3>
                  <p className={`text-slate-400 leading-relaxed ${f.wide ? "text-base max-w-sm" : "text-sm"}`}>{f.body}</p>
                  {f.wide && (
                    <div className="mt-7 flex items-center gap-1.5 text-sm font-semibold text-blue-400 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                      Learn more <ArrowUpRight className="w-4 h-4" />
                    </div>
                  )}
                  <div className={`absolute inset-0 ${f.glowCls} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   HIGHLIGHTS — collaborations + why SRIT
══════════════════════════════════════════════════════ */
const HIGHLIGHTS = [
  {
    icon: Building2,
    title: "IIT Bombay Collaboration",
    body: "SRIT is a Remote Center for IIT Bombay under the Train 10000 Teachers Programme (T10KT) to conduct ISTE Workshops.",
    tag: "Since 2012",
  },
  {
    icon: FlaskConical,
    title: "Funded Research Projects",
    body: "Ongoing consultancy work including acoustic-based Steam Leak Detection for Power Boilers (Micromax Systems, Trichy) and textile dyeing sludge conversion projects.",
    tag: "Active",
  },
  {
    icon: Award,
    title: "NAAC Re-accredited 'A' Grade",
    body: "Re-accredited with a CGPA of 3.20 on a four-point scale. Recognised as a leader in engineering education, research and knowledge application.",
    tag: "CGPA 3.20",
  },
  {
    icon: GraduationCap,
    title: "Industry MoUs",
    body: "Active MoUs with Infosys (Campus Connect), CISCO, BSNL, CODISSIA, KKM Soft, Salzer Electronics, and more industry partners.",
    tag: "20+ MoUs",
  },
];

function Highlights() {
  return (
    <section className="relative py-24 px-6 md:px-14 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <Reveal className="mb-14">
          <Label>Why Choose SRIT</Label>
          <h2 className="mt-4 text-[clamp(1.8rem,4.5vw,3rem)] font-black leading-tight text-white">
            A track record
            <em className="block font-light not-italic text-white/25">you can trust.</em>
          </h2>
        </Reveal>

        {/* staggered row — intentionally not a uniform grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {HIGHLIGHTS.map((h, i) => {
            const Icon = h.icon;
            return (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`group relative rounded-3xl border border-white/[0.06] bg-white/[0.015] p-7 hover:border-white/[0.1] hover:bg-white/[0.025] transition-all duration-300 ${i === 1 ? "sm:mt-8" : ""}`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="inline-flex w-10 h-10 rounded-xl bg-white/[0.05] items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-blue-400/60 border border-blue-400/20 rounded-full px-3 py-1">
                      {h.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{h.title}</h3>
                  <p className="text-slate-500 text-sm leading-[1.8]">{h.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   CTA
══════════════════════════════════════════════════════ */
function CTA({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative py-24 px-6 md:px-14 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="relative rounded-[2.5rem] border border-white/[0.055] bg-white/[0.015] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[280px] rounded-full bg-blue-600/[0.08] blur-[80px]" />

            <div className="relative grid lg:grid-cols-[1fr_auto] gap-10 items-center px-10 py-14 md:px-16 md:py-16">
              <div>
                <Label>Ready to Begin</Label>
                <h2 className="mt-5 text-[clamp(1.8rem,4vw,3rem)] font-black text-white leading-tight max-w-xl">
                  Transform your{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">assessment</span>{" "}
                  experience at SRIT.
                </h2>
                <p className="mt-5 text-slate-400 leading-relaxed max-w-lg text-[0.95rem]">
                  Create unlimited quizzes, implement them seamlessly across departments, and trust
                  the platform to handle academic integrity — for every SRIT faculty member and student.
                </p>
                <ul className="mt-7 flex flex-col gap-2.5">
                  {[
                    "Free for all SRIT members",
                    "No setup fees or hidden charges",
                    "Available 24 / 7 across all devices",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-blue-500/70 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-start lg:items-center gap-3 shrink-0">
                <button
                  onClick={onStart}
                  className="group relative overflow-hidden flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-blue-500 text-white font-semibold text-sm shadow-[0_8px_32px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_52px_rgba(59,130,246,0.48)] transition-shadow duration-300 whitespace-nowrap"
                >
                  <BookOpen className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Get Started Now</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                <p className="text-[11px] text-slate-700">For admissions: +91-75987 41852</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════ */
const FOOTER_LINKS = {
  Academics: ["Computer Science & Engineering","ECE","Electrical & Electronics","Mechanical Engineering","Information Technology","Science & Humanities"],
  Institution: ["About SRIT","History","Management","Principal's Message","Governing Body","IQAC"],
  Resources: ["NIRF Disclosures","AICTE Disclosures","UGC Mandatory","Anti-Ragging Committee","Downloads","Placements"],
};

function Footer() {
  return (
    <footer className="border-t border-white/[0.04] px-6 md:px-14 lg:px-20 pt-16 pb-10">
      <div className="max-w-7xl mx-auto">

        {/* top: brand + links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-sm font-bold text-white leading-none">SecureQuiz — SRIT</p>
            </div>
            <p className="text-xs text-slate-600 leading-[1.8]">
              Secure assessment platform built exclusively for the Sri Ramakrishna Institute of Technology community.
            </p>
            <p className="mt-4 text-xs text-slate-700">TNEA Code: <span className="text-slate-500">2725</span></p>
            <p className="text-xs text-slate-700 mt-1">+91-75987 41852</p>
          </div>

          {/* link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">{heading}</p>
              <ul className="flex flex-col gap-2">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-xs text-slate-600 hover:text-slate-300 transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-700">
            © 2026 <a href="https://srit.org" className="hover:text-slate-500 transition-colors">srit.org</a>. All rights reserved.
          </p>
          <p className="text-xs text-slate-700">
            Accredited by NAAC · Approved by AICTE · Affiliated to Anna University, Chennai
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════
   ROOT PAGE
══════════════════════════════════════════════════════ */
export default function HomePage() {
  const router = useRouter();
  const go = () => router.push("/auth/login");

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white overflow-x-hidden selection:bg-blue-500/30">
      {/* grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.022]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "160px 160px",
        }}
      />
      <div className="relative z-10">
        <Hero onStart={go} />
        <Marquee />
        <About />
        <Features />
        <Highlights />
        <CTA onStart={go} />
        <Footer />
      </div>
    </div>
  );
}