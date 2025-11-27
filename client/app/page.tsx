"use client";
import Link from 'next/link';

import { 
  GraduationCap, 
  Users, 
  BarChart3, 
  Bell, 
  Shield, 
  Smartphone,
  ChevronRight,
  CheckCircle,
  Star,
  Award,
  BookOpen,
  Calendar,
  TrendingUp,
  Zap,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
              <Star className="w-4 h-4 fill-current" />
              <span>Trusted by 1000+ Institutions Worldwide</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
              The Future of <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                Education Management
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Streamline your institution's operations with our AI-powered platform. 
              From admissions to alumni, manage everything in one place with 
              unmatched efficiency and elegance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/register">
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-blue-500/25 flex items-center gap-2 transition-all">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              
              <Link href="#features">
                <button className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-2xl font-semibold text-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-all">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  View Features
                </button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-12 border-t border-gray-200 dark:border-slate-800">
              {[
                { label: 'Active Users', value: '50K+', icon: Users },
                { label: 'Institutions', value: '1000+', icon: Award },
                { label: 'Uptime', value: '99.99%', icon: TrendingUp },
                { label: 'Countries', value: '25+', icon: Shield },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-3 text-blue-600 dark:text-blue-400">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A comprehensive suite of tools designed to modernize your educational institution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Management',
                desc: 'AI-driven insights for better decision making and resource allocation.',
                icon: BarChart3,
                color: 'blue'
              },
              {
                title: 'Real-time Tracking',
                desc: 'Monitor attendance, grades, and performance in real-time.',
                icon: Calendar,
                color: 'green'
              },
              {
                title: 'Secure Platform',
                desc: 'Enterprise-grade security to protect sensitive student data.',
                icon: Shield,
                color: 'purple'
              },
              {
                title: 'Mobile First',
                desc: 'Access your dashboard from any device, anywhere, anytime.',
                icon: Smartphone,
                color: 'orange'
              },
              {
                title: 'Instant Alerts',
                desc: 'Automated notifications for important updates and announcements.',
                icon: Bell,
                color: 'red'
              },
              {
                title: 'LMS Integration',
                desc: 'Seamlessly integrated learning management system.',
                icon: BookOpen,
                color: 'indigo'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-slate-700"
              >
                <div className={`w-12 h-12 rounded-2xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-700">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Institution?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join the education revolution today. Start your free trial and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-xl hover:bg-blue-50 transition-colors">
                Get Started Now
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="px-8 py-4 bg-blue-700 text-white border border-blue-500 rounded-2xl font-bold text-lg hover:bg-blue-800 transition-colors">
                Login to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">EduManage</span>
            </div>
            
            <div className="flex gap-8 text-sm font-medium">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact Support</Link>
            </div>
            
            <div className="text-sm">
              &copy; 2024 EduManage Pro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}