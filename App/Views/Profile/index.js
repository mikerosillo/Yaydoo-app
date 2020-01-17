import React, { Component } from 'react';
import {
    StyleSheet,
    Alert,
    AsyncStorage,
    Text,
    View,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Image,
    Dimensions,
    NativeModules
} from 'react-native';
import * as Progress from 'react-native-progress';
import Drawer from 'react-native-drawer';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import 'moment/locale/es';
import PushController from '../../PushController';
var numeral = require('numeral');
import Loading from 'react-native-whc-loading'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Iconuser from 'react-native-vector-icons/FontAwesome';
import { Header, Title, Body } from 'native-base';


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
          show:false,
          noSolicitudesPending:'',
          noOrdenesPending:'',
      }
      this.getAllSolicitudes()
      this.getAllPo()
    };
   
    onRefresh() {
        this.setState({ solicitudes: [], pendingPo: [], noSolicitudesPending:'', noOrdenesPending:'' })
        this.getAllSolicitudes()
        this.getAllPo()
    };


    openDrawer() {
        this.drawer.open();
    };


    logout() {
        async function removeItemValue() {
          try {
            await AsyncStorage.removeItem('ACCESS_TOKEN');
            Actions.login({
              type: 'reset',
            });
            return true;
          }
          catch(err) {
            console.log(`The error is: ${err}`)
            return false;
          }
        }
      removeItemValue()
    };


    refresh(){
      Actions.profile()
    };


    async getAllSolicitudes() {
      console.log(NativeModules.DeviceInfo)
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
                        if(allSolicitudes.length <= 0){
                          this.setState({noSolicitudesPending:'Todas tus solicitudes han sido aprobadas'})
                        }
                        var createdAt = solicitudes.map((element, key)=>{
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


    howManyDaysAfter(date){
      var fecha = new Date(JSON.stringify(date));
      let dayCreated = moment(date).format('D') // = 9
      let todaysDate = moment(new Date()).format('D')
      var afterCreated = todaysDate - dayCreated
      
      if(afterCreated <= 30 && afterCreated >= 1 ){
        return <Text>Hace {afterCreated} d</Text>
      }else if(afterCreated <= -1) {
        return <Text>Hace 1 mes</Text>
      } else if(afterCreated <= -30){
        return <Text>Hace 2 meses</Text>
      } else if(afterCreated <= -60){
        return <Text>Hace 3 meses</Text>
      } else if(afterCreated == 0) {
        return <Text>Hoy</Text>
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
                          let accountInfo = datos.data
                          var pendingPo = accountInfo.filter((element) => {
                              return element.type == 3
                          })
                          if(pendingPo.length <= 0){
                            this.setState({noOrdenesPending:'Todas tus Ordenes han sido aprobadas'})
                          }
                          var createdAt = pendingPo.map((element, key)=>{
                            return element.created_at
                          })
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
        }
    };


    getAddressPo(data){
      let arr = [data]
      let provider = arr.map((element, key)=>{
        return element.proposal.provider.address
      })
      return provider 
    };


    pendingPoLength(date){
      let arr = this.state.poDate
      var count = 0
      for(let i = 0; i < arr.length; i++){
         if(moment(arr[i]).format('D MMM YY') == moment(date).format('D MMM YY') ){
           count ++
         }
      }
      return count
    };


    async approveOrdenes(data){
      this.refs.loading4.show();
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
            this.refs.loading4.close();
              Actions.profile()
          } else {
            this.refs.loading4.close();
            Alert.alert(`respuesta, ${JSON.stringify(response)}`)
          }
      }).catch((err)=>{
        console.log(err.message)
      })
    };


    rejectOrdenes(data, folio, tipo){
      Actions.rechazar({data: data, folio: folio, tipo:tipo})
    };


    goToInfoOrdenes(data, folio, tipo){
      Actions.infoOrdenes({data: data, folio: folio, tipo:tipo})
    };


    ifProgressBarNotANumber(data){
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
    }; 


    ifOrdenType(data, tipo) { 
      if(tipo == 3){
        return <View>
                  <TouchableOpacity  onPress={() => this.goToInfoOrdenes(data, data.folio)}>
                    <View style={styles.solicitudesDescription3}>
                          <Image
                              source={{uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZMD1evACIwv083oh-CbaavyrN-0pXUGdKHMM-Ny_oZMh7lQ928Q&s'}}
                              style={{ width: 52, height: 52, marginLeft: 10,marginRight:10, marginTop:20, borderRadius:24}}
                          />
                        <View style={{color:'#000000', flexDirection:'column', marginTop:20}}>
                            <Text style={{ color: '#000000', fontFamily: 'Montserrat-Medium', fontSize: 19.94 }}>{data.tipo} {data.folio} </Text>
                            <Text style={{color:'#000000', fontFamily: 'Montserrat-Regular', fontSize: 14.09}}>{data.account.user.first_name}{'    '}{data.account.user.last_name}</Text>
                        </View>
                        <Text style={{ color: '#000000', fontFamily: 'Montserrat-Regular',  fontSize: 12.08, marginLeft:'auto', marginRight:10, marginTop:25 }}></Text>
                    </View>
                    <View  style={{flexDirection:'row'}}>
                      <TouchableOpacity style={{flexDirection:'row'}}  onPress={() => this.goToInfoOrdenes(data, data.folio)}>
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
                          {this.ifProgressBarNotANumber(data)}
                        </View>
                        <View style={{flexDirection:'column', width:'20%', justifyContent:'flex-end'}}>
                          <TouchableOpacity  onPress={() => this.goToInfoOrdenes(data, data.folio)}>
                            <Image
                                source={{uri : 'https://img.icons8.com/material-rounded/2x/chevron-right.png'}}
                                style={{ width: 24, height: 24, marginLeft: 'auto',marginRight:5, marginTop:20}}
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
               <View style={{flexDirection:'row', justifyContent:'space-around', marginBottom:0, marginTop:20}}>
                <View style={{width:'50%', marginLeft:0}}>
                  <TouchableOpacity style={{
                    height:50,
                    backgroundColor:'#EBF0F2',
                    borderWidth:1,
                    borderRadius:3,
                    alignItems:'center',
                    justifyContent:'center',
                    borderBottomLeftRadius:3,
                    borderColor:'#EBF0F2'
                  }}
                    onPress={() => this.rejectOrdenes(data, data.folio, tipo)}
                  >
                  <Text style={{color:'rgba(0,0,0,0.6)', letterSpacing:0.25, fontSize:13.96, fontFamily: 'Montserrat-Medium',}}>RECHAZAR</Text>
                  </TouchableOpacity>
                </View>
                <View style={{width:'50%', marginRight:0}}>
                  <TouchableOpacity style={{
                    height:50,
                    backgroundColor:'#4BBC68',
                    borderWidth:1,
                    borderRadius:0,
                    alignItems:'center',
                    borderBottomRightRadius:3,
                    justifyContent:'center',
                    borderColor:'#4BBC68'
                  }}
                    onPress={() => Alert.alert(
                      'Advertencia:', '¿Estás seguro de querer aprobar esta orden de compra?',
                      [
                        { text: "NO",
                        style: "cancel"
                        },
                        { text: 'SI',onPress: () => this.approveOrdenes(data)},
                      ],
                      { cancelable: false },
                    )}  
                  >
                  <Text style={{color:'#FFFFFF', letterSpacing:0.25, fontSize:13.96, fontFamily: 'Montserrat-Medium',}}>APROBAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
             </View>
      } else {
        return false
      } 
    };


    async approveSolicitudes(request_id, data){
      this.refs.loading4.show()
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
          this.refs.loading4.close()
          Actions.profile()
        } else {
          this.refs.loading4.close()
          Alert.alert(`respuesta, ${JSON.stringify(response)}`)
        }
      }).catch((err)=>{
        console.log(err.message)
      })
    };


    ifSolicitudType(data, tipo) { 
      function goToInfoSolicitudes(data, folio, tipo){
        Actions.infoSolicitudes({data: data, folio: folio, tipo: tipo})
      };
      function getAddressSolicitudes(data, tipo){
        var arr = [data]
        if(tipo == 4){
          let shipping = arr.map((element, key)=>{
            return element.shipping
          })
          let address = shipping.map((element, key)=>{
            return element.address
          })
          let city = address.map((element, key)=>{
            return element.city
          })
          let street = address.map((element, key)=>{
            return element.street
          })
          let mapstate = address.map((element, key)=>{
            return element.state
          })
          let country = mapstate.map((element, key)=>{
            return element.country.name
          })
            return country+' ' + city +' '+ street
        } else {
          let provider = arr.map((element, key)=>{
            return element.proposal.provider.address
          })
          return provider 
        }
        
      };
      function rejectSolicitudes(data, request_id, tipo){
        Actions.rechazar({request_id: request_id, data:data, tipo:tipo})
      }
      if(tipo == 4){
        return  <View>
                  <TouchableOpacity  onPress={() => goToInfoSolicitudes(data, data.folio)}>
                    <View style={styles.solicitudesDescription3}>
                          <Image
                              source={{uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZMD1evACIwv083oh-CbaavyrN-0pXUGdKHMM-Ny_oZMh7lQ928Q&s'}}
                              style={{ width: 52, height: 52, marginLeft: 10,marginRight:10, marginTop:20, borderRadius:24}}
                          />
                        <View style={{color:'#000000', flexDirection:'column', marginTop:20}}>
                            <Text style={{ color: '#000000', fontFamily: 'Montserrat-Medium', fontSize: 19.94 }}>{data.tipo} {data.folio} </Text>
                            <Text style={{color:'#000000', fontFamily: 'Montserrat-Regular', fontSize: 14.09}}>{data.account.user.first_name}{'   '}{data.account.user.last_name}</Text>
                        </View>
                        <Text style={{ color: '#000000', fontFamily: 'Montserrat-Regular',  fontSize: 12.08, marginLeft:'auto', marginRight:10, marginTop:25 }}></Text>
                    </View>
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
                  </TouchableOpacity>
                  <View style={{flexDirection:'row', justifyContent:'space-around', marginBottom:0, marginTop:20}}>
                    <View style={{width:'50%', marginLeft:0}}>
                      <TouchableOpacity style={{
                        height:50,
                        backgroundColor:'#EBF0F2',
                        borderWidth:1,
                        borderRadius:0,
                        alignItems:'center',
                        justifyContent:'center',
                        borderBottomLeftRadius:3,
                        borderColor:'#EBF0F2'
                      }}
                        onPress={() => rejectSolicitudes(data, data.uuid)}
                      >
                      <Text style={{color:'rgba(0,0,0,0.6)', letterSpacing:0.25, fontSize:13.96, fontFamily:'Montserrat-Medium'}}>RECHAZAR</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{width:'50%', marginRight:0}}>
                      <TouchableOpacity style={{
                        height:50,
                        backgroundColor:'#4BBC68',
                        borderWidth:1,
                        borderRadius:0,
                        borderBottomRightRadius:3,
                        alignItems:'center',
                        justifyContent:'center',
                        borderColor:'#4BBC68'
                      }}
                      onPress={() => Alert.alert(
                        'Advertencia:', '¿Estás seguro de querer aprobar esta solicitud?',
                        [
                          { text: "NO",
                          style: "cancel"
                          },
                          { text: 'SI',onPress: () => this.approveSolicitudes(data.uuid, data)},
                        ],
                        { cancelable: false },
                      )} 
                      >
                      <Text style={{color:'#FFF', fontSize:13.96, fontFamily:'Montserrat-Medium', letterSpacing:0.25}}>APROBAR</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
      } else {
        return false
      } 
    };


    getPoAndSolicitudesPending() {
      let arr1 = this.state.pendingPo
      arr1.forEach(function (element) {
          element.tipo = "Orden";
      });
      let arr2 = this.state.solicitudes
      arr2.forEach(function (element) {
          element.tipo = "Solicitud";
      });
      Array.prototype.push.apply(arr1, arr2)
      let both = arr1
      let sort1 = both.sort(function (a, b) { return new Date(b.created_at) - new Date(a.created_at) });
      var map = sort1.map((data, key) => {
        
        function solicitudesLength(date, tipo, solicitudesDate, poDate, key){
              if(tipo == 4 && key == poDate.length ){
              let arr = solicitudesDate
              var count = 0
              for(let i = 0; i < arr.length; i++){
                if(moment(arr[i]).format('D MMM YY') == moment(date).format('D MMM YY') ){
                  count ++
                }
              } return  <View key={key} style={{flexDirection:'row'}}>
                            <View style={{ alignItems: 'flex-start',width:'50%' }}><Text style={{fontFamily: 'Montserrat-Medium', color: '#000000', fontSize: 13.96, marginBottom:10, marginLeft:10 }}>{moment(data.created_at).locale('es').format('D MMM YY')}</Text></View>
                            <View style={{ alignItems: 'flex-end',width:'50%' }}><Text style={{fontFamily: 'Montserrat-Medium', color: '#000000', fontSize: 12.08, marginBottom:10, marginRight:10 }}>Pendientes {count}</Text></View>
                        </View>    
            }  else {
              return false
            }
        };
        function poLength(date, tipo, solicitudesDate, poDate, key){
          
             if(tipo == 3 && key == 0) {
                  let arr = poDate
              var count = 0
              for(let i = 0; i < arr.length; i++){
                if(moment(arr[i]).format('D MMM YY') == moment(date).format('D MMM YY') ){
                  count ++
                }
              }
              return  <View key={key} style={{flexDirection:'row'}}>
                          <View style={{ alignItems: 'flex-start',width:'50%' }}><Text style={{fontFamily: 'Montserrat-Medium', color: '#000000', fontSize: 13.96, marginBottom:10, marginLeft:10 }}>{moment(data.created_at).locale('es').format('D MMM YY')}</Text></View>
                          <View style={{ alignItems: 'flex-end',width:'50%' }}><Text style={{fontFamily: 'Montserrat-Medium', color: '#000000', fontSize: 12.08, marginBottom:10, marginRight:10 }}>Pendientes {count}</Text></View>
                      </View>
            } else {
              return false
            }
          
        };
        
          return <View style={{alignItems:'center', display:'flex'}}>
                    <View style={styles.solicitudesMain}>
                        {/* <View style={{flexDirection:'row'}}>
                           <View style={{ alignItems: 'flex-start',width:'50%' }}><Text style={{fontFamily: 'Montserrat-Medium', color: '#000000', fontSize: 13.96, marginBottom:10, marginLeft:10 }}>{Moment(data.created_at).locale('es',momentES ).format('D MMM YY')}</Text></View>
                           <View style={{ alignItems: 'flex-end',width:'50%' }}><Text style={{fontFamily: 'Montserrat-Medium', color: '#000000', fontSize: 12.08, marginBottom:10, marginRight:10 }}>{solicitudesAndPoLength( data.created_at, data.type,this.state.solicitudesDate, this.state.poDate)} por resolver</Text></View>
                        </View> */}
                        {poLength( data.created_at, data.type,this.state.solicitudesDate, this.state.poDate, key)}
                        {solicitudesLength( data.created_at, data.type,this.state.solicitudesDate, this.state.poDate, key)}
                        <View style={styles.solicitudes}>
                          <View style={styles.solicitudesDescription3}> 
                            {this.ifSolicitudType(data, data.type, key)}
                            {this.ifOrdenType(data, data.type, key)}
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
    ifNoSolicitudesPending(){
      if(this.state.noSolicitudesPending.length >= 1 && this.state.noOrdenesPending.length >= 1){
        return  <ScrollView
          refreshControl={
          <RefreshControl
          progressBackgroundColor='#FFFFFF'
          tintColor='#00A0F8'
          colors={['#00A0F8']}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh.bind(this)}
          />
        } 
        style={{flex:1,}}>
          <Text style={{ textAlign: 'center', color:'#000000', fontSize:20, marginTop:20}}>¡Todas tus solicitudes han sido aprobadas!</Text>
        </ScrollView>
      } else {
        return <ScrollView style={{marginTop:0}}
          refreshControl={
          <RefreshControl
          progressBackgroundColor='#FFFFFF'
          tintColor='#00A0F8'
          colors={['#00A0F8']}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh.bind(this)}
          />
          }
        >
          {this.getPoAndSolicitudesPending()}
          <View style={{marginTop:40}}></View>
        </ScrollView>
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
                >
                  <Header style={{backgroundColor:'#00A0F8'}}>
                    <Body style={{flexDirection:'row', justifyContent:'space-between'}}>
                      <Title style={{fontSize:19.94, letterSpacing:0.25, marginLeft:16}}>Aprobaciones</Title>
                      <Title style={{marginRight:13, fontSize:13.96, letterSpacing:0.25, marginTop:5}}></Title>
                    </Body>
                  </Header>
                  <Loading 
                  borderRadius={50}
                  size={40}
                  ref='loading4'
                  backgroundColor={'transparent'}
                  indicatorColor={'#00A0F8'}/>
                    {/* <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={{marginLeft:'auto', marginRight:20}} onPress={this.openDrawer.bind(this)} >
                        <Image
                            source={{uri : 'https://img.icons8.com/ultraviolet/2x/menu.png'}}
                            style={{ width: 25, height: 25,  padding:20, marginTop:5}}
                        />
                        </TouchableOpacity>
                    </View> */}
                    {this.ifNoSolicitudesPending()}
                    <View style={{flexDirection:'row', backgroundColor:'#FFFFFF'}}>
                      <View style={{width:'33%'}}>
                      <TouchableOpacity style={{justifyContent:'center', alignItems:'center', alignContent:'center', height:56}}
                        onPress={() => Alert.alert(
                          '¿Estás seguro de que deseas cerrar sesión?', '',
                          [
                            { text: "NO",
                            style: "cancel"
                            },
                            { text: 'SI',onPress: () => this.logout()},
                          ],
                          { cancelable: false },
                        )}
                       >
                        <Icon name="logout" size={20} color="#848F9D" />
                      </TouchableOpacity>
                      </View>
                      <View style={{width:'33%'}}>
                      <TouchableOpacity style={{justifyContent:'center', alignItems:'center', alignContent:'center', height:56}}
                       >
                       
                        <Icon name="format-float-left" size={20} color="#848F9D" />
                        
                      </TouchableOpacity>
                      </View>
                      <View style={{width:'33%'}}>
                        <TouchableOpacity style={{justifyContent:'center', alignItems:'center', alignContent:'center', height:56}}
                         >
                          <Iconuser name="user" size={20} color="#848F9D" />
                        </TouchableOpacity>
                      </View>
                    </View>
                </View>
                <PushController />
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
