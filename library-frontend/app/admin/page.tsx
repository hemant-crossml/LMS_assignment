'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Book, Users, BookMarked, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeIssues: 0,
    overdueIssues: 0,
  });

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated && !user?.is_staff) {
      router.push('/');
    } else if (isAuthenticated && user?.is_staff) {
      fetchStats();
    }
  }, [isAuthenticated, isLoading, user, router]);

  const fetchStats = async () => {
    try {
      const [booksRes, usersRes, issuesRes, overdueRes] = await Promise.all([
        api.get('/books/'),
        api.get('/users/'),
        api.get('/issues/?returned=false'),
        api.get('/issues/overdue/'),
      ]);

      setStats({
        totalBooks: booksRes.data.length,
        totalUsers: usersRes.data.length,
        activeIssues: issuesRes.data.length,
        overdueIssues: overdueRes.data.length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.is_staff) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader
        title="Admin Dashboard"
        description="Manage your library system"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Books</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
                </div>
                <div className="bg-primary-100 rounded-full p-3">
                  <Book className="w-8 h-8 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="bg-secondary-100 rounded-full p-3">
                  <Users className="w-8 h-8 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Issues</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeIssues}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <BookMarked className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overdue Books</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.overdueIssues}</p>
                </div>
                <div className="bg-red-100 rounded-full p-3">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="http://localhost:8000/admin/books/book/"
                target="_blank"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Manage Books</h3>
                <p className="text-sm text-gray-600">Add, edit, or delete books from the system</p>
              </Link>

              <Link
                href="http://localhost:8000/admin/accounts/user/"
                target="_blank"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
                <p className="text-sm text-gray-600">View and manage user accounts</p>
              </Link>

              <Link
                href="http://localhost:8000/admin/circulation/issue/"
                target="_blank"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Manage Issues</h3>
                <p className="text-sm text-gray-600">Issue and return books</p>
              </Link>

              <Link
                href="http://localhost:8000/admin/circulation/reservation/"
                target="_blank"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Manage Reservations</h3>
                <p className="text-sm text-gray-600">View and process book reservations</p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Note:</strong> For detailed admin operations, use the Django admin panel at{' '}
                <a
                  href="http://localhost:8000/admin/"
                  target="_blank"
                  className="underline hover:text-blue-900"
                >
                  http://localhost:8000/admin/
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
