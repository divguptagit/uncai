'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import HealthDataForm from '@/app/components/HealthDataForm';

interface HealthData {
  weight: number;
  height: number;
  activityLevel: string;
  goals: string[];
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [healthData, setHealthData] = useState<HealthData>({
    weight: 0,
    height: 0,
    activityLevel: 'moderate',
    goals: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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

  const handleSubmit = async (data: HealthData) => {
    try {
      const response = await fetch('/api/user/health', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage('Health data updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to update health data');
      }
    } catch (error) {
      console.error('Error updating health data:', error);
      setMessage('Failed to update health data. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Health Settings</h1>
      
      {message && (
        <div className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      <div className="card">
        <div className="p-6">
          <h2 className="text-lg font-medium text-white mb-4">Your Health Data</h2>
          <HealthDataForm
            initialData={healthData}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
