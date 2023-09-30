import {
    ADD_ITEM,
    DELETE_ITEM,
    EDIT_ITEM, GET_ITEMS,
    GET_LIST_ITEMS, GET_ITEM,
    GET_POPULAR_ITEMS, GET_ITEMS_WITH_CATEGORY,
    GET_ITEMS_CONTENT, GET_ITEMS_COLLABORATIVE, GET_ALL_ITEMS
} from '../actions/types'

const initialState = {
    items: [],
    all_items: [],
    items_popular: [],
    items_content: [],
    items_coll: [],
    item: null,
    links: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_LIST_ITEMS:
            return {
                ...state,
                items: action.payload,
            };

        case GET_ITEMS:
            return {
                ...state,
                items: action.payload.results,
                links: action.payload.links
            };

        case GET_ALL_ITEMS:
            return {
                ...state,
                all_items: action.payload
            };

        case GET_ITEMS_CONTENT:
            return {
                ...state,
                items_content: action.payload
            };

        case GET_ITEMS_COLLABORATIVE:
            return {
                ...state,
                items_coll: action.payload
            };

        case GET_POPULAR_ITEMS:
            return {
                ...state,
                items_popular: action.payload
            };

        case GET_ITEMS_WITH_CATEGORY:
            return {
                ...state,
                items: action.payload.results,
                links: action.payload.links
            };

        case GET_ITEM:
            return {
                ...state,
                item: action.payload
            };

        case DELETE_ITEM:
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload),
            };

        case ADD_ITEM:
            return {
                ...state,
                all_items: [action.payload, ...state.all_items],
            };

        case EDIT_ITEM:
            return {
                ...state,
                items: [action.payload, ...state.items.filter((item) => item.id !== action.payload.id)],
            };

        default:
            return state;
    }
}