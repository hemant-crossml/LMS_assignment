from rest_framework.routers import DefaultRouter
from .views import BookViewSet,BookCopyViewSet,IssueViewSet,ReservationViewSet

router = DefaultRouter()
router.register('books', BookViewSet, )
router.register('copies', BookCopyViewSet)
router.register('issues', IssueViewSet)
router.register('reservations', ReservationViewSet)

urlpatterns = router.urls