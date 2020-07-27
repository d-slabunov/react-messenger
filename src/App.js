import React from 'react';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import AdminPanel from './components/Admin/Admin';
import UserPanel from './components/User/User';
import './App.css';

const App = () => {
  return (
    <div className='App'>
      <Switch>
        <Route exact path='/' component={Login} />
        <Route path='/admin' component={AdminPanel} />
        <Route path='/user' component={UserPanel} />
      </Switch>
    </div>
  );
};

export default withRouter(App);
