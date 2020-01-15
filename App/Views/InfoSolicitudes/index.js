import React, { Component } from 'react';
import {
    StyleSheet,
    Alert,
    AsyncStorage,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import Loading from 'react-native-whc-loading';
import Drawer from 'react-native-drawer';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import 'moment/locale/es';
var numeral = require('numeral');

export default class InfoSolicitudes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:props.data,
            folio:props.folio,
            informacion: true,
            productos: false,
        }
    };

    previewsPage(){
      Actions.profile()
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
    informacionTitleStyle(){
        if(this.state.informacion == true){
            return {
                color:'#F5F5F5',
                fontSize:13.96,
                fontFamily:'montserrat-Medium',
                letterSpacing:1.25
            }
        } else {
            return {
                color:'#F5F5F5',
                fontSize:13.96,
                fontFamily:'montserrat-Medium',
                letterSpacing:1.25
            }
        }
    };
    productosTitleStyle(){
        if(this.state.productos == true){
            return {
                color:'#F5F5F5',
                marginLeft:20,
                fontSize:13.96,
                fontFamily:'montserrat-Medium',
                letterSpacing:1.25
            }
        } else {
            return {
                color:'#F5F5F5',
                marginLeft:20,
                fontSize:13.96,
                fontFamily:'montserrat-Medium',
                letterSpacing:1.25
            }
        }
    };
    async  approveSolicitudes(){
        this.refs.loading4.show()
        const token = await AsyncStorage.getItem('ACCESS_TOKEN')
        const enterpriseUuid = await AsyncStorage.getItem('UUID');
        await fetch(`https://stage.ws.yay.do/v2/enterprise/${enterpriseUuid}/quotation/request/${this.state.data.uuid}/approve`, {
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
        this.refs.loading4.close()
        console.log(err.message)
      })
    };
    rejectSolicitudes(){
        Actions.rechazar({data: this.state.data, folio: this.state.folio, tipo:this.state.data.type})
    };
    whichToRender(){
        let arr = [this.state.data]
        let name = arr.map((el)=>{
            return el.account.user.first_name
        });

        let priority = arr.map((el)=>{
            var res=''
            if(el.priority == '1'){
                 res = 'Muy alta'
            } else if(el.priority == '2'){
                res = 'Alta'
            } else if(el.priority == '3'){
                res = 'Media'
            } else if(el.priority == '4'){
                res = 'Baja'
            } else {
                res = 'Muy baja'
            }
            return res
        });
        let address = arr.map((el)=>{
            return el.shipping.address.entity.name
        })
        var items = this.state.data.quotation_items.map((data, key)=>{
            return     <View style={styles.solicitudes}>

                            <View style={{flexDirection:'row', maxWidth:'95%', borderTopLeftRadius:4}}>
                                <View style={{width:'50%', backgroundColor:'#FFF'}}>
                                    <Image
                                        source={{uri :`${data.item.image.full}`}}
                                        style={{ width: 150, height: 150, marginTop:20, marginLeft:0}}
                                    />
                                </View>
                                <View style={{width:'50%', marginTop:20}}>
                                    <Text style={{fontFamily:'Montserrat-Medium', color:'rgba(0,0,0,0.87)', marginBottom:10, fontSize:13.96, fontWeight:'500'}}>{data.item.description}</Text>
                                    <Text style={{color:'rgba(0,0,0,0.6)', marginBottom:0, fontSize:12.09, fontFamily:'Montserrat-Regular'}}>{data.units}{' '}pieza ={' '}{numeral(data.item.price * data.units).format('$0,0.00')}{' '}{data.item.vendor.vendor.currency}</Text>
                                    {/* <Text style={{color:'#808080', marginBottom:20}}></Text> */}
                                    <Text style={{color:'rgba(0,0,0,0.6)', fontSize:12.09, fontFamily:'Montserrat-Regular'}}>Entrega{' '}{moment(this.state.deliveryDate).locale('es').format('D MMM YY')}</Text>
                                </View>
                            </View>
                            <View style={{maxWidth:'95%', flexDirection:'row'}}>
                                <Text style={{color:'rgba(0,0,0,0.87)', marginBottom:20, marginLeft:30, marginTop:20, fontSize:12.08}}>
                                Pieza
                                </Text>
                                <Text style={{color:'rgba(0,0,0,0.6)', marginBottom:20, marginLeft:5, marginTop:20, fontSize:12.09}}>
                                {numeral(data.item.price).format('$0,0.00')}{' '}{data.item.vendor.vendor.currency}
                                </Text>
                            </View>
                        </View>
           })
        if(this.state.productos == true){
            return items
        } else {
           return   <View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{width:'50%'}}>
                                <Text style={{color:'rgba(0,0,0,0.87)', marginLeft:20, fontSize:13.96, fontFamily:'Montserrat-Medium', marginTop:20, marginBottom:10, fontWeight:'500'}}>Detalle</Text>
                                <Text style={{color:'rgba(0,0,0,0.87)', marginLeft:20, marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>Solicitante</Text>
                                <Text style={{color:'rgba(0,0,0,0.87)', marginLeft:20, marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>Prioridad</Text>
                                <Text style={{color:'rgba(0,0,0,0.87)', marginLeft:20, marginTop:0, marginBottom:10, fontSize:13.96, fontWeight:'500', fontFamily:'Montserrat-Medium',}}>Entrega</Text>
                                <Text style={{color:'rgba(0,0,0,0.87)', fontSize:14.09, fontFamily:'Montserrat-Regular', marginLeft:20, marginTop:0, marginBottom:10}}>Dirección</Text>
                                <Text style={{color:'rgba(0,0,0,0.87)', fontSize:14.09, fontFamily:'Montserrat-Regular', marginLeft:20, marginTop:0, marginBottom:10}}>Fecha requerida</Text>
                            </View>
                            <View style={{width:'50%'}}>
                                <Text style={{color:'#000000', fontSize:15, fontWeight:'bold', marginTop:20, marginBottom:10}}></Text>
                                <Text style={{color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{name}</Text>
                                <Text style={{color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{priority}</Text>
                                <Text style={{color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontWeight:'bold'}}></Text>
                                <Text style={{color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{address}</Text>
                                <Text style={{color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{moment(this.state.data.delivery_date).locale('es').format('D MMM YY')}</Text>
                            </View>
                        </View>
                    </View>

        }
    };
    stylesContainer(){
        if(this.state.informacion == true){
            return {
                flex: 1,
                backgroundColor: "#F9FAFB",
            }
        } else {
            return {
                flex: 1,
                backgroundColor: "#F9FAFB"
            }
        }
    };
    ifInfoTrue(){
        if(this.state.productos !== true){
            return  <View >
                        <View style={{flexDirection:'row',  marginBottom:0, marginTop:0}}>
                            <View style={{width:'50%', marginLeft:0,}}>
                                <TouchableOpacity style={{
                                height:36,
                                backgroundColor:'rgba(98,2,238,0)',
                                borderWidth:1,
                                borderRadius:3,
                                alignItems:'center',
                                justifyContent:'center',
                                borderColor:'rgba(0,0,0,0.6)',
                                flexDirection:'row'
                                }}
                                onPress={() => this.rejectSolicitudes()}
                                >
                                <Text style={{color:'rgba(0,0,0,0.6)', marginRight:20}}>
                                    <Image
                                        style={{width: 15, height: 15}}
                                        source={require('../../../assets/close.png')}
                                    />
                                </Text>
                                <Text style={{color:'rgba(0,0,0,0.6)', letterSpacing:0.25, fontSize:13.96, fontWeight:'500', fontFamily:'Montserrat-Medium'}}>RECHAZAR</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{width:'50%', marginRight:0}}>
                            <TouchableOpacity style={{
                                height:36,
                                backgroundColor:'#08d06a',
                                borderWidth:1,
                                borderRadius:3,
                                alignItems:'center',
                                justifyContent:'center',
                                borderColor:'#08d06a',
                                flexDirection:'row'
                                }}
                                onPress={() => Alert.alert(
                                    'Advertencia:', '¿Estás seguro de querer aprobar esta solicitud?',
                                    [
                                      { text: "NO",
                                      style: "cancel"
                                      },
                                      { text: 'SI',onPress: () => this.approveSolicitudes()},
                                    ],
                                    { cancelable: false },
                                  )}
                                // onPress={() => this.approveSolicitudes()}
                                >
                                <Text style={{ marginRight:20}}>
                                    <Image
                                        style={{width: 15, height: 15}}
                                        source={require('../../../assets/ok.png')}
                                    />
                                </Text>
                                <Text style={{color:'#FFF',fontFamily:'Montserrat-Medium', fontWeight:'500', letterSpacing:0.25, fontSize:13.96}}>APROBAR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
        } else {
            return false
        }
    };
    howManyDaysAfter(){
        if(this.state.productos == true){
            let date = this.state.data.account.created_at


            let dayCreated = moment(date).format('D') // = 9
            let todaysDate = moment(new Date()).format('D')
            var afterCreated = todaysDate - dayCreated

            if(afterCreated <= 30 && afterCreated >= 1 ){
            return <Text>Haces {afterCreated} d</Text>
            }else if(afterCreated <= -1) {
            return <Text>Hace 1 mes</Text>
            } else if(afterCreated <= -30){
            return <Text>Hace 2 meses</Text>
            } else if(afterCreated <= -60){
            return <Text>Hace 3 meses</Text>
            } else {
            return <Text>Hace meses</Text>
            }
        } else {
            return false
        }
      };
      ifProductosTrue(){
          if(this.state.productos == true){
              return <Text>Item - Productos solicitud</Text>
          } else {
              return false
          }
      };
      hightLigth(){
        if(this.state.informacion == true){
            return  <View style={{flexDirection:'row', marginTop:-2.5}}>
                        <View
                            style={{
                            borderBottomColor: '#0071D6',
                            borderBottomWidth: 2,
                            marginBottom:0,
                            width:'50%'
                            }}
                        />
                        <View
                            style={{
                            borderBottomColor: 'transparent',
                            borderBottomWidth: 2,
                            marginBottom:0,
                            width:'50%'
                            }}
                        />
                    </View>
        } else if(this.state.productos == true){
            return  <View style={{flexDirection:'row', marginTop:-2.5}}>
                        <View
                            style={{
                            borderBottomColor: 'transparent',
                            borderBottomWidth: 2,
                            marginBottom:0,
                            width:'50%'
                            }}
                        />
                        <View
                            style={{
                            borderBottomColor: '#0071D6',
                            borderBottomWidth: 2,
                            marginBottom:0,
                            width:'50%'
                            }}
                        />
                    </View>
        }
    };
    render() {
        return (
            <View style={this.stylesContainer()}>
                 <Loading 
                  borderRadius={50}
                  size={40}
                  ref='loading4'
                  backgroundColor={'#FFF'}
                  indicatorColor={'#000000'}/>
                <View style={{backgroundColor:'#00A0F8'}}>
                    <TouchableOpacity  onPress={() => this.previewsPage()}>
                        <View style={{flexDirection:'row', marginTop:30}}>
                            <View style={{width:'50%', flexDirection:'row'}}>
                            <View style={{width:'40%', justifyContent:'center'}}>
                                    <TouchableOpacity  onPress={() => this.previewsPage()}>
                                        <Image
                                            source={require('../../../assets/icons8-chevron-left-48.png')}
                                            // source={{uri : 'assets/icons8-chevron-left-48.png'}}
                                            style={{ width: 15, height: 15, marginLeft: 20,color:'#FFFFFF'}}
                                        />
                                    </TouchableOpacity>
                            </View>
                            <View style={{width:'60%'}}>
                                <Text style={{fontWeight:'500',color:'#FFFFFF', fontSize:19.94, fontFamily:'Montserrat-Medium'}}># {this.state.folio}</Text>
                            </View>
                            </View>
                            <View style={{width:'50%'}}></View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection:'row', marginTop:20, marginBottom:20}}>
                        <View style={{width:'50%', justifyContent:'center', alignItems:'center'}}>
                            <TouchableOpacity  onPress={() => this.setState({informacion: true, productos: false})}>
                                <Text style={this.informacionTitleStyle()}>INFORMACIÓN</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'50%', justifyContent:'center', alignItems:'center'}}>
                            <TouchableOpacity onPress={() => this.setState({productos: true, informacion: false})}>
                                <Text style={this.productosTitleStyle()}>PRODUCTOS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {this.hightLigth()}
                <ScrollView style={{marginTop:0}}>
                    <View style={styles.solicitudesMain}>
                    {this.whichToRender()}
                    
                    <View style={{ alignItems:'center'}}>
                        <Text style={{fontSize:20}}>{this.ifProductosTrue()}</Text>
                        <Text style={{fontSize:20}}>{this.howManyDaysAfter()}</Text>
                    </View>
                    </View>
                </ScrollView>
                {this.ifInfoTrue()}
                {/* <View>
                    <TouchableOpacity style={{backgroundColor:'#00A0F8', height:40, justifyContent:'center'}} onPress={this.logout}>
                        <Text style={{ color: '#FFF', marginLeft: 20, marginBottom: 10, fontFamily: 'Montserrat-Regular' }}> CERRAR SESIÓN  </Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        )
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",

    },
    solicitudesMain: {
        flex:1,
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center'
    },
    solicitudes:{
        borderTopLeftRadius:4,
        borderTopRightRadius:4,
        borderRadius:4,
        shadowColor: "rgba(0,0,0,0.14)",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 0.27,
        elevation: 3,
        marginTop:20,
        marginBottom:20,
        backgroundColor:'#ffffff',
        maxWidth:'98%'
      },
})
