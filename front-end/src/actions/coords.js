import axios from "axios";
import { MAPBOX_TOKEN } from "../data";
import { GET_COORDS, SET_COORDS } from "./types";

export const getRoute = (items) => (dispatch) => {
    const p = points(items);
    
    axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${p}?steps=true&overview=full&geometries=geojson&access_token=${MAPBOX_TOKEN}`)
    .then(res => {
        dispatch({
            type: GET_COORDS,
            payload: res.data.routes[0].geometry.coordinates
        });
    }).catch(err => console.log(err));
}

export const points = (items) => {
    let points_str = ``
    items.map((item, index) => {
        if (index) {
            points_str += `;${item.Longitude},${item.Latitude}`
        } else {
            points_str += `${item.Longitude},${item.Latitude}`
        }
    })

    return points_str;
}

export const setCoords = () => (dispatch) => {
    dispatch({
        type: SET_COORDS,
        payload: []
    });
}