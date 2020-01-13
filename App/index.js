import React, { Component } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
} from 'react-native';
import Routes from './Routes/index';


class App extends Component {
  
  render() {

    return (
      <SafeAreaView style={styles.safeArea}>
      <Routes />
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  }
});


export default App
