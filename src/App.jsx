import React, { useState, useEffect, Suspense, lazy } from "react";
import { Phone, ArrowRight, ChevronDown, CheckCircle2, ChevronLeft, ChevronRight, Menu, X, Triangle, Building, Building2, Landmark, Diamond, User, Briefcase, Settings, Link as LinkIcon, Send, Share2, TrendingUp, Palette, Users, Rocket, ArrowUpRight, Target } from "lucide-react";
const PremiumMap = lazy(() => import("./PremiumMap"));

const projectsData = [
  { title: "NUMAN GROUP", subtitle: "Asosiy kompaniya", value1: "140 mlrd+", label1: "shartnomalar", value2: "400+ ta", label2: "xonadon sotildi", video: "/numan-group-carusel.mp4", logo: "/logos/numan.webp" },
  { title: "OLTINSOY CITY", subtitle: "Turar joy majmuasi", value1: "35 mlrd+", label1: "sotuv", value2: "100 ta", label2: "uy sotildi", video: "/oltinsoy-carusel.mp4", logo: "/logos/oltinsoy.webp" },
  { title: "ECO TOWER", subtitle: "Turar joy majmuasi", value1: "87,5 mlrd+", label1: "sotuv", value2: "250 ta", label2: "uy sotildi", logo: "/logos/logo2.webp", darkLogoBg: true },
  { title: "YAQINLAR", subtitle: "Turar joy majmuasi", value1: "70 mlrd+", label1: "sotuv", value2: "200 ta", label2: "uy sotildi", logo: "/logos/logo5.webp", darkLogoBg: true },
  { title: "BEKOBOD TURON", subtitle: "Turar joy majmuasi", value1: "17,5 mlrd+", label1: "sotuv", value2: "50 ta", label2: "uy sotildi", logo: "/logos/logo3.webp", darkLogoBg: true },
  { title: "SHIRIN", subtitle: "Turar joy majmuasi", value1: "350 mlrd+", label1: "sotuv", value2: "1000 ta", label2: "uy sotildi", logo: "/logos/shirin.webp", darkLogoBg: true },
  { title: "SOHILBO'YI", subtitle: "Turar joy majmuasi", value1: "105 mlrd+", label1: "sotuv", value2: "300 ta", label2: "uy sotildi", logo: "/logos/logo1.webp", darkLogoBg: true }
];

import { motion, AnimatePresence } from "framer-motion";
import CountUpPkg from "react-countup";
const CountUp = CountUpPkg.default || CountUpPkg;
import MarqueePkg from "react-fast-marquee";
const Marquee = MarqueePkg.default || MarqueePkg;
import "leaflet/dist/leaflet.css";

const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_CHAT_ID;

async function sendToTelegram(data) {
  const text =
    `📋 *Yangi ariza — Ravnaq Group*\n\n` +
    `👤 *Ism:* ${data.name}\n` +
    `📞 *Telefon:* ${data.phone}\n` +
    `🏢 *Kompaniya:* ${data.company}\n` +
    `💼 *Lavozim:* ${data.position}\n` +
    `🛠 *Xizmat:* ${data.service}\n` +
    `❓ *Qanday muammo:* ${data.problem}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: "Markdown" }),
    });
    return response.ok;
  } catch (error) {
    console.error("Telegramga yuborishda xatolik:", error);
    return false;
  }
}

// Global Animation Variants
const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const fadeRightVariant = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const fadeLeftVariant = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.15,
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    }
  })
};

export default function App() {
  const [openFaq, setOpenFaq] = useState(0);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", company: "", position: "", service: "", source: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [currentProjectSlide, setCurrentProjectSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

    const maxSlide = isMobile ? projectsData.length - 1 : Math.max(0, projectsData.length - 2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProjectSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [maxSlide]);

  const nextProjectSlide = () => setCurrentProjectSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  const prevProjectSlide = () => setCurrentProjectSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setError("Ism va telefon raqamini to'ldiring!"); return; }
    setSending(true); setError("");
    const ok = await sendToTelegram(form);
    setSending(false);
    if (ok) { setSent(true); setForm({ name: "", phone: "", company: "", position: "", service: "", source: "" }); }
    else setError("Xatolik yuz berdi. Qayta urinib ko'ring.");
  };

  const faqs = [
    { question: "01. RAVNAQ GROUP qanday ishlaydi?", answer: "Biz qurilish loyihasining marketing va sotuv jarayonlarini yagona tizimda boshqaramiz. Maqsadimiz — loyihaga sifatli xaridorlarni olib kelish va ularni real sotuvga aylantirish." },
    { question: "02. Hamkorlik uchun oldindan to'lov qilinadimi?", answer: "Yo'q. Hamkorlikni oldindan to'lovsiz boshlaymiz. Bizning daromadimiz sotilgan xonadonlardan olinadigan komissiya asosida shakllanadi." },
    { question: "03. RAVNAQ GROUP qanday xizmatlarni o'z ichiga oladi?", answer: "RAVNAQ GROUP — qurilish loyihasining marketing va sotuvini to'liq boshqaradigan yagona tizim. Strategiyadan boshlab SMM, lead generation, CRM, sotuv bo'limi, zapusk va quruvchining shaxsiy brendigacha bo'lgan barcha jarayonlar bitta hamkorlik modeli ichida amalga oshiriladi." },
    { question: "04. Faqat marketing bilan shug'ullanasizmi?", answer: "Yo'q. Biz faqat reklama, SMM yoki lead generation bilan cheklanmaymiz. Marketingdan boshlab, mijozni jalb qilish, CRM orqali boshqarish va uni real sotuvga aylantirishgacha bo'lgan butun jarayonni o'z zimmamizga olamiz." },
    { question: "05. Sotuv bo'limini ham tashkil qilib berasizmi?", answer: "Ha. Sotuvchilar, ROP, skriptlar, KPI va nazorat tizimini shakllantirib, sotuv jarayonini yo'lga qo'yamiz." },
    { question: "06. Qanday qurilish loyihalari bilan ishlaysiz?", answer: "50 tadan 5000+ tagacha xonadonli qurilish loyihalari bilan ishlaymiz. Hamkorlik modeli loyiha hajmi va sotuv maqsadiga qarab shakllantiriladi." },
    { question: "07. Xonadonlarni qancha vaqtda sotib berasiz?", answer: "Bu loyihaning joylashuvi, narxi, qurilish bosqichi, xonadonlar soni va bozor talabiga bog'liq. Loyihani tahlil qilgandan so'ng real sotuv rejasi ishlab chiqiladi." },
    { question: "08. Reklama uchun alohida budjet kerakmi?", answer: "Ha. Reklama budjeti loyiha uchun alohida belgilanadi. Budjet miqdori auditoriya, loyiha hajmi va sotuv maqsadidan kelib chiqib aniqlanadi." },
    { question: "09. Hamkorlikni boshlash uchun nima qilish kerak?", answer: "Biz bilan bog'lanasiz. Loyihangizni tahlil qilamiz, mavjud marketing va sotuv holatini o'rganamiz hamda sizga mos hamkorlik modelini taklif qilamiz." },
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 2;
      });
    }, 40); // 40ms * 50 steps = 2000ms total

    const splashTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(splashTimer);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0f0f17 100%)" }}
          >
            {/* Ambient gold glow behind logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.18, scale: 1.4 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute w-96 h-96 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, #C8A96E 0%, transparent 70%)" }}
            />

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 mb-16"
            >
              <img
                src="/ravnaq-logo.png"
                alt="Ravnaq Group"
                width="192" height="80"
                className="w-36 sm:w-48 h-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative z-10 w-48 sm:w-64"
            >
              {/* Track */}
              <div className="w-full h-[1px] bg-white/10 rounded-full overflow-hidden">
                {/* Fill */}
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #C8A96E, #f0d48a)",
                    boxShadow: "0 0 8px rgba(200, 169, 110, 0.6)"
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen font-sans bg-ravnaq-light-bg text-ravnaq-black">
        {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
          <div className={`bg-white h-[72px] flex justify-between items-center px-6 relative z-50 transition-all duration-300 ${isMobileMenuOpen ? 'rounded-b-none shadow-none' : 'rounded-b-2xl shadow-lg'}`}>
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a href="#">
                <img src="/pictures/ravnaq-group-logo.webp" alt="Ravnaq Group" width="160" height="72" className="h-16 sm:h-[72px] w-auto object-contain transform scale-110 origin-left" />
              </a>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex space-x-10 text-sm font-medium text-gray-500">
              <a href="#" className="hover:text-ravnaq-dark transition">Asosiy</a>
              <a href="#biz-kimmiz" className="hover:text-ravnaq-dark transition">Kompaniya</a>
              <a href="#" className="hover:text-ravnaq-dark transition">Loyihalar</a>
              <a href="#faq" className="hover:text-ravnaq-dark transition">FAQ</a>
              <a href="#contact" className="hover:text-ravnaq-dark transition">Bog'lanish</a>
            </nav>

            {/* Contact Button */}
            <div className="hidden lg:flex items-center">
              <a href="#contact" className="bg-ravnaq-dark text-white px-5 py-2.5 rounded-[12px] font-semibold flex items-center gap-2 hover:bg-gray-800 transition shadow-md">
                <Phone size={16} className="text-ravnaq-gold" />
                <span>+998 77 277 37 65</span>
              </a>
            </div>
            
            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button aria-label="Menyuni ochish" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-ravnaq-dark hover:text-ravnaq-gold transition">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Premium Mobile Menu Dropdown */}
          <div 
            className="lg:hidden absolute top-[72px] left-4 right-4 bg-white shadow-2xl rounded-b-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-40"
            style={{
              maxHeight: isMobileMenuOpen ? '500px' : '0px',
              opacity: isMobileMenuOpen ? 1 : 0
            }}
          >
            <div className="flex flex-col p-6 space-y-4">
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-ravnaq-dark hover:text-ravnaq-gold transition px-2">Asosiy</a>
              <div className="h-px w-full bg-gray-100"></div>
              <a href="#biz-kimmiz" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-ravnaq-dark hover:text-ravnaq-gold transition px-2">Kompaniya</a>
              <div className="h-px w-full bg-gray-100"></div>
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-ravnaq-dark hover:text-ravnaq-gold transition px-2">Loyihalar</a>
              <div className="h-px w-full bg-gray-100"></div>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-ravnaq-dark hover:text-ravnaq-gold transition px-2">FAQ</a>
              <div className="pt-4">
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-4 text-center bg-ravnaq-dark text-white text-base font-semibold rounded-2xl shadow-lg hover:bg-gray-800 transition">
                  Bog'lanish
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Full-screen wrapper for Hero and Partners */}
        <div className="min-h-screen flex flex-col">
          {/* Hero Section */}
          <section className="relative flex-1 flex flex-col justify-center pt-24 pb-16 lg:pt-[72px] overflow-hidden bg-ravnaq-dark">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/pictures/hero.webp" 
              alt="Construction Worker" 
              width="1920" height="1080" 
              fetchpriority="high" 
              className="w-full h-full object-cover object-[center_top]"
            />
            <div className="absolute inset-0 bg-[#1a2332]/1 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332] via-[#1a2332]/40 to-transparent"></div>
          </div>

          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left relative z-10 lg:pt-16 xl:pt-24 max-w-2xl mx-auto lg:mx-0">
                
                
                <motion.h1 
                  className="text-[40px] sm:text-[48px] lg:text-[54px] font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
                  custom={1}
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  Qurilish biznesingiz uchun <br className="hidden sm:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-ravnaq-gold to-yellow-400">
                    raqamlashtirilgan sotuv bo'limi<br className="hidden sm:block"/> va marketing xizmati
                  </span>
                </motion.h1>

                <motion.p 
                  className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed font-medium"
                  custom={2}
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  Strategiya, brending, reklama, lidlar oqimi va tahlilgacha va 
                  sotuvning barcha jarayonlarini raqamlashtirilgan yagona ekotizimda boshqaramiz.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                  custom={3}
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <button className="bg-ravnaq-gold hover:bg-[#c5913d] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Bepul diagnostika olish
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              </div>

              {/* Right Content - Stats Card */}
              <motion.div 
                className="flex justify-center lg:justify-end mt-12 lg:mt-0 w-full z-10"
                custom={4}
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="bg-[#f9f9f9]/95 backdrop-blur-xl border-4 border-white/40 rounded-[28px] p-6 sm:p-8 pb-0 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-[380px] w-full relative overflow-hidden">
                  <h2 className="text-[22px] font-bold text-[#1a2332] mb-8">Natijalarimiz</h2>
                  <div className="flex justify-between mb-8 px-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-ravnaq-gold"><CountUp end={20} duration={2} enableScrollSpy scrollSpyOnce />+</div>
                      <div className="text-xs text-gray-500 font-medium mt-1">loyiha</div>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-ravnaq-gold"><CountUp end={35} duration={2} enableScrollSpy scrollSpyOnce />+</div>
                      <div className="text-xs text-gray-500 font-medium mt-1">mutaxassis</div>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-ravnaq-gold"><CountUp end={10} duration={2} enableScrollSpy scrollSpyOnce />+</div>
                      <div className="text-xs text-gray-500 font-medium mt-1">yil tajriba</div>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="text-[34px] font-bold text-ravnaq-gold mb-0.5 leading-none">$<CountUp end={56} duration={2} enableScrollSpy scrollSpyOnce /> mln</div>
                    <div className="text-[11px] text-gray-500 mb-12">umumiy sotuv summasi</div>
                  </div>
                  {/* Smoother Chart graphic */}
                  <div className="absolute bottom-0 left-0 right-0 h-[100px] w-full z-0">
                     <svg className="w-full h-full" viewBox="0 0 380 100" preserveAspectRatio="none">
                       <path d="M0,70 C40,70 60,85 100,70 C140,55 170,30 210,50 C260,75 300,105 340,30 L380,60 L380,100 L0,100 Z" fill="rgba(217,163,74,0.15)" />
                       <path d="M0,70 C40,70 60,85 100,70 C140,55 170,30 210,50 C260,75 300,105 340,30 L380,60" fill="none" stroke="#D9A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          </section>

          {/* Partners Section */}
          <motion.section 
            className="py-8 bg-white border-b border-gray-100 shrink-0"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <h2 className="text-xl font-bold text-[#1a2332] text-center md:text-left md:w-1/4 leading-snug shrink-0">Bizning<br className="hidden md:block"/>loyihalarimiz</h2>
              <div className="flex-1 w-full relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                <Marquee gradient={false} speed={40} pauseOnHover={true} pauseOnClick={true}>
                  <div className="flex gap-6 pr-6 py-2">
                  {[
                    { name: 'Numan Tower', src: '/pictures/numan.webp' },
                    { name: 'Yangi Asr Uylari', src: '/pictures/yangi_asr.webp' },
                    { name: 'Oltinsoy City', src: '/pictures/oltinsoy.webp' },
                    { name: 'Turon Uylari', src: '/pictures/turon.webp' },
                    { name: 'MB Meros', src: '/pictures/mezzon.webp' },
                  ].map((logo, index) => (
                    <div key={index} className="flex justify-center items-center w-[160px] md:w-[200px] h-[140px] md:h-[160px] shrink-0 p-2 sm:p-4 bg-[#1a2332] rounded-[16px] shadow-[0_8px_20px_rgba(26,35,50,0.15)] border border-[#d4af37]/20 transition-transform duration-300 hover:-translate-y-1">
                      <img loading="lazy" src={logo.src} alt={logo.name} width="160" height="140" className="max-w-[90%] max-h-[90%] object-contain" />
                    </div>
                  ))}
                  </div>
                </Marquee>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

        {/* About Section */}
        <section className="py-24 bg-white overflow-hidden" id="biz-kimmiz">
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-ravnaq-dark">Biz kimmiz ?</h2>
          </motion.div>
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <motion.p variants={fadeRightVariant} className="text-lg text-ravnaq-gray leading-relaxed font-normal">
                  <span className="text-ravnaq-dark font-bold">RAVNAQ GROUP</span> — qurilish kompaniyalari uchun marketing va sotuv tizimini boshqaradigan jamoa. Biz alohida marketing yoki sotuv xizmatini emas, loyihaning marketingidan tortib real sotuvigacha bo'lgan jarayonni to'liq o'z zimmamizga olamiz. Quruvchi esa qurilish sifati va muddatiga e'tibor qaratadi.
                </motion.p>
                <motion.p variants={fadeRightVariant} className="text-lg text-ravnaq-gray leading-relaxed">
                  Bizning yondashuvimiz — marketing va sotuvni yagona raqamlashtirilgan tizimda boshqarish. Marketing orqali loyihaga talab va sifatli xaridorlar oqimini yaratamiz, RAVNAQ GROUP Akademiyasida tayyorlangan tajribali sotuvchilarni loyihaga biriktiramiz va kelgan murojaatlarni tizimli ravishda real sotuvga aylantiramiz.
                </motion.p>
                <motion.p variants={fadeRightVariant} className="text-lg text-ravnaq-gray leading-relaxed">
                  Har bir loyihaning hajmi, joylashuvi, qurilish bosqichi, auditoriyasi va mavjud sotuv holatini hisobga olib, individual yondashuvni shakllantiramiz. Bizning asosiy maqsadimiz — quruvchining marketing va sotuv bilan bog'liq bosh og'rig'ini o'z zimmamizga olib, xonadonlarning tezroq va samaraliroq sotilishini ta'minlash.
                </motion.p>
                <motion.div variants={fadeRightVariant} className="pt-4">
                  <a href="#contact" className="inline-block bg-ravnaq-gold text-white font-semibold px-8 py-3 rounded-full hover:bg-ravnaq-gold-hover transition duration-300 shadow-lg hover:-translate-y-1">
                    Bepul diagnostika olish
                  </a>
                </motion.div>
              </div>
              <motion.div variants={fadeLeftVariant} className="relative rounded-2xl overflow-hidden shadow-2xl h-[300px] sm:h-[400px] lg:h-[500px]">
                <img loading="lazy" 
                  src="/pictures/rt4y5ui.webp" 
                  alt="Office Meeting" 
                  width="600" height="500"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Problems Section */}
        <section className="py-24 bg-ravnaq-light-bg overflow-hidden">
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-ravnaq-dark max-w-3xl mx-auto">
              Qurilishda sotuvni sekinlashtiradigan<br/>6 ta asosiy muammo
            </h2>
          </motion.div>

          {/* Marquee container with blur edges via mask */}
          <motion.div
            className="relative"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
            }}
          >
            <Marquee gradient={false} speed={40} pauseOnHover={true} pauseOnClick={true}>
              <div className="flex gap-6 pr-6 py-4">
              {(() => {
                const cards = [
                  { 
                    img: "/pictures/1463db54173250c425b18faccc17a2dc.webp",
                    title: "Loyiha va bozor yetarlicha chuqur o'rganilmaydi.",
                    desc: "Loyiha raqobatchilar va bozor to'liq tahlil qilinmaydi. Natijada xaridor uchun kuchli va ajralib turadigan taklif ishlab chiqilmaydi.",
                    num: "01"
                  },
                  { 
                    img: "/pictures/280b71cdac2312f54fe65a1af6cbc72c.webp",
                    title: "Maqsadli mijozning aniq portreti tuzilmagan.",
                    desc: "Loyiha kimga sotilishi, xaridorning ehtiyoji, imkoniyati va qaror qabul qilishiga ta'sir qiluvchi omillar chuqur o'rganilmaydi.",
                    num: "02"
                  },
                  { 
                    img: "/pictures/604c187382d8778d7851c9a49901c3e8.webp",
                    title: "Sotuv bo'limi tizimlashtirilmagan.",
                    desc: "Sotuvchilar, ROP, skriptlar, KPI va nazorat tizimi yo'lga qo'yilmagani sababli kelgan mijozlarning bir qismi sotuvga aylantirilmaydi.",
                    num: "03"
                  },
                  { 
                    img: "/pictures/a056922e920aa4647cba3d490de74b43.webp",
                    title: "Lidlar sifatsiz, reklama byudjeti samarasiz sarflanadi.",
                    desc: "Maqsadli xaridorlar o'rniga sifatsiz murojaatlar keladi. Natijada reklama uchun sarflangan pulning bir qismi havoga uchadi.",
                    num: "04"
                  },
                  { 
                    img: "/pictures/fd149415820981d3d5c0c9e782dc0595.webp",
                    title: "Shaxsiy brend va ishonch yo'q.",
                    desc: "Mijozlar bilan ishonch o'rnatilmaganligi sababli, boshqa raqobatchilarga o'tib ketish ehtimoli oshadi.",
                    num: "05"
                  },
                  { 
                    img: "/pictures/chatgpt-image.webp",
                    title: "Katta hajmdagi xonadonlarni sotish tizimi yo'lga qo'yilmagan.",
                    desc: "Ko'p xonadonni qisqa muddatda sotish uchun maxsus zapusk strategiyasi ishlab chiqilmaydi va sotuvni sun'iy oshirish mexanizmi yo'lga qo'yilmaydi.",
                    num: "06"
                  },
                ];
                return cards.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md flex-shrink-0 flex flex-col group hover:shadow-xl transition-shadow duration-300" style={{ width: '300px', marginRight: '24px' }}>
                    <div className="overflow-hidden" style={{ height: '200px' }}>
                      <img loading="lazy" src={item.img} alt={item.title} width="300" height="200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    </div>
                    <div className="p-5 flex-1 flex flex-col relative">
                      <h3 className="font-bold text-base text-ravnaq-dark mb-2 pr-8 leading-snug">{item.title}</h3>
                      <p className="text-sm text-ravnaq-gray flex-1 leading-relaxed">{item.desc}</p>
                      <div className="absolute bottom-4 right-4 text-4xl font-bold text-ravnaq-gold opacity-40">{item.num}</div>
                    </div>
                  </div>
                ));
              })()}
              </div>
            </Marquee>
          </motion.div>

          <motion.div 
            className="mt-12 text-center"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
          >
            <a href="#contact" className="inline-block bg-ravnaq-gold text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-ravnaq-gold-hover transition duration-300 hover:-translate-y-1">
              Bepul diagnostika olish
            </a>
          </motion.div>
        </section>


        {/* Case Studies */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 sm:mb-12 gap-6"
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-ravnaq-dark text-center sm:text-left">Biz qurgan tizim – real<br className="hidden sm:block"/>natijalarda</h2>
              <div className="flex gap-2 justify-center sm:justify-start">
                <button aria-label="Oldingi slayd" onClick={prevProjectSlide} className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-ravnaq-dark hover:text-white transition hover:border-ravnaq-dark">
                  <ChevronLeft size={20} />
                </button>
                <button aria-label="Keyingi slayd" onClick={nextProjectSlide} className="w-12 h-12 rounded-full border border-ravnaq-dark bg-ravnaq-dark text-white flex items-center justify-center hover:bg-opacity-90 transition">
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="overflow-hidden relative"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out" 
                style={{ transform: `translateX(-${currentProjectSlide * (isMobile ? 100 : 50)}%)` }}
              >
                {projectsData.map((project, idx) => (
                  <div key={idx} className="w-full md:w-1/2 shrink-0 px-4">
                    <div className="group relative bg-white/70 backdrop-blur-lg border border-white/40 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                      {/* Decorative emotional glow */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-ravnaq-gold/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150 pointer-events-none"></div>

                      <div className="relative z-10">
                        <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ravnaq-dark to-gray-600 tracking-tight uppercase mb-1">{project.title}</h3>
                        <p className="text-sm font-medium text-ravnaq-gray/80 tracking-wide uppercase mb-8">{project.subtitle}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-8 flex-1 relative z-10">
                        <div className="flex flex-col justify-center">
                          <div className="text-4xl font-black text-ravnaq-dark tracking-tighter mb-1">{project.value1}</div>
                          <div className="text-sm font-semibold text-ravnaq-gray uppercase tracking-wider">{project.label1}</div>
                        </div>
                        <div className="row-span-2 flex justify-end items-stretch h-full w-full relative">
                           {project.video ? (
                             <div className="relative w-full h-48 sm:h-64 md:h-72 ml-4 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-shadow duration-500 border border-white/50">
                               <video 
                                 src={project.video} 
                                 className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                 autoPlay 
                                 muted 
                                 loop 
                                 playsInline
                                 preload="none"
                                 width="400" height="288"
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                             </div>
                           ) : project.logo ? (
                             <div className="flex items-center justify-center ml-4 self-center w-full">
                               <div className={`${project.darkLogoBg ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-100'} rounded-2xl p-4 shadow-sm group-hover:shadow-md transition-shadow duration-300 flex items-center justify-center w-36 h-36`}>
                                 <img
                                    src={project.logo}
                                    alt={project.title}
                                    width="144" height="144"
                                    loading="lazy"
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                  />
                               </div>
                             </div>
                           ) : (
                             <div className="w-32 h-32 opacity-20 self-center transition-opacity duration-500 group-hover:opacity-40" style={{ backgroundImage: 'radial-gradient(#0F172A 2px, transparent 2px)', backgroundSize: '12px 12px' }}></div>
                           )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <div className="text-4xl font-black text-ravnaq-dark tracking-tighter mb-1">{project.value2}</div>
                          <div className="text-sm font-semibold text-ravnaq-gray uppercase tracking-wider">{project.label2}</div>
                        </div>
                      </div>

                      <div className="mt-10 relative z-10">
                        <a href="https://www.instagram.com/ravnaq.group" target="_blank" rel="noopener noreferrer" className="group/btn bg-ravnaq-dark text-white font-semibold px-8 py-3 rounded-full text-sm inline-flex items-center gap-3 hover:bg-ravnaq-gold transition-colors duration-300 shadow-md hover:shadow-xl">
                          Ko'rish 
                          <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="mt-12 text-center"
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
            >
              <a href="#contact" className="inline-block bg-ravnaq-gold text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-ravnaq-gold-hover transition duration-300 hover:-translate-y-1">
                Bepul diagnostika olish
              </a>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-ravnaq-black text-white">
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest mb-4">XIZMATLARIMIZ</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Obyektingizni sotishga ishlaydigan tizim<br/>
              Har bir xizmat alohida emas - barchasi bitta maqsadga: ko'proq va tezroq sotuvga ishlaydi.
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="flex flex-wrap justify-center gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {[
                { title: "Marketing xizmati (SOSTAC modeli asosida)", desc: "Bozor va raqobatchilarni tahlil qilib, maqsadli auditoriyani aniqlaymiz, marketing strategiyasini ishlab chiqamiz va SOSTAC asosida jarayonlarni tizimli boshqaramiz.", icon: Target },
                { title: "Quruvchi shaxsiy brendi", desc: "Quruvchini ekspert sifatida pozitsiyalab, uning shaxsiy brendi orqali loyihaga ishonch va sotuv yaratamiz.", icon: Share2 },
                { title: "SMM & Media Production", desc: "Loyihani kontent orqali qadoqlaymiz: Reels, foto, video, dizayn va obyektning sotuvchi kontent yaratamiz.", icon: TrendingUp },
                { title: "Lead Generation", desc: "Maqsadli reklama orqali potensial xaridorlar oqimini yaratamiz va har bir lidning qiymati hamda sifatini nazorat qilamiz.", icon: Palette },
                { title: "CRM & Sotuvni raqamlashtirish", desc: "Lid kelgandan shartnoma tuzilgunga qadar bo'lgan jarayonni CRM, avtomatlashtirish va analitika orqali boshqaramiz.", icon: Users },
                { title: "Zapusk", desc: "Yangi qurilish loyihasini bozorga chiqarishdan sotuvning faol bosqichigacha bo'lgan launch jarayonini ishlab chiqamiz va boshqaramiz.", icon: Rocket }
              ].map((item, idx) => (
                <motion.div variants={fadeUpVariant} key={idx} className="bg-white text-ravnaq-dark rounded-2xl p-6 sm:p-8 shadow-lg relative group overflow-hidden hover:-translate-y-2 transition-transform duration-300 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] flex flex-col justify-center">
                   {item.icon && (
                     <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                         <item.icon size={20} className="text-ravnaq-gold"/>
                       </div>
                       <ArrowUpRight size={20} className="text-gray-400 group-hover:text-ravnaq-gold transition-colors duration-300" />
                     </div>
                   )}
                   <h3 className="font-bold mb-3 text-lg min-h-[84px] flex items-start">{item.title}</h3>
                   <p className="text-sm text-gray-500 leading-relaxed mb-4">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-12 text-center">
              <a href="#contact" className="inline-block bg-ravnaq-gold text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-ravnaq-gold-hover transition duration-300">
                Bepul diagnostika olish
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="grid lg:grid-cols-12 gap-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={fadeRightVariant} className="lg:col-span-5 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-ravnaq-dark mb-10 lg:mb-12">Eng ko'p beriladigan<br className="hidden lg:block"/>savollar</h2>
                
                <div className="space-y-6">
                  <img width="400" height="200" loading="lazy" src="/pictures/a056922e920aa4647cba3d490de74b43.webp" alt="Team meeting" className="rounded-3xl w-full h-48 object-cover shadow-lg" />
                  <img width="400" height="200" loading="lazy" src="/pictures/1463db54173250c425b18faccc17a2dc.webp" alt="Person wondering" className="rounded-3xl w-full h-48 object-cover shadow-lg" />
                </div>
              </motion.div>
              <div className="lg:col-span-7 space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                    <button aria-label="Savolni ko'rish" 
                      onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                      className="w-full text-left px-6 py-5 font-semibold text-ravnaq-dark flex justify-between items-center focus:outline-none"
                    >
                      {faq.question}
                      <ChevronDown size={20} className={`transform transition-transform ${openFaq === idx ? "rotate-180 text-ravnaq-gold" : "text-gray-500"}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Footer Section */}
        <section id="contact" className="relative bg-ravnaq-black text-white overflow-hidden bg-cover bg-center bg-[url('/pictures/contact-bg-mobile.webp')] md:bg-[url('/pictures/contact-bg-desktop.webp')]" style={{ minHeight: '600px' }}>
          
          {/* Mobile Video Background */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover md:hidden"
          >
            <source src="/videos/contact-bg-mobile.mp4" type="video/mp4" />
          </video>

          {/* Desktop Video Background */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
          >
            <source src="/videos/contact-bg-desktop.mp4" type="video/mp4" />
          </video>

          {/* Optional dark overlay to ensure text remains legible */}
          <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Title — top left */}
            <motion.div 
              className="mb-12 max-w-sm"
              variants={fadeRightVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-white drop-shadow-md">
                Keling, biznesingiz haqida gaplashamiz
              </h2>
              <p className="text-gray-200 text-sm leading-relaxed drop-shadow">
                Ma'lumotlaringizni qoldiring — mutaxassisimiz siz bilan tez orada bog'lanadi.
              </p>
            </motion.div>

            {/* Single Merged Card */}
            <motion.div 
              className="bg-white text-ravnaq-dark rounded-[28px] p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row max-w-[1000px] mx-auto"
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              
              {/* Left Side — BOG'LANISH + map */}
              <div className="flex-1 flex flex-col gap-6 md:pr-10">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">BOG'LANISH</p>
                  <a href="tel:+998772773765" className="text-3xl font-bold block hover:text-ravnaq-gold transition">
                    +998 77 277 37 65
                  </a>
                </div>

                <div className="space-y-4">
                  <a href="https://t.me/ravnaqgroup" target="_blank" rel="noreferrer" className="flex items-center gap-4 border border-gray-200 rounded-[14px] px-5 py-4 hover:bg-gray-50 transition">
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                      <Send size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-0.5">TELEGRAM</p>
                      <p className="text-sm font-semibold text-ravnaq-dark">@ravnaqgroup</p>
                    </div>
                  </a>

                  <a href="https://instagram.com/ravnaq.group" target="_blank" rel="noreferrer" className="flex items-center gap-4 border border-gray-200 rounded-[14px] px-5 py-4 hover:bg-gray-50 transition">
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-0.5">INSTAGRAM</p>
                      <p className="text-sm font-semibold text-ravnaq-dark">@ravnaq.group</p>
                    </div>
                  </a>
                </div>

                {/* Map */}
                <div className="flex-1 min-h-[160px] rounded-[14px] overflow-hidden">
                  <Suspense fallback={<div className="h-[400px] bg-gray-100 rounded-3xl animate-pulse flex items-center justify-center text-gray-500">Xarita yuklanmoqda...</div>}>
                    <PremiumMap />
                  </Suspense>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden md:block w-px bg-gray-200 mx-2"></div>

              {/* Right Side — Form */}
              <div className="flex-1 flex flex-col md:pl-10 mt-10 md:mt-0">
                <h2 className="font-bold text-2xl mb-2">Bepul audit uchun ariza</h2>
                <p className="text-[13px] text-gray-500 mb-8 font-medium">Formani to'ldiring — 24 soat ichida bog'lanamiz.</p>

                {sent ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="font-bold text-xl text-ravnaq-dark mb-2">Ariza qabul qilindi!</h3>
                    <p className="text-gray-500 text-sm">24 soat ichida siz bilan bog'lanamiz.</p>
                    <button onClick={() => setSent(false)} className="mt-6 text-ravnaq-gold text-sm underline">
                      Yangi ariza yuborish
                    </button>
                  </div>
                ) : (
                  <form className="space-y-4 flex-1 flex flex-col" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                          <User size={16} />
                        </div>
                        <input aria-label="Ismingiz" name="name" value={form.name} onChange={handleChange} type="text" placeholder="Ismingiz" className="w-full pl-10 px-4 py-3.5 rounded-[12px] border border-gray-200 focus:outline-none focus:border-ravnaq-gold text-sm font-medium" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 gap-2">
                          <Phone size={16} />
                          <span className="text-gray-500 font-medium text-sm">+998</span>
                        </div>
                        <input aria-label="Telefon raqamingiz" name="phone" value={form.phone} onChange={handleChange} type="tel" className="w-full pl-24 px-4 py-3.5 rounded-[12px] border border-gray-200 focus:outline-none focus:border-ravnaq-gold text-sm font-medium" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                          <Building size={16} />
                        </div>
                        <input aria-label="Kompaniyangiz nomi" name="company" value={form.company} onChange={handleChange} type="text" placeholder="Kompaniyangiz nomi" className="w-full pl-10 px-4 py-3.5 rounded-[12px] border border-gray-200 focus:outline-none focus:border-ravnaq-gold text-sm font-medium" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                          <Briefcase size={16} />
                        </div>
                        <input aria-label="Lavozimingiz" name="position" value={form.position} onChange={handleChange} type="text" placeholder="Lavozimingiz" className="w-full pl-10 px-4 py-3.5 rounded-[12px] border border-gray-200 focus:outline-none focus:border-ravnaq-gold text-sm font-medium" />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Settings size={16} />
                      </div>
                      <select aria-label="Sizga qanday xizmat kerak" name="service" value={form.service} onChange={handleChange} className="w-full pl-10 px-4 py-3.5 rounded-[12px] border border-gray-200 focus:outline-none focus:border-ravnaq-gold text-gray-500 bg-white text-sm font-medium appearance-none">
                        <option value="">Qanday muammoyingiz bor?</option>
                        <option>SMM</option>
                        <option>Lead Generation</option>
                        <option>Sotuv bo'limi</option>
                        <option>Zapusk</option>
                        <option>CRM va raqamlashtirish</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                        <ChevronDown size={16} />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <LinkIcon size={16} />
                      </div>
                      <select aria-label="Biz haqimizda qayerdan bildingiz" name="source" value={form.source} onChange={handleChange} className="w-full pl-10 px-4 py-3.5 rounded-[12px] border border-gray-200 focus:outline-none focus:border-ravnaq-gold text-gray-500 bg-white text-sm font-medium appearance-none">
                        <option value="">Qayerdan bildingiz?</option>
                        <option>Instagram</option>
                        <option>Telegram</option>
                        <option>Tanishim tavsiya qildi</option>
                        <option>Qidiruv (Google/Yandex)</option>
                        <option>Boshqa</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                        <ChevronDown size={16} />
                      </div>
                    </div>

                    <div className="mt-auto pt-2">
                      <button 
                        type="submit" 
                        disabled={sending || !agreed}
                        className="w-full py-4 bg-ravnaq-gold text-white font-semibold rounded-[12px] flex items-center justify-center gap-2 hover:bg-[#c5913d] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {sending ? 'Yuborilmoqda...' : 'Ariza qoldirish'} <ArrowRight size={18} />
                      </button>
                      <label className="flex items-start gap-2 mt-4 cursor-pointer">
                        <input 
                          type="checkbox" 
                          required
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="mt-0.5 accent-ravnaq-gold w-4 h-4 rounded" 
                        />
                        <span className="text-[10px] text-gray-500 text-left leading-tight">
                          Men <button type="button" onClick={() => setIsPrivacyOpen(true)} className="text-ravnaq-gold hover:underline">Maxfiylik siyosati</button> va <a href="#faq" className="text-ravnaq-gold hover:underline">FAQ</a> (shartlarga) rozilik bildiraman.
                        </span>
                      </label>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
          {/* Footer */}
          <footer className="w-full mt-24 pt-8 pb-4 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <img src="/pictures/ravnaq-group-logo.webp" alt="Ravnaq Group" className="h-10" />
                <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Ravnaq Group. Barcha huquqlar himoyalangan.</p>
              </div>
              <div className="flex items-center gap-6">
                <button onClick={() => setIsPrivacyOpen(true)} className="text-gray-400 hover:text-white text-sm transition">Maxfiylik siyosati</button>
              </div>
            </div>
          </footer>
        </section>
      </main>

      {/* Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPrivacyOpen(false)} />
          <div className="relative bg-white w-full max-w-3xl max-h-[80vh] rounded-2xl p-6 md:p-10 overflow-y-auto z-10 shadow-2xl">
            <button onClick={() => setIsPrivacyOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-black transition">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-ravnaq-dark mb-6">Maxfiylik siyosati</h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>Sizning shaxsiy ma'lumotlaringiz xavfsizligi biz uchun muhim. Ushbu maxfiylik siyosati biz qanday ma'lumotlarni yig'ishimiz, ulardan qanday foydalanishimiz va himoya qilishimizni tushuntiradi.</p>
              <h3 className="font-semibold text-gray-800 text-base mt-6">1. Ma'lumotlarni yig'ish</h3>
              <p>Biz saytimiz orqali so'rov qoldirganingizda ismingiz, telefon raqamingiz va qiziqayotgan xizmat turini yig'amiz.</p>
              <h3 className="font-semibold text-gray-800 text-base mt-6">2. Ma'lumotlardan foydalanish</h3>
              <p>Yig'ilgan ma'lumotlar faqatgina siz bilan bog'lanish va sizga sifatli xizmat ko'rsatish maqsadida foydalaniladi. Biz shaxsiy ma'lumotlaringizni uchinchi shaxslarga sotmaymiz yoki ularga uzatmaymiz.</p>
              <h3 className="font-semibold text-gray-800 text-base mt-6">3. Ma'lumotlarni himoya qilish</h3>
              <p>Biz ma'lumotlaringizni xavfsiz saqlash va ruxsatsiz kirishdan himoya qilish uchun barcha zarur xavfsizlik choralarini ko'ramiz.</p>
              <h3 className="font-semibold text-gray-800 text-base mt-6">4. O'zgarishlar</h3>
              <p>Ushbu maxfiylik siyosati vaqti-vaqti bilan yangilanishi mumkin. Har qanday o'zgarishlar ushbu sahifada e'lon qilinadi.</p>
            </div>
            <div className="mt-8 text-center">
              <button onClick={() => setIsPrivacyOpen(false)} className="bg-ravnaq-gold text-white px-8 py-3 rounded-[12px] font-semibold hover:bg-[#c5913d] transition">Tushunarli</button>
            </div>
          </div>
        </div>
      )}

      </div>
    </>
  );
}