"use client";
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 shadow-lg border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SMS</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Student Management</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link href="/auth/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Login
              </Link>
              <Link href="/auth/register" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Modern Student
                <span className="text-blue-600 dark:text-blue-400"> Management</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Streamline your educational institution with our comprehensive student management system. 
                Track attendance, manage grades, and communicate seamlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                  Get Started
                </Link>
                <Link href="#features" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to manage your students effectively</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '👥',
                  title: 'Student Management',
                  description: 'Comprehensive student profiles with attendance, grades, and performance tracking'
                },
                {
                  icon: '📊',
                  title: 'Analytics Dashboard',
                  description: 'Real-time insights and analytics to monitor student progress and institutional performance'
                },
                {
                  icon: '🔔',
                  title: 'Real-time Notifications',
                  description: 'Instant notifications and announcements to keep everyone connected and informed'
                },
                {
                  icon: '🔐',
                  title: 'Secure Access',
                  description: 'Role-based access control with admin approval system for enhanced security'
                },
                {
                  icon: '📱',
                  title: 'Mobile Responsive',
                  description: 'Access your dashboard from any device with our fully responsive design'
                },
                {
                  icon: '🌙',
                  title: 'Dark Mode',
                  description: 'Modern interface with light and dark mode support for comfortable viewing'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Intuitive Dashboards</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Designed for both administrators and students</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Admin Dashboard</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Manage all students</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Approve registrations</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Track attendance & grades</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Send announcements</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Generate reports</li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Student Dashboard</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> View personal profile</li>
                  <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> Check attendance</li>
                  <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> View grades & performance</li>
                  <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> Receive notifications</li>
                  <li className="flex items-center"><span className="text-blue-500 mr-2">✓</span> Update information</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Student Management System</h3>
              <p className="text-gray-400 mb-6">Empowering education through technology</p>
              <div className="flex justify-center space-x-6">
                <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">Login</Link>
                <Link href="/auth/register" className="text-blue-400 hover:text-blue-300">Register</Link>
                <Link href="#features" className="text-blue-400 hover:text-blue-300">Features</Link>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-800">
                <p className="text-gray-400">&copy; 2024 Student Management System. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}