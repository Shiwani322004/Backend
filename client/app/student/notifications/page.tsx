"use client";
import { useEffect, useState } from 'react';
import { Bell, Search, CheckCircle, AlertCircle, Info, Megaphone, Trash2, Check, X } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'academic' | 'administrative' | 'alert' | 'announcement';
  read: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'academic' | 'administrative' | 'alert' | 'announcement'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    filterNotifications();
  }, [notifications, selectedFilter, searchQuery]);

  const fetchNotifications = async () => {
    try {
      if (user?.token) {
        // Mock data - replace with actual API call
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'New Grade Posted',
            message: 'Your grade for Mathematics midterm exam has been posted. You scored 92/100.',
            type: 'academic',
            read: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            priority: 'high'
          },
          {
            id: '2',
            title: 'Attendance Alert',
            message: 'Your attendance in Physics has dropped below 75%. Please ensure regular attendance.',
            type: 'alert',
            read: false,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            priority: 'high'
          },
          {
            id: '3',
            title: 'Campus Event',
            message: 'Annual Science Fair will be held on December 15th. All students are encouraged to participate.',
            type: 'announcement',
            read: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            priority: 'medium'
          },
          {
            id: '4',
            title: 'Fee Payment Reminder',
            message: 'Your semester fee payment is due by November 30th. Please clear your dues to avoid late fees.',
            type: 'administrative',
            read: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'high'
          },
          {
            id: '5',
            title: 'Assignment Submission',
            message: 'Your Chemistry assignment has been successfully submitted and is under review.',
            type: 'academic',
            read: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'low'
          },
          {
            id: '6',
            title: 'Library Book Due',
            message: 'The book "Advanced Physics" is due for return by December 1st.',
            type: 'administrative',
            read: true,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'medium'
          },
          {
            id: '7',
            title: 'Exam Schedule Released',
            message: 'Final exam schedule for Fall 2024 has been released. Check your student portal for details.',
            type: 'announcement',
            read: false,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'high'
          },
          {
            id: '8',
            title: 'Grade Update',
            message: 'Your Computer Science project grade has been updated to A+.',
            type: 'academic',
            read: true,
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            priority: 'medium'
          }
        ];

        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(n => n.type === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      toast.success('Marked as read');
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      setShowDeleteConfirm(null);
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-purple-500" />;
      case 'administrative':
        return <Info className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    const opacity = read ? '10' : '20';
    switch (type) {
      case 'academic':
        return `bg-blue-50 dark:bg-blue-900/${opacity}`;
      case 'alert':
        return `bg-red-50 dark:bg-red-900/${opacity}`;
      case 'announcement':
        return `bg-purple-50 dark:bg-purple-900/${opacity}`;
      case 'administrative':
        return `bg-yellow-50 dark:bg-yellow-900/${opacity}`;
      default:
        return `bg-gray-50 dark:bg-gray-800/${opacity}`;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Stay updated with your academic activities
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'academic', 'administrative', 'alert', 'announcement'].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="border-none shadow-lg">
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'Try adjusting your search' : 'You\'re all caught up!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map(notification => (
              <Card
                key={notification.id}
                className={`border-none shadow-md hover:shadow-lg transition-all ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                } ${getNotificationBg(notification.type, notification.read)}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className={`text-base font-semibold ${
                          !notification.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-gray-500" />
                            </button>
                          )}
                          <button
                            onClick={() => setShowDeleteConfirm(notification.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                        <span className="capitalize">{notification.type}</span>
                        <span>•</span>
                        <span>{formatTime(notification.createdAt)}</span>
                        {notification.priority === 'high' && (
                          <>
                            <span>•</span>
                            <span className="text-red-500 font-semibold">High Priority</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === notification.id && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                        Are you sure you want to delete this notification?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => deleteNotification(notification.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(null)}
                          className="flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
