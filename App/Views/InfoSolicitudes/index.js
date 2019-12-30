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
        console.log(this.state.data.account.uuid)
    }
    informacionTitleStyle(){
        if(this.state.informacion == true){
            return {
                textDecorationLine: 'underline',
                color:'#FFF',
                marginLeft:20,
                fontSize:18
            }
        } else {
            return {
                color:'#FFF',
                marginLeft:20,
                fontSize:18
            }
        }
    };
    productosTitleStyle(){
        if(this.state.productos == true){
            return {
                textDecorationLine: 'underline',
                color:'#FFF',
                marginLeft:20,
                fontSize:18
            }
        } else {
            return {
                color:'#FFF',
                marginLeft:20,
                fontSize:18
            }
        }
    };
    async  approveSolicitudes(){
        const token = await AsyncStorage.getItem('ACCESS_TOKEN')
        const enterpriseUuid = await AsyncStorage.getItem('UUID');
        await fetch(`https://stage.ws.yay.do/enterprise/${enterpriseUuid}/quotation/request/${this.state.data.uuid}/approve`, {
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
                                    <Text style={{color:'#000000', marginBottom:40, fontSize:16, fontWeight:'bold'}}>{data.item.description}</Text>
                                    <Text style={{color:'#808080', marginBottom:20, fontSize:16}}>{data.units}{' '}piezas ={' '}{numeral(data.item.price * data.units).format('$0,0.00')}{' '}{data.item.vendor.vendor.currency}</Text>
                                    <Text style={{color:'#808080', marginBottom:20}}></Text>
                                    <Text style={{color:'#808080', fontSize:16}}>Entrega{' '}{Moment(this.state.deliveryDate).format('D MMM YY')}</Text>
                                </View>
                            </View>
                            <View style={{maxWidth:'95%'}}>
                                <Text style={{color:'#808080', marginBottom:20, marginLeft:30, marginTop:20, fontSize:16}}>
                                Pieza{' '}{numeral(data.item.price).format('$0,0.00')}{' '}{data.item.vendor.vendor.currency}
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
                                <Text style={{color:'#000000', marginLeft:20, fontSize:15, fontWeight:'bold', marginTop:20, marginBottom:20}}>Detalle</Text>
                                <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Solicitante</Text>
                                <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Prioridad</Text>
                                <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20, fontWeight:'bold'}}>Entrega</Text>
                                <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Dirección</Text>
                                <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Fecha requerida</Text>
                            </View>
                            <View style={{width:'50%'}}>
                                <Text style={{color:'#000000', fontSize:15, fontWeight:'bold', marginTop:20, marginBottom:20}}></Text>
                                <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>{name}</Text>
                                <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>{priority}</Text>
                                <Text style={{color:'#000000', marginTop:20, marginBottom:20, fontWeight:'bold'}}></Text>
                                <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>{address}</Text>
                                <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>{Moment(this.state.data.delivery_date).format('D MMM YY')}</Text>
                            </View>
                        </View>
                    </View>

        }
    };
    stylesContainer(){
        if(this.state.informacion == true){
            return {
                flex: 1,
                backgroundColor: "#FFF",
            }
        } else {
            return {
                flex: 1,
                backgroundColor: "rgb(211,211,211)"
            }
        }
    };
    ifInfoTrue(){
        if(this.state.productos !== true){
            return  <View style={{marginTop:80}}>
                        <View
                            style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                            marginBottom:20
                            }}
                        />
                        <View style={{flexDirection:'row', justifyContent:'space-around', marginBottom:20, marginTop:20}}>
                            <View style={{width:'40%', marginLeft:20}}>
                                <TouchableOpacity style={{
                                height:30,
                                backgroundColor:'transparent',
                                borderWidth:1,
                                borderRadius:3,
                                alignItems:'center',
                                justifyContent:'space-around',
                                borderColor:'#808080',
                                flexDirection:'row'
                                }}
                                onPress={() => this.rejectSolicitudes()}
                                >
                                <Text style={{color:'#808080'}}>
                                    <Image
                                        style={{width: 15, height: 15,marginRight:5}}
                                        source={require('../../../assets/PNGIX.com_close-icon-png_904874.png')}
                                    />
                                </Text>
                                <Text style={{color:'#808080'}}>RECHAZAR</Text>
                                </TouchableOpacity>

                            </View>
                            <View style={{width:'20%'}}></View>
                            <View style={{width:'40%', marginRight:20}}>
                            <TouchableOpacity style={{
                                height:30,
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
                <View style={{backgroundColor:'#4180fd'}}>
                    <TouchableOpacity  onPress={() => this.previewsPage()}>
                        <View style={{flexDirection:'row', marginTop:30}}>
                            <View style={{width:'50%', flexDirection:'row'}}>
                            <View style={{width:'40%', justifyContent:'center'}}>
                                    <TouchableOpacity  onPress={() => this.previewsPage()}>
                                        <Image
                                            source={require('../../../assets/icons8-chevron-left-48.png')}
                                            // source={{uri : 'assets/icons8-chevron-left-48.png'}}
                                            style={{ width: 15, height: 15, marginLeft: 20,color:'#FFF'}}
                                        />
                                    </TouchableOpacity>
                            </View>
                            <View style={{width:'60%'}}>
                                <Text style={{color:'#FFF', fontSize:20}}># {this.state.folio}</Text>
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
        backgroundColor: "rgb(211,211,211)",

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
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
        marginTop:20,
        marginBottom:20,
        backgroundColor:'#ffffff',
        maxWidth:'98%'
      },
})
