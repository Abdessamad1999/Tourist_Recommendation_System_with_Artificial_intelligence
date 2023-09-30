from django.urls import path, include
from .views import *
from knox import views as knox_views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'user_profile', UserProfileView, 'user_profile')
router.register(r'auth/all_user', AllUsersAPI, 'all_user')

urlpatterns = [
  path('', include(router.urls)),
  path('auth/', include('knox.urls')),
  path('auth/register', RegisterAPI.as_view()),
  path('auth/register1', Register1API.as_view()),
  path('auth/register2', Register2API.as_view()),
  path('auth/login', LoginAPI.as_view()),
  path('auth/user', UserAPI.as_view()),
  path('auth/key_words', KeyWordsAPI.as_view()),
  path('auth/logout', knox_views.LogoutView.as_view(), name='knox_logout')
]