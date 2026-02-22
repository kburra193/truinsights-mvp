// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import VoiceRecorder from '../components/VoiceRecorder';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [journals, setJournals] = useState<any[]>([]);
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

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
      setLoading(false);
      
      await fetchJournalsForUser(user.id);
    } catch (error) {
      console.error('Error:', error);
      router.push('/login');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  async function fetchJournalsForUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching journals:', error);
        return;
      }

      setJournals(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingJournals(false);
    }
  }

  async function handleRecordingComplete(audioBlob: Blob) {
    try {
      const timestamp = Date.now();
      const fileName = `${user?.id}/${timestamp}.webm`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
          cacheControl: '3600',
        });

      if (uploadError) {
        alert('Failed to upload recording. Please try again.');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName);

      const { data: journalData, error: journalError } = await supabase
        .from('journals')
        .insert({
          student_id: user?.id,
          audio_url: publicUrl,
          audio_duration: 30,
          status: 'pending',
          extracted_data: {
            class_type: selectedClass,
          }
        })
        .select()
        .single();

      if (journalError) {
        alert('Failed to save journal. Please try again.');
        return;
      }

      alert('Recording saved successfully!');
      setSelectedClass('');
      
      if (user?.id) {
        await fetchJournalsForUser(user.id);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Mock data for charts
  const energyData = [
    { date: 'Mon', energy: 7 },
    { date: 'Tue', energy: 8 },
    { date: 'Wed', energy: 6 },
    { date: 'Thu', energy: 9 },
    { date: 'Fri', energy: 8 },
    { date: 'Sat', energy: 7 },
    { date: 'Sun', energy: 8 },
  ];

  const classDistribution = [
    { name: 'HIIT', count: 12 },
    { name: 'Pilates', count: 8 },
    { name: 'Yoga', count: 5 },
    { name: 'Cycling', count: 3 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#111111] border-r border-[#1f1f1f] flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">🏋️</span>
            <h1 className="text-xl font-bold text-white">TruInsights</h1>
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase text-gray-500 mb-3 font-semibold">Dashboards</div>
            
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                activeSection === 'overview' 
                  ? 'bg-[#1a1a1a] text-white' 
                  : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <span className="text-sm">Overview</span>
            </button>

            <button
              onClick={() => setActiveSection('journals')}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                activeSection === 'journals' 
                  ? 'bg-[#1a1a1a] text-white' 
                  : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <span className="text-sm">Journals</span>
            </button>

            <button
              onClick={() => setActiveSection('insights')}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                activeSection === 'insights' 
                  ? 'bg-[#1a1a1a] text-white' 
                  : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <span className="text-sm">AI Insights</span>
            </button>
          </div>

          <div className="mt-8">
            <div className="text-xs uppercase text-gray-500 mb-3 font-semibold">History</div>
            <button className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-all">
              Recent Activity
            </button>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-[#1f1f1f]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
              {user?.user_metadata?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <div className="text-sm text-white font-medium">{user?.user_metadata?.full_name || 'User'}</div>
              <div className="text-xs text-gray-500">Student</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] text-white text-sm rounded-lg transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {activeSection === 'overview' && 'Overview'}
              {activeSection === 'journals' && 'My Journals'}
              {activeSection === 'insights' && 'AI Insights'}
            </h2>
            <p className="text-gray-400">
              {activeSection === 'overview' && 'Your fitness journey at a glance'}
              {activeSection === 'journals' && 'Track all your workout journals'}
              {activeSection === 'insights' && 'AI-powered analysis of your progress'}
            </p>
          </div>

          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                  <div className="text-sm text-gray-400 mb-2">Total Journals</div>
                  <div className="text-4xl font-bold text-white mb-1">{journals.length}</div>
                  <div className="text-xs text-cyan-400">All time</div>
                </div>

                <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                  <div className="text-sm text-gray-400 mb-2">This Week</div>
                  <div className="text-4xl font-bold text-white mb-1">0</div>
                  <div className="text-xs text-gray-500">Workouts</div>
                </div>

                <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                  <div className="text-sm text-gray-400 mb-2">Avg Energy</div>
                  <div className="text-4xl font-bold text-white mb-1">-</div>
                  <div className="text-xs text-gray-500">Last 7 days</div>
                </div>

                <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                  <div className="text-sm text-gray-400 mb-2">Streak</div>
                  <div className="text-4xl font-bold text-white mb-1">0</div>
                  <div className="text-xs text-gray-500">Days</div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Energy Trend */}
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Energy Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #1f1f1f' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="energy" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Class Distribution */}
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Class Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={classDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                      <XAxis dataKey="name" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #1f1f1f' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Journal */}
              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#1f1f1f] rounded-xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Quick Journal</h3>
                    <p className="text-gray-400">Record your post-workout thoughts</p>
                  </div>
                  <div className="text-4xl">🎤</div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-white mb-2">Class Type</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-80 px-4 py-3 bg-[#111111] border border-[#1f1f1f] rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
                  >
                    <option value="">Select class type...</option>
                    <option value="Hot Pilates">Hot Pilates</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Vinyasa Yoga">Vinyasa Yoga</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Cycling">Cycling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <VoiceRecorder
                  onRecordingComplete={handleRecordingComplete}
                  selectedClass={selectedClass}
                />
              </div>
            </div>
          )}

          {/* Journals Section */}
          {activeSection === 'journals' && (
            <div className="space-y-4">
              {journals.map((journal) => (
                <div key={journal.id} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 hover:border-cyan-500/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">
                        {journal.extracted_data?.class_type || 'Workout'}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {new Date(journal.created_at).toLocaleString('en-US', {
                          weekday: 'long',
                          hour: 'numeric',
                          minute: '2-digit',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      journal.status === 'complete' 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {journal.status === 'complete' ? 'Processed' : 'Pending'}
                    </span>
                  </div>

                  <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#1f1f1f]">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          const audio = document.getElementById(`audio-${journal.id}`) as HTMLAudioElement;
                          if (playingAudio === journal.id) {
                            audio.pause();
                            setPlayingAudio(null);
                          } else {
                            if (playingAudio) {
                              const prevAudio = document.getElementById(`audio-${playingAudio}`) as HTMLAudioElement;
                              if (prevAudio) prevAudio.pause();
                            }
                            audio.play();
                            setPlayingAudio(journal.id);
                          }
                        }}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 flex items-center justify-center transition-all hover:scale-105"
                      >
                        {playingAudio === journal.id ? (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="text-sm text-gray-300 font-medium mb-1">Audio Recording</div>
                        <div className="text-xs text-gray-500">{journal.audio_duration || 30} seconds</div>
                      </div>

                      <a
                        href={journal.audio_url}
                        download={`journal-${journal.id}.webm`}
                        className="text-gray-400 hover:text-cyan-400 transition p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    </div>

                    <audio
                      id={`audio-${journal.id}`}
                      src={journal.audio_url}
                      onEnded={() => setPlayingAudio(null)}
                      className="hidden"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Insights Section */}
          {activeSection === 'insights' && (
            <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Summary</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Based on your {journals.length} journal entries, your energy levels remain consistent. 
                    Continue your current routine for optimal results.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}