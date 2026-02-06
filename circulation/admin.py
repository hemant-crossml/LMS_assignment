from django.contrib import admin
from .models import Issue, Reservation

@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'book_copy',
        'issue_date',
        'due_date',
        'returned',
    )
    list_filter = ('returned', 'issue_date')
    search_fields = ('user__username', 'book_copy__book__title')


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'book',
        'created_at',
    )
    search_fields = ('user__username', 'book__title')
