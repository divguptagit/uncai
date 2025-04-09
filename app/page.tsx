

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              Wellness<span className="text-blue-600">Watch</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your intelligent AI companion, making health monitoring simple and accessible
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">
            © 2025 WellnessWatch. Making health monitoring smarter.
          </p>
        </div>
      </footer>
    </div>
  )
}
