// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import VoiceRecorder from '../components/VoiceRecorder';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [journals, setJournals] = useState<any[]>([]);
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

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
      console.log('Recording complete!', audioBlob);
      
      const timestamp = Date.now();
      const fileName = `${user?.id}/${timestamp}.webm`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
          cacheControl: '3600',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Failed to upload recording. Please try again.');
        return;
      }

      console.log('Upload successful:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName);

      console.log('Audio URL:', publicUrl);

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
        console.error('Journal error:', journalError);
        alert('Failed to save journal. Please try again.');
        return;
      }

      console.log('Journal saved:', journalData);
      
      alert('Recording saved successfully! We will process it with AI soon.');
      setSelectedClass('');
      
      if (user?.id) {
        await fetchJournalsForUser(user.id);
      }

    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
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
      
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20"></div>
      
      <div className="relative min-h-screen">
        
        <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏋️</span>
                <h1 className="text-xl font-bold text-white">TruInsights</h1>
              </div>
              
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

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="text-gray-400 text-sm mb-2">Total Journals</div>
              <div className="text-3xl font-bold text-white mb-1">{journals.length}</div>
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
            
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Class Type
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full md:w-80 px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:border-white/50 transition"
              >
                <option value="" className="bg-zinc-900">Select class type...</option>
                <option value="Hot Pilates" className="bg-zinc-900">Hot Pilates</option>
                <option value="HIIT" className="bg-zinc-900">HIIT</option>
                <option value="Vinyasa Yoga" className="bg-zinc-900">Vinyasa Yoga</option>
                <option value="Strength Training" className="bg-zinc-900">Strength Training</option>
                <option value="Cycling" className="bg-zinc-900">Cycling</option>
                <option value="Other" className="bg-zinc-900">Other</option>
              </select>
            </div>

            <VoiceRecorder
              onRecordingComplete={handleRecordingComplete}
              selectedClass={selectedClass}
            />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">
                Recent Journals
              </h3>
              {journals.length > 0 && (
                <button className="text-sm text-purple-400 hover:text-purple-300 font-medium transition">
                  View All ({journals.length})
                </button>
              )}
            </div>

            {loadingJournals ? (
              <div className="text-center py-16">
                <div className="text-gray-400">Loading journals...</div>
              </div>
            ) : journals.length === 0 ? (
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
              </div>
            ) : (
              <div className="space-y-4">
                {journals.map((journal) => (
                  <div key={journal.id} className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 hover:border-zinc-600 transition">
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
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          journal.status === 'complete' 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : journal.status === 'processing'
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}>
                          {journal.status === 'complete' ? 'Processed' : 
                           journal.status === 'processing' ? 'Processing' : 
                           'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
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
                            className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
                          >
                            {playingAudio === journal.id ? (
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            )}
                          </button>
                          
                          <div className="flex-1">
                            <div className="text-sm text-gray-300 mb-1 font-medium">Audio Recording</div>
                            <div className="text-xs text-gray-500">
                              {journal.audio_duration || 30} seconds
                            </div>
                          </div>
                          
                          <a
                            href={journal.audio_url}
                            download={`journal-${journal.id}.webm`}
                            className="text-gray-400 hover:text-white transition p-2"
                            title="Download recording"
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

                    {journal.transcript && (
                      <div className="mb-4 p-4 bg-zinc-900 rounded-lg border border-zinc-700">
                        <div className="text-xs text-gray-400 mb-2">Transcript:</div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {journal.transcript}
                        </p>
                      </div>
                    )}

                    {journal.status === 'complete' && journal.extracted_data && (
                      <div className="flex flex-wrap gap-2">
                        {journal.extracted_data.energy && (
                          <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                            Energy: {journal.extracted_data.energy}/10
                          </span>
                        )}
                        {journal.extracted_data.difficulty && (
                          <span className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                            Difficulty: {journal.extracted_data.difficulty}/10
                          </span>
                        )}
                        {journal.extracted_data.mood && (
                          <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-medium">
                            Mood: {journal.extracted_data.mood}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}