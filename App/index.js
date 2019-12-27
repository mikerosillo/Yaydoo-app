import React, { Component, Fragment } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  ScrollView, 
  View, 
  Text, 
  StatusBar, 
  FlatList
} from 'react-native';
import {Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import Routes from './Routes/index';
import PushController from './PushController';
// Dummy data for list, we'll replace this with data received from push
// let pushData = [
//   {
//     title: "First push",
//     message: "First push message"
//   },
//   {
//     title: "Second push",
//     message: "Second push message"
//   }
// ];
// _renderItem = ({ item }) => (
//   <View key={item.title}>
//     <Text style={styles.title}>{item.title}</Text>
//     <Text style={styles.message}>{item.message}</Text>
//   </View>
// );

class App extends Component {

  render() {
    // _renderItem = ({ item }) => (
    //   <View key={item.title}>
    //     <Text style={styles.title}>{item.title}</Text>
    //     <Text style={styles.message}>{item.message}</Text>
    //   </View>
    // );
    return (
      <Fragment>
      {/* <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          <View style={styles.listHeader}>
            <Text>Push Notifications</Text>
          </View>
          <View style={styles.body}>
            <FlatList
              data={pushData}
              renderItem={(item ) => _renderItem(item)}
              keyExtractor={(item ) => item.title}
            />
          </View>
        </ScrollView>
      </SafeAreaView> */}
      <PushController/>
      <Routes />
    </Fragment>
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
