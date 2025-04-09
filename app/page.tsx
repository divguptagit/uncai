

import Logo from './components/Logo'
import AnimatedButton from './components/AnimatedButton'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              Wellness<span className="text-blue-500">Watch</span>
            </h1>
          </div>
          <div>
            <AnimatedButton href="/login" className="text-sm px-4 py-2">
              Sign in
            </AnimatedButton>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <Logo />
            <h2 className="hero-title text-4xl sm:text-6xl font-bold text-white mb-6">
              Your Personal Health
              <span className="text-blue-500"> Assistant</span>
            </h2>
            <p className="hero-description text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Experience intelligent health monitoring that adapts to your needs.
              Stay on top of your health with personalized insights and reminders.
            </p>
            <AnimatedButton href="/login" className="hero-button">
              Get Started
            </AnimatedButton>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card card p-6" style={{animationDelay: '0.2s'}}>
              <h3 className="text-lg font-semibold text-white mb-3">Health Monitoring</h3>
              <p className="text-gray-400">Track your vital signs and daily activities with smart AI technology</p>
            </div>
            <div className="feature-card card p-6" style={{animationDelay: '0.4s'}}>
              <h3 className="text-lg font-semibold text-white mb-3">Smart Reminders</h3>
              <p className="text-gray-400">Never miss important medications or appointments with intelligent alerts</p>
            </div>
            <div className="feature-card card p-6" style={{animationDelay: '0.6s'}}>
              <h3 className="text-lg font-semibold text-white mb-3">Personalized Insights</h3>
              <p className="text-gray-400">Get tailored health recommendations based on your activity patterns</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-400">
            © 2025 WellnessWatch. Making health monitoring smarter.
          </p>
        </div>
      </footer>
    </div>
  )
}
