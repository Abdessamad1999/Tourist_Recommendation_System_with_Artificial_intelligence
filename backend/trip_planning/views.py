from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from bson import ObjectId, json_util
import json
import os
from .serializers import *
from users.models import UserProfile
from users.serializers import UserSerializer
from .models import *
from datetime import datetime
from PIL import Image
from io import BytesIO
from django.core.files import File
from recommandation_system.systemR import *
import numpy as np
import random

class CustomPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response(data={
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'page_size': self.page_size,
            'results': data
        }, status=status.HTTP_200_OK)

class ItemView(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    pagination_class = CustomPagination
    # parser_classes = [MultiPartParser, FormParser]

    def get_item(self, pk):
        try:
            return Item.objects.get(pk=ObjectId(pk))
        except:
            return None
   
    @action(detail=False)
    def insert_data(self, request):
        url_img = 'Dataset/images_draa/item '
        
        #read json file
        with open('Dataset/data_draa.json', 'rb') as f:
            items = json.load(f)

        for i, item in enumerate(items):
            print('item ',i+1)
            url = url_img+str(i+1)+'/'
            
            images = []
            for j, img_path in enumerate(os.listdir(url)):
                img = None
                img = Image.open(os.path.join(url, img_path))
                img = img.convert('RGB')
                blob = BytesIO()
                img.save(blob, 'JPEG') 
                data = ImagesItem()
                data.image.save(f'item_{i+1}_{j+1}.jpg', File(blob), save=True)
                images.append(data)

            ds = ImagesItemSerializer(data=images, context=self.get_serializer_context(), many=True)
            ds.is_valid()
            item['images'] = ds.data
            item['index'] = i
            item_serializer = self.get_serializer(data=item)
            item_serializer.is_valid(raise_exception=True)
            item_serializer.save()

        return Response({"message": "success"}, status=status.HTTP_200_OK)

    # GET ITEMS (blogs, admin)
    def list(self, request):
        page = self.paginate_queryset(self.queryset)
        if page is not None:
            data = self.get_serializer(page, many=True).data
            for i in range(len(data)):
                data[i]['images'] = eval(data[i]['images'])
            
            return self.get_paginated_response(data)

        return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # GET LIST ITEMS (user)
    @action(detail=False)
    def list_items(self, request):
        try : 
            serializer_items = ItemForTripSerializer(self.queryset, many=True).data
            return Response(data=serializer_items, status=status.HTTP_200_OK)
        except :
            return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # GET ALL ITEMS
    @action(detail=False)
    def all_items(self, request):
        data = self.get_serializer(self.queryset, many=True).data
        return Response(data=data, status=status.HTTP_200_OK)

    # GET POPULAR ITEMS (user)
    @action(detail=False)
    def popular_items(self, request):
        try : 
            queryset = Item.objects.all().order_by('-review_count')[:2]
            data = self.get_serializer(queryset, many=True).data
            for i in range(len(data)):
                data[i]['images'] = eval(data[i]['images'])
            return Response(data=data, status=status.HTTP_200_OK)
        except :
            return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=True)
    def items_content_statique(self, request, pk=None):
        # Méthode statique : Pearson correlation coefficient
        item = self.get_item(pk)

        index_items = content_recommondation_statique(item.index, 4)

        items = []
        for i in index_items:
            item = Item.objects.get(index=i)
            items.append(item)

        try :
            data = self.get_serializer(items, many=True).data
            for i in range(len(data)):
                data[i]['images'] = eval(data[i]['images'])

            return Response(data=data, status=status.HTTP_200_OK)
        except :
            return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True)
    def items_content_ia(self, request, pk=None):
        # Méthode IA : Modél SVM
        print('A')
        instance = UserProfile.objects.get(user=request.user)
        print('B')
        user_profile = np.array(instance.list_TFiDF)
        print('C')
        item = self.get_item(pk)
        print('D')
        index_items = content_recommondation_ia(user_profile, item.index, 4)
        print('E')
        print(index_items)

        items = []
        for i in index_items:
            item = Item.objects.get(index=i)
            items.append(item)

        try :
            print('here')
            data = self.get_serializer(items, many=True).data
            for i in range(len(data)):
                data[i]['images'] = eval(data[i]['images'])

            return Response(data=data, status=status.HTTP_200_OK)
        except :
            print('here2')
            return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False)
    def items_collaborative(self, request):
        try : 
            queryset = Item.objects.all().order_by('-review_count')[:6]
            data = self.get_serializer(queryset, many=True).data
            for i in range(len(data)):
                data[i]['images'] = eval(data[i]['images'])
            return Response(data=data, status=status.HTTP_200_OK)
        except :
            return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # SEARCH
    @action(detail=False, methods=['post'])
    def search(self, request):
        item_list = request.data.get('item_list',None)

        items = []
        for id in item_list:
            items.append(self.get_item(id))

        page = self.paginate_queryset(items)
        if page is not None:
            data = self.get_serializer(page, many=True).data
            for i in range(len(data)):
                data[i]['images'] = eval(data[i]['images'])
            
            return self.get_paginated_response(data)

        return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # GET ITEMS WITH CATEGORY (user)
    @action(detail=False, url_path=r'items_category/(?P<category>\w+)')
    def items_category(self, request, category=None):
        queryset = Item.objects.filter(category = category)
        page = self.paginate_queryset(queryset)
        if page is not None:
            data = self.get_serializer(page, many=True).data
            for i in range(len(data)):
                data[i]['images'] = eval(data[i]['images'])
            
            return self.get_paginated_response(data)

        return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # GET ITEM (article, admin)
    def retrieve(self, request, pk):
        item = self.get_item(pk)
        if item == None:
            return Response({"status": "fail", "message": f"Item with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(item)
        data = serializer.data
        data['images'] = eval(data['images'])
        data['categories'] = eval(data['categories'])
        
        return Response(data=data, status=status.HTTP_200_OK)
    
    # ADD ITEM (admin)
    def create(self, request, *args, **kwargs):
    
        index = Item.objects.last().index + 1
        images = []

        for j,img in enumerate(request.data.getlist('images')):
            data = ImagesItem()
            data.image.save(f'item_{index+1}_{j+1}.jpg', img, save=True)
            images.append(data)

        images_serializer = ImagesItemSerializer(data=images, context=self.get_serializer_context(), many=True)
        images_serializer.is_valid()
        request.data['images'] = images_serializer.data
        request.data['index'] = index
        request.data['categories'] = request.data.get('categories').split(',')

        # tf-idf of item
        filename_tfidf = 'recommandation_system/tools/tfidf.pickle'
        tf_idf = pickle.load(open(filename_tfidf, 'rb'))
        categories_input = ', '.join(request.data['categories'])
        tf_idf_item = tf_idf.transform([categories_input]).toarray()
        items_tf_idf = np.load('recommandation_system/tools/tfidf_draa.npy')
        data_tf_idf = np.concatenate((items_tf_idf, tf_idf_item), axis=0)
        np.save('recommandation_system/tools/tfidf_draa.npy', data_tf_idf)

        item_serializer = self.get_serializer(data=request.data)

        if item_serializer.is_valid(raise_exception=True):
            item_serializer.save()
            data = item_serializer.data
            data['images'] = eval(data['images'])

            return Response(data=data, status=status.HTTP_201_CREATED)

        return Response(data=item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # UPDATE ITEM / not work
    def update(self, request, pk=None):
        item = self.get_item(pk)

        serializer = self.serializer_class(instance=item, data=request.data, partial=True)

        if serializer.is_valid():
            print('valid')
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE ITEM (admin)
    def destroy(self, request, pk=None):
        print(pk)
        item = self.get_item(pk)
        if item == None:
            return Response({"status": "fail", "message": f"Item with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)
        
        for img in item.images:
            image = ImagesItem.objects.get(pk=ObjectId(img['_id']))
            os.remove('media/'+ str(image.image))
            image.delete()

        item.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ReviewsView(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()
    # permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    # def get_permissions(self):
    #     if self.action == 'list':
    #         permission_classes = [IsAuthenticated]
    #     else:
    #         permission_classes = [IsAdminUser]
    #     return [permission() for permission in permission_classes]

    def get_review(self, pk):
        try:
            return Review.objects.get(pk=ObjectId(pk))
        except:
            return None
        

    # Numbers
    @action(detail=False)
    def statistic_numbers(self, request):
        info = {
            "nb_items": len(Item.objects.all()),
            "nb_users": len(User.objects.all()),
            "nb_reviews": len(Review.objects.all()),
            "nb_trips": len(TripPlanning.objects.all())
        }

        return Response(info, status=status.HTTP_200_OK)
    
    # Numbers reviews , trips
    @action(detail=False)
    def number_reviews_trips(self, request):
        user = User.objects.get(pk=ObjectId(request.user._id))
        info = {
            "reviews": len(user.review_set.all()),
            "trips": len(user.tripplanning_set.all()),
        }

        return Response(info, status=status.HTTP_200_OK)
    
    # Distrubution de ratings
    @action(detail=False)
    def ratings_distribution(self, request):
        reviews = Review.objects.all()

        statistic = {key: 0 for key in ["1", "2", "3", "4", "5"]}
        for review in reviews:
            statistic[str(review.rating)] = statistic[str(review.rating)] + 1
        

        # for key in statistic.keys():
        #     statistic[key] = round((statistic[key]/len(reviews))*100)

        return Response(statistic, status=status.HTTP_200_OK)

    # GET ALL Reviews
    @action(detail=False)
    def all_reviews(self, request):

        reviews = Review.objects.all()
        data = []

        for review in reviews:
            r = {
                "id": json.loads(json_util.dumps(review._id))['$oid'],
                "user": review.user.last_name+ ' ' +review.user.first_name,
                "item": review.item.name,
                "rating": review.rating,
                "comment": review.comment,
                "date": review.date
            }

            data.append(r)

        return Response(data =data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def categories_user(self, request):
        user = User.objects.get(pk=ObjectId(request.user._id))
        reviews = user.review_set.all()

        all_categories = np.load('recommandation_system/tools/all_categories.npy')
        data = dict((el,0) for el in all_categories)

        for review in reviews:
            for category in review.item.categories:
                data[category] = data[category] + review.rating

        if reviews.count():
            for c in data.keys():
                data[c] = data[c] / reviews.count()
            
        # info = {'labels': data.keys(), 'values': data.values()}

        values = []
        for c in data.keys():
            v = round(random.uniform(0, 5), 2)
            if v > 0.5 :
                values.append(v)
            else:
                values.append(0)

        info = {'labels': data.keys(), 'values': values}

        return Response(data=info, status=status.HTTP_200_OK)

    # GET REVIEWS OF ITEM (user, admin)
    @action(detail=True)
    def reviews_of_item(self, request, pk=None):

        item = Item.objects.get(pk = ObjectId(pk))
        if item == None:
            return Response({"status": "fail", "message": f"Item with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)
        
        queryset = item.review_set.all()

        page = self.paginate_queryset(queryset)
        if page is not None:
            data = self.get_serializer(page, many=True).data
            data = json.loads(json_util.dumps(data))
            for i in range(len(data)):
                user = User.objects.get(pk=ObjectId(data[i]['user']['$oid']))
                data[i]['user'] = UserSerializer(instance=user).data
                data[i]['user']['image'] = 'http://localhost:8000'+data[i]['user']['image']
                data[i]['item'] = data[i]['item']['$oid']

            return self.get_paginated_response(data)

        return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # GET REVIEWS OF USER (user, admin)
    @action(detail=False)
    def reviews_of_user(self, request):
        user = User.objects.get(pk=ObjectId(request.user._id))
        queryset = user.review_set.all()

        page = self.paginate_queryset(queryset)
        if page is not None:
            data = self.get_serializer(page, many=True).data
            data = json.loads(json_util.dumps(data))
            for i in range(len(data)):
                data[i]['user'] = data[i]['user']['$oid']
                data[i]['item'] = data[i]['item']['$oid']

            return self.get_paginated_response(data)

        return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # STATISTIC
    @action(detail=True)
    def statistique(self, request, pk=None):
        item = Item.objects.get(pk=ObjectId(pk))

        if item == None:
            return Response({"status": "fail", "message": f"Item with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)
        
        reviews = item.review_set.all()
        statistic = {key: 0 for key in ["1", "2", "3", "4", "5"]}

        for review in reviews:
            statistic[str(review.rating)] = statistic[str(review.rating)] + 1

        for key in statistic.keys():
            statistic[key] = round((statistic[key]/len(reviews))*100)

        return Response(statistic, status=status.HTTP_200_OK)

    # GET REVIEWS (admin)
    def list(self, request):

        page = self.paginate_queryset(self.queryset)
        if page is not None:
            data = self.get_serializer(page, many=True).data
            data = json.loads(json_util.dumps(data))
            for i in range(len(data)):
                data[i]['user'] = data[i]['user']['$oid']
                data[i]['item'] = data[i]['item']['$oid']

            return self.get_paginated_response(data)

        return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # GET REVIEW (user, admin)
    def retrieve(self, request, pk):
        review = self.get_review(pk)

        if review == None:
            return Response({"status": "fail", "message": f"Review with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(review)
        data = json.loads(json_util.dumps(serializer.data))
        data['user'] = data['user']['$oid']
        data['item'] = data['item']['$oid']

        return Response(data = data, status=status.HTTP_200_OK)
    
    # ADD REVIEW
    def create(self, request):

        data = {
            "user": ObjectId(request.user._id),
            "item": ObjectId(request.data.get("item", None)),
            "rating": request.data.get("rating", None),
            "comment": request.data.get("comment", None),
        }

        serializer = self.serializer_class(data=data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            data = json.loads(json_util.dumps(serializer.data))
            user = User.objects.get(pk=ObjectId(data['user']['$oid']))
            data['user'] = UserSerializer(instance=user).data
            data['user']['image'] = 'http://localhost:8000'+data['user']['image']
            data['item'] = data['item']['$oid']

            # update_user_profile
            item = Item.objects.get(pk=ObjectId(data['item']))
            instance = UserProfile.objects.get(user=request.user)
            user_profile = np.array(instance.list_TFiDF)
            instance.list_TFiDF = updateUserProfile(user_profile, data['rating'], item.index)

            instance.save()

            #update item (stars and reviews count)
            item.review_count = item.review_count + 1
            item.sum_stars = item.sum_stars + data['rating']
            item.stars = round(item.sum_stars/item.review_count, 1)
            item.save()

            return Response(data=data, status=status.HTTP_201_CREATED)
        
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # UPDATE REVIEW (user)
    def update(self, request, pk):
        review = self.get_review(pk)

        data = {
            "user": ObjectId(request.user._id),
            "item": ObjectId(request.data.get("item", None)),
            "rating": request.data.get("rating", None),
            "comment": request.data.get("comment", None),
            "date": datetime.now()
        }

        serializer = self.serializer_class(instance=review, data=data)

        if serializer.is_valid():
            serializer.save()
            data = json.loads(json_util.dumps(serializer.data))
            data['user'] = data['user']['$oid']
            data['item'] = data['item']['$oid']

            return Response(data=data, status=status.HTTP_201_CREATED)
        
        Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE REVIEW (admin)
    def destroy(self, request, pk=None):

        review = self.get_review(pk)

        if review == None:
            return Response({"status": "fail", "message": f"Review with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)
        
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TripPlanningView(viewsets.ModelViewSet):
    serializer_class = TripPlanningSerializer
    queryset = TripPlanning.objects.all()

    def get_trip(self, pk):
        try:
            return TripPlanning.objects.get(pk=ObjectId(pk))
        except:
            return None
      
    # GET TRIPS (user)
    def list(self, request):
        try :
            user = User.objects.get(pk=ObjectId(request.user._id))
            queryset = user.tripplanning_set.all()

            trips = []
            data = self.get_serializer(queryset, many=True).data
            for i in range(len(data)):
                items = eval(data[i]['item_list'])
                trip = {
                    "id": data[i]['_id'],
                    "name": data[i]['name'],
                    "source": Item.objects.get(pk=ObjectId(items[0])).name,
                    "destination": Item.objects.get(pk=ObjectId(items[-1])).name,
                    "nb_items": len(items),
                    "like": data[i]['like'],
                    "date": data[i]['date']
                }

                trips.append(trip)
            
            trips = json.loads(json_util.dumps(trips))
            return Response(data=trips, status=status.HTTP_200_OK)

        except :
            return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # GET TRIPS (user)
    def list1(self, request):
        user = User.objects.get(pk=ObjectId(request.user._id))
        queryset = user.tripplanning_set.all()

        page = self.paginate_queryset(queryset)

        if page is not None:
            data = self.get_serializer(page, many=True).data

            for i in range(len(data)):
                items = []
                for id_item in eval(data[i]['item_list']):
                    items.append(Item.objects.get(pk=ObjectId(id_item)))

                items_s = ItemSerializer(data = items, context=self.get_serializer_context(), many=True)
                items_s.is_valid()
                data[i]['item_list'] = items_s.data

                for j in range(len(data[i]['item_list'])):
                    data[i]['item_list'][j]['images'] = eval( data[i]['item_list'][j]['images'])
            
                data = json.loads(json_util.dumps(data))
                data[i]['user'] = data[i]['user']['$oid']

            return self.get_paginated_response(data)

        return Response({"status": "fail", "message": f"Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # GET TRIP (user)
    def retrieve(self, request, pk):
        trip = self.get_trip(pk)
        print(trip._id)

        if trip == None:
            return Response({"status": "fail", "message": f"Trip with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = self.get_serializer(trip).data

        items = []
        for id_item in eval(data['item_list']):
            items.append(Item.objects.get(pk=ObjectId(id_item)))

        items_s = ItemSerializer(data = items, context=self.get_serializer_context(), many=True)
        items_s.is_valid()
        data['item_list'] = items_s.data

        for i in range(len(data['item_list'])):
            data['item_list'][i]['images'] = eval(data['item_list'][i]['images'])

        data = json.loads(json_util.dumps(data))
        data['user'] = data['user']['$oid']

        return Response(data = {"item_list": data['item_list'], "id": str(trip._id)}, status=status.HTTP_200_OK)
    
    # CREATE TRIP (user)
    def create(self, request):

        instance = UserProfile.objects.get(user=request.user)
        user_profile = np.array(instance.list_TFiDF)
        
        item_depart = Item.objects.get(pk=ObjectId(request.data['debut']))
        item_arrive = Item.objects.get(pk=ObjectId(request.data['fin']))
        N = int(request.data['number_items'])
        index_items = get_recommondation(user_profile, item_depart.index, item_arrive.index, N)

        items = []
        for i in index_items:
            item = Item.objects.get(index=i)
            items.append(item)

        items = [item_depart] + items + [item_arrive]

        # sorted item with OR-Tools - Google
        items = sort_ortools(items)

        data_s = ItemSerializer(data=items, context=self.get_serializer_context(), many=True)
        data_s.is_valid()

        for i in range(len(data_s.data)):
            data_s.data[i]['images'] = eval(data_s.data[i]['images'])
        
        return Response(data=data_s.data, status=status.HTTP_201_CREATED)
    
    # like_dislike
    @action(detail=True, methods=['post'])
    def like_dislike(self, request, pk=None):
        trip = self.get_trip(pk=pk)
        trip.like = not trip.like
        trip.save()

        return Response(status=status.HTTP_200_OK)


    # Distrubution des trips
    @action(detail=False)
    def trips_distribution(self, request):
        trips = TripPlanning.objects.all()

        statistic = {key: 0 for key in ["like", "dislike"]}
        for trip in trips:
            if trip.like:
                statistic["like"] = statistic["like"] + 1
            else :
                statistic["dislike"] = statistic["dislike"] + 1
        
        return Response(statistic, status=status.HTTP_200_OK)

    # LOAD TRIP OFFER
    @action(detail=False, methods=['post'])
    def load_trip_offer(self, request):
        list_items = request.data.get('list_items',None)
        items = []
        for id in list_items:
            item = Item.objects.get(pk=ObjectId(id))
            items.append(item)

        data_s = ItemSerializer(data=items, context=self.get_serializer_context(), many=True)
        data_s.is_valid()

        for i in range(len(data_s.data)):
            data_s.data[i]['images'] = eval(data_s.data[i]['images'])
        
        return Response(data=data_s.data, status=status.HTTP_201_CREATED)

    # SAVE TRIP
    @action(detail=False, methods=['post'])
    def save_trip(self, request):

        data = {
            "user": ObjectId(request.user._id),
            "name": request.data.get('name',None),
            "item_list": request.data.get('item_list',None)
        }

        trip_serializer = self.serializer_class(data=data)
        if trip_serializer.is_valid():
            trip_serializer.save()
            data = trip_serializer.data
            items = eval(data['item_list'])
            trip = {
                    "id": data['_id'],
                    "name": data['name'],
                    "source": Item.objects.get(pk=ObjectId(items[0])).name,
                    "destination": Item.objects.get(pk=ObjectId(items[-1])).name,
                    "nb_items": len(items),
                    "date": data['date']
                }
            
            trip = json.loads(json_util.dumps(trip))

            return Response(data=trip, status=status.HTTP_201_CREATED)
        return Response(data=trip_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # ADD ITEM TO TRIP MANUAL
    @action(detail=False, methods=['post'])
    def add_item_manual(self, request):
        item_list = request.data.get('item_list',None)

        items = []
        for id in item_list:
            items.append(Item.objects.get(pk=ObjectId(id)))

        data_s = ItemSerializer(data=items, context=self.get_serializer_context(), many=True)
        data_s.is_valid()

        for i in range(len(data_s.data)):
            data_s.data[i]['images'] = eval(data_s.data[i]['images'])
        
        return Response(data=data_s.data, status=status.HTTP_200_OK)
        
    # ADD ITEM TO TRIP AUTO
    @action(detail=False, methods=['post'])
    def add_item_auto(self, request):
        item_list = request.data.get('item_list',None)

        items = []
        for id in item_list:
            items.append(Item.objects.get(pk=ObjectId(id)))

        # sorted item with OR-Tools - Google
        items = sort_ortools(items)

        data_s = ItemSerializer(data=items, context=self.get_serializer_context(), many=True)
        data_s.is_valid()

        for i in range(len(data_s.data)):
            data_s.data[i]['images'] = eval(data_s.data[i]['images'])
        
        return Response(data=data_s.data, status=status.HTTP_200_OK)
    
    # REMOVE ITEM FROM TRIP
    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        item_list = request.data.get('item_list',None)

        items = []
        for id in item_list:
            items.append(Item.objects.get(pk=ObjectId(id)))

        data_s = ItemSerializer(data=items, context=self.get_serializer_context(), many=True)
        data_s.is_valid()

        for i in range(len(data_s.data)):
            data_s.data[i]['images'] = eval(data_s.data[i]['images'])
        
        return Response(data=data_s.data, status=status.HTTP_200_OK)

    # UPDATE Trip
    def update(self, request, pk):
        trip = self.get_trip(pk)
        item_list = request.data.get('item_list',None)
        print(type(item_list))
        trip.item_list = item_list
        trip.save()

        return Response(status=status.HTTP_200_OK)

    # DELETE TRIP (user)
    def destroy(self, request, pk=None):
        trip = self.get_trip(pk)
        if trip == None:
            return Response({"status": "fail", "message": f"Trip with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)

        trip.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
