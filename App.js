// import 'react-native-gesture-handler';

// import React from 'react';
// import { StyleSheet, Text, View ,Icon} from 'react-native';
// //import {createBottomTabNavigator} from 'react-navigation'
// import { NavigationContainer } from '@react-navigation/native';
// //import { createStackNavigator } from '@react-navigation/stack';

// import Ionicons from 'react-native-vector-icons/Ionicons';


// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import feed from './app/screens/feed.js' 
// import upload from './app/screens/upload.js' 
// import profile from './app/screens/profile.js' 
// import{f,storage,auth,database} from './config/config'

// const Tab = createBottomTabNavigator();
// //const Stack = createStackNavigator();


// export default class App extends React.Component {

  
// login = async(email,password)=>{
//   if (email != '' && password!=''){
// try{
//   let user=await auth.signInWithEmailAndPassword('m@m.com','12345678');
//   console.log(user)
// }catch(err){

//   console.log(err)
// }




//   }
//   else{

// alert('Missing email or password')

//   }


// }


// constructor(props){
// super(props)
// this.login();

// }


//   render(){
//   return (




   
//     <NavigationContainer>

//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'Upload') {
//             iconName = focused
//               ? 'ios-add-circle'
//               : 'ios-add-circle-outline';
//           } else if (route.name === 'Feed') {
//             iconName = focused ? 'ios-list-box' : 'ios-list';
//           }
//           else{iconName = focused
//             ? 'ios-person'
//             : 'ios-person';}

//           // You can return any component that you like here!
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//       })}
//       tabBarOptions={{
//         activeTintColor: 'blue',
//         inactiveTintColor: 'gray',
//       }}
//     >
//       <Tab.Screen name="Feed" component={feed} />
//       <Tab.Screen name="Upload" component={upload} />
//       <Tab.Screen name="Profile" component={profile} />

//     </Tab.Navigator>
//   </NavigationContainer>
//   );
//     }
// }



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import feed from './app/screens/feed.js' 

import upload from './app/screens/upload.js' 
import profile from './app/screens/profile.js' 
import userProfile from './app/screens/userProfile.js' 
import comments from './app/screens/comments.js' 
import login from './app/screens/login.js' 
import register from './app/screens/Register.js' 



import{f,storage,auth,database} from './config/config'
import { View } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack =createStackNavigator();

function Home() {
  return (

    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Upload') {
            iconName = focused
              ? 'ios-add-circle'
              : 'ios-add-circle-outline';
          } else if (route.name === 'Feed') {
            iconName = focused ? 'ios-list-box' : 'ios-list';
          }
          else{iconName = focused
            ? 'ios-person'
            : 'ios-person';}

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Feed" component={feed} />
      <Tab.Screen name="Upload" component={upload} />
      <Tab.Screen name="Profile" component={profile} />
      


    </Tab.Navigator>
    
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" >
         
         <Stack.Screen name="Login" component={login}   />
         <Stack.Screen name="Register" component={register}   />

         <Stack.Screen name="comments" component={comments}   />
        <Stack.Screen  name="Insta-Photo" component={Home} 
        
        options={{
          
          headerLeft: () => (
           <View></View>
          ),
        }}
        
        />
        <Stack.Screen name="Profile" component={profile} />
        <Stack.Screen name="upload" component={upload} />
        <Stack.Screen name="userProfile" component={userProfile} />


      </Stack.Navigator>
    </NavigationContainer>
    
  );
}