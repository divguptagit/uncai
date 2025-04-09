'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import AnimatedButton from '../components/AnimatedButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setErrors({
            email: '',
            password: result.error,
          });
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrors({
          email: '',
          password: 'An error occurred during login',
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-3">
            Welcome Back
          </h2>
          <p className="text-lg text-gray-300">
            Sign in to your WellnessWatch account or{' '}
            <Link href="/register" className="text-blue-500 hover:text-blue-400">
              create an account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!e.target.value.includes('@')) {
                    setErrors(prev => ({ ...prev, email: 'Please include an @ in the email address' }));
                  } else {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="input-error">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="input-error">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 bg-gray-900 border-gray-700 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="#" className="text-blue-500 hover:text-blue-400 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <AnimatedButton
            type="submit"
            className="w-full"
          >
            Sign in
          </AnimatedButton>

          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link href="#" className="text-blue-500 hover:text-blue-400 transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
