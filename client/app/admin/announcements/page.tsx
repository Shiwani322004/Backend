"use client";
import { useState, useEffect } from 'react';

import { Megaphone, Send, Trash2, Clock, AlertCircle, CheckCircle2, Info } from 'lucide-react';
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
  createdAt: string;
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

      socket.emit('admin-announcement', newAnnouncement);
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
    if (confirm('Delete this announcement?')) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast.success('Announcement deleted');
    }
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Announcements
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Broadcast important updates to students and staff
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Announcement Form */}
          <div className="lg:col-span-1">
            <Card className="border shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 sticky top-8">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <Send className="w-5 h-5 text-blue-600" />
                  New Announcement
                </CardTitle>
                <CardDescription>Send a notification to everyone</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Title
                    </label>
                    <Input
                      placeholder="e.g., Exam Schedule Released"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Message
                    </label>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Priority Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'info', label: 'Info', icon: Info, color: 'bg-blue-100 text-blue-700 border-blue-200' },
                        { value: 'warning', label: 'Warning', icon: AlertCircle, color: 'bg-amber-100 text-amber-700 border-amber-200' },
                        { value: 'important', label: 'Urgent', icon: AlertCircle, color: 'bg-rose-100 text-rose-700 border-rose-200' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({...formData, type: type.value})}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                            formData.type === type.value
                              ? `${type.color} ring-2 ring-offset-1 ring-blue-500/20`
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <type.icon className="w-5 h-5 mb-1" />
                          <span className="text-xs font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 h-12 rounded-xl text-base font-medium" 
                    isLoading={loading}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Broadcast Now
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Announcements List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                Recent Broadcasts
              </h3>
              <span className="text-sm text-slate-500">{announcements.length} total</span>
            </div>
            
            {announcements.length === 0 ? (
              <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700 bg-transparent shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Megaphone className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No Announcements Yet
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">
                    Create your first announcement using the form to notify students and staff.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">

                  {announcements.map((announcement, index) => (
                    <div
                      key={announcement.id}
                    >
                      <Card className={`border shadow-sm hover:shadow-md transition-all duration-300 ${
                        announcement.type === 'important' ? 'bg-white dark:bg-slate-800 border-l-4 border-l-rose-500' :
                        announcement.type === 'warning' ? 'bg-white dark:bg-slate-800 border-l-4 border-l-amber-500' :
                        'bg-white dark:bg-slate-800 border-l-4 border-l-blue-500'
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-xl shrink-0 ${
                                announcement.type === 'important' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20' :
                                announcement.type === 'warning' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' :
                                'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                              }`}>
                                {announcement.type === 'important' ? <AlertCircle className="w-6 h-6" /> :
                                 announcement.type === 'warning' ? <AlertCircle className="w-6 h-6" /> :
                                 <Megaphone className="w-6 h-6" />}
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                  {announcement.title}
                                </h4>
                                <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed text-sm">
                                  {announcement.message}
                                </p>
                                <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
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
                              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}

              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
