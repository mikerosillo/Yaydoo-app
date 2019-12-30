import React, {Component} from "react";
import PushNotification from "react-native-push-notification";
import { AsyncStorage,View, Text, TouchableOpacity, Image, Alert, ScrollView} from 'react-native';
import { Actions } from "react-native-router-flux";
import { TextField } from 'react-native-materialui-textfield';

// var PushNotification = require("react-native-push-notification");
export default class Rechazar extends Component{
    constructor(props) {
        super(props)
        this.state = {
            request_id:'',
            data:[],
            selected1:false,
            selected2:false,
            selected3:false,
            notas:'',
            tipo:null,
        }
    };
    UNSAFE_componentWillMount(){
        this.state.request_id = this.props.request_id
        this.state.data = this.props.data
        this.state.tipo = this.props.tipo
    }
    reject(){
        if(this.state.data.type == '3'){
            this.rejectOrdenes()
        } else {
            this.ifNotasNotNull()
        }
    };
    ifNotasNotNull(){
        if(this.state.notas !== ''){
            this.rejectSolicitudes()
        } else {
            Alert.alert('Favor de seleccionar motivo de rechazo')
        }
    }
    async rejectOrdenes(){
        const token = await AsyncStorage.getItem('ACCESS_TOKEN')
        const enterpriseUuid = await AsyncStorage.getItem('UUID');
        await fetch(`https://stage.ws.yay.do/me/account/quotation/${this.state.data.proposal.uuid}/approve`, {
          method: 'PUT',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              "X-Auth-Token": token
          },
          body: JSON.stringify({
            status : 0
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
    async rejectSolicitudes(){
        console.log('solicitudes', this.state.data.uuid)
        console.log('solicitudes2', this.state.request_id)
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
            status:0,
            comment : this.state.notas
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
    styleSelected1(){
        if(this.state.selected1 == true){
        return {
            borderColor:' #c2dcff',
            color:'#bcd0f7',
            backgroundColor:'#e1ebfc',
            height:40, 
            borderWidth:2,
            width:'80%',
            textAlign:'center',
            alignItems:'center',
            justifyContent:'center',
           
        } 
        } else {
        return {
            
            color:'#000000',
            backgroundColor:'#FFF',
            height:40, 
            borderWidth:2,
            width:'80%',
            textAlign:'center',
            alignItems:'center',
            justifyContent:'center',
            borderColor:'rgb(211,211,211)'
        }   
        }
    };
    styleSelected1Text1(){
        if(this.state.selected1 == true){
            return {
                color:'#a8c0f4',
                fontSize:15
            }
        } else {
            return {
                color:'#000000',
                fontSize:15
            }
        }
    };
    styleSelected2(){
        if(this.state.selected2 == true){
        return {
            color:'#bcd0f7',
            backgroundColor:'#e1ebfc',
            height:40, 
            borderWidth:2,
            width:'80%',
            textAlign:'center',
            alignItems:'center',
            justifyContent:'center',
            borderColor:' #c2dcff'
        } 
        } else {
        return {
            color:'#000000',
            backgroundColor:'#FFF',
            height:40, 
            borderWidth:2,
            width:'80%',
            textAlign:'center',
            alignItems:'center',
            justifyContent:'center',
            borderColor:'rgb(211,211,211)'
        }   
        }
    };
    styleSelected1Text2(){
        if(this.state.selected2 == true){
            return {
                color:'#a8c0f4',
                fontSize:15
            }
        } else {
            return {
                color:'#000000',
                fontSize:15
            }
        }
    };
    styleSelected3(){
        if(this.state.selected3 == true){
            return {
                color:'#bcd0f7',
                backgroundColor:'#e1ebfc',
                height:40, 
                borderWidth:2,
                width:'80%',
                textAlign:'center',
                alignItems:'center',
                justifyContent:'center',
                borderColor:' #c2dcff'
            } 
        } else {
            return {
                color:'#000000',
                backgroundColor:'#FFF',
                height:40, 
                borderWidth:2,
                width:'80%',
                textAlign:'center',
                alignItems:'center',
                justifyContent:'center',
                borderColor:'rgb(211,211,211)'
            }   
        }
    };
    styleSelected1Text3(){
        if(this.state.selected3 == true){
            return {
                color:'#a8c0f4',
                fontSize:15
            }
        } else {
            return {
                color:'#000000',
                fontSize:15
            }
        }
    };
    selectType(){
        if(this.state.tipo == '3' || this.state.data.type == '3'){
            return <Text style={{color:'#000000', fontSize:15}}>rechazas la orden</Text>
        } else {
            return <Text style={{color:'#000000', fontSize:15}}>rechazas la solicitud</Text>
        }
    };
    selectTypeInHeader(){
        if(this.state.tipo == '3' || this.state.data.type == '3'){
            return <Text>Orden</Text>
        } else {
            return <Text>Solicitud</Text>
        }
    }
    render(){
        return (
            <ScrollView style={{backgroundColor:'#FFF', flex:1}}  behavior="padding" enabled>
            <View style={{backgroundColor:'#4180fd'}}>
                <View style={{ flexDirection:'row', marginTop:20, marginBottom:20}}>
                    <View style={{width:'50%'}}>
                        <TouchableOpacity style={{flexDirection:'row'}} onPress={() => Actions.profile()} >
                            <Text style={{color:'#ffffff', marginLeft:30}}>
                                <Image
                                style={{width: 20, height: 20}}
                                source={require('../../../assets/PNGIX.com_close-icon-png_904874.png')}
                                />
                            </Text>
                            <Text style={{color:'#FFF', marginLeft:10, fontSize:20}}>RECHAZADA</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'50%'}}>



                        <TouchableOpacity onPress={() => this.reject()}>
                            <Text style={{color:'#FFF', marginLeft:30, fontSize:20}}>COMFIRMAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{}}>
                <Text style={{color:'#000000',marginLeft:20, marginTop:20, fontSize:15}}>Solicitante{'        '} {this.state.data.account.user.first_name}{' '}{this.state.data.account.user.last_name}</Text>
                <Text style={{color:'#000000',marginLeft:20, marginTop:20, fontSize:15}}>{this.selectTypeInHeader()}{'           '} #{this.state.data.folio}</Text>
                <View style={{alignItems:'center', textAlign:'center', marginTop:20}}>
                    <Text style={{color:'#000000', fontSize:15}}>Selecciona el motivo por el cual</Text>
                    {this.selectType()}
                </View>
                <View style={{alignItems:'center', textAlign:'center', marginTop:20}}>
                    <TouchableOpacity onPress={() => this.setState({selected1:true, selected2: false, selected3:false, notas:'No son prioridad'})} style={this.styleSelected1()}>
                    <Text style={this.styleSelected1Text1()}>No son prioridad</Text>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems:'center', textAlign:'center', marginTop:20}}>
                    <TouchableOpacity onPress={() => this.setState({selected2:true, selected1:false, selected3:false, notas: 'Sin presupuesto'})} style={this.styleSelected2()}>
                    <Text style={this.styleSelected1Text2()}>Sin presupuesto</Text>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems:'center', textAlign:'center', marginTop:20}}>
                    <TouchableOpacity onPress={() => this.setState({selected3:true, selected1:false, selected2:false, notas: 'Cambio de productos'})} style={this.styleSelected3()}>
                    <Text style={this.styleSelected1Text3()}>Cambio de productos</Text>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems:'center'}}>
                    <View style={{width:'80%'}}>
                        <TextField
                            label="Notas"
                            onChangeText={val => this.setState({ notas: val })} //mutate the value of our global variable email at input
                            lineWidth={1}
                            // returnKeyType="next"
                            // onSubmitEditing={() => {
                            // this.Password.focus();
                            // }}
                            blurOnSubmit={false}

                        />
                    </View>
                </View>
            </View>
            
            </ScrollView>
        )
    }
}