import React from 'react';
import { useAuth } from '../App';
import {
  TrendingUp,
  Target,
  Award,
  Calendar,
  ArrowRight,
  BookOpen,
  Users,
  Briefcase,
  Lightbulb,
  FileText
} from 'lucide-react';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

export function Dashboard({ onTabChange }: DashboardProps) {
  const { user } = useAuth();

  const stats = [
    { label: 'Resume Score', value: '85', change: '+12', icon: FileText, color: 'from-green-500 to-emerald-500' },
    { label: 'Applications', value: '23', change: '+5', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
    { label: 'Hackathons', value: '7', change: '+2', icon: Lightbulb, color: 'from-yellow-500 to-orange-500' },
    { label: 'Connections', value: '156', change: '+18', icon: Users, color: 'from-purple-500 to-pink-500' },
  ];

  const quickActions = [
    {
      title: 'Analyze Resume',
      description: 'Get AI-powered insights to improve your resume',
      icon: FileText,
      color: 'from-[#6A0DAD] to-[#9B4DFF]',
      action: () => onTabChange('resume')
    },
    {
      title: 'Find Hackathons',
      description: 'Discover upcoming hackathons and build your portfolio',
      icon: Lightbulb,
      color: 'from-orange-500 to-yellow-500',
      action: () => onTabChange('hackathons')
    },
    {
      title: 'Connect with Mentors',
      description: 'Get guidance from industry professionals',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      action: () => onTabChange('mentors')
    },
    {
      title: 'Job Opportunities',
      description: 'Browse latest internships and job openings',
      icon: Briefcase,
      color: 'from-green-500 to-emerald-500',
      action: () => onTabChange('jobs')
    },
  ];

  const recentActivity = [
    { type: 'resume', message: 'Resume score improved by 12 points', time: '2 hours ago' },
    { type: 'application', message: 'Applied to Software Engineering Intern at TechCorp', time: '1 day ago' },
    { type: 'hackathon', message: 'Registered for AI Innovation Challenge', time: '2 days ago' },
    { type: 'mentor', message: 'New message from Sarah Johnson', time: '3 days ago' },
  ];

  const upcomingEvents = [
    { title: 'AI/ML Hackathon', date: 'Dec 15-17', type: 'Hackathon' },
    { title: 'Career Fair 2024', date: 'Dec 20', type: 'Event' },
    { title: 'Mock Interview with John', date: 'Dec 22', type: 'Meeting' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#6A0DAD] via-[#8B5FBF] to-[#9B4DFF] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center text-white space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome to Your Career Journey
              {user && <span className="block text-2xl md:text-3xl mt-2 text-white/90">Hello, {user.name}! 👋</span>}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Your personalized dashboard to track progress, discover opportunities, and accelerate your career growth
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center space-y-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-white/70 text-sm">{stat.label}</p>
                    <p className="text-green-300 text-sm font-medium">{stat.change} this week</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  onClick={action.action}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                  <div className="flex items-center text-sm font-medium text-[#6A0DAD] group-hover:translate-x-1 transition-transform duration-200">
                    Get Started <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#6A0DAD] to-[#9B4DFF] rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.message}</p>
                      <p className="text-gray-500 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-4 rounded-xl border border-gray-200 hover:border-[#6A0DAD] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <span className="text-xs bg-[#6A0DAD]/10 text-[#6A0DAD] px-2 py-1 rounded-full">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {event.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#6A0DAD] to-[#9B4DFF] h-2 rounded-full" style={{ width: '85%' }} />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-600">Skill Assessment</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}