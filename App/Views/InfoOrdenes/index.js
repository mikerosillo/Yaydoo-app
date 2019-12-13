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
            token: '',
            refreshing: true,
            pendingPo:[],
            poDate:[],
        }
        this.getAllPo()
    };
    onRefresh() {
        this.setState({ pendingPo: [] })
        this.getAllPo()
    };
    
    previewsPage(){
      Actions.profile()
    };
    
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
    
    async getAllPo() {
        const token = await AsyncStorage.getItem('ACCESS_TOKEN')
        const uuid = await AsyncStorage.getItem('UUID');
        if (token && uuid) { // if user is logged in
            await fetch(`https://stage.ws.yay.do/v2/enterprise/${uuid}/purchaseOrder/?filter=2&type=3&page=1&approver=1`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "X-Auth-Token": token
                },

            })
                .then((response) => {
                    if (response.ok) {
                        response.json().then((datos) => {
                             // var ultimaFecha = Moment(lastDate[0]).format('D MMM YY')
                          // console.log(datos.data.account)
                          // console.log(datos.data.approved)
                          // console.log(datos.data.internal)
                            let accountInfo = datos.data
                            // let solicitudes = datos.data
                            // let name = codes[0].account.user.first_name

                            var pendingPo = accountInfo.filter((element) => {
                                return element.type == 3
                            })
                            var createdAt = pendingPo.map((element)=>{
                              return element.created_at
                            })

                            //console.log('json filter',pendingPo[0])
                            // var map2 = accountInfo.map((element) => {
                            //     return element.folio
                            // })
                            this.setState({
                              refreshing: false,
                              pendingPo:pendingPo,
                              poDate:createdAt,
                            })
                        })
                    }
                })
                .catch(err => console.warn(err.message));
        } else {
            this.setState({refreshing: false})
            // Alert.alert('Favor de iniciar sesión')
        }
    };
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
       
        return (
            <View style={styles.container}>
               
                <ScrollView style={{marginTop:0}}
                    refreshControl={
                        <RefreshControl
                            //refresh control used for the Pull to Refresh
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >
                
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
