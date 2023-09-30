from djongo import models
from django.core.validators import RegexValidator, MaxValueValidator, MinValueValidator
from users.models import User

def upload_to(instance, filename):
    return 'items/{filename}'.format(filename=filename)

class ImagesItem(models.Model):
    _id = models.ObjectIdField()
    image = models.ImageField(upload_to=upload_to, default='items/default.jpg')
    # item = models.ForeignKey(to=Item, on_delete=models.CASCADE)

class Item(models.Model):
    phoneNumberRegex = RegexValidator(regex = r"^\+?1?\d{8,15}$")

    _id = models.ObjectIdField()
    index = models.IntegerField(validators = [MinValueValidator(0)], unique=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    categories = models.JSONField()
    description = models.TextField(null=True, blank=True)
    adress = models.CharField(max_length=255)
    phoneNumber = models.CharField(validators = [phoneNumberRegex], max_length = 16, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    site = models.URLField(null=True, blank=True)
    Latitude = models.FloatField()
    Longitude = models.FloatField()
    stars = models.FloatField(default=0, validators = [MinValueValidator(1), MaxValueValidator(5)])
    sum_stars = models.FloatField(default=0, validators = [MinValueValidator(0)])
    review_count = models.IntegerField(default=0, validators = [MinValueValidator(0)])
    city = models.CharField(max_length=30)
    video = models.URLField(null=True, blank=True)
    timetable = models.CharField(max_length=255, null=True, blank=True)
    price = models.FloatField(default=0, validators = [MinValueValidator(0)], null=True, blank=True)
    images = models.ArrayField(model_container = ImagesItem)

    def __str__(self):
        return self.name
    


class Review(models.Model):
    _id = models.ObjectIdField()
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    item = models.ForeignKey(to=Item, on_delete=models.CASCADE)
    rating = models.IntegerField(validators = [MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)


class TripPlanning(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=255)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    item_list = models.JSONField()
    like = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name