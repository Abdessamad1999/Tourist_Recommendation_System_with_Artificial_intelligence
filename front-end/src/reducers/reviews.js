import { ADD_REVIEW, GET_REVIEWS_ITEM, CATEGORIES_USER, STATISTIC_REVIEWS, GET_ALL_REVIEWS, GET_NUMBERS_DASH, REVIEWS_DISTRU, DELETE_REVIEW, REVIEWS_TRIPS_NUMBERS } from "../actions/types";

const initialState = {
    reviews: [],
    all_reviews: [],
    review: null,
    links: null,
    categories_user: null,
    statistic: null,
    dashboard_numbers: null,
    reviews_distru: null,
    reviews_trips_number: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_REVIEW:
            return {
                ...state,
                reviews: [...state.reviews, action.payload],
            };

        case DELETE_REVIEW:
            return {
                ...state,
                all_reviews: state.all_reviews.filter(review => review.id !== action.payload),
            };

        case REVIEWS_TRIPS_NUMBERS:
            return {
                ...state,
                reviews_trips_number: action.payload
            };

        case GET_REVIEWS_ITEM:
            return {
                ...state,
                reviews: action.payload.results,
                links: action.payload.links
            };

        case GET_ALL_REVIEWS:
            return {
                ...state,
                all_reviews: action.payload
            };

        case CATEGORIES_USER:
            return {
                ...state,
                categories_user: action.payload
            };

        case STATISTIC_REVIEWS:
            return {
                ...state,
                statistic: action.payload
            };

        case GET_NUMBERS_DASH:
            return {
                ...state,
                dashboard_numbers: action.payload
            };

        case REVIEWS_DISTRU:
            return {
                ...state,
                reviews_distru: action.payload
            };

        default:
            return state;
    }

}
