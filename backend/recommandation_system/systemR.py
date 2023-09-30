import pickle
import os
import numpy as np
import pandas as pd
import haversine as hs
from haversine import Unit
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import warnings
import json
# from tensorflow.keras.models import load_model

warnings.filterwarnings('ignore')

print('model loaded')
filename_model = 'recommandation_system/tools/model_ia/model_SVM.sav'
loaded_model = pickle.load(open(filename_model, 'rb'))

if not os.path.exists('recommandation_system/tools/tfidf_draa.npy'):
    print('create table of tf_idf')
    filename_tfidf = 'recommandation_system/tools/tfidf.pickle'
    tf_idf = pickle.load(open(filename_tfidf, 'rb'))
    items = pd.read_json('Dataset/data_draa.json')
    items['categories'] = [', '.join(x) for x in items['categories'].values]
    items['input_text'] = items.categories.replace({"[^A-Za-z0-9 ]+": ""}, regex=True)
    tfidf_matrix = tf_idf.transform(items['input_text'])
    np.save('recommandation_system/tools/tfidf_draa.npy', tfidf_matrix.toarray())



def get_recommondation1(user_profile, N):
    #list of items - tf-idf
    items_tf_idf = np.load('recommandation_system/tools/tfidf_draa.npy')
    input_data = []
    for item in items_tf_idf:
        input_data.append(item * user_profile)

    input_data = np.array(input_data)

    # prediction
    results = loaded_model.predict(input_data)
    return results.argsort()[-1:-N-1:-1]

def updateUserProfile(user_profile, rating, index_item):
    items_tf_idf = np.load('recommandation_system/tools/tfidf_draa.npy')
    tf_idf_item = items_tf_idf[index_item] * rating
    return [x+y for x,y in zip(user_profile, tf_idf_item)]

def get_recommondation(user_profile, index_debut, index_fin, N):
    #list of items - tf-idf
    items_tf_idf = np.load('recommandation_system/tools/tfidf_draa.npy')
    input_data = []
    for item in items_tf_idf:
        input_data.append(item * user_profile)

    input_data = np.array(input_data)

    # prediction
    results = loaded_model.predict(input_data).argsort()[::-1]
    results = np.setdiff1d(results, [index_debut, index_fin], assume_unique =True)
    N = N - 2
    idx = results[:N]

    return idx

def sort_ortools(items):

    # Instantiate the data problem.
    data = create_data_model(items)

    # Create the routing index manager.
    manager = pywrapcp.RoutingIndexManager(len(data['distance_matrix']),
                            data['num_vehicles'],data['starts'],data['ends'])

    # Create Routing Model.
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        """Returns the distance between the two nodes."""
        # Convert from routing variable Index to distance matrix NodeIndex.
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return data['distance_matrix'][from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)

    # Define cost of each arc.
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Setting first solution heuristic.
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)

    # Solve the problem.
    solution = routing.SolveWithParameters(search_parameters)

    # Print solution on console.
    if solution:
        return print_solution(manager, routing, solution, items)
    
    print('errore! pas de solution')
    return items

def create_data_model(items):
    M = []
    for i in range(len(items)):
        row = []
        for j in range(len(items)):
            loc1 = (items[i].Latitude, items[i].Longitude)
            loc2 = (items[j].Latitude, items[j].Longitude)
            row.append(round(hs.haversine(loc1,loc2,unit=Unit.METERS), 2))

        M.append(row)

    index_debut = 0
    index_fin = len(items)-1

    data = {}
    data['distance_matrix'] = M
    data['num_vehicles'] = 1
    data['starts'] = [index_debut]
    data['ends'] = [index_fin]
    
    return data

def print_solution(manager, routing, solution, items):
    
    print('Objective: {} Meters'.format(solution.ObjectiveValue()))

    index = routing.Start(0)
    items_sorted = []
    while not routing.IsEnd(index):
        items_sorted.append(items[manager.IndexToNode(index)])
        index = solution.Value(routing.NextVar(index))

    items_sorted.append(items[manager.IndexToNode(index)])
    return items_sorted

def content_recommondation_statique(index_item, N):
    #list of items - tf-idf
    items_tf_idf = np.load('recommandation_system/tools/tfidf_draa.npy')
    df = pd.DataFrame(items_tf_idf.T)
    corr_matrix = df.corr(method='pearson')
    sort_vecteur = corr_matrix[index_item].values.argsort()[::-1]
    items_index = np.delete(sort_vecteur, np.where(sort_vecteur == index_item))[:N]
    return items_index

def content_recommondation_ia(user_profile, index_item, N):
    #list of items - tf-idf
    items_tf_idf = np.load('recommandation_system/tools/tfidf_draa.npy')
    input_data = []
    for item in items_tf_idf:
        print(type(item))
        input_data.append(item * user_profile)

    input_data = np.array(input_data)

    # prediction
    results = loaded_model.predict(input_data).argsort()[::-1]
    results = np.setdiff1d(results, [index_item], assume_unique =True)

    items_index = results[:N]
    return items_index

def getKeyWords(user_profile):
    vocabular = np.load('recommandation_system/tools/feature_names.npy', allow_pickle=True)

    index_sorted = user_profile.argsort()[::-1]
    index_sorted = index_sorted[:10]

    return vocabular[index_sorted]