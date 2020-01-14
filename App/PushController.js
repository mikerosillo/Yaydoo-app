import React, {Component} from "react";
import {Platform, AsyncStorage,Alert} from 'react-native';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';

export default class PushController extends Component{
  getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  };
  async sendToken () {
    const access_token = await AsyncStorage.getItem('ACCESS_TOKEN')
    let token = await AsyncStorage.getItem('fcmToken');
    console.log("TOKEN:", token);
    await fetch(`https://stage.ws.yay.do/me/app/account`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          "X-Auth-Token": access_token
      },
      body: JSON.stringify({
        token: token,
        device: Platform.OS
      }),
    }).then((response)=>{
      console.log('from response',response)
    }).catch((err)=>{
      console.log('from error',err.message)
    })
  }
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
      // Alert.alert('Se recomienda tener activadas las notificaciones');
      console.log('permission rejected');
    }
  };
  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      // Alert.alert('Se recomienda tener activadas las notificaciones');
      console.log('permission rejected');
    }
  };

  createNotificationListeners = async () => {
    this.onUnsubscribeNotificaitonListener = firebase
      .notifications()
      .onNotification(notification => {
        console.warn('noti',notification)
        notification.android.setChannelId("teamcide")
        firebase.notifications().displayNotification(notification);
      });
      this.notificationOpenedListener = firebase.notifications().onNotificationOpened(() => {
        Actions.profile()
      });
  };

  removeNotificationListeners = () => {
    this.onUnsubscribeNotificaitonListener();
  };
  componentDidMount() {
    // Build a channel
    const channelld = new firebase.notifications.Android.Channel('teamcide', 'Test Channel', firebase.notifications.Android.Importance.High)
    .setDescription('My apps test channel');

    // Create the channel
    this.checkPermission();
    this.createNotificationListeners();
    firebase.notifications().android.createChannel(channelld);
    this.sendToken()
  }

  componentWillUnmount() {
    this.removeNotificationListeners();
  }

    render(){
        return null;
    }
}