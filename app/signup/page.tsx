'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/app/auth';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setNameError('');
    setEmailError('');
    setPasswordError('');
    
    let hasError = false;
    
    if (!name) {
      setNameError('Please fill out the name field');
      hasError = true;
    }

    if (!email) {
      setEmailError('Please fill out the email field');
      hasError = true;
    } else if (!email.includes('@')) {
      setEmailError('Please include an \'@\' in the email address');
      hasError = true;
    }
    
    if (!password) {
      setPasswordError('Please fill out the password field');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      hasError = true;
    }

    if (hasError) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Sign in the user after successful signup
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!signInRes?.error) {
        // Login successful, redirect to home page
        router.push('/');
        router.refresh();
      } else {
        // If auto-login fails, redirect to login page
        router.push('/login?message=Account created successfully');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              UncAI
              <span className="text-blue-600 dark:text-blue-400">Assistant</span>
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Create your account
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value) {
                    setNameError('');
                  }
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                         placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                         dark:bg-gray-700 dark:text-white"
                placeholder="Enter your name"
              />
              {nameError && (
                <div className="mt-1 flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>{nameError}</span>
                </div>
              )}
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value) {
                    setEmailError('');
                  }
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                         placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                         dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
              />
              {emailError && (
                <div className="mt-1 flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>{emailError}</span>
                </div>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value) {
                    setPasswordError('');
                  }
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                         placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                         dark:bg-gray-700 dark:text-white"
                placeholder="Enter your password"
              />
              {passwordError && (
                <div className="mt-1 flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                       text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
