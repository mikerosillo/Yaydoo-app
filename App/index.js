import React, { Component } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Routes from './Routes/index';


class App extends Component {
  componentDidMount() {
    console.disableYellowBox = true;
    SplashScreen.hide()
  }
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
