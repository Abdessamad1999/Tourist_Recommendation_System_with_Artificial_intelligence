from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from knox.models import AuthToken
from .models import UserProfile,User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, UserProfileSerializer
from bson import json_util, ObjectId
import json
import numpy as np
import pickle
from recommandation_system.systemR import getKeyWords

# Register API for new user
class RegisterAPI(generics.GenericAPIView):
  parser_classes = [MultiPartParser, FormParser]
  serializer_class = RegisterSerializer

  def post(self, request, *args, **kwargs):
    data = request.data
    # print(data)
    # return Response('A')
    categories = data.pop('categories',None)
    serializer = self.get_serializer(data=data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    # Create User_Profile
    tf_idf_user_profile = list(np.zeros(155, dtype=float))

    if categories:
      filename_tfidf = 'recommandation_system/tools/tfidf.pickle'
      tf_idf = pickle.load(open(filename_tfidf, 'rb'))
      input_tfidf = ', '.join(categories)

      tf_idf_user_profile = list(tf_idf.transform([input_tfidf]).toarray()[0])

    UserProfile.objects.create(
        list_TFiDF= tf_idf_user_profile,
        user = user
    )

    return Response({
      "user": UserSerializer(user, context=self.get_serializer_context()).data,
      "token": AuthToken.objects.create(user)[1]
    })

# Register API for new user
class Register2API(generics.GenericAPIView):
  parser_classes = [MultiPartParser, FormParser]
  serializer_class = RegisterSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    # Create User_Profile
    print('code is work')
    tf_idf = list(np.zeros(155, dtype=float))
    UserProfile.objects.create(
        list_TFiDF= tf_idf,
        user = user
    )

    return Response({
      "user": UserSerializer(user, context=self.get_serializer_context()).data,
      "token": AuthToken.objects.create(user)[1]
    })
  
# Register API for exist user 
class Register1API(generics.GenericAPIView):
  parser_classes = [MultiPartParser, FormParser]
  serializer_class = RegisterSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    # Create User_Profile
    array = np.load('recommandation_system/tools/user/user_profile_user1.npy')
    array = list(array)
    UserProfile.objects.create(
        list_TFiDF= array,
        user = user
    )

    return Response({
      "user": UserSerializer(user, context=self.get_serializer_context()).data,
      "token": AuthToken.objects.create(user)[1]
    })

# Login API
class LoginAPI(generics.GenericAPIView):
  serializer_class = LoginSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data
    _, token = AuthToken.objects.create(user)
    return Response({
      "user": UserSerializer(user, context=self.get_serializer_context()).data,
      "token": token
    })
  
# all users
class AllUsersAPI(viewsets.ModelViewSet):
  serializer_class = UserSerializer
  queryset = User.objects.all()

  def list(self, request):
    info = self.get_serializer(self.queryset, many=True).data
    return Response(info, status=status.HTTP_200_OK)
  
  @action(detail=False, methods=['post'])
  def updateUser(self, request):
    user = User.objects.get(pk = ObjectId(request.user._id))

    if type(request.data.get('image',None) == str):
      request.data.pop('image')

    serializer = self.get_serializer(instance=user, data=request.data, partial=True)

    if serializer.is_valid():
      serializer.save()
      return Response(data=serializer.data, status=status.HTTP_200_OK)
    
    return Response({"error": "error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


  
# key words
class KeyWordsAPI(generics.GenericAPIView):
  serializer_class = UserSerializer

  def post(self, request, *args, **kwargs):
    instance = UserProfile.objects.get(user=request.user)
    user_profile = np.array(instance.list_TFiDF)

    keywords = getKeyWords(user_profile)

    return Response(keywords,status=status.HTTP_200_OK)
  
# Get User API
class UserAPI(generics.RetrieveAPIView):
  permission_classes = [
    permissions.IsAuthenticated,
  ]
  serializer_class = UserSerializer

  def get_object(self):
    return self.request.user
  
class UserProfileView(viewsets.ModelViewSet):
  serializer_class = UserProfileSerializer
  queryset = UserProfile.objects.all()

  def list(self, request):
    data = self.serializer_class(self.queryset, many=True).data
    data = json.loads(json_util.dumps(data))
    for i in range(len(data)):
       data[i]['user'] = data[i]['user']['$oid']
    return Response(data=data,status=status.HTTP_200_OK)
  
  def retrieve(self, request,pk):
    instance = UserProfile.objects.get(_id=ObjectId(pk))
    data = self.serializer_class(instance).data
    data = json.loads(json_util.dumps(data))
    data['user'] = data['user']['$oid']
    return Response(data,
                    status=status.HTTP_200_OK)
    
  def update(self, request, pk, *args, **kwargs):
    instance = UserProfile.objects.get(_id=ObjectId(pk))
    data = {
      "list_TFiDF":list(request.data.get("list_TFiDF", None).split(',')),
      "user": ObjectId(request.data.get("user", None))
    }
    serializer = self.serializer_class(instance=instance,
                                        data=data, # or request.data
                                        partial=True)
    if serializer.is_valid():
        serializer.save()
        data = json.loads(json_util.dumps(serializer.data))
        data['user'] = data['user']['$oid']
        return Response(data=data, status=status.HTTP_201_CREATED)
    else:
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  # def create(self, request, *args, **kwargs):
  #   data = {
  #     "list_TFiDF":list(request.data.get("list_TFiDF", None).split(',')),
  #     "user": ObjectId(request.data.get("user", None))
  #   }
  #   serializer = self.serializer_class(data=data)
  #   if serializer.is_valid():
  #       serializer.save()
  #       serializer.data = json.loads(json_util.dumps(serializer))
  #       serializer.data['user'] = serializer.data['user']['$oid']
  #       return Response(data=serializer.data, status=status.HTTP_201_CREATED)
  #   else:
  #       return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  # def list(self, request):
  #       serializer = UserProfileSerializer(self.queryset, many=True)
  #       return Response(serializer.data)
  
  # def create(self, request):
  #   print(request.data)
  #   return Response('here')
