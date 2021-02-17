import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DrawerResponsive from './component/DrawerResponsive';
import SignIn from './component/SignIn';

const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={SignIn} /> {/* exact : 주어진 경로와 정확히 맞아 떨어져야만 설정한 컴포넌트를 보여줌 */}
          <Route path="/dashboard" component={DrawerResponsive} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
