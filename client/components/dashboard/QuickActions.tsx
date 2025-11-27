"use client";

import { BookOpen, Calendar, MessageSquare, Settings, FileText, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Link from 'next/link';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function QuickActions() {
  const actions: QuickAction[] = [
    {
      title: 'Study Materials',
      description: 'Access course materials',
      icon: <BookOpen className="w-5 h-5" />,
      href: '/student/materials',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Schedule',
      description: 'View timetable & events',
      icon: <Calendar className="w-5 h-5" />,
      href: '/student/schedule',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Messages',
      description: 'Chat with teachers',
      icon: <MessageSquare className="w-5 h-5" />,
      href: '/student/messages',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Assignments',
      description: 'Submit assignments',
      icon: <FileText className="w-5 h-5" />,
      href: '/student/assignments',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Study Groups',
      description: 'Join study sessions',
      icon: <Users className="w-5 h-5" />,
      href: '/student/groups',
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Settings',
      description: 'Manage preferences',
      icon: <Settings className="w-5 h-5" />,
      href: '/student/settings',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🚀 Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <div
              key={action.title}
            >
              <Link href={action.href}>
                <div
                  className="p-4 rounded-lg bg-gradient-to-r text-white cursor-pointer"
                  style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                >
                  <div className={`bg-gradient-to-r ${action.color} p-4 rounded-lg text-white`}>
                    <div className="flex flex-col items-center text-center space-y-2">
                      {action.icon}
                      <div>
                        <h3 className="font-medium text-sm">{action.title}</h3>
                        <p className="text-xs opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}