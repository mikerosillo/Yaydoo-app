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
    constructor(props) {
        super(props)
        this.state = {
            token: '',
            codes: [],
            refreshing: true,
            userName: '',
            solicitudes:[],
            pendingPo:[],
            solicitudesDate:[],
            poDate:[],
        }
        this.getAllSolicitudes()
        this.getAllPo()
    };
    onRefresh() {
        this.setState({ solicitudes: [], pendingPo: [] })
        this.getAllSolicitudes()
        this.getAllPo()
    };
    openDrawer() {
        this.drawer.open();
    };
    logout() {
        // OneSignal.removeExternalUserId()
        AsyncStorage.clear();
        Actions.welcome({
          type: 'reset',
        });
    };
    refresh(){
      Actions.profile()
    };
    async getAllSolicitudes() {
        const token = await AsyncStorage.getItem('ACCESS_TOKEN')
        const uuid = await AsyncStorage.getItem('UUID');
        if (token && uuid) { // if user is logged in
            await fetch(`https://stage.ws.yay.do/v2/enterprise/${uuid}/quotation/request/pending?page=1`, {
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
                          let allSolicitudes = datos.data
                          var solicitudes = allSolicitudes.filter((element) => {
                              return element.type == 4
                          })
                          var createdAt = solicitudes.map((element)=>{
                            return element.created_at
                          })
                            this.setState({
                              refreshing: false,
                              solicitudes: solicitudes,
                              solicitudesDate:createdAt
                            })
                        })
                    }
                })
                .catch(err => console.warn(err.message));
        } else {
            this.setState({refreshing: false})
        }
    };
    // getAddress(data, tipo){
    //   console.log(tipo)
    //   if(tipo == 4){
    //     this.getAddressSolicitudes(data)
    //   } else {
    //     this.getAddressPo(data)
    //   }
    // }
    
    checkStatus(data){
      if(data == null){
        return 'Pendiente'
      } else {
        return 'Aprobado'
      }
    };
    howManyDaysAfter(date){
      // let dateStr = JSON.parse(date)
      var fecha = new Date(JSON.stringify(date));
     
      let dayCreated = Moment(date).format('D') // = 9
      let todaysDate = Moment(new Date()).format('D')
      var afterCreated = todaysDate - dayCreated
      
      if(afterCreated <= 30 && afterCreated >= 1 ){
        return <Text>Hace {afterCreated} d</Text>
      }else if(afterCreated <= -1) {
        return <Text>Hace 1 mes</Text>
      } else if(afterCreated <= -30){
        return <Text>Hace 2 meses</Text>
      } else if(afterCreated <= -60){
        return <Text>Hace 3 meses</Text>
      } else {
        return <Text>Hace meses</Text>
      }
    };
    
    async getAllPo() {
        const token = await AsyncStorage.getItem('ACCESS_TOKEN')
        const enterpriseUuid = await AsyncStorage.getItem('UUID');
        if (token && enterpriseUuid) { // if user is logged in
            await fetch(`https://stage.ws.yay.do/v2/enterprise/${enterpriseUuid}/purchaseOrder/?filter=2&type=3&page=1&approver=1`, {
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
    getAddressPo(data){
      let arr = [data]
      let provider = arr.map((element)=>{
        return element.proposal.provider.address
      })
      
      // let address = provider.map((element)=>{
      //   return element.address
      // })
      // let city = provider.map((element)=>{
      //   return element.city
      // })
      // let zipCode = provider.map((element)=>{
      //   return element.zip_code
      // })
      return provider 
    };
    pendingPoLength(date){
      let arr = this.state.poDate
      var count = 0
      for(let i = 0; i < arr.length; i++){
         if(Moment(arr[i]).format('D MMM YY') == Moment(date).format('D MMM YY') ){
           count ++
         }
      }
      return count
    };
   
    getPoAndSolicitudesPending() {
      // let both = Array.prototype.push.apply(payments, capital)
      // console.log('fr',this.state.solicitudes[0])
      
      let arr1 = this.state.pendingPo
      arr1.forEach(function (element) {
          element.tipo = "Orden";
      });
      let arr2 = this.state.solicitudes
      arr2.forEach(function (element) {
          element.tipo = "Solicitud";
      });
      Array.prototype.push.apply(arr1, arr2)
      // let both = concat.reduce((acc, val) => acc.concat(val), []);
      let both = arr1
      let sort1 = both.sort(function (a, b) { return new Date(b.created_at) - new Date(a.created_at) });
     
      // let sort2 = sort1.reverse()
      var map = sort1.map((data, key) => {
        function solicitudesAndPoLength(date, tipo, solicitudesDate, poDate){
          if(tipo == 4){
          let arr = solicitudesDate
    
          var count = 0
          for(let i = 0; i < arr.length; i++){
             if(Moment(arr[i]).format('D MMM YY') == Moment(date).format('D MMM YY') ){
               count ++
             }
          }
          return count
        } else {
              let arr = poDate
          var count = 0
          for(let i = 0; i < arr.length; i++){
            if(Moment(arr[i]).format('D MMM YY') == Moment(date).format('D MMM YY') ){
              count ++
            }
          }
          return count
        }
        };
        function getAddressSolicitudes(data, tipo){
          var arr = [data]
          if(tipo == 4){
            let shipping = arr.map((element)=>{
              return element.shipping
            })
            let address = shipping.map((element)=>{
              return element.address
            })
            //  console.log(address)
            // let address = provider.map((element)=>{
            //   return element.address
            // })
            let city = address.map((element)=>{
              return element.city
            })
            let street = address.map((element)=>{
              return element.street
            })
            let mapstate = address.map((element)=>{
              return element.state
            })
            let country = mapstate.map((element)=>{
              return element.country.name
            })
              return country+' ' + city +' '+ street
          } else {
            let provider = arr.map((element)=>{
              return element.proposal.provider.address
            })
           
            // let address = provider.map((element)=>{
            //   return element.address
            // })
            // let city = provider.map((element)=>{
            //   return element.city
            // })
            // let zipCode = provider.map((element)=>{
            //   return element.zip_code
            // })
            return provider 
          }
          
        };
          function ifOrdenType(data, tipo) { 
            function goToInfoOrdenes(data, folio, tipo){
              Actions.infoOrdenes({data: data, folio: folio, tipo:tipo})
            };
            function rejectOrdenes(data, folio, tipo){
              Actions.rechazar({data: data, folio: folio, tipo:tipo})
            };
            async function approveOrdenes(data){
              const token = await AsyncStorage.getItem('ACCESS_TOKEN')
              await fetch(`https://stage.ws.yay.do/me/account/quotation/${data.proposal.uuid}/approve`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "X-Auth-Token": token
                },
                body: JSON.stringify({
                  status:1
                }),
            }).then((response)=>{
                if(response.ok){
                    Actions.profile()
                } else {
                  Alert.alert(`respuesta, ${JSON.stringify(response)}`)
                }
            }).catch((err)=>{
              console.log(err.message)
            })
          };
            if(tipo == 3){
              function ifProgressBarNotANumber(){
                let bar = 0+'.'+ parseFloat(data.budget.available).toFixed(2)*100;
                if( data.budget.available >= 0.1 && data.budget.name !== 'Bloqueado'){
                  
                    return <Progress.Bar
                                style={{marginTop:10}}
                                fillStyle={{}}
                                progress={bar}
                                width={Dimensions.get('window').width - 240}
                                height={6}
                                color={'#4BBC68'}
                                borderWidth={0}
                                unfilledColor={'rgb(211,211,211)'}
                            />
                } else {
                    return <Progress.Bar
                                style={{marginTop:10}}
                                fillStyle={{}}
                                progress={0}
                                width={Dimensions.get('window').width - 240}
                                height={6}
                                color={'#4BBC68'}
                                borderWidth={0}
                                unfilledColor={'rgb(211,211,211)'}
                            />
                }
            } 
              return <View>
                        <View  style={{flexDirection:'row'}}>
                          <TouchableOpacity style={{flexDirection:'row'}}  onPress={() => goToInfoOrdenes(data, data.folio)}>
                            <View style={{flexDirection:'column', width:'40%'}}>
                              <Text style={{ color: 'rgba(0,0,0,0.87)', fontFamily: 'Montserrat-Regular',  fontSize: 14.09, marginLeft:10 , marginTop:10}}>Dirección</Text>
                              <Text style={{ color: 'rgba(0,0,0,0.87)', fontFamily: 'Montserrat-Regular',  fontSize: 14.09, marginLeft:10 , marginTop:10}}>Monto</Text>
                              <Text style={{ color: 'rgba(0,0,0,0.87)', fontFamily: 'Montserrat-Regular',  fontSize: 14.09, marginLeft:10, marginTop:10}}>Presupuesto</Text>
                            </View>
                            <View style={{flexDirection:'column', width:'40%'}}>
                            <Text style={{ color: 'rgba(0,0,0,0.6)', fontFamily: 'Montserrat-Regular',  fontSize: 14.09, marginTop:10}}>{data.proposal.provider.address}</Text>
                              <Text style={{ color: 'rgba(0,0,0,0.6)', fontFamily: 'Montserrat-Regular',  fontSize: 14.09, marginTop:10   }}>{numeral(data.proposal.total).format('$0,0.00')}</Text>
                              <Text style={{ color: 'rgba(0,0,0,0.6)', fontFamily: 'Montserrat-Regular',  fontSize: 14.09, marginTop:10  }}>{data.budget.name}</Text>
                              <Text style={{ color: 'rgba(0,0,0,0.6)', fontFamily: 'Montserrat-Regular',  fontSize: 14.09 }}>de {numeral(data.budget.amount).format('$0,0.00')}</Text>
                              {ifProgressBarNotANumber()}
                            </View>
                            <View style={{flexDirection:'column', width:'20%', justifyContent:'flex-end'}}>
                              <TouchableOpacity  onPress={() => goToInfoOrdenes(data, data.folio)}>
                                <Image
                                    source={{uri : 'https://img.icons8.com/material-rounded/2x/chevron-right.png'}}
                                    style={{ width: 24, height: 24, marginLeft: 'auto',marginRight:5, marginTop:20}}
                                />
                              </TouchableOpacity>
                            </View>
                          </TouchableOpacity>
                        </View>
                     <View style={{flexDirection:'row', justifyContent:'space-around', marginBottom:20, marginTop:20}}>
                      <View style={{width:148, marginLeft:10}}>
                        <TouchableOpacity style={{
                          height:36,
                          backgroundColor:'rgba(98,2,238,0)',
                          borderWidth:1,
                          borderRadius:3,
                          alignItems:'center',
                          justifyContent:'center',
                          borderColor:'rgba(0,0,0,0.6)'
                        }}
                          onPress={() => rejectOrdenes(data, data.folio, tipo)}
                        >
                        <Text style={{color:'rgba(0,0,0,0.6)', fontSize:13.96, fontFamily: 'Montserrat-Medium',}}>RECHAZAR</Text>
                        </TouchableOpacity>

                      </View>
                      <View style={{width:'10%'}}></View>
                      <View style={{width:148, marginRight:10}}>
                        <TouchableOpacity style={{
                          height:36,
                          backgroundColor:'rgba(98,2,238,0)',
                          borderWidth:1,
                          borderRadius:3,
                          alignItems:'center',
                          justifyContent:'center',
                          borderColor:'#4BBC68'
                        }}
                          onPress={() => approveOrdenes(data)}
                        >
                        <Text style={{color:'#4BBC68', fontSize:13.96, fontFamily: 'Montserrat-Medium',}}>APROBAR</Text>
                        </TouchableOpacity>

                      </View>
                    </View>
                   </View>
            } else {
              return false
            } 
          };
          function ifSolicitudType(data, tipo) { 
            function goToInfoSolicitudes(data, folio, tipo){
              Actions.infoSolicitudes({data: data, folio: folio, tipo: tipo})
            };
            async function approveSolicitudes(request_id, data){
              const token = await AsyncStorage.getItem('ACCESS_TOKEN')
              const enterpriseUuid = await AsyncStorage.getItem('UUID');
              await fetch(`https://stage.ws.yay.do/v2/enterprise/${enterpriseUuid}/quotation/request/${request_id}/approve`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    "X-Auth-Token": token
                },
                body: JSON.stringify({
                  status:1
                }),
            }).then((response)=>{
              if(response.ok){
                Actions.profile()
              } else {
                Alert.alert(`respuesta, ${JSON.stringify(response)}`)
              }
            }).catch((err)=>{
              console.log(err.message)
            })
            };
            function rejectSolicitudes(data, request_id, tipo){
              Actions.rechazar({request_id: request_id, data:data, tipo:tipo})
            }
            if(tipo == 4){
              return <View>
                        <View style={{flexDirection:'row', marginTop:10}}>
                          <TouchableOpacity style={{flexDirection:'row'}} onPress={() => goToInfoSolicitudes(data, data.folio)}>
                              <View style={{width:'30%'}}>
                                  <Text style={{ color: 'rgba(0,0,0,0.87)',fontSize:14.9, fontFamily: 'Montserrat-Regular', marginLeft:10 }}>Dirección </Text>
                              </View>
                              <View style={{width:'50%'}}>
                                <Text style={{color:'rgba(0,0,0,0.6)',fontFamily: 'Montserrat-Regular', fontSize: 14.09}}>{getAddressSolicitudes(data, data.type)}</Text>
                              </View>
                              <View style={{width:'20%'}}>
                              <TouchableOpacity  onPress={() => goToInfoSolicitudes(data, data.folio)}>
                                  <Image
                                      source={{uri : 'https://img.icons8.com/material-rounded/2x/chevron-right.png'}}
                                      style={{ width: 24, height: 24, marginLeft: 'auto',marginRight:5}}
                                  />
                                </TouchableOpacity>
                              </View>
                          </TouchableOpacity>  
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-around', marginBottom:20, marginTop:20}}>
                          <View style={{width:148, marginLeft:10}}>
                            <TouchableOpacity style={{
                              height:36,
                              backgroundColor:'rgba(98,2,238,0)',
                              borderWidth:1,
                              borderRadius:3,
                              alignItems:'center',
                              justifyContent:'center',
                              borderColor:'rgba(0,0,0,0.6)'
                            }}
                              onPress={() => rejectSolicitudes(data, data.uuid)}
                            >
                            <Text style={{color:'rgba(0,0,0,0.6)', fontSize:13.96, fontFamily:'Montserrat-Medium'}}>RECHAZAR</Text>
                            </TouchableOpacity>

                          </View>
                          <View style={{width:'10%'}}></View>
                          <View style={{width:148, marginRight:10}}>
                            <TouchableOpacity style={{
                              height:36,
                              backgroundColor:'rgba(98,2,238,0)',
                              borderWidth:1,
                              borderRadius:3,
                              alignItems:'center',
                              justifyContent:'center',
                              borderColor:'#4BBC68'
                            }}
                              onPress={() => approveSolicitudes(data.uuid, data)}
                            >
                            <Text style={{color:'#4BBC68', fontSize:13.96, fontFamily:'Montserrat-Medium'}}>APROBAR</Text>
                            </TouchableOpacity>

                          </View>
                        </View>
                     
                  </View>
            } else {
              return false
            } 
          };
          return <View style={{alignItems:'center', display:'flex'}}>
                    <View style={styles.solicitudesMain}>
                        <View style={{flexDirection:'row'}}>
                           <View style={{ alignItems: 'flex-start',width:'50%' }}><Text style={{fontFamily: 'Montserrat-Medium', color: '#000000', fontSize: 13.96, marginBottom:10, marginLeft:10 }}>{Moment(data.created_at).format('D MMM YY')}</Text></View>
                           <View style={{ alignItems: 'flex-end',width:'50%' }}><Text style={{fontFamily: 'Montserrat-Medium', color: '#000000', fontSize: 12.08, marginBottom:10, marginRight:10 }}>{solicitudesAndPoLength( data.created_at, data.type,this.state.solicitudesDate, this.state.poDate)} por resolver</Text></View>
                        </View>
                        <View style={styles.solicitudes}>
                          <View style={styles.solicitudesDescription3}>
                                <Image
                                    source={{uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZMD1evACIwv083oh-CbaavyrN-0pXUGdKHMM-Ny_oZMh7lQ928Q&s'}}
                                    style={{ width: 52, height: 52, marginLeft: 10,marginRight:10, marginTop:20, borderRadius:24}}
                                />
                              <View style={{color:'#000000', flexDirection:'column', marginTop:20}}>
                                  <Text style={{ color: '#000000', fontFamily: 'Montserrat-Medium', fontSize: 19.94 }}>{data.tipo} {data.folio} </Text>
                                  <Text style={{color:'#000000', fontFamily: 'Montserrat-Regular', fontSize: 14.09}}>{data.account.user.first_name}</Text>
                              </View>
                              <Text style={{ color: '#000000', fontFamily: 'Montserrat-Regular',  fontSize: 12.08, marginLeft:'auto', marginRight:10, marginTop:25 }}>{this.howManyDaysAfter(data.created_at.toString())}</Text>
                          </View>
                          <View style={styles.solicitudesDescription3}> 
                            {ifSolicitudType(data, data.type)}
                            {ifOrdenType(data, data.type)}
                          </View>
                        </View>
                  </View>
              </View>
      });
      if (this.state.solicitudes.length >= 1 || this.state.pendingPo.length >= 1) {
          return map
      } else {
          return false
      }
  };
    render() {
        var drawer = (
            <View style={{ flex: 1, backgroundColor: '#4BBC68' }}>
              <Text style={{ color: '#FFF', marginTop: 30, fontSize: 25, }}></Text>
              <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 40 }}>

              </View>
              <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 50 }}>
                <TouchableOpacity onPress={this.logout}>
                  <Text style={{ color: '#FFF', marginLeft: 20, marginBottom: 10, fontFamily: 'OpenSans-Bold' }}> CERRAR SESIÓN  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        return (
            <Drawer renderNavigationView={() => drawer}
            content={drawer}
            type="overlay"
            tapToClose={true}
            openDrawerOffset={0.4}
            ref={_drawer => (this.drawer = _drawer)}>
                <View
                    style={styles.container}
                    // resizeMode="cover"
                    // source={require('../../../assets/FONDO_16.png')}
                >
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={{marginLeft:'auto', marginRight:20}} onPress={this.openDrawer.bind(this)} >
                        <Image
                            source={{uri : 'https://img.icons8.com/ultraviolet/2x/menu.png'}}
                            style={{ width: 25, height: 25,  padding:20, marginTop:5}}
                        />
                        </TouchableOpacity>
                        {/* <Image
                          style={styles.yayImage}
                          resizeMode={'contain'}
                          source={require('../../../assets/yay.png')}
                        /> */}
                    </View>
                    <ScrollView style={{marginTop:0}}
                        refreshControl={
                            <RefreshControl
                                //refresh control used for the Pull to Refresh
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    >
                      {this.getPoAndSolicitudesPending()}
                      <View style={{marginTop:40}}></View>
                    </ScrollView>
                </View>
            </Drawer>
        )
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    yayImage: {
      width: Dimensions.get('window').width - 240,
      resizeMode: "contain",
      height: 50,
      marginLeft:70
    },
    solicitudesMain:{
      marginLeft: 5,
      marginRight: 5,
      marginTop: 20,
      width:'90%',
      flexDirection:'column',
      backgroundColor:'#F9FAFB',
      alignContent: 'center',
    },
    solicitudes:{
      borderRadius:10,
      shadowColor: "rgba(0,0,0,0.14)",
      shadowOffset: {
      	width: 0,
      	height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 0.27,
      elevation: 3,
      backgroundColor:'#ffffff',
      alignContent: 'center'
    },
    solicitudesDescription3:{
      flexDirection:'row',
      backgroundColor:'#FAFAFA',
      alignContent: 'center',
    },
    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1
    },
})
