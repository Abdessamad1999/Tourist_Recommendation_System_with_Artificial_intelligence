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
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  user: null,
  all_users: [],
  formStage: 1,
  formUserSingup: "",
  formUserInfo: "",
  keyWords: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case UPDATE_USER:
      return {
        ...state,
        user: action.payload
      };

    case GET_ALL_USERS:
      return {
        ...state,
        all_users: action.payload,
      };

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };

    case REGISTER_USER_STAGE:
      return {
        ...state,
        formStage: action.payload
      };

    case REGISTER_USER_SINGUP:
      return {
        ...state,
        formUserSingup: action.payload
      };

    case REGISTER_USER_INFO:
      return {
        ...state,
        formUserInfo: action.payload
      };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case KEY_WORD_USER:
      return {
        ...state,
        keyWords: action.payload
      };
    default:
      return state;
  }
}