import axios from "axios";
import { CREATE_TRIP, SAVE_TRIP, GET_TRIPS, GET_TRIP, DELETE_TRIP, UPDATE_TRIP, LIKE_DISLIKE, TRIPS_DISTRU, RESET_ID_TRIP } from "./types";
import { host_url } from "../data";
import { toast } from "react-toastify";

// get trips
export const getTrips = () => (dispatch, getState) => {
  axios.get(`${host_url}/api/trips/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TRIPS,
        payload: res.data
      });
    })
    .catch(err => console.log(err))
}

// get trip
export const getTrip = (id_trip) => (dispatch, getState) => {
  axios.get(`${host_url}/api/trips/${id_trip}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TRIP,
        payload: res.data
      });
    })
    .catch(err => console.log(err))
}

export const resetIdTrip = () => (dispatch) => {
  dispatch({
    type: RESET_ID_TRIP
  })
}

// create trip
export const createTrip = (info) => (dispatch, getState) => {
  const body = JSON.stringify(info);
  axios.post(`${host_url}/api/trips/`, body, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: CREATE_TRIP,
        payload: res.data
      });
    }).catch((err) => console.log(err))
}

// load trip for offer
export const loadTripOffer = (info) => (dispatch, getState) => {
  const body = JSON.stringify(info);
  axios.post(`${host_url}/api/trips/load_trip_offer/`, body, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: CREATE_TRIP,
        payload: res.data
      });
    }).catch((err) => console.log(err))
}

// save trip
export const saveTrip = (info) => (dispatch, getState) => {
  const body = JSON.stringify(info)
  axios.post(`${host_url}/api/trips/save_trip/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: SAVE_TRIP,
        payload: res.data
      });
      toast.success('Trip is saved.');
    }).catch(err => console.log(err))
}

// update trip
export const updateTrip = (id, info) => (dispatch, getState) => {
  const body = JSON.stringify(info)
  axios.put(`${host_url}/api/trips/${id}/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_TRIP
      });
      toast.success('Trip is updated.');
    }).catch(err => console.log(err))
}

// update trip : like dislike
export const likeDislike = (id) => (dispatch, getState) => {
  
  axios.post(`${host_url}/api/trips/${id}/like_dislike/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: LIKE_DISLIKE
      });
    }).catch(err => console.log(err))
}

// trio distrubution
export const getTripsDistru = () => (dispatch) => {
  
  axios.get(`${host_url}/api/trips/trips_distribution/`)
    .then(res => {
      dispatch({
        type: TRIPS_DISTRU,
        payload: res.data
      });
    }).catch(err => console.log(err))
}


// add item to trip manual
export const addItemToTripManual = (info) => (dispatch, getState) => {
  const body = JSON.stringify(info)
  axios.post(`${host_url}/api/trips/add_item_manual/`, body, tokenConfig(getState))
  .then(res => {
    dispatch({
      type: CREATE_TRIP,
      payload: res.data
    });
  }).catch(err => console.log(err))
}

// add item to trip automatic
export const addItemToTripAuto = (info) => (dispatch, getState) => {
  const body = JSON.stringify(info)
  axios.post(`${host_url}/api/trips/add_item_auto/`, body, tokenConfig(getState))
  .then(res => {
    dispatch({
      type: CREATE_TRIP,
      payload: res.data
    });
  }).catch(err => console.log(err))
}

// remove item from trip
export const removeItemFromTrip = (info) => (dispatch, getState) => {
  const body = JSON.stringify(info)
  axios.post(`${host_url}/api/trips/remove_item/`, body, tokenConfig(getState))
  .then(res => {
    dispatch({
      type: CREATE_TRIP,
      payload: res.data
    });
  }).catch(err => console.log(err))
}

// delete trip
export const deleteTrip = (id) => (dispatch, getState) => {
  axios.delete(`${host_url}/api/trips/${id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DELETE_TRIP,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
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