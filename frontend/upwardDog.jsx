var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;
var IndexRoute = ReactRouter.IndexRoute;

var Landing = require('./components/Landing');
var App = require('./components/App');
var LoginForm = require('./components/LoginForm');
var TasksIndex = require('./components/TasksIndex');
var TasksEdit = require('./components/TasksEdit');
var ProjectsIndex = require('./components/ProjectsIndex');
var ProjectsDetail = require('./components/ProjectsDetail');
var NewProjectsForm = require('./components/NewProjectsForm');
var EditProjectsForm = require('./components/EditProjectsForm');

var SessionStore = require('./stores/SessionStore');
var SessionApiUtil = require('./util/SessionApiUtil');
var TasksApiUtil = require('./util/TasksApiUtil');

var routes = (
  <Route path="/" component={Landing} >
    <Route path="/hello" component={App} >
      <Route path="/hello/login" component={ LoginForm } />
      <Route path="/hello/signup" component={ LoginForm } />
      <Route path="/hello/login/guest" component={ LoginForm } />
    </Route>
    <IndexRoute component={ProjectsIndex} />
    <Route path="/user/projects" component={ProjectsIndex} onEnter={ redirectIfNotLoggedIn }>
      <Route path="/user/projects/new" component={NewProjectsForm} />
      <Route path="/user/projects/:id/edit" component={EditProjectsForm} />
      <Route path="/user/projects/:project_id" component={ProjectsDetail} >
        <IndexRoute component={TasksIndex} />
        <Route path="/user/projects/:project_id/tasks" component={TasksIndex} >
          <Route path="/user/projects/:project_id/tasks/:id/edit" component={ TasksEdit }/>
        </Route>
      </Route>
    </Route>
  </Route>
);


function _ensureLoggedIn(nextState, replace, asyncDoneCallback) {
  if (SessionStore.currentUserHasBeenFetched()){
    asyncDoneCallback();
  } else {
    SessionApiUtil.fetchCurrentUser(asyncDoneCallback);
  }
}

function redirectIfNotLoggedIn(nextState, replace) {
  if (!SessionStore.isUserLoggedIn()) {
    replace('/hello');
  }
}


document.addEventListener("DOMContentLoaded", function () {
  var root = document.getElementById("content");
  ReactDOM.render(
    <Router history={hashHistory}>{routes}</Router>, root);
});
