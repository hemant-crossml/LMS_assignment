from rest_framework.viewsets import ModelViewSet
from books.models import Book, BookCopy
from books.serializers import BookSerializer, BookCopySerializer
from circulation.models import Issue, Reservation
from circulation.serializers import IssueSerializer, ReservationSerializer
from rest_framework.permissions import IsAdminUser

class BookViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminUser]

class BookCopyViewSet(ModelViewSet):
    queryset = BookCopy.objects.all()
    serializer_class = BookCopySerializer

class IssueViewSet(ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

class ReservationViewSet(ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer