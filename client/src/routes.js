import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import App from './App'
import GoogleBotTest from './GoogleBotTest'
import NotFound from './NotFound'
import AdminPassword from './components/AdminPassword';

class Routes extends Component {
  render () {
    return <Router>
      <Switch>
        {['', '/kz', '/by', '/uz'].map((lang, i) => [
          <Route path={`${lang}/`} exact component={App} />,
          <Route path={`${lang}/search`} exact component={App} />,
          <Route path={`${lang}/get`} exact component={App} />,
          <Route path={`${lang}/s/:from/:to`} exact render={routeProps => <App sPage {...routeProps}/>} />,
        ])}
        <Route path='/googlebot_test' exact component={GoogleBotTest} />
        <Route path='/admin' exact component={AdminPassword} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  }
}

export default Routes
