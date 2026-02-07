# api/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from datetime import date

from books.models import Book, BookCopy, Author, Category, Publisher
from books.serializers import (
    BookSerializer, BookListSerializer, BookCopySerializer,
    AuthorSerializer, CategorySerializer, PublisherSerializer
)
from circulation.models import Issue, Reservation
from circulation.serializers import IssueSerializer, ReservationSerializer
from accounts.serializers import RegisterSerializer, UserProfileSerializer
from accounts.models import User

class BookViewSet(ModelViewSet):
    queryset = Book.objects.all().prefetch_related('authors', 'category', 'publisher')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'publication_year', 'language']
    search_fields = ['title', 'isbn', 'authors__name']
    ordering_fields = ['title', 'publication_year', 'created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BookListSerializer
        return BookSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    @action(detail=True, methods=['get'])
    def copies(self, request, pk=None):
        """Get all copies of a specific book"""
        book = self.get_object()
        copies = book.copies.all()
        serializer = BookCopySerializer(copies, many=True)
        return Response(serializer.data)

class AuthorViewSet(ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

class PublisherViewSet(ModelViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

class BookCopyViewSet(ModelViewSet):
    queryset = BookCopy.objects.all().select_related('book')
    serializer_class = BookCopySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['book', 'is_available', 'condition']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

class IssueViewSet(ModelViewSet):
    serializer_class = IssueSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['user', 'returned', 'book_copy__book']
    ordering_fields = ['issue_date', 'due_date']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Issue.objects.all().select_related('user', 'book_copy__book')
        return Issue.objects.filter(user=user).select_related('book_copy__book')
    
    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['get'])
    def my_issues(self, request):
        """Get current user's issues"""
        issues = Issue.objects.filter(user=request.user).select_related('book_copy__book')
        serializer = self.get_serializer(issues, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get all overdue books"""
        if not request.user.is_staff:
            return Response(
                {"detail": "Permission denied"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        overdue_issues = Issue.objects.filter(
            returned=False,
            due_date__lt=date.today()
        ).select_related('user', 'book_copy__book')
        
        serializer = self.get_serializer(overdue_issues, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        """Mark a book as returned"""
        if not request.user.is_staff:
            return Response(
                {"detail": "Permission denied"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        issue = self.get_object()
        issue.returned = True
        issue.return_date = date.today()
        issue.save()
        
        serializer = self.get_serializer(issue)
        return Response(serializer.data)

class ReservationViewSet(ModelViewSet):
    serializer_class = ReservationSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['user', 'book', 'status']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Reservation.objects.all().select_related('user', 'book')
        return Reservation.objects.filter(user=user).select_related('book')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_reservations(self, request):
        """Get current user's reservations"""
        reservations = Reservation.objects.filter(user=request.user).select_related('book')
        serializer = self.get_serializer(reservations, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a reservation"""
        reservation = self.get_object()
        if reservation.user != request.user and not request.user.is_staff:
            return Response(
                {"detail": "Permission denied"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        reservation.status = 'cancelled'
        reservation.save()
        
        serializer = self.get_serializer(reservation)
        return Response(serializer.data)

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    filterset_fields = ['user_type', 'is_active']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RegisterSerializer
        return UserProfileSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            from rest_framework.permissions import AllowAny
            return [AllowAny()]
        if self.action in ['update', 'partial_update', 'destroy', 'list']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Get or update current user profile"""
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        else:
            serializer = self.get_serializer(
                request.user, 
                data=request.data, 
                partial=request.method == 'PATCH'
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)