import React, {Component} from "react";
import PushNotification from "react-native-push-notification";
import {Platform, AsyncStorage,Alert} from 'react-native';
import firebase from 'react-native-firebase';
import  { RemoteMessage } from 'react-native-firebase';

// var PushNotification = require("react-native-push-notification");
export default class PushController extends Component{
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
        console.log('noti',notification)
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
    this.sendToken()
  }

  componentWillUnmount() {
    this.removeNotificationListeners();
  }

    render(){
        return null;
    }
}