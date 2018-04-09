import * as types from '../action/types.js'
import createReducer from './createReducer'
import { combineReducers } from 'redux';
import * as Constants from '../../lib/constant'

const app_state = createReducer(false, {
  [types.WELCOME](state, action) {
    return action.state
  },
})



const loginReducer = combineReducers({
  app_state,
})

export default loginReducer