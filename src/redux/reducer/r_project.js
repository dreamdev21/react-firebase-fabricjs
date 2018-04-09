import * as types from '../action/types.js'
import createReducer from './createReducer'
import { combineReducers } from 'redux';
import * as Constants from '../../lib/constant'

const selected_project = createReducer({}, {
  [types.SELECTED_PROJECT](state, action) {
    return action.project
  },
})

const sorted_workIds = createReducer([], {
  [types.SORTED_WORKIDS](state, action) {
    return action.workIds
  },
})

const ProjectReducer = combineReducers({
  selected_project,
  sorted_workIds
})



export default ProjectReducer