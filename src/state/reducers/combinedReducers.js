import {combineReducers} from 'redux';
import userReducer from './userReducer';
import userProjectsReducer from './userProjectsReducer';
import projectReducer from './projectReducer';
import itemsReducer from './itemsReducer';

const reducers=combineReducers({
    user:userReducer,
    userProjects:userProjectsReducer,
    project:projectReducer,
    items:itemsReducer
})

export default reducers;