from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
# from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('_id', 'first_name', 'last_name', 'gender', 'date_birth', 'email', 'image', 'city', 'country', 'familiar_situation', 'is_staff')

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('_id', 'first_name', 'last_name', 'gender', 'date_birth', 'email', 'password', 'image', 'city', 'country', 'familiar_situation', 'is_staff')
    extra_kwargs = {'password': {'write_only': True}}

  def create(self, validated_data):
    password = validated_data.pop('password', None)
    user = self.Meta.model(**validated_data)
    if password is not None:
      user.set_password(password)
    user.save()
    return user

# Login Serializer
class LoginSerializer(serializers.Serializer):
  email = serializers.EmailField()
  password = serializers.CharField()

  def validate(self, data):
    user = authenticate(**data)
    print('her')
    print(user)
    if user and user.is_active:
      return user 
    
    raise serializers.ValidationError("Incorrect Credentials")
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'