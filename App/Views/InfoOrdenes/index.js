import React, { Component } from 'react';
import {
    StyleSheet,
    Alert,
    AsyncStorage,
    Text,
    View,
    ScrollView,
    RefreshControl,
    ImageBackground,
    TouchableOpacity,
    Image,
    Button,
    Dimensions,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { ListItem } from 'native-base';
import Drawer from 'react-native-drawer';
import { Actions } from 'react-native-router-flux';
import Moment from 'moment';
var numeral = require('numeral');

export default class Profile extends Component {
    constructor() {
        super()
        this.state = {
            data:[],  
        }
    };
    
    previewsPage(){
      Actions.profile()
    };
    componentWillMount(){
        this.state.data = this.props.data
    }
    // getAddress(data, tipo){
    //   console.log(tipo)
    //   if(tipo == 4){
    //     this.getAddressSolicitudes(data)
    //   } else {
    //     this.getAddressPo(data)
    //   }
    // }
    
   
    // howManyDaysAfter(date){
    //   // let dateStr = JSON.parse(date)
    //   var fecha = new Date(JSON.stringify(date));
     
    //   let dayCreated = Moment(date).format('D') // = 9
    //   let todaysDate = Moment(new Date()).format('D')
    //   var afterCreated = todaysDate - dayCreated
    //   if(afterCreated == 1){
    //     return <Text>Hace {afterCreated} d</Text>
    //   }else {
    //     return <Text>Hace {afterCreated} d</Text>
    //   }
    // };
    
    // getAddressPo(data){
    //   let arr = [data]
    //   let provider = arr.map((element)=>{
    //     return element.proposal.provider.address
    //   })
      
      // let address = provider.map((element)=>{
      //   return element.address
      // })
      // let city = provider.map((element)=>{
      //   return element.city
      // })
      // let zipCode = provider.map((element)=>{
      //   return element.zip_code
      // })
    //   return provider 
    // };
    // pendingPoLength(date){
    //   let arr = this.state.poDate
    //   var count = 0
    //   for(let i = 0; i < arr.length; i++){
    //      if(Moment(arr[i]).format('D MMM YY') == Moment(date).format('D MMM YY') ){
    //        count ++
    //      }
    //   }
    //   return count
    // };
   
   
    render() {
        var data = this.state.data
        console.log('from',data)
        return (
            <View style={styles.container}>
                <ScrollView style={{marginTop:0}}>
                    <View style={{marginTop:40}}></View>
                </ScrollView>
            </View> 
        )
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(211,211,211)",

    },
})
