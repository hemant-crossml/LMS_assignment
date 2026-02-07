'use client';

import React, { useState } from 'react';
import { Reservation } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar, X } from 'lucide-react';
import { formatDateTime } from '@/utils/helpers';
import api from '@/lib/api';

interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: () => void;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
}) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await api.post(`/reservations/${reservation.id}/cancel/`);
      onCancel?.();
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const statusColors = {
    pending: 'warning',
    fulfilled: 'success',
    cancelled: 'default',
  } as const;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {reservation.book_details?.title || 'Book Title'}
            </h3>
            {reservation.book_details?.authors && (
              <p className="text-sm text-gray-600">
                by {reservation.book_details.authors.map(a => a.name).join(', ')}
              </p>
            )}
          </div>
          <Badge variant={statusColors[reservation.status]}>
            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Reserved: {formatDateTime(reservation.created_at)}</span>
          </div>

          {reservation.expiry_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Expires: {formatDateTime(reservation.expiry_date)}</span>
            </div>
          )}
        </div>

        {reservation.status === 'pending' && (
          <div className="mt-4">
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancel}
              isLoading={isCancelling}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Reservation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
