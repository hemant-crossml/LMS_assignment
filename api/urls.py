# api/urls.py
from rest_framework.routers import DefaultRouter
from .views import (
    BookViewSet, BookCopyViewSet, IssueViewSet, ReservationViewSet,
    AuthorViewSet, CategoryViewSet, PublisherViewSet, UserViewSet
)

router = DefaultRouter()
router.register('books', BookViewSet)
router.register('authors', AuthorViewSet)
router.register('categories', CategoryViewSet)
router.register('publishers', PublisherViewSet)
router.register('copies', BookCopyViewSet)
router.register('issues', IssueViewSet, basename='issue')
router.register('reservations', ReservationViewSet, basename='reservation')
router.register('users', UserViewSet)

urlpatterns = router.urls