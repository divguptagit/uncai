'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AnimatedButton from '../components/AnimatedButton';

export const dynamic = 'force-dynamic';

interface HealthData {
  weight: number;
  height: number;
  activityLevel: string;
  goals: string[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch('/api/user/health');
        const data = await response.json();
        setHealthData(data);
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);
  return (
    <div className="min-h-screen">
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Wellness<span className="text-blue-500">Watch</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {session?.user?.name}</span>
              <AnimatedButton
                onClick={() => signOut()}
                variant="secondary"
                className="text-sm px-4 py-2"
              >
                Sign Out
              </AnimatedButton>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Health Stats Card */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">Health Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Heart Rate</span>
                    <span className="text-white font-medium">72 bpm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Steps Today</span>
                    <span className="text-white font-medium">8,432</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Sleep</span>
                    <span className="text-white font-medium">7.5 hrs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reminders Card */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">Upcoming Reminders</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-900 text-blue-200">
                        1
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Take Medication</p>
                      <p className="text-gray-400">Today at 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-900 text-blue-200">
                        2
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Doctor's Appointment</p>
                      <p className="text-gray-400">Tomorrow at 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-white font-medium">Morning Walk</p>
                    <p className="text-gray-400">45 minutes - 3.2 km</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-white font-medium">Yoga Session</p>
                    <p className="text-gray-400">30 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
