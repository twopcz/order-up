import React from 'react';
import Sidebar from './components/Sidebar';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './pages/Home';
import Manager from './pages/Manager';
import Menu from './pages/Menu';
import Employees from './pages/Employees';
import FOH from './pages/FOH';
import BOH from './pages/BOH';

function App() {
  return (
    <div>
      <Router>
        <Sidebar />
        <Switch>
          <Route exact path='/home' component={Home} />
          <Route exact path='/manager' component={Manager} />
          <Route exact path='/menu' component={Menu} />
          <Route exact path='/employees' component={Employees} />
          <Route exact path='/FOH' component={FOH} />
          <Route exact path='/BOH' component={BOH} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
