import React, { Component } from 'react';

import Login from './scene/login'
import FirstProject from './scene/project/new'
import AllProjects from './scene/project/all'
import Project from './scene/project/select'
import WorkItemView from './scene/work'
import MyAccount from './scene/profile'
import Activity from './scene/activity'
import InvalidPage from './scene/invalidPage'
import reducer from './redux/reducer/index.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import promise from 'redux-promise-middleware';


const loggerMiddleware = createLogger();
const routeMiddleware = routerMiddleware(browserHistory);
const promiseMiddleware = promise()

const middleware = compose(applyMiddleware(  promiseMiddleware,  thunkMiddleware,  loggerMiddleware ), window.devToolsExtension ? window.devToolsExtension() : f => f);
const store = createStore(reducer, {}, middleware);
const history = syncHistoryWithStore(browserHistory, store);
injectTapEventPlugin();


class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <Router history={history}>
            <Route path="/">
              <IndexRoute component={Login} />
            </Route>
            <Route path="/app/projects">
              <IndexRoute component={FirstProject}/>
              <Route path="/app/projects/all" component={AllProjects} />
              <Route path="/app/projects/:id" component={Project} />
              <Route path="/app/projects/:id/works/:index" component={WorkItemView} />
            </Route>
            <Route path="/app/myaccount">
              <IndexRoute component={MyAccount} />
            </Route>
            <Route path="/app/activity">
              <IndexRoute component={Activity} />
            </Route>
            <Route path="*" component={InvalidPage}>
            </Route>

          </Router>
        </Provider>
    );
  }
}

export default App;
