import React from 'react';
import { StyleSheet, Text, Platform,View,ImageBackground ,TouchableOpacity,Dimensions,TextInput,Button} from 'react-native';
import{f,storage,auth,database} from '../../config/config.js'
import {feed} from './feed'


export default class login extends React.Component
 {
    constructor(props) {
        super(props)

        this.state={

            loggedin:false,
            email:'',
            pass:''
        }
    }

componentDidMount=()=>{ 
var that=this;
f.auth().onAuthStateChanged(function(user){
if(user){

    // i will move to home
    that.setState({
       loggedin:true 
    });

}else{
    that.setState({
        loggedin:false 
     });


}


});


}


login=async()=>{
  
   var that=this
   var email =this.state.email.trim().toLowerCase();
   var pass=this.state.pass.trim();
   if(email!=''&&pass!=''){
try{
let user=await auth.signInWithEmailAndPassword(email,pass);
this.props.navigation.replace('Insta-Photo')



}catch(error){

console.log(error);
alert(error);

}



   }else{alert('email or password is empty..');}



}



    render() {

        return (




        


            <View style={{flex:1,backgroundColor:'white'}}>
       
              <Text
              style={{fontSize:50,marginTop:'20%',marginBottom:'10%',textAlign:'center'}}
              >InstaPhoto  </Text>





               <View >



                  <View style={{ borderBottomColor: '#000000', borderBottomWidth: 1,marginHorizontal:20 }}>
                     <TextInput style={styles.inputStyle} underlineColorAndroid="transparent"
                        placeholder="Enter Email"
                        placeholderTextColor="black"
                        keyboardType='email-address'
                        autoCapitalize="none" onChangeText={(text)=>this.setState({email:text})}
                     />

                  </View>


                  <View style={{ borderBottomColor: '#000000', borderBottomWidth: 1,marginTop: 40,marginHorizontal:20 }}>
                     <TextInput style={styles.inputStyle} underlineColorAndroid="transparent"
                        placeholder="Enter password"
                        placeholderTextColor="black"
                        secureTextEntry={true}

                        autoCapitalize="none" onChangeText={(text)=>this.setState({pass:text})}
                     />

                  </View>


               </View>

               <TouchableOpacity 
     onPress={() => this.login()}
        style={{marginTop:'10%',marginHorizontal:'5%',height:'10%',backgroundColor:'blue',borderRadius:5}}>
       
        <Text style={{textAlign:'center',fontWeight:'bold',paddingTop:'5%',fontSize:20,color:'white'}}>Login</Text>
        
        </TouchableOpacity>


           
           
               <TouchableOpacity style={{ margin: 20 ,alignContent:"center" }} onPress={()=>(this.props.navigation.navigate('Register'))}>
               <Text style={{textAlign:"center",color:"blue" }}>Create new Account? </Text>
            </TouchableOpacity>
            </View>



           
        );


    }



}


const styles = StyleSheet.create({
    container: {
       flex: 1,
       backgroundColor: "#fff",
       alignItems: "center",
       justifyContent: "space-around"
    },
    textStyle: {
       color: "#1A12FC",
       textAlign: "center",
       fontSize: 40,
       fontWeight: "300",
 
 
 
    },
    inputStyle: {
       width: Dimensions.get('window').width - 20,
       fontSize: 20
    }
 
 
 })
 
 