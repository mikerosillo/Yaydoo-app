import React from 'react';
import { Router, Scene } from 'react-native-router-flux';
import Login from '../Components/Login';
import Profile from '../Views/Profile';
import PlaceHolder from '../Components/PlaceHolder';
import Welcome from '../Components/Welcome';
import InfoOrdenes from '../Views/InfoOrdenes';

const Routes = () => (
  <Router>
    <Scene key="root">
      <Scene key="start" component={PlaceHolder} initial={true} />
      <Scene key="welcome" component={Welcome} hideNavBar />
      <Scene key="login" component={Login} hideNavBar />
      <Scene key="profile" component={Profile} hideNavBar />
      <Scene key="infoOrdenes" component={InfoOrdenes} hideNavBar />
    </Scene>
  </Router>
);
export default Routes;