"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Send, Trash2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'important';
  createdAt: string; // Changed to string for JSON serialization
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  // Load announcements from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('announcements');
    if (saved) {
      try {
        setAnnouncements(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse announcements', e);
      }
    }
  }, []);

  // Save announcements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('announcements', JSON.stringify(announcements));
  }, [announcements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000');
      
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: formData.title,
        message: formData.message,
        type: formData.type as 'info' | 'warning' | 'important',
        createdAt: new Date().toISOString()
      };

      // Emit announcement to all connected clients
      socket.emit('admin-announcement', newAnnouncement);
      
      // Add to local list
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      
      toast.success('Announcement broadcasted successfully!');
      setFormData({ title: '', message: '', type: 'info' });
      
      socket.disconnect();
    } catch (error) {
      console.error('Failed to send announcement:', error);
      toast.error('Failed to send announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast.success('Announcement deleted');
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Announcements
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Broadcast messages to all students and staff
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Announcement Form */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-lg sticky top-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  New Announcement
                </CardTitle>
                <CardDescription>Send a notification to everyone</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Title"
                    placeholder="e.g., Exam Schedule Released"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Message
                    </label>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-xl border border-gray-200 bg-white dark:bg-slate-900 px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Type
                    </label>
                    <select
                      className="flex h-11 w-full rounded-xl border border-gray-200 bg-white dark:bg-slate-900 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="info">Information</option>
                      <option value="warning">Warning</option>
                      <option value="important">Important</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25" isLoading={loading}>
                    <Send className="w-4 h-4 mr-2" />
                    Broadcast
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Announcements List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Recent Announcements
            </h3>
            
            {announcements.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-200 dark:border-slate-700 bg-transparent shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Megaphone className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Announcements
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Create your first announcement to notify students.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {announcements.map((announcement, index) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-none shadow-md hover:shadow-lg transition-all duration-300 ${
                        announcement.type === 'important' ? 'bg-red-50/50 dark:bg-red-900/10 border-l-4 border-red-500' :
                        announcement.type === 'warning' ? 'bg-yellow-50/50 dark:bg-yellow-900/10 border-l-4 border-yellow-500' :
                        'bg-white dark:bg-slate-800 border-l-4 border-blue-500'
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-full shrink-0 ${
                                announcement.type === 'important' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                announcement.type === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {announcement.type === 'important' ? <AlertCircle className="w-6 h-6" /> :
                                 announcement.type === 'warning' ? <AlertCircle className="w-6 h-6" /> :
                                 <Megaphone className="w-6 h-6" />}
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {announcement.title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                                  {announcement.message}
                                </p>
                                <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(announcement.createdAt).toLocaleString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Posted by Admin
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(announcement.id)}
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full p-2 h-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
