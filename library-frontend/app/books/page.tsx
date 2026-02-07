'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { BookCard } from '@/components/books/BookCard';
import { BookDetailModal } from '@/components/books/BookDetailModal';
import { BookFilters } from '@/components/books/BookFilters';
import { Book } from '@/types';
import api from '@/lib/api';

export default function BooksPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchBooks = async () => {
    try {
      const response = await api.get<Book[]>('/books/');
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredBooks(books);
      return;
    }

    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.isbn.toLowerCase().includes(query.toLowerCase()) ||
        book.authors.some((author) =>
          author.name.toLowerCase().includes(query.toLowerCase())
        )
    );
    setFilteredBooks(filtered);
  };

  const handleCategoryFilter = (categoryId: string) => {
    if (!categoryId) {
      setFilteredBooks(books);
      return;
    }

    const filtered = books.filter(
      (book) => book.category?.id === parseInt(categoryId)
    );
    setFilteredBooks(filtered);
  };

  const handleLanguageFilter = (language: string) => {
    if (!language) {
      setFilteredBooks(books);
      return;
    }

    const filtered = books.filter((book) => book.language === language);
    setFilteredBooks(filtered);
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader
        title="Browse Books"
        description="Explore our collection of books and reserve your favorites"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <BookFilters
          onSearch={handleSearch}
          onCategoryChange={handleCategoryFilter}
          onLanguageChange={handleLanguageFilter}
        />

        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => handleBookClick(book)}
              />
            ))}
          </div>
        )}
      </div>

      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
