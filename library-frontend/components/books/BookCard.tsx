'use client';

import React from 'react';
import Image from 'next/image';
import { Book } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, Users, Calendar } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  // Check if book has available copies
  const availableCount = book.available_copies_count || 0;
  const totalCount = book.total_copies_count || 0;
  const isAvailable = availableCount > 0;

  return (
    <Card hoverable className="cursor-pointer h-full" onClick={onClick}>
      <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200">
        {book.cover_image ? (
          <Image
            src={book.cover_image}
            alt={book.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="w-24 h-24 text-primary-400" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge variant={isAvailable ? 'success' : 'danger'}>
            {isAvailable ? `${availableCount} Available` : 'Out of Stock'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {book.title}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
           <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">
              {book.authors && book.authors.length > 0
                ? typeof book.authors[0] === 'string'
                ? book.authors.join(', ')
                : book.authors.map(a => a.name).join(', ')
              : 'Unknown Author'}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{book.publication_year || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Language:</span>
            <span className="ml-2">{book.language || 'N/A'}</span>
          </div>
          {book.category && (
            <div className="mt-2">
              <Badge variant="info">
                {typeof book.category === 'string'
                  ? book.category
                  : book.category.name}
              </Badge>

            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Available:</span>
            <span className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {availableCount} / {totalCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
