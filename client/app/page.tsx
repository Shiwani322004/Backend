"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  BarChart3, 
  Bell, 
  Shield, 
  Smartphone,
  Sun,
  Moon,
  ChevronRight,
  CheckCircle,
  Star,
  Award,
  BookOpen,
  Calendar,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* Navigation */}
      <motion.nav 
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduManage Pro
              </span>
            </motion.div>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleTheme}
                className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center"
                  animate={{ x: isDark ? 28 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {isDark ? (
                    <Moon className="w-3 h-3 text-blue-500" />
                  ) : (
                    <Sun className="w-3 h-3 text-yellow-500" />
                  )}
                </motion.div>
              </motion.button>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/login" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg">
                  Login
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/register" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                  Register
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <section className="relative py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                    <Star className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Trusted by 1000+ Institutions</span>
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Next-Gen
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Student Management
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
                  Transform your educational institution with our AI-powered platform. 
                  Streamline operations, boost engagement, and unlock student potential.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/auth/register" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-xl flex items-center">
                      Get Started Free
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="#features" className="group border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600 hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center">
                      Watch Demo
                      <Zap className="w-5 h-5 ml-2 group-hover:text-yellow-500 transition-colors" />
                    </Link>
                  </motion.div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                  {[
                    { number: '1000+', label: 'Institutions', icon: Award },
                    { number: '50K+', label: 'Students', icon: Users },
                    { number: '99.9%', label: 'Uptime', icon: TrendingUp },
                    { number: '24/7', label: 'Support', icon: Shield }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    >
                      <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.number}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Powerful Features</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Everything you need to transform your educational institution into a modern, efficient powerhouse
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: 'Smart Student Management',
                  description: 'AI-powered student profiles with comprehensive tracking, predictive analytics, and personalized insights',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: BarChart3,
                  title: 'Advanced Analytics',
                  description: 'Real-time dashboards with deep insights, performance metrics, and actionable intelligence',
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  icon: Bell,
                  title: 'Smart Notifications',
                  description: 'Intelligent notification system with real-time updates, custom alerts, and multi-channel delivery',
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  icon: Shield,
                  title: 'Enterprise Security',
                  description: 'Bank-grade security with role-based access, encryption, and compliance management',
                  color: 'from-red-500 to-orange-500'
                },
                {
                  icon: Smartphone,
                  title: 'Mobile-First Design',
                  description: 'Native mobile experience with offline capabilities and cross-platform synchronization',
                  color: 'from-indigo-500 to-blue-500'
                },
                {
                  icon: BookOpen,
                  title: 'Learning Management',
                  description: 'Integrated LMS with course management, assignments, and progress tracking',
                  color: 'from-yellow-500 to-orange-500'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Intuitive Dashboards</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Purpose-built interfaces that adapt to your role and workflow
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div 
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 p-10 hover:shadow-3xl transition-all duration-300"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Command Center</h3>
                </div>
                <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                  {[
                    { text: 'AI-powered student insights & analytics', icon: BarChart3 },
                    { text: 'One-click approval workflows', icon: CheckCircle },
                    { text: 'Real-time attendance & grade tracking', icon: Calendar },
                    { text: 'Broadcast announcements instantly', icon: Bell },
                    { text: 'Advanced reporting & export tools', icon: TrendingUp }
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <item.icon className="w-5 h-5 text-green-500 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 p-10 hover:shadow-3xl transition-all duration-300"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Student Hub</h3>
                </div>
                <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                  {[
                    { text: 'Personalized learning dashboard', icon: BookOpen },
                    { text: 'Real-time attendance tracking', icon: Calendar },
                    { text: 'Interactive grade analytics', icon: TrendingUp },
                    { text: 'Smart notification center', icon: Bell },
                    { text: 'Profile & goal management', icon: Users }
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center group"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <item.icon className="w-5 h-5 text-blue-500 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Institution?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of educational institutions already using EduManage Pro to streamline operations and enhance student success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/register" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-xl">
                    Start Free Trial
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/login" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300">
                    Login Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    EduManage Pro
                  </span>
                </div>
                <p className="text-gray-400 mb-6 max-w-md">
                  Empowering educational institutions with cutting-edge technology to enhance learning outcomes and operational efficiency.
                </p>
                <div className="flex space-x-4">
                  {/* Social links would go here */}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                  <li><Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
                  <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Status</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-800 text-center">
              <p className="text-gray-400">&copy; 2024 EduManage Pro. All rights reserved. Built with ❤️ for education.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}