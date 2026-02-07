# books/models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime

class Author(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)  # Added
    created_at = models.DateTimeField(auto_now_add=True)  # Added

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Made unique
    description = models.TextField(blank=True)  # Added
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

class Publisher(models.Model):
    name = models.CharField(max_length=100)
    website = models.URLField(blank=True)  # Added
    
    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    isbn = models.CharField(max_length=13, unique=True, db_index=True)
    publication_year = models.IntegerField(
        validators=[
            MinValueValidator(1000),
            MaxValueValidator(datetime.now().year)
        ]
    )
    language = models.CharField(max_length=50, default='English')
    description = models.TextField(blank=True)  # Added
    cover_image = models.URLField(blank=True)  # Added
    total_pages = models.IntegerField(null=True, blank=True)  # Added

    authors = models.ManyToManyField(Author, related_name='books')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='books')
    publisher = models.ForeignKey(Publisher, on_delete=models.SET_NULL, null=True, related_name='books')
    
    created_at = models.DateTimeField(auto_now_add=True)  # Added
    updated_at = models.DateTimeField(auto_now=True)  # Added

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['title', 'isbn']),
        ]

    def __str__(self):
        return self.title
    
    @property
    def available_copies_count(self):
        return self.bookcopy_set.filter(is_available=True).count()
    
    @property
    def total_copies_count(self):
        return self.bookcopy_set.count()

class BookCopy(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='copies')
    copy_number = models.CharField(max_length=50, unique=True)  # Added
    is_available = models.BooleanField(default=True)
    condition = models.CharField(  # Added
        max_length=20,
        choices=[
            ('new', 'New'),
            ('good', 'Good'),
            ('fair', 'Fair'),
            ('poor', 'Poor'),
        ],
        default='good'
    )
    location = models.CharField(max_length=100, blank=True)  # Shelf location
    
    class Meta:
        verbose_name_plural = 'Book Copies'
        ordering = ['book', 'copy_number']

    def __str__(self):
        return f"{self.book.title} - Copy #{self.copy_number}"