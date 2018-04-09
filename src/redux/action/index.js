import * as loginActions from './a_login'
import * as projectActions from './a_project'
import * as workActions from './a_work'
import * as profileActions from './a_profile'
import * as activityActions from './a_activity'

export const ActionCreators = Object.assign({},
  loginActions,
  projectActions,
  workActions,
  profileActions,
  activityActions
);