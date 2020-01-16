import React, {Component} from "react";
import Loading from 'react-native-whc-loading';
import { AsyncStorage,View, Text, TouchableOpacity, Image, Alert, ScrollView} from 'react-native';
import { Actions } from "react-native-router-flux";
import { TextField } from 'react-native-materialui-textfield';

export default class Rechazar extends Component{
    constructor(props) {
        super(props)
        this.state = {
            request_id:props.request_id,
            data:props.data,
            selected1:false,
            selected2:false,
            selected3:false,
            notas:'',
            tipo:props.tipo,
        }
    };
    
    reject(){
        if(this.state.data.type == '3'){
            this.rejectOrdenes()
        } else {
            this.ifNotasNotNull()
        }
    };
    goToPreviewsPage(){
        if(this.state.data.type == '3'){
            Actions.infoOrdenes({data: this.state.data, folio: this.state.data.folio, tipo:this.state.tipo})
        } else {
            Actions.infoSolicitudes({data: this.state.data, folio: this.state.data.folio, tipo:this.state.tipo})
        }
    };
    ifNotasNotNull(){
        if(this.state.notas !== ''){
            this.rejectSolicitudes()
        } else {
            Alert.alert('Favor de seleccionar motivo de rechazo')
        }
    };
    async rejectOrdenes(){
        this.refs.loading4.show();
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
            this.refs.loading4.close();
              Actions.profile()
          } else {
            this.refs.loading4.close();
            Alert.alert(`respuesta, ${JSON.stringify(response)}`)
          }
      }).catch((err)=>{
        this.refs.loading4.close();
        console.log(err.message)
      })
    };
    async rejectSolicitudes(){
        this.refs.loading4.show();
        const token = await AsyncStorage.getItem('ACCESS_TOKEN')
        //dGaCRT8Eirg:APA91bGLU2FFhsjAvBoxjYty9BL-RwGTrWC6gbyFXZUZkU0p29EQ4159ZcW8A4ELoylJRRLtjRrj-tBC6f07irJXVkim4YSloEbyBSZ3brVfs3bn42pMuPsZ2FaZAo2wvNN-s9Y_-vTM
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
            this.refs.loading4.close();
              Actions.profile()
          } else {
            this.refs.loading4.show();
            Alert.alert(`respuesta, ${JSON.stringify(response)}`)
          }
      }).catch((err)=>{
        this.refs.loading4.show();
        console.log(err.message)
      })
    };
    styleSelected1(){
        if(this.state.selected1 == true){
        return {
            borderColor:' #00A0F8',
            color:'#bcd0f7',
            backgroundColor:'#e1ebfc',
            height:32, 
            borderWidth:2,
            width:'80%',
            textAlign:'center',
            alignItems:'center',
            justifyContent:'center',
            width:208
        } 
        } else {
        return {
            
            color:'#000000',
            backgroundColor:'#FFF',
            height:32, 
            borderWidth:2,
            width:'80%',
            textAlign:'center',
            alignItems:'center',
            justifyContent:'center',
            borderColor:'rgb(211,211,211)',
            width:208
        }   
        }
    };
    styleSelected1Text1(){
        if(this.state.selected1 == true){
            return {
                color:'#a8c0f4',
                fontSize:14.09,
                fontFamily:'Montserrat-Regular'
            }
        } else {
            return {
                color:'#000000',
                fontSize:14.09,
                fontFamily:'Montserrat-Regular'
            }
        }
    };
    styleSelected2(){
        if(this.state.selected2 == true){
        return {
            color:'#bcd0f7',
            backgroundColor:'#e1ebfc',
            height:32, 
            borderWidth:2,
            width:'80%',
            textAlign:'center',
            alignItems:'center',
            justifyContent:'center',
            borderColor:' #c2dcff',
            width:208
        } 
        } else {
        return {
            color:'#000000',
            backgroundColor:'#FFF',
            height:32, 
            borderWidth:2,
            width:'80%',
            textAlign:'center',
            alignItems:'center',
            justifyContent:'center',
            borderColor:'rgb(211,211,211)',
            width:208
        }   
        }
    };
    styleSelected1Text2(){
        if(this.state.selected2 == true){
            return {
                color:'#a8c0f4',
                fontSize:14.09,
                fontFamily:'Montserrat-Regular'
            }
        } else {
            return {
                color:'#000000',
                fontSize:14.09,
                fontFamily:'Montserrat-Regular'
            }
        }
    };
    styleSelected3(){
        if(this.state.selected3 == true){
            return {
                color:'#bcd0f7',
                backgroundColor:'#e1ebfc',
                height:32, 
                borderWidth:2,
                width:'80%',
                textAlign:'center',
                alignItems:'center',
                justifyContent:'center',
                borderColor:' #c2dcff',
                width:208
            } 
        } else {
            return {
                color:'#000000',
                backgroundColor:'#FFF',
                height:32, 
                borderWidth:2,
                width:'80%',
                textAlign:'center',
                alignItems:'center',
                justifyContent:'center',
                borderColor:'rgb(211,211,211)',
                width:208
            }   
        }
    };
    styleSelected1Text3(){
        if(this.state.selected3 == true){
            return {
                color:'#a8c0f4',
                fontSize:14.09,
                fontFamily:'Montserrat-Regular'
            }
        } else {
            return {
                color:'#000000',
                fontSize:14.09,
                fontFamily:'Montserrat-Regular'
            }
        }
    };
    selectType(){
        if(this.state.tipo == '3' || this.state.data.type == '3'){
            return <Text>Orden</Text>
        } else {
            return <Text>Solicitud</Text>
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
            <View style={{backgroundColor:'#FFF', flex:1}}>
                <Loading 
                  borderRadius={50}
                  size={40}
                  ref='loading4'
                  backgroundColor={'transparent'}
                  indicatorColor={'#00A0F8'}/>
                <ScrollView>
                    <View style={{ flexDirection:'row',backgroundColor:'#00A0F8', height:56,justifyContent:'center', alignItems:'center'}}>
                        <View style={{width:'10%'}}>
                            <TouchableOpacity  onPress={() => Actions.profile()} >
                                <Image
                                style={{width: 20, height: 20}}
                                source={require('../../../assets/icons8-chevron-left-48.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'60%'}}>
                            <TouchableOpacity  onPress={() => Actions.profile()} >
    <Text style={{textAlign:'center', color:'#FFFFFF', marginLeft:0, fontSize:19.94, fontWeight:'500', fontFamily:'Montserrat-Medium', letterSpacing:0.25}}>Rechazar {this.selectType()}</Text>
                            </TouchableOpacity>   
                        </View>
                        <View style={{width:'10%'}}></View>
                        {/* <View style={{ flexDirection:'row', marginTop:20, marginBottom:20, alignItems:'flex-end',
                                        justifyContent:'center',}}> */}
                            {/* <View style={{width:'50%', alignItems:'center',
                                        justifyContent:'center',}}> */}
                                {/* <TouchableOpacity style={{flexDirection:'row',}} onPress={() => Actions.profile()} > */}
                                    {/* <Text style={{color:'#ffffff', marginLeft:30}}>
                                        <Image
                                        style={{width: 20, height: 20}}
                                        source={require('../../../assets/close.png')}
                                        />
                                    </Text> */}
                                    {/* <Text style={{color:'#F5F5F5', marginLeft:10, fontSize:19.94, fontWeight:'500', fontFamily:'Montserrat-Medium', letterSpacing:0.25}}>Rechazar orden</Text> */}
                                {/* </TouchableOpacity> */}
                            {/* </View> */}
                            {/* <View style={{width:'50%'}}>



                                <TouchableOpacity onPress={() => this.reject()}>
                                    <Text style={{marginTop:6,letterSpacing:1.25, fontFamily:'Montserrat-Medium',fontWeight:'500', color:'rgba(255,255,255,0.6)', marginLeft:50, fontSize:13.96}}>COMFIRMAR</Text>
                                </TouchableOpacity>
                            </View>
                        </View> */}
                    </View>
                    <View style={{}}>
                        <Text style={{color:'rgba(0,0,0,0.87)',marginLeft:20, marginTop:20, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>Solicitante{'        '} <Text style={{color:'rgba(0,0,0,0.6)'}}>{this.state.data.account.user.first_name}{' '}{this.state.data.account.user.last_name}</Text></Text>
                        <Text style={{color:'rgba(0,0,0,0.87)',marginLeft:20, marginTop:20, fontSize:14.09, fontFamily:'Montserrat-Regular'}}>{this.selectTypeInHeader()}{'           '}{'     '}<Text style={{color:'rgba(0,0,0,0.6)'}}>#{this.state.data.folio}</Text></Text>
                        <View style={{alignItems:'center', textAlign:'center', marginTop:30, marginBottom:40}}>
                            <Text style={{color:'rgba(0,0,0,0.6)', fontSize:16.1, fontFamily:'Montserrat-Regular'}}>¿Cuál es el motivo del rechazo?</Text>
                            {/* {this.selectType()} */}
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
                                    label="Escribe otro motivo"
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
                <View style={{flexDirection:'row', justifyContent:'space-around', marginBottom:0, marginTop:20}}>
                    {/* <View style={{width:'50%', marginLeft:0}}>
                        <TouchableOpacity style={{
                        height:56,
                        backgroundColor:'transparent',
                        borderWidth:1,
                        borderRadius:0,
                        alignItems:'center',
                        justifyContent:'center',
                        borderColor:'rgba(0,0,0,0.6)',
                        flexDirection:'row',
                        borderRigthWidth:0
                        }}
                        
                        onPress={() =>  this.goToPreviewsPage()}
                        >
                       
                        <Text style={{color:'rgba(0,0,0,0.6)',fontFamily:'Montserrat-Medium', fontWeight:'500', letterSpacing:0.25, fontSize:13.96}}>CANCELAR</Text>
                        </TouchableOpacity>

                    </View> */}
                    <View style={{width:'100%', marginRight:0}}>
                    <TouchableOpacity style={{
                        height:56,
                        backgroundColor:'#4BBC68',
                        borderWidth:1,
                        borderRadius:0,
                        alignItems:'center',
                        justifyContent:'center',
                        borderColor:'#4BBC68',
                        flexDirection:'row',
                        borderLeftWidth:0
                        }}
                        // onPress={() => Alert.alert(
                        //     'Advertencia:', '¿Estás seguro de querer aprobar esta orden de compra?',
                        //     [
                        //         { text: "NO",
                        //         style: "cancel"
                        //         },
                        //         { text: 'SI',onPress: () => this.approveOrdenes()},
                        //     ],
                        //     { cancelable: false },
                        //     )}
                        onPress={() => this.reject()}
                        >
                        {/* <Text style={{color:'#808080', marginRight:20}}>
                            <Image
                                style={{width: 15, height: 15}}
                                source={require('../../../assets/ok.png')}
                            />
                        </Text> */}
                        <Text style={{color:'#FFFFFF',fontFamily:'Montserrat-Medium', fontWeight:'500', letterSpacing:0.25, fontSize:13.96}}>CONFIRMAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
