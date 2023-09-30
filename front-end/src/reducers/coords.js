import { GET_COORDS, SET_COORDS } from '../actions/types';

const initialSlide = {
    coords: [],
}

export default function (state = initialSlide, action) {
    switch (action.type) {
        case GET_COORDS:
            return {
                ...state,
                coords: action.payload
            };

        case SET_COORDS:
            return {
                ...state,
                coords: action.payload
            };
        default :
            return state;
    }
}