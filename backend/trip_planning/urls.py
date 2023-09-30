from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'items', views.ItemView, 'item')
router.register(r'trips', views.TripPlanningView, 'trip')
router.register(r'reviews', views.ReviewsView, 'review')

urlpatterns = [
    path('api/', include(router.urls)),
]
