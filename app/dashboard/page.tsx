// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);
    } catch (error) {
      console.error('Error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20"></div>
      
      {/* Content */}
      <div className="relative min-h-screen">
        
        {/* Top Navigation */}
        <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              
              {/* Logo */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏋️</span>
                <h1 className="text-xl font-bold text-white">TruInsights</h1>
              </div>
              
              {/* Right side */}
              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-400">
                  Welcome back, <span className="font-semibold text-white">{user?.user_metadata?.full_name || 'User'}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-2">Total Journals</div>
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-xs text-gray-500">All time</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-2">This Week</div>
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-xs text-gray-500">Workouts logged</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-2">Avg Energy</div>
              <div className="text-3xl font-bold text-white mb-1">-</div>
              <div className="text-xs text-gray-500">Last 7 days</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-2">Streak</div>
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-xs text-gray-500">Days</div>
            </div>

          </div>

          {/* Quick Journal Section */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 md:p-10 mb-12 shadow-2xl shadow-purple-500/20">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Quick Journal
                </h2>
                <p className="text-white/80 text-lg">
                  Record your post-workout thoughts
                </p>
              </div>
              <div className="text-5xl">🎤</div>
            </div>
            
            {/* Class Selector */}
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Class Type
              </label>
              <select className="w-full md:w-80 px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:border-white/50 transition">
                <option className="bg-zinc-900">Select class type...</option>
                <option className="bg-zinc-900">Hot Pilates</option>
                <option className="bg-zinc-900">HIIT</option>
                <option className="bg-zinc-900">Vinyasa Yoga</option>
                <option className="bg-zinc-900">Strength Training</option>
                <option className="bg-zinc-900">Cycling</option>
                <option className="bg-zinc-900">Other</option>
              </select>
            </div>

            {/* Record Button */}
            <button className="group px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all hover:scale-105 shadow-xl flex items-center gap-3">
              <span className="text-2xl">🔴</span>
              <span>Start Recording</span>
              <span className="text-sm font-normal opacity-70">(30 seconds)</span>
            </button>
          </div>

          {/* Recent Journals */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">
                Recent Journals
              </h3>
              <button className="text-sm text-purple-400 hover:text-purple-300 font-medium transition">
                View All →
              </button>
            </div>

            {/* Empty State */}
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📔</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">
                No journals yet
              </h4>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Start your fitness journey by recording your first post-workout journal. It only takes 30 seconds!
              </p>
              <button className="text-purple-400 hover:text-purple-300 font-medium transition">
                Record your first journal →
              </button>
            </div>

            {/* Example Journal Card - Will show when there's data */}
            {/* 
            <div className="space-y-4">
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 hover:border-zinc-600 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Hot Pilates</h4>
                    <p className="text-sm text-gray-400">Tuesday, 6:00 PM • 2 hours ago</p>
                  </div>
                  <button className="text-gray-400 hover:text-white transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                    ⚡ Energy: 8/10
                  </span>
                  <span className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                    💪 Difficulty: 7/10
                  </span>
                  <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-medium">
                    😊 Energized
                  </span>
                </div>

                <p className="text-gray-300 leading-relaxed text-sm">
                  "Core felt really strong today, hip flexors were a bit tight. Had a banana and coffee before class - perfect energy level. Sarah's playlist was amazing!"
                </p>
              </div>
            </div>
            */}
          </div>

        </div>
      </div>
    </div>
  );
}