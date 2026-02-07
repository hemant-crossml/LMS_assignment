'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { IssueCard } from '@/components/dashboard/IssueCard';
import { ReservationCard } from '@/components/dashboard/ReservationCard';
import { Issue, Reservation } from '@/types';
import api from '@/lib/api';
import { BookMarked, Clock } from 'lucide-react';

export default function MyBooksPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'issues' | 'reservations'>('issues');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchData = async () => {
    try {
      const [issuesRes, reservationsRes] = await Promise.all([
        api.get<Issue[]>('/issues/my_issues/'),
        api.get<Reservation[]>('/reservations/my_reservations/'),
      ]);

      setIssues(issuesRes.data);
      setReservations(reservationsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const activeIssues = issues.filter((issue) => !issue.returned);
  const returnedIssues = issues.filter((issue) => issue.returned);

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader
        title="My Books"
        description="Track your borrowed books and reservations"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg shadow-md p-1 mb-6">
          <button
            onClick={() => setActiveTab('issues')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
              activeTab === 'issues'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookMarked size={20} />
            <span className="font-medium">My Issues ({issues.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
              activeTab === 'reservations'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock size={20} />
            <span className="font-medium">My Reservations ({reservations.length})</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'issues' ? (
          <div className="space-y-8">
            {/* Active Issues */}
            {activeIssues.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Active Issues ({activeIssues.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              </div>
            )}

            {/* Returned Issues */}
            {returnedIssues.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  History ({returnedIssues.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {returnedIssues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              </div>
            )}

            {issues.length === 0 && (
              <div className="text-center py-12">
                <BookMarked className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No books issued yet</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {reservations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onCancel={fetchData}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No reservations yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
