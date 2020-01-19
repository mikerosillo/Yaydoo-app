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
    Dimensions,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Loading from 'react-native-whc-loading';
import Drawer from 'react-native-drawer';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import 'moment/locale/es';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import Iconx from 'react-native-vector-icons/Feather';

var numeral = require('numeral');

export default class InfoOrdenes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:props.data,
            folio:props.folio,
            informacion: true,
            productos: false,
            poInfo: [],
            city:'',
            state:'',
            no:'',
            street:'',
            deliveryDate:'',
            deliveryAt:'',
            factura:'',
            proveedor:'',
            payment_terms:'',
            asignado:'',
            disponible:'',
            gastado:'',
            barGraph: null,
            cero:0.,
            currency:'',
            items:[],
            tipo:props.tipo,
        }
        this.getPoInfo()
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
    async approveOrdenes(){
        this.refs.loading4.show()
        const token = await AsyncStorage.getItem('ACCESS_TOKEN')
        await fetch(`https://stage.ws.yay.do/me/account/quotation/${this.state.data.proposal.uuid}/approve`, {
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
    async getPoInfo() {
        const token = await AsyncStorage.getItem('ACCESS_TOKEN')
        const uuid = await AsyncStorage.getItem('UUID');
        if (token && uuid) { // if user is logged in
            await fetch(`https://stage.ws.yay.do/v2/enterprise/${uuid}/purchaseOrder/${this.state.data.code}`, {
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
                            let poInfo = datos

                            var city;
                            var state;
                            var street;
                            var no;
                            var factura;
                            let deliveryAt = poInfo.delivery_at
                            let deliveryDate = poInfo.delivery_date
                            let proveedor = poInfo.proposal.provider.name
                            let payment_terms = poInfo.proposal.payment_terms
                            let asignado = poInfo.budget.name
                            let disponible = poInfo.budget.available
                            let gastado = poInfo.proposal.price
                            let barGraph2 = poInfo.budget.available - poInfo.proposal.price
                            let toFixed = barGraph2.toFixed(2)*100
                            let barGraph = this.state.cero + toFixed
                            let decimalGraph = 0+'.'+barGraph
                            let currency = poInfo.proposal.provider.currency
                            let items = poInfo.quotation_items
                            // console.log('dr',poInfo.account.billing.length)
                            if(poInfo.account.billing.length > 0){
                                city = poInfo.account.billing[0].city
                                state = poInfo.account.billing[0].state
                                street = poInfo.account.billing[0].street
                                no = poInfo.account.billing[0].num_ext
                                factura = poInfo.account.billing[0].name
                            } else {
                                city = 'No address'
                                state = ''
                                street = ''
                                no = ''
                                factura = ''
                            }

                            this.setState({
                                refreshing: false,
                                poInfo: poInfo,
                                city: city,
                                street: street,
                                no: no,
                                state:state,
                                deliveryDate:deliveryDate,
                                deliveryAt:deliveryAt,
                                factura:factura,
                                proveedor: proveedor,
                                payment_terms: payment_terms,
                                asignado:asignado,
                                disponible: disponible,
                                gastado: gastado,
                                barGraph: decimalGraph,
                                currency: currency,
                                items: items,
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
    informacionTitleStyle(){
        if(this.state.informacion == true){
            return {
                color:'#FFF',
                fontSize:13.96,
                fontFamily:'Montserrat-Medium',
                letterSpacing:1.25
            }
        } else {
            return {
                color:'#FFF',
                fontSize:13.96,
                fontFamily:'Montserrat-Medium',
                letterSpacing:1.25
            }
        }
    };
    productosTitleStyle(){
        if(this.state.productos == true){
            return {
                color:'#FFF',
                fontSize:13.96,
                fontFamily:'Montserrat-Medium',
                letterSpacing:1.25
            }
        } else {
            return {
                color:'#FFF',
                fontSize:13.96,
                fontFamily:'Montserrat-Medium',
                letterSpacing:1.25 
            }
        }
    };
    unitType(units, unitId){
           console.log(units)
           if(units > 1 && unitId == 1){
               return <Text>piezas =</Text>
           } else if(units <= 1 && unitId == 1){
               return <Text>Pieza =</Text>
           } else if(units > 1 && unitId == 3){
               return <Text>cajas =</Text>
           } else if(units <= 1 && unitId == 3){
               return <Text>caja =</Text>
           } else {
               return <Text>unit id not identified</Text>
           }
       };
       unitTypeAtBottom(units, unitId){
        //    console.log(unitId)
           if(unitId == 1){
               return <Text>Pieza =</Text>
           } else if( unitId == 3){
               return <Text>Caja =</Text>
           }  else {
               return <Text>unit id not identified</Text>
           }
       }
    whichToRender(){
        var bar = this.state.barGraph
           var items = this.state.items.map((data, key)=>{
               function ifImageNotNull(data){
                   console.log('from image not null id', data.item.unit_id)
                   console.log('from image not null how many', data.units)
                   if(data.item.image !== null){
                       return <Image
                                    source={{uri :`${data.item.image.full}`}}
                                    resizeMode='contain'
                                    style={{ width: 150, height: 150}}
                                />
                   } else {
                       return false
                   }
               }
            return  <View style={styles.solicitudes}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{width:'50%'}}>
                                {ifImageNotNull(data)}
                            </View>
                            <View style={{width:'50%', marginTop:20}}>
                                <Text style={{color:'rgba(0,0,0,0.87)', marginBottom:10, fontSize:13.96, fontWeight:'500', fontFamily:'Montserrat-Medium'}}>{data.item.description}</Text>
                                <Text style={{color:'rgba(0,0,0,0.6)', marginBottom:0, fontSize:12.09, fontFamily:'Montserrat-Regular'}}>{data.units}{' '}{this.unitType(data.units, data.item.unit_id)}{' '}{numeral(data.item.price * data.units).format('$0,0.00')}{' '}{data.item.vendor.vendor.currency}</Text>
                                {/* <Text style={{color:'#808080', marginBottom:20}}></Text> */}
                                <Text style={{color:'rgba(0,0,0,0.6)', fontSize:12.09, fontFamily:'Montserrat-Regular'}}>Entrega{' '}{moment(this.state.deliveryDate).locale('es').format('D MMM YY')}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{color:'rgba(0,0,0,0.87)', marginBottom:20, marginLeft:30, marginTop:20, fontSize:12.08, fontFamily:'Montserrat-Regular'}}>
                            {this.unitTypeAtBottom(data.units, data.item.unit_id)}
                            </Text>
                            <Text style={{color:'rgba(0,0,0,0.6)', marginBottom:20, marginLeft:5, marginTop:20, fontSize:12.09, fontFamily:'Montserrat-Regular'}}>
                              {numeral(data.item.price).format('$0,0.00')}{' '}{data.item.vendor.vendor.currency}
                            </Text>
                        </View>
                    </View>
           })

            if(this.state.productos == true){
                return items
            } else {
                function ifProgressBarNotANumber(){
                    if( bar >= 0.1){
                        return <Progress.Bar
                                    style={{marginLeft:0}}
                                    fillStyle={{}}
                                    progress={bar}
                                    width={Dimensions.get('window').width - 240}
                                    height={6}
                                    color={'#08d06a'}
                                    borderWidth={0}
                                    unfilledColor={'rgb(211,211,211)'}
                                />
                    } else {
                        return <Progress.Bar
                                    style={{marginLeft:0}}
                                    fillStyle={{}}
                                    progress={0}
                                    width={Dimensions.get('window').width - 240}
                                    height={6}
                                    color={'#08d06a'}
                                    borderWidth={0}
                                    unfilledColor={'rgb(211,211,211)'}
                                />
                    }
                }
            return  <View>
                        <View style={{}}>
                            <View style={{width:'100%', flexDirection:'row'}}>
                                <Text style={{minWidth:'45%',maxWidth:'45%', color:'rgba(0,0,0,0.87)', marginLeft:10, marginTop:20, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Medium', fontWeight:'500'}}>Entrega</Text>
                                <Text style={{minWidth:'50%',maxWidth:'50%',color:'rgba(0,0,0,0.6)', marginTop:20, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{this.state.street}{'  '}No.{this.state.no}</Text>
                            </View>
                            <View style={{width:'100%', flexDirection:'row'}}>
                                <Text style={{minWidth:'45%',maxWidth:'45%', color:'rgba(0,0,0,0.87)', marginLeft:10, marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>Dirección</Text>
                                <Text style={{minWidth:'50%',maxWidth:'50%',color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{this.state.city}{'   '}{this.state.state}</Text>
                            </View>
                            <View style={{width:'100%', flexDirection:'row'}}>
                                <Text style={{minWidth:'45%',maxWidth:'45%', color:'rgba(0,0,0,0.87)', marginLeft:10, marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>Fecha requerida</Text>
                                <Text style={{minWidth:'50%',maxWidth:'50%',color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{moment(this.state.deliveryAt).locale('es').format('D MMM YY')}</Text>
                            </View>
                            <View style={{width:'100%', flexDirection:'row'}}>
                                <Text style={{minWidth:'45%',maxWidth:'45%', color:'rgba(0,0,0,0.87)', marginLeft:10, marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>Factura</Text>
                                <Text style={{minWidth:'50%',maxWidth:'50%',color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{this.state.factura}</Text>
                            </View>
                            <View style={{width:'100%', flexDirection:'row'}}>
                                <Text style={{minWidth:'45%',maxWidth:'45%', color:'rgba(0,0,0,0.87)', marginLeft:10, marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>Proveedor</Text>
                                <Text style={{minWidth:'50%',maxWidth:'50%',color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{this.state.proveedor}</Text>
                            </View>
                            <View style={{width:'100%', flexDirection:'row'}}>
                                <Text style={{minWidth:'45%',maxWidth:'45%', color:'rgba(0,0,0,0.87)', marginLeft:10, marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>Terminos de pago</Text>
                                <Text style={{minWidth:'50%',maxWidth:'50%',color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{this.state.payment_terms}{' '}dias</Text>
                            </View>
                            <View style={{width:'100%', flexDirection:'row'}}>
                                <Text style={{minWidth:'45%',maxWidth:'45%', color:'rgba(0,0,0,0.87)', marginLeft:10, marginTop:20, marginBottom:20, fontSize:14.09, fontFamily:'Montserrat-Medium', fontWeight:'500'}}>Presupuesto</Text>
                            </View>
                            <View style={{width:'100%', flexDirection:'row'}}>
                                <Text style={{minWidth:'45%',maxWidth:'45%', color:'rgba(0,0,0,0.87)', marginLeft:10, marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>Asignado</Text>
                                <Text style={{minWidth:'50%',maxWidth:'50%',color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{this.state.asignado}</Text>
                            </View>
                            <View style={{width:'100%', flexDirection:'row'}}>
                                <Text style={{minWidth:'45%',maxWidth:'45%', color:'rgba(0,0,0,0.87)', marginLeft:10, marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>Disponible</Text>
                                <Text style={{minWidth:'50%',maxWidth:'50%',color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{numeral(this.state.disponible).format('$0,0.00')}</Text>
                            </View>
                            <View style={{width:'100%', flexDirection:'row'}}>
                                <Text style={{minWidth:'45%',maxWidth:'45%', color:'rgba(0,0,0,0.87)', marginLeft:10, marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>Gastado</Text>
                                <Text style={{ minWidth:'50%',maxWidth:'50%',color:'rgba(0,0,0,0.6)', marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{numeral(this.state.gastado).format('$0,0.00')}
                                {"\n"}
                               de{' '}{numeral(this.state.disponible).format('$0,0.00')}
                                </Text>
                            </View>
                            <View style={{width:'100%', flexDirection:'row'}}>
                                <View style={{minWidth:'45%',maxWidth:'45%', color:'rgba(0,0,0,0.87)', marginLeft:10, marginTop:0, marginBottom:10, fontSize:14.09, fontFamily:'Montserrat-Regular'}}></View>
                                <View style={{minWidth:'55%',maxWidth:'55%'}}>
                                    {ifProgressBarNotANumber()}
                                </View>
                            </View>
                        </View>
                    </View>

            }

    };
    ifInfoTrue(){
        if(this.state.productos !== true){
            return  <View>
                        <View
                            style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                            marginBottom:20
                            }}
                        />
                        <View style={{justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontFamily:'Montserrat-Regular',color:'rgba(0,0,0,0.87)', fontSize:16.1, flexDirection:'row', justifyContent:'center'}}>
                                Total: <Text style={{color:'rgba(0,0,0,0.87)',fontSize:19.94, fontWeight:'500', fontFamily:'Montserrat-Medium'}}>{numeral(this.state.gastado).format('$0,0.00')}{' '}{this.state.currency}</Text>
                            </Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-around', marginBottom:0, marginTop:20}}>
                            <View style={{width:'50%', marginLeft:0}}>
                                <TouchableOpacity style={{
                                    height:50,
                                    backgroundColor:'#EBF0F2',
                                    borderWidth:1,
                                    borderRadius:0,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    flexDirection:'row',
                                    borderBottomLeftRadius:3,
                                    borderColor:'#EBF0F2'
                                }}
                                onPress={() =>  Actions.rechazar({data: this.state.data, folio: this.state.folio, tipo:this.state.tipo})}
                                >
                                <Text style={{color:'#808080', marginRight:20}}>
                                <Iconx name="x" size={20} color="rgba(0,0,0,0.6)" />
                                </Text>
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
                                    flexDirection:'row',
                                    borderColor:'#4BBC68'
                                }}
                                onPress={() => Alert.alert(
                                    '¿Estás seguro de querer aprobar esta orden?','',
                                    [
                                    { text: "NO",
                                    style: "cancel"
                                    },
                                    { text: 'SI',onPress: () => this.approveOrdenes()},
                                    ],
                                    { cancelable: false },
                                )} 
                                >
                                <Text style={{color:'#808080', marginRight:20}}>
                                    <Icon name="check" size={20} color="#FFFFFF" />
                                </Text>
                                <Text style={{color:'#FFF', fontSize:13.96, fontFamily:'Montserrat-Medium', letterSpacing:0.25}}>APROBAR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
        } else {
            return false
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
                        <View style={{flexDirection:'row', marginTop:20}}>
                            <View style={{width:'50%', flexDirection:'row'}}>
                            <View style={{width:'40%', justifyContent:'center'}}>
                                {/* <Image
                                    source={require('../../../assets/icons8-chevron-left-48.png')}
                                    // source={{uri : 'assets/icons8-chevron-left-48.png'}}
                                    style={{ width: 24, height: 24, marginLeft: 20,color:'#FFF'}}
                                /> */}
                                <Text style={{marginLeft: 15}}>
                                    <Icon name="chevron-left" size={24} color="#FFFFFF" />
                                </Text>
                            </View>
                            <View style={{width:'60%'}}>
                                <Text style={{color:'#FFFFFF', fontSize:19.94, fontFamily:'Montserrat-Medium'}}># {this.state.folio}</Text>
                            </View>
                            </View>
                            <View style={{width:'50%'}}></View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection:'row', marginTop:30, marginBottom:20}}>
                        <View style={{width:'50%', justifyContent:'center', alignItems:'center'}}>
                            <TouchableOpacity  onPress={() => this.setState({informacion: true, productos: false})}>
                                <Text style={this.informacionTitleStyle()}>INFORMACIÓN</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'50%', justifyContent:'center', alignItems:'center'}}>
                            <TouchableOpacity onPress={() => this.setState({informacion: false, productos: true})}>
                                <Text style={this.productosTitleStyle()}>PRODUCTOS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {this.hightLigth()}
                <ScrollView style={{marginTop:0}}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                    {this.whichToRender()}
                    {/* {this.ifInfoTrue()} */}
                    </View>
                </ScrollView>
                {this.ifInfoTrue()}
                
                {/* <View style={{justifyContent:'center', alignItems:'center'}}>
                    {this.ifInfoTrue()}
                </View> */}
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
        shadowRadius: 0.27,
        elevation: 3,
        marginTop:20,
        marginBottom:20,
        backgroundColor:'#ffffff',
        maxWidth:'95%'
      },
})
