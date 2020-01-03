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

export default class InfoSolicitudes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:[],
            folio:'',
            informacion: true,
            productos: false,
        }
    };

    previewsPage(){
      Actions.profile()
    };
    UNSAFE_componentWillMount(){
        this.state.data = this.props.data
        this.state.folio = this.props.folio
        console.log(this.state.data.uuid)
    }
    informacionTitleStyle(){
        if(this.state.informacion == true){
            return {
                textDecorationLine: 'underline',
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
    productosTitleStyle(){
        if(this.state.productos == true){
            return {
                textDecorationLine: 'underline',
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
          Actions.profile()
        } else {
          Alert.alert(`respuesta, ${JSON.stringify(response)}`)
        }
      }).catch((err)=>{
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
                                    <Text style={{color:'rgba(0,0,0,0.6)', fontSize:12.09, fontFamily:'Montserrat-Regular'}}>Entrega{' '}{Moment(this.state.deliveryDate).format('D MMM YY')}</Text>
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
                                <Text style={{color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{Moment(this.state.data.delivery_date).format('D MMM YY')}</Text>
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
            return  <View style={{flex:1, marginTop:200}}>
                        <View
                            style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 0.5,
                            marginBottom:20,
                            flex:1
                            }}
                        />
                        <View style={{flex:1,flexDirection:'row', justifyContent:'space-around', marginBottom:0, marginTop:20}}>
                            <View style={{width:148, marginLeft:20,}}>
                                <TouchableOpacity style={{
                                height:36,
                                backgroundColor:'rgba(98,2,238,0)',
                                borderWidth:1,
                                borderRadius:3,
                                alignItems:'center',
                                justifyContent:'space-around',
                                borderColor:'rgba(0,0,0,0.6)',
                                flexDirection:'row'
                                }}
                                onPress={() => this.rejectSolicitudes()}
                                >
                                <Text style={{color:'rgba(0,0,0,0.6)'}}>
                                    <Image
                                        style={{width: 15, height: 15,marginRight:5}}
                                        source={require('../../../assets/PNGIX.com_close-icon-png_904874.png')}
                                    />
                                </Text>
                                <Text style={{color:'rgba(0,0,0,0.6)', fontSize:13.96, fontFamily:'Montserrat-Medium'}}>RECHAZAR</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{width:'10%'}}></View>
                            <View style={{width:148, marginRight:20}}>
                            <TouchableOpacity style={{
                                height:36,
                                backgroundColor:'transparent',
                                borderWidth:1,
                                borderRadius:3,
                                alignItems:'center',
                                justifyContent:'space-around',
                                borderColor:'#08d06a',
                                flexDirection:'row'
                                }}
                                onPress={() => this.approveSolicitudes()}
                                >
                                <Text style={{color:'#808080'}}>
                                    <Image
                                        style={{width: 15, height: 15,marginRight:5}}
                                        source={require('../../../assets/pngfuel.com.png')}
                                    />
                                </Text>
                                <Text style={{color:'#08d06a'}}>APROBAR</Text>
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


            let dayCreated = Moment(date).format('D') // = 9
            let todaysDate = Moment(new Date()).format('D')
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
      }
    render() {
        return (
            <View style={this.stylesContainer()}>
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
                        <View style={{width:'50%'}}>
                            <TouchableOpacity  onPress={() => this.setState({informacion: true, productos: false})}>
                                <Text style={this.informacionTitleStyle()}>INFORMACION</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'50%'}}>



                            <TouchableOpacity onPress={() => this.setState({productos: true, informacion: false})}>
                                <Text style={this.productosTitleStyle()}>PRODUCTOS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollView style={{marginTop:0}}>
                    <View style={styles.solicitudesMain}>
                    {this.whichToRender()}
                    {this.ifInfoTrue()}
                    <View style={{ alignItems:'center'}}>
                        <Text style={{fontSize:20}}>{this.ifProductosTrue()}</Text>
                        <Text style={{fontSize:20}}>{this.howManyDaysAfter()}</Text>
                    </View>
                    </View>
                </ScrollView>
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
