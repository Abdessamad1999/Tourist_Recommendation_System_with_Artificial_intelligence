import axios from 'axios';
import { host_url } from '../data';
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_USER_STAGE,
  REGISTER_USER_SINGUP,
  REGISTER_USER_INFO,
  REGISTER_FAIL,
  KEY_WORD_USER,
  GET_ALL_USERS,
  UPDATE_USER
} from './types';

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
  // User Loading
  dispatch({ type: USER_LOADING });

  axios
    .get(`${host_url}/api/auth/user`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

// GET ALL USERS
export const getAllUsers = () => (dispatch) => {
  axios.get(`${host_url}/api/auth/all_user/`)
    .then((res) => {
      dispatch({
        type: GET_ALL_USERS,
        payload: res.data,
      });
    })
    .catch((err) => {console.log(err)});
};

// LOGIN USER
export const login = (email, password) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Request Body
  const body = JSON.stringify({ email, password });
  axios
    .post(`${host_url}/api/auth/login`, body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      console.log('login fail');
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

export const update = (data) => (dispatch, getState) => {
  // Request Body
  const body = JSON.stringify(data);
  axios
    .post(`${host_url}/api/auth/all_user/updateUser/`, body, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: UPDATE_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  axios
    .post(`${host_url}/api/auth/logout`, null, tokenConfig(getState))
    .then((res) => {
      dispatch({ type: 'CLEAR_LEADS' });
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      console.log('logout fail');
    });
};

export const getKeyWordUser = () => (dispatch, getState) => {
  axios
    .post(`${host_url}/api/auth/key_words`, null, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: KEY_WORD_USER,
        payload: res.data
      });
    })
    .catch((err) => {
      console.log(err);
    });
};


export const formStage = (page) => (dispatch) => {
  dispatch({
    type: REGISTER_USER_STAGE,
    payload: page
  })
};

export const formSingup = (data) => (dispatch) => {
  dispatch({
    type: REGISTER_USER_SINGUP,
    payload: data
  })
};

export const formInfo = (data) => (dispatch) => {
  dispatch({
    type: REGISTER_USER_INFO,
    payload: data
  })
};

// REGISTER USER
export const register = (user_data, categories) => (dispatch) => {
  let formData = new FormData();

  formData.append('first_name', user_data.first_name);
  formData.append('last_name', user_data.last_name);
  formData.append('gender', user_data.gender);
  formData.append('date_birth', user_data.date_birth);
  formData.append('email', user_data.email);
  formData.append('password', user_data.password);
  formData.append('city', user_data.city);
  formData.append('country', user_data.country);
  formData.append('familiar_situation', user_data.familiar_situation);
  formData.append('image', user_data.image);
  formData.append('categories', categories);

  axios.post(`${host_url}/api/auth/register`, formData)
    .then(res => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log('register fail')
      dispatch({
        type: REGISTER_FAIL,
      });
    })
}

// REGISTER USER
export const register1 = ({ first_name, last_name, gender, date_birth, email, password }) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Request Body
  const body = JSON.stringify({ first_name, last_name, gender, date_birth, email, password });

  axios
    .post(`${host_url}/api/auth/register`, body, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      console.log('register fail');
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};



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