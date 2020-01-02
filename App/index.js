import React, { Component, Fragment } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  ScrollView, 
  View, 
  Text, 
  Platform, 
  AsyncStorage,
} from 'react-native';
import {Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import Routes from './Routes/index';
import firebase from 'react-native-firebase';
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
  getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  };

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  };
  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  };
  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  };

  createNotificationListeners = () => {
    this.onUnsubscribeNotificaitonListener = firebase
      .notifications()
      .onNotification(notification => {
        firebase.notifications().displayNotification(notification);
      });
  };

  removeNotificationListeners = () => {
    this.onUnsubscribeNotificaitonListener();
  };
  componentDidMount() {
    // Build a channel
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
    .setDescription('My apps test channel');

    // Create the channel
    firebase.notifications().android.createChannel(channel);
    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    this.removeNotificationListeners();
  }
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
