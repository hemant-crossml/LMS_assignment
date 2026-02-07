export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'student' | 'staff' | 'external';
  phone: string;
  address: string;
  is_staff: boolean;
}

export interface Author {
  id: number;
  name: string;
  bio?: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Publisher {
  id: number;
  name: string;
  website?: string;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  publication_year: number;
  language: string;
  description?: string;
  cover_image?: string;
  total_pages?: number;
  authors: Author[];
  category: Category;
  publisher: Publisher;
  available_copies_count: number;
  total_copies_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface BookCopy {
  id: number;
  book: number;
  copy_number: string;
  is_available: boolean;
  condition: 'new' | 'good' | 'fair' | 'poor';
  location?: string;
}

export interface Issue {
  id: number;
  user: number;
  book_copy: number;
  book_copy_details?: {
    id: number;
    book: Book;
    copy_number: string;
    is_available: boolean;
  };
  user_details?: User;
  issue_date: string;
  due_date: string;
  return_date?: string;
  returned: boolean;
  fine_amount: string;
  notes?: string;
  is_overdue?: boolean;
}

export interface Reservation {
  id: number;
  user: number;
  book: number;
  book_details?: Book;
  user_details?: User;
  created_at: string;
  status: 'pending' | 'fulfilled' | 'cancelled';
  expiry_date?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  user_type: 'student' | 'staff' | 'external';
  phone?: string;
  address?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
