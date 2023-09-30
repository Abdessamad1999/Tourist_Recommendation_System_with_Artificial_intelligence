import { combineReducers } from 'redux'
import items from './items'
import auth from './auth';
import trips from './trips';
import reviews from './reviews';
import coords from './coords';

export default combineReducers({
    items,
    auth,
    trips,
    reviews,
    coords
});