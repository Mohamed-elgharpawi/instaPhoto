import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Button, Dimensions, TextInput } from 'react-native';

import { f, storage, auth, database } from '../../config/config.js'


class Register extends React.Component {






   state = {
      username: '',
      email: '',
      pass: '',

   };

createUser=(userObj,email)=>{

   objToSave={
name:this.state.username,
username:'@'+this.state.username,
avatar: 'https://i.pravatar.cc/300',
email:email


   }

   database.ref('users').child(userObj.uid).set(objToSave);
   alert("Registered, Successfully");

   this.props.navigation.navigate('Login');





}

   signUp = async()=>{
      var email =this.state.email.trim().toLowerCase();
      var pass=this.state.pass.trim();
      var username=this.state.username.trim(); 
      if(email!=''&&pass!=''&&username!=''){
   try{
   let user=await auth.createUserWithEmailAndPassword(email,pass).then((userObj)=> this.createUser(userObj.user,email))
   .catch((error)=>alert(error))


   
   
   }catch(error){
   
   console.log(error);
   alert(error);
   
   }}else{

alert("please, Fill all fields ")

   }
   }













   render() {


      return (










         <View style={{backgroundColor:'white',flex:1}}>
            <Text
              style={{fontSize:50,marginTop:'20%',marginBottom:'10%',textAlign:'center'}}
              >InstaPhoto </Text>

            <View >



               <View style={{ borderBottomColor: '#000000', borderBottomWidth: 1,  marginHorizontal: 20 }}>
                  <TextInput style={styles.inputStyle} underlineColorAndroid="transparent"
                     placeholder="Enter Email"
                     placeholderTextColor="black"
                     autoCapitalize="none" onChangeText={(text) => this.setState({ email: text })}
                  />

               </View>

               <View style={{ borderBottomColor: '#000000', borderBottomWidth: 1, marginTop: 40, marginHorizontal: 20 }}>
                  <TextInput style={styles.inputStyle} underlineColorAndroid="transparent"
                     placeholder="Enter Username"
                     placeholderTextColor="black"
                     autoCapitalize="none" onChangeText={(text) => this.setState({ username: text })}
                  />

               </View>





               <View style={{ borderBottomColor: '#000000', borderBottomWidth: 1, marginTop: 40, marginHorizontal: 20 }}>
                  <TextInput style={styles.inputStyle} underlineColorAndroid="transparent"
                     placeholder="Enter password"
                     placeholderTextColor="black"
                     secureTextEntry={true}
                     autoCapitalize="none" onChangeText={(text) => this.setState({ pass: text })}
                  />

               </View>








            </View>
            <TouchableOpacity
               onPress={() => this.signUp()}
               style={{ marginTop:'10%',marginHorizontal:'5%',height:'10%',backgroundColor:'green',borderRadius:5}}>
        <Text style={{textAlign:'center',fontWeight:'bold',paddingTop:'5%',fontSize:20,color:'white'}}>Register</Text>

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



export default Register