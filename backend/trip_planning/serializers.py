from rest_framework import serializers
from .models import *

class ImagesItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagesItem
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class ItemForTripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('_id', 'name')

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class TripPlanningSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripPlanning
        fields = '__all__'

