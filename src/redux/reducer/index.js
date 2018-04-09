import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import loginReducer from './r_login';
import projectReducer from './r_project'

const reducer = combineReducers({
    loginReducer,
    projectReducer,
    routing: routerReducer
});

export default reducer;