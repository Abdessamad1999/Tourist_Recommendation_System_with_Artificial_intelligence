import { CREATE_TRIP, SAVE_TRIP, GET_TRIPS, GET_TRIP, DELETE_TRIP, UPDATE_TRIP, LIKE_DISLIKE, TRIPS_DISTRU, RESET_ID_TRIP } from '../actions/types';

const initialState = {
    trips: [],
    list_trips: [],
    id_trip: '',
    trips_distru: null,
}

export default function (state = initialState, action) {
    switch (action.type) {

        case CREATE_TRIP:
            return {
                ...state,
                trips: action.payload
            };

        case RESET_ID_TRIP:
            return {
                ...state,
                id_trip: ''
            };


        case GET_TRIP:
            return {
                ...state,
                trips: action.payload['item_list'],
                id_trip: action.payload["id"]
            };

        case SAVE_TRIP:
            return {
                ...state,
                list_trips: [action.payload, ...state.list_trips],
                id_trip: action.payload["id"]
            };

        case UPDATE_TRIP:
            return {
                ...state,
            };

        case GET_TRIPS:
            return {
                ...state,
                list_trips: action.payload
            };

        case TRIPS_DISTRU:
            return {
                ...state,
                trips_distru: action.payload
            };

        case LIKE_DISLIKE:
            return {
                ...state
            };

        case DELETE_TRIP:
            return {
                ...state,
                list_trips: state.list_trips.filter((trip) => trip.id !== action.payload),
            };

        default:
            return state;
    }
}