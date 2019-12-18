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

export default class InfoOrdenes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:[],
            folio:'',
            informacion: true,
            productos: false,
            poInfo: [],
            city:'',
            state:'',
            no:'',
            street:'',
            deliveryDate:'',
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
        }
        this.getPoInfo()
    };
    
    previewsPage(){
      Actions.profile()
    };
    productosPage(){
        Actions.products({data: this.state.data, folio: this.state.folio})
      };
    UNSAFE_componentWillMount(){
        this.state.data = this.props.data
        this.state.folio = this.props.folio
        this.getPoInfo()
    }
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
                            let city = poInfo.account.billing[0].city
                            let state = poInfo.account.billing[0].state 
                            let street = poInfo.account.billing[0].street
                            let no = poInfo.account.billing[0].num_ext
                            let deliveryDate = poInfo.delivery_date
                            let factura = poInfo.account.billing[0].name
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
                           console.log(items[0].item.price)
                           console.log(items[0])

                            this.setState({
                                refreshing: false,
                                poInfo: poInfo,
                                city: city,
                                street: street,
                                no: no,
                                state:state,
                                deliveryDate:deliveryDate,
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
    whichToRender(){
           var items = this.state.items.map((data, key)=>{
            return  <View style={styles.solicitudes}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{width:'50%'}}>
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
                        <View style={{}}>
                            <Text style={{color:'#808080', marginBottom:20, marginLeft:30, marginTop:20, fontSize:16}}>
                               Pieza{' '}{numeral(data.item.price).format('$0,0.00')}{' '}{data.item.vendor.vendor.currency}
                            </Text>
                        </View>
                    </View>
           })
            
            if(this.state.productos == true){
                return items
            } else {      
            return  <View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{width:'40%'}}>
                                    <Text style={{color:'#000000', marginLeft:20, fontSize:15, fontWeight:'bold', marginTop:20, marginBottom:20}}>Entrega</Text>
                                    <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Dirección</Text>
                                    <Text style={{color:'#000000', marginLeft:20, marginTop:0, marginBottom:0}}></Text>
                                    <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Fecha requerida</Text>
                                    <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Factura</Text>
                                    <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Fecha requerida</Text>
                                    <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Proveedor</Text>
                                    <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Terminos de pago</Text>
                                    <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20, fontWeight:'bold'}}>Presupuesto</Text>
                                    <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Asignado</Text>
                                    <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Disponible</Text>
                                    <Text style={{color:'#000000', marginLeft:20, marginTop:20, marginBottom:20}}>Gastado</Text>
                                </View>
                                <View style={{width:'60%'}}>
                                    <Text style={{color:'#000000', fontSize:15, fontWeight:'bold', marginTop:20, marginBottom:20}}></Text>
                                    <Text style={{color:'#000000', fontSize:15, marginTop:0, marginBottom:0}}>{this.state.street}{'  '}No.{this.state.no}</Text>
                                    <Text style={{color:'#000000', fontSize:15, marginTop:0, marginBottom:20}}>{this.state.city}{'   '}{this.state.state}</Text>
                                    <Text style={{marginLeft:20,color:'#000000', marginTop:38, marginBottom:20}}>{Moment(this.state.deliveryDate).format('D MMM YY')}</Text>
                                    <Text style={{marginLeft:20,color:'#000000', marginTop:20, marginBottom:20}}>{this.state.factura}</Text>
                                    <Text style={{marginLeft:20,color:'#000000', marginTop:20, marginBottom:20}}>{Moment(this.state.deliveryDate).format('D MMM YY')}</Text>
                                    <Text style={{marginLeft:20,color:'#000000', marginTop:20, marginBottom:20}}>{this.state.proveedor}</Text>
                                    <Text style={{marginLeft:20,color:'#000000', marginTop:20, marginBottom:20}}>{this.state.payment_terms}</Text>

                                    <Text style={{color:'#000000', marginTop:20, marginBottom:20, fontWeight:'bold'}}></Text>
                                    <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>{this.state.asignado}</Text>
                                    <Text style={{color:'#000000', marginTop:20, marginBottom:20}}>{numeral(this.state.disponible).format('$0,0.00')}</Text>
                                    <Text style={{color:'#000000', marginTop:20, marginBottom:0}}>{numeral(this.state.gastado).format('$0,0.00')}</Text>
                                    <Text style={{color:'#000000', marginTop:0, marginBottom:0}}>de{' '}{numeral(this.state.disponible).format('$0,0.00')}</Text>
                                    <Progress.Bar
                                        fillStyle={{}}
                                        progress={this.state.barGraph}
                                        width={Dimensions.get('window').width - 240}
                                        height={6}
                                        color={'#08d06a'}
                                        borderWidth={0}
                                        unfilledColor={'rgb(211,211,211)'}
                                    />
                                    <Text style={{color:'#000000', marginTop:20, marginBottom:0}}></Text>
                                </View>     
                            </View>
                            <View
                                style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: 1,
                                marginBottom:20
                                }}
                            />
                    </View> 
                    
            }
        
    };
    ifInfoTrue(){
        if(this.state.productos !== true){
            return  <View>
                        <View style={{justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'#000000', fontSize:20, flexDirection:'row', justifyContent:'center'}}>
                                Total: <Text style={{fontSize:25, fontWeight:'bold'}}>{numeral(this.state.gastado).format('$0,0.00')}{' '}{this.state.currency}</Text>
                            </Text>
                        </View>
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
                                onPress={() => Alert.alert('Simple Button pressed')}
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
                                onPress={() => Alert.alert('Simple Button pressed')}
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
    render() {
        return (
            <View style={this.stylesContainer()}>
                <View style={{backgroundColor:'#4180fd'}}>
                    <TouchableOpacity  onPress={() => this.previewsPage()}>
                        <View style={{flexDirection:'row', marginTop:20}}>
                            <View style={{width:'50%', flexDirection:'row'}}>
                            <View style={{width:'40%', justifyContent:'center'}}>
                                <Image
                                    source={require('../../../assets/icons8-chevron-left-48.png')}
                                    // source={{uri : 'assets/icons8-chevron-left-48.png'}}
                                    style={{ width: 15, height: 15, marginLeft: 20,color:'#FFF'}}
                                />
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
                            <TouchableOpacity onPress={() => this.setState({informacion: false, productos: true})}> 
                                <Text style={this.productosTitleStyle()}>PRODUCTOS</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ScrollView style={{marginTop:0}}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                    {this.whichToRender()}
                    {this.ifInfoTrue()}
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
        maxWidth:'95%'
      },
})
