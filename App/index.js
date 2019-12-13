import React, { Component } from 'react';
import {
  StyleSheet
} from 'react-native';
import Routes from './Routes/index';


class App extends Component {

  render() {
    return (
      <Routes />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f9023c',
    padding: 10,
    paddingTop: 180
  },
});


export default App
