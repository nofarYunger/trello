import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

import { boardReducer } from './reducers/boardReducer'
import { userReducer } from './reducers/userReducer'
import { popoverReducer } from './reducers/popoverReducer'
const rootReducer = combineReducers({
    boardReducer,
    userReducer,
    popoverReducer
});


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
