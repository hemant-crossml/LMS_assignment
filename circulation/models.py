# circulation/models.py
from django.db import models
from django.conf import settings
from books.models import BookCopy
from datetime import timedelta, date
from django.core.exceptions import ValidationError

class Issue(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='issues')
    book_copy = models.ForeignKey(BookCopy, on_delete=models.CASCADE, related_name='issues')
    issue_date = models.DateField(auto_now_add=True)
    due_date = models.DateField(blank=True, null=True)
    return_date = models.DateField(null=True, blank=True)  # Added
    returned = models.BooleanField(default=False)
    fine_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Added
    notes = models.TextField(blank=True)  # Added

    class Meta:
        ordering = ['-issue_date']
        indexes = [
            models.Index(fields=['user', 'returned']),
            models.Index(fields=['book_copy', 'returned']),
        ]

    def save(self, *args, **kwargs):
        if not self.due_date:
            self.due_date = date.today() + timedelta(days=14)
        
        # Mark book copy as unavailable when issued
        if not self.returned and not self.pk:
            self.book_copy.is_available = False
            self.book_copy.save()
        
        # Mark book copy as available when returned
        if self.returned and self.return_date:
            self.book_copy.is_available = True
            self.book_copy.save()
            
            # Calculate fine if overdue
            if self.return_date > self.due_date:
                days_overdue = (self.return_date - self.due_date).days
                self.fine_amount = days_overdue * 5  # $5 per day
        
        super().save(*args, **kwargs)

    def clean(self):
        if not self.returned and Issue.objects.filter(
            user=self.user, 
            returned=False
        ).exclude(pk=self.pk).count() >= 5:  # Max 5 books at a time
            raise ValidationError("User has already borrowed maximum number of books")
        
        if not self.book_copy.is_available and not self.pk:
            raise ValidationError("This book copy is not available")

    def __str__(self):
        return f"{self.user.username} - {self.book_copy.book.title}"
    
    @property
    def is_overdue(self):
        if not self.returned and self.due_date:
            return date.today() > self.due_date
        return False

class Reservation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('fulfilled', 'Fulfilled'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations')
    book = models.ForeignKey('books.Book', on_delete=models.CASCADE, related_name='reservations')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')  # Added
    expiry_date = models.DateTimeField(null=True, blank=True)  # Added
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'book']  # Prevent duplicate reservations

    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.status})"