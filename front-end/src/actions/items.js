import axios from "axios";
import { toast } from "react-toastify"
import {
    ADD_ITEM, DELETE_ITEM,
    EDIT_ITEM, GET_ITEMS, GET_LIST_ITEMS,
    GET_ITEM, GET_POPULAR_ITEMS,
    GET_ITEMS_WITH_CATEGORY, GET_ITEMS_CONTENT,
    GET_ITEMS_COLLABORATIVE,
    GET_ALL_ITEMS
} from "./types";
import { host_url } from '../data';


// GET ITEMS
export const getListItems = () => dispatch => {
    axios.get(`${host_url}/api/items/list_items/`)
        .then(res => {
            dispatch({
                type: GET_LIST_ITEMS,
                payload: res.data,
            });
        }).catch(err => console.log(err));
}

// GET ITEMS
export const getItems = (url) => dispatch => {
    if (url === undefined) {
        url = `${host_url}/api/items/`
    }

    axios.get(url)
        .then(res => {
            dispatch({
                type: GET_ITEMS,
                payload: res.data,
            });
        }).catch(err => console.log(err));
}

// GET ALL ITEMS
export const getAllItems = () => dispatch => {

    axios.get(`${host_url}/api/items/all_items/`)
        .then(res => {
            dispatch({
                type: GET_ALL_ITEMS,
                payload: res.data,
            });
        }).catch(err => console.log(err));
}

// GET POPULAR ITEMS
export const getPopularItems = () => dispatch => {

    axios.get(`${host_url}/api/items/popular_items/`)
        .then(res => {
            console.log(res.data)
            dispatch({
                type: GET_POPULAR_ITEMS,
                payload: res.data
            });
        })
        .catch(err => console.log(err))
}

// GET SIMILAR ITEMS (unauthenticated)
export const getSimilarItemStatique = (id) => (dispatch) => {
    axios.get(`${host_url}/api/items/${id}/items_content_statique/`)
        .then(res => {
            dispatch({
                type: GET_ITEMS_CONTENT,
                payload: res.data
            });
        })
        .catch(err => console.log(err))
}

// GET SIMILAR ITEMS (authenticated)
export const getSimilarItemIA = (id) => (dispatch, getState) => {
    axios.get(`${host_url}/api/items/${id}/items_content_ia/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_ITEMS_CONTENT,
                payload: res.data
            });
        })
        .catch(err => console.log(err))
}

// GET ITEMS (collaborative)
export const getCollaborativeItem = () => (dispatch) => {
    axios.get(`${host_url}/api/items/items_collaborative/`)
        .then(res => {
            dispatch({
                type: GET_ITEMS_COLLABORATIVE,
                payload: res.data
            });
        })
        .catch(err => console.log(err))
}

// GET ITEMS WITH CATEGORY
export const getItemsWithCategory = (category) => dispatch => {
    axios.get(`${host_url}/api/items/items_category/${category}/`)
        .then(res => {
            dispatch({
                type: GET_ITEMS_WITH_CATEGORY,
                payload: res.data
            });
        })
        .catch(err => console.log(err))
}

// SEARCH
export const search = (info) => dispatch => {
    const body = JSON.stringify(info)

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    axios.post(`${host_url}/api/items/search/`, body, config)
        .then(res => {
            dispatch({
                type: GET_ITEMS,
                payload: res.data,
            });
        }).catch(err => console.log(err))
}

// GET_ITEM
export const getItem = (id) => dispatch => {
    axios.get(`${host_url}/api/items/${id}/`)
        .then(res => {
            dispatch({

                type: GET_ITEM,
                payload: res.data,
            });
        }).catch(err => console.log(err));
}

// DELETE ITEM
export const deleteItem = (id) => (dispatch) => {
    axios
        .delete(`${host_url}/api/items/${id}/`)
        .then((res) => {
            dispatch({
                type: DELETE_ITEM,
                payload: id,
            });
        })
        .catch((err) => console.log(err));
}

// ADD ITEM
export const addItem = (item) => dispatch => {
    let formData = new FormData();

    for (const key in item) {
        if (key !== 'images') {
            formData.append(key, item[key])
        } else {
            for (let i = 0; i < item[key].length; i++) {
                formData.append(key, item[key][i])
            }
        }

    }
    axios.post(`${host_url}/api/items/`, formData)
        .then((res) => {
            dispatch({
                type: ADD_ITEM,
                payload: res.data,
            });
            toast.success('Item Added successfully.');
        }).catch((err) => console.log(err))
}

// EDIT ITEM
export const editItem = (item) => dispatch => {
    axios.put(`${host_url}/api/items/${item._id}/`, item)
        .then((res) => {
            dispatch({
                type: EDIT_ITEM,
                payload: res.data,
            });
            toast.success('Item Updated successfully.');
        }).catch((err) => console.log(err))
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