'use client';

import { useEffect, useState, useRef } from 'react';
import { auth, signOut } from '@/app/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const session = await auth();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        setName(session.user.name || '');
        setEmail(session.user.email || '');
        setImageUrl(session.user.image || '');
      }
    };
    getSession();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const updateData: any = { name, email };
      if (currentPassword && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }
      if (imageUrl) {
        updateData.image = imageUrl;
      }

      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setUser({ ...user, ...data });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Profile
            </h1>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Profile Picture */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-gray-200 dark:bg-gray-700">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                           dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-900 dark:text-white">
                  {user?.name || 'Not set'}
                </p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                           shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                           dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-900 dark:text-white">
                  {user?.email}
                </p>
              )}
            </div>

            {/* Password fields - only shown when editing */}
            {isEditing && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                             dark:bg-gray-700 dark:text-white"
                    placeholder="Enter only if changing password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                             dark:bg-gray-700 dark:text-white"
                    placeholder="Enter only if changing password"
                  />
                </div>
              </div>
            )}

            {/* Error and Success messages */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-4">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                             text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                             focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setName(user?.name || '');
                      setEmail(user?.email || '');
                      setCurrentPassword('');
                      setNewPassword('');
                      setError('');
                      setSuccess('');
                    }}
                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm 
                             font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 
                             dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                             text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                             focus:ring-blue-500"
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm 
                             font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 
                             dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
