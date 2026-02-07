from rest_framework import serializers
from circulation.models import Issue, Reservation
from books.serializers import BookSerializer, BookCopySerializer
from accounts.serializers import UserProfileSerializer

class IssueSerializer(serializers.ModelSerializer):
    book_copy_details = BookCopySerializer(source='book_copy', read_only=True)
    user_details = UserProfileSerializer(source='user', read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Issue
        fields = '__all__'
        read_only_fields = ('issue_date', 'fine_amount', 'return_date')

    def validate(self, data):
        if not data.get('returned', False):
            # Check if book copy is available
            if not data['book_copy'].is_available:
                raise serializers.ValidationError("This book copy is not available")
            
            # Check user's current issue count
            active_issues = Issue.objects.filter(
                user=data['user'],
                returned=False
            ).count()
            
            if active_issues >= 5:
                raise serializers.ValidationError("User has reached maximum borrow limit (5 books)")
        
        return data

class ReservationSerializer(serializers.ModelSerializer):
    book_details = BookSerializer(source='book', read_only=True)
    user_details = UserProfileSerializer(source='user', read_only=True)
    
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ('created_at',)