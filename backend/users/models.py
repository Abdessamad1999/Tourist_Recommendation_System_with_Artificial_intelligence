from djongo import models
from django.contrib.auth.models import AbstractUser
import numpy as np

def upload_to(instance, filename):
    return 'users/{filename}'.format(filename=filename)

# Create your models here.
class User(AbstractUser):
    _id = models.ObjectIdField()
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    gender = models.CharField(max_length=10)
    date_birth = models.DateField()
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    image = models.ImageField(upload_to=upload_to, default='users/profile.jpg')
    city = models.CharField(max_length=30, blank=True)
    country = models.CharField(max_length=30, blank=True)
    familiar_situation = models.CharField(max_length=30, blank=True)
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


class UserProfile(models.Model):
    _id = models.ObjectIdField()
    list_TFiDF = models.JSONField(default=list)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)