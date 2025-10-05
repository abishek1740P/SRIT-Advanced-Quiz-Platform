"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  BarChart3,
  Clock,
  Zap,
  ChevronRight,
  Play,
  BookOpen,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    router.push("/auth/login");
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Environment",
      description:
        "Advanced anti-cheating measures with fullscreen enforcement and violation detection",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Dual Role System",
      description:
        "Seamless experience for both teachers and students with role-based access",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description:
        "Comprehensive insights and performance metrics for better learning outcomes",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Monitoring",
      description:
        "Live tracking with Socket.io for synchronized timing and violation logging",
    },
  ];

  const slides = [
    {
      title: "Create Secure Quizzes",
      description:
        "Build comprehensive assessments with advanced security features",
      image: "/api/placeholder/600/400",
      color: "from-blue-500/20 to-purple-500/20",
    },
    {
      title: "Monitor Student Progress",
      description:
        "Track performance with detailed analytics and violation reports",
      image: "/api/placeholder/600/400",
      color: "from-green-500/20 to-cyan-500/20",
    },
    {
      title: "Enhanced Learning Experience",
      description:
        "Focus on knowledge assessment in a secure, distraction-free environment",
      image: "/api/placeholder/600/400",
      color: "from-orange-500/20 to-red-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
                >
                  <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-sm font-medium text-slate-300">
                    Trusted by SRIT Faculty & Students
                  </span>
                </motion.div>

                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Secure
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {" "}
                    Quiz{" "}
                  </span>
                  Platform
                </h1>

                <p className="text-xl text-slate-300 leading-relaxed">
                  Advanced assessment platform with comprehensive security
                  features, real-time monitoring, and detailed analytics for
                  educational excellence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Creating Quizzes</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLearnMore}
                  className="px-8 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl font-semibold backdrop-blur-sm hover:bg-slate-700/50 transition-all"
                >
                  Learn More
                </motion.button>
              </div>

              {/* Stats - Removed as requested */}
            </motion.div>

            {/* Right Content - Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden backdrop-blur-sm bg-slate-800/30 border border-slate-700/50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].color} rounded-2xl flex items-center justify-center`}
                  >
                    <div className="text-center p-8">
                      <h3 className="text-2xl font-bold mb-4">
                        {slides[currentSlide].title}
                      </h3>
                      <p className="text-slate-300">
                        {slides[currentSlide].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide ? "bg-white w-6" : "bg-slate-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Advanced <span className="text-blue-400">Features</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Built with cutting-edge technology to ensure secure and efficient
              assessments. Create and implement unlimited quizzes seamlessly for
              your educational needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl p-12 backdrop-blur-sm border border-slate-700/50"
          >
            <Award className="w-16 h-16 mx-auto mb-6 text-blue-400" />
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Assessment Experience?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Create unlimited quizzes and implement them seamlessly for faculty
              and students at SRIT.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
              >
                <BookOpen className="w-5 h-5" />
                <span>Get Started Now</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400">
            © 2025 Secure Quiz Platform. Built for SRIT Community.
          </p>
        </div>
      </footer>
    </div>
  );
}
