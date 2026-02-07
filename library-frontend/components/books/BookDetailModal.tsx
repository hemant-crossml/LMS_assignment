'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Book } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, Users, Calendar, Globe, BookMarked, Hash } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  const { user } = useAuthStore();
  const [isReserving, setIsReserving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!book) return null;

  const handleReserve = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please login to reserve a book' });
      return;
    }

    setIsReserving(true);
    setMessage(null);

    try {
      await api.post('/reservations/', {
        user: user.id,
        book: book.id,
      });
      setMessage({ type: 'success', text: 'Book reserved successfully!' });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to reserve book',
      });
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <div className="relative h-96 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden">
            {book.cover_image ? (
              <Image
                src={book.cover_image}
                alt={book.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="w-32 h-32 text-primary-400" />
              </div>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h2>
            <Badge variant={book.available_copies_count > 0 ? 'success' : 'danger'}>
              {book.available_copies_count > 0
                ? `${book.available_copies_count} Available`
                : 'Out of Stock'}
            </Badge>
          </div>

          {book.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{book.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <Users className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Authors</p>
                <p className="font-medium text-gray-900">
                  {book.authors.map(a => a.name).join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Publication Year</p>
                <p className="font-medium text-gray-900">{book.publication_year}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">ISBN</p>
                <p className="font-medium text-gray-900">{book.isbn}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Language</p>
                <p className="font-medium text-gray-900">{book.language}</p>
              </div>
            </div>

            {book.category && (
              <div className="flex items-start space-x-2">
                <BookMarked className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{book.category.name}</p>
                </div>
              </div>
            )}

            {book.publisher && (
              <div className="flex items-start space-x-2">
                <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Publisher</p>
                  <p className="font-medium text-gray-900">{book.publisher.name}</p>
                </div>
              </div>
            )}
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="pt-4 flex space-x-3">
            <Button
              variant="primary"
              onClick={handleReserve}
              isLoading={isReserving}
              disabled={book.available_copies_count === 0}
              className="flex-1"
            >
              Reserve Book
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
