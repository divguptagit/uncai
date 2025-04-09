'use client';

import { useState } from 'react';
import AnimatedButton from './AnimatedButton';

interface HealthData {
  weight: number;
  height: number;
  activityLevel: string;
  goals: string[];
}

interface Props {
  initialData: HealthData;
  onSubmit: (data: HealthData) => void;
}

export default function HealthDataForm({ initialData, onSubmit }: Props) {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">
          Weight (kg)
        </label>
        <input
          type="number"
          id="weight"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">
          Height (cm)
        </label>
        <input
          type="number"
          id="height"
          value={formData.height}
          onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-300 mb-1">
          Activity Level
        </label>
        <select
          id="activityLevel"
          value={formData.activityLevel}
          onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
          className="input-field"
        >
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very-active">Very Active</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Health Goals
        </label>
        <div className="space-y-2">
          {['Weight Loss', 'Muscle Gain', 'Better Sleep', 'More Energy', 'Stress Reduction'].map((goal) => (
            <label key={goal} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.goals.includes(goal)}
                onChange={(e) => {
                  const newGoals = e.target.checked
                    ? [...formData.goals, goal]
                    : formData.goals.filter(g => g !== goal);
                  setFormData({ ...formData, goals: newGoals });
                }}
                className="h-4 w-4 bg-gray-900 border-gray-700 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
              />
              <span className="text-gray-300">{goal}</span>
            </label>
          ))}
        </div>
      </div>

      <AnimatedButton type="submit" className="w-full">
        Save Changes
      </AnimatedButton>
    </form>
  );
}
