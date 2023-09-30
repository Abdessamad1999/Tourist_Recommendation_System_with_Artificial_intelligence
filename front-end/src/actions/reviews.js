import axios from "axios";
import { GET_REVIEWS_ITEM, ADD_REVIEW, CATEGORIES_USER, STATISTIC_REVIEWS, GET_ALL_REVIEWS, GET_NUMBERS_DASH, REVIEWS_DISTRU, DELETE_REVIEW, REVIEWS_TRIPS_NUMBERS } from "./types";
import { host_url } from "../data";


// GET ALL REVIEWS
export const getAllReviews = () => (dispach) => {
  axios.get(`${host_url}/api/reviews/all_reviews/`)
  .then(res => {
    console.log(res.data);
    dispach({
      type: GET_ALL_REVIEWS,
      payload: res.data
    });
  }).catch(err => console.log(err))
}

// Number of reviews and trips
export const getNumberReviewsAndTrips= () => (dispach, getState) => {
  axios.get(`${host_url}/api/reviews/number_reviews_trips/`, tokenConfig(getState))
  .then(res => {
    dispach({
      type: REVIEWS_TRIPS_NUMBERS,
      payload: res.data
    });
  }).catch(err => console.log(err))
}

// REMOVE REVIEWS
export const deleteReview = (id) => (dispach) => {
  axios.delete(`${host_url}/api/reviews/${id}/`)
  .then(res => {
    dispach({
      type: DELETE_REVIEW,
      payload: id
    });
  }).catch(err => console.log(err))
}

// GET REVIEWS WITH ITEM
export const getNumbersDash = () => (dispach) => {
  axios.get(`${host_url}/api/reviews/statistic_numbers/`)
  .then(res => {
    dispach({
      type: GET_NUMBERS_DASH,
      payload: res.data
    });
  }).catch(err => console.log(err))
}

// GET REVIEWS WITH ITEM
export const getReviewsDistru = () => (dispach) => {
  axios.get(`${host_url}/api/reviews/ratings_distribution/`)
  .then(res => {
    dispach({
      type: REVIEWS_DISTRU,
      payload: res.data
    });
  }).catch(err => console.log(err))
}


// GET REVIEWS WITH ITEM
export const getReviewsItem = (id ,url) => (dispach) => {

  if (url === undefined){
    url = `${host_url}/api/reviews/${id}/reviews_of_item/`
  }

  axios.get(url)
  .then(res => {
    dispach({
      type: GET_REVIEWS_ITEM,
      payload: res.data
    });
  }).catch(err => console.log(err))
}

export const getCategoriesUser = () => (dispatch, getState) => {
  axios
    .post(`${host_url}/api/reviews/categories_user/`, null, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: CATEGORIES_USER,
        payload: res.data
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// ADD REVIEW
export const addReview = (review) => (dispatch, getState) => {
    const body = JSON.stringify(review);
    axios.post(`${host_url}/api/reviews/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
            type: ADD_REVIEW,
            payload: res.data
        });
    }).catch(err => console.log(err))
}

// Statistic
export const getStatisticReviews = (id) => (dispatch) => {
  axios.get(`${host_url}/api/reviews/${id}/statistique/`)
    .then(res => {
      dispatch({
            type: STATISTIC_REVIEWS,
            payload: res.data
        });
    }).catch(err => console.log(err))
}

// Setup config with token - helper function
export const tokenConfig = (getState) => {
    // Get token from state
    const token = getState().auth.token;
  
    // Headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    // If token, add to headers config
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
  
    return config;
};