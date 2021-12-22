import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom'
import { AppHeader } from './cmps/AppHeader.jsx'
import { routes } from './routes'
function App() {
  return (
    <Router>
      <AppHeader />
      <main className="App">
        <Switch>
          {routes.map(route => <Route exact key={route.path} path={route.path} component={route.component} />)}
        </Switch>
      </main>
    </Router>
  );
}

export default App;
