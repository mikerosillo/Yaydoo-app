import React, {Component} from "react";
import PushNotification from "react-native-push-notification";
import {Platform, AsyncStorage,} from 'react-native';

// var PushNotification = require("react-native-push-notification");
export default class PushController extends Component{
    componentDidMount(){
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: async function(token) {
              const access_token = await AsyncStorage.getItem('ACCESS_TOKEN')
              console.log("TOKEN:", token.token);
              await fetch(`https://stage.ws.yay.do/v2/me/app/account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Auth-Token": access_token
                },
                body: JSON.stringify({
                  token: token.token,
                  device:'Android'
                }),
              }).then((response)=>{
                console.log('from response',response)
              }).catch((err)=>{
                console.log('from error',err.message)
              })
            },
          
            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
              console.log("NOTIFICATION:", notification, );
           
              // const Component = Platform.select({
              //   ios: () => require('ComponentIOS'),
              //   android: () => require('ComponentAndroid'),
              // })();
          
              // process the notification here
          
              // required on iOS only 
              if(Platform.OS == "ios"){
                notification.finish(PushNotificationIOS.FetchResult.NoData);
              }
            //   notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            // Android only
            senderID: "200303079766",
            // iOS only
            permissions: {
              alert: true,
              badge: true,
              sound: true
            },
            popInitialNotification: true,
            requestPermissions: true
          });
    }

    render(){
        return null;
    }
}