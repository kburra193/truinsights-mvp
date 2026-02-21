// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/30 via-black to-purple-900/30"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      {/* Content Container */}
      <div className="relative min-h-screen flex flex-col">
        
        {/* Hero Section */}
        <div className="px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-7xl mb-6">🏋️</div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
              TruInsights
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-300 font-light mb-8">
              AI-Powered Fitness Intelligence
            </h2>
            <p className="text-2xl md:text-3xl text-white font-medium mb-2">
              Track your progress the easiest way
            </p>
            <p className="text-xl md:text-2xl text-gray-400 mb-10">
              Just talk for 30 seconds
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup"
                className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-purple-500/50"
              >
                Get Started →
              </Link>
              <Link 
                href="/login"
                className="px-10 py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-lg font-semibold rounded-lg transition-all hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-6xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-white mb-3">
                How it works
              </h3>
              <p className="text-gray-400 text-lg">
                Three simple steps to transform your fitness tracking
              </p>
            </div>
            
            {/* 3 Steps Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl font-bold text-purple-400">1</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">
                  Record your thoughts
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  30 seconds of talking after your workout. No forms, no buttons. Just speak naturally.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl font-bold text-purple-400">2</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">
                  AI extracts insights
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Our AI captures energy levels, nutrition, what worked, and what didn't.
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl font-bold text-purple-400">3</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">
                  See your progress
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Beautiful visualizations reveal patterns you'd never notice on your own.
                </p>
              </div>

            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              
              <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div className="text-5xl mb-3">🎤</div>
                <h4 className="text-lg font-semibold text-white mb-2">No Typing</h4>
                <p className="text-gray-400 text-sm">Voice-first design</p>
              </div>

              <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div className="text-5xl mb-3">⚡</div>
                <h4 className="text-lg font-semibold text-white mb-2">30 Seconds</h4>
                <p className="text-gray-400 text-sm">That's all it takes</p>
              </div>

              <div className="text-center p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div className="text-5xl mb-3">📊</div>
                <h4 className="text-lg font-semibold text-white mb-2">Smart Insights</h4>
                <p className="text-gray-400 text-sm">AI-powered analytics</p>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-800 py-8 mt-auto">
          <p className="text-center text-gray-500 text-sm">
            © 2026 TruInsights • Built with 💜 for fitness enthusiasts
          </p>
        </footer>

      </div>
    </main>
  );
}