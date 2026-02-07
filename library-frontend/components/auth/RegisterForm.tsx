'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { BookOpen } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RegisterData } from '@/types';
import Link from 'next/link';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterData & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      router.push('/');
    } catch (err: any) {
      setError(
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="h-16 w-16 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our library management system
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                type="text"
                {...register('first_name', { required: 'First name is required' })}
                error={errors.first_name?.message}
              />

              <Input
                label="Last Name"
                type="text"
                {...register('last_name', { required: 'Last name is required' })}
                error={errors.last_name?.message}
              />

              <Input
                label="Username"
                type="text"
                {...register('username', { required: 'Username is required' })}
                error={errors.username?.message}
              />

              <Input
                label="Email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                error={errors.password?.message}
              />

              <Input
                label="Confirm Password"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                error={errors.confirmPassword?.message}
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Type
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  {...register('user_type', { required: 'User type is required' })}
                >
                  <option value="">Select user type</option>
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="external">External</option>
                </select>
                {errors.user_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_type.message}</p>
                )}
              </div>

              <Input
                label="Phone (Optional)"
                type="tel"
                {...register('phone')}
              />

              <Input
                label="Address (Optional)"
                type="text"
                {...register('address')}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Register
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
