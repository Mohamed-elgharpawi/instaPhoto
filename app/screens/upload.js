import React from 'react';
import { StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Text, View, Image, Alert, ImageEditor } from 'react-native';
import { f, storage, auth, database } from '../../config/config.js'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default class upload extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

            loggedin: false,
            imageId: this.uniqueId(),
            imageSelected: false,
            uploading: false,
            currentFileType:'',
            uri:'',
            caption: "",
            progress: 0
        }
    }

    _checkPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ camera: status });

        const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ cameraRoll: statusRoll });


    }



    randomStr = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      };
    uniqueId = () => {
        return this.randomStr() + this.randomStr() +'-'+this.randomStr() +'-'+
            this.randomStr() +'-'+ this.randomStr() +'-'
            + this.randomStr() + '-' + this.randomStr()+'-' + this.randomStr();


    }
  choosePickingMethod(){
    Alert.alert(
        'Picking Method',
        'choose Cam or Gallery',
        [
          {text: 'Ask me later',style: 'cancel', onPress: () => console.log('Ask me later pressed')},
          {
            text: 'Camera',
            onPress: () => this.findNewImage('cam'),
            
          },
          {text: 'Gallery', onPress: () => this.findNewImage('gal')},
        ],
        {cancelable: false},
      );


  }




    findNewImage = async (method) => {
        var result =null
        this._checkPermissions();
        if(method==='cam'){
        result = await ImagePicker.launchCameraAsync({

            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1

        });}
        else
        {
             result = await ImagePicker.launchImageLibraryAsync({

                mediaTypes: 'Images',
                allowsEditing: true,
                quality: 1 });

        }


        console.log(result)
        if (!result.cancelled) {
            console.log(result)

            console.log('upload iamge');

            this.setState({
                imageSelected: true,
                imageId: this.uniqueId(),
                uri: result.uri
            });
            // this.uploadImage(result.uri);


        }
        else {
            console.log('cancle')
            
            this.setState({
                imageSelected: false
            });
        }



    }

    uploadPublish = () => {
        if (this.state.uploading == false) {
          if (this.state.caption != '') {
            //

            this.uploadImage(this.state.uri);
          } else {
            alert("Please enter a caption..");
          }
        } else {
          console.log("Ignore button tap as already uploading");
        }
      };

    uploadImage =   (uri) => {

       
        var userid = f.auth().currentUser.uid;
        var imageId = this.state.imageId;
        

        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(uri)[1];

        this.setState({
            currentFileType : ext,
            uploading: true
        });
        

        



        var FilePath = imageId + "." + ext;

        const oReq = new XMLHttpRequest();
        oReq.open("GET", uri, true);
        oReq.responseType = "blob";
        oReq.onload = () => {
            const blob = oReq.response;
            this.completeUploadBlob(blob, FilePath);
        };
        oReq.send();




    }
    completeUploadBlob = (blob, FilePath) => {
console.log("Path"+FilePath)
console.log('test'+this.state.uploading)
        console.log('test2'+this.state.currentFileType)


        var that = this;
        var userid = f.auth().currentUser.uid;
        var imageId = this.state.imageId;

        var uploadTask = storage
            .ref("user/" + userid + "/img")
            .child(FilePath)
            .put(blob);

        uploadTask.on(
            "state_changed",
            function (snapshot) {
                var progress = (
                    (snapshot.bytesTransferred / snapshot.totalBytes) *
                    100
                ).toFixed(0);
                console.log("Upload is " + progress + "% complete");
                that.setState({
                    progress: progress
                });
            },
            function (error) {
                console.log("error with upload - " + error);
            },
            function () {
                //complete
                that.setState({ progress: 100 });
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log(downloadURL);
                    that.processUpload(downloadURL);
                });
            }
        );
    };

    processUpload = (imageUrl) => {
        //Process here...
        //Set needed info
        var imageId = this.state.imageId;
        var userId = f.auth().currentUser.uid;
        var caption = this.state.caption;
        var dateTime = Date.now();
        var timestamp = Math.floor(dateTime / 1000);
        //Build photo object
        //author, caption, posted, url

        var photoObj = {
            author: userId,
            caption: caption,
            posted: timestamp,
            url: imageUrl
        };

        //Update database

        //Add to photors for the feed page
        database.ref("/photos/" + imageId).set(photoObj);

        //Set user photos object
        database.ref("/users/" + userId + "/photos/" + imageId).set(photoObj);

       alert("Image Uploaded Successfully!!");

        this.setState({
            uploading: false,
            imageSelected: false,
            caption: "",
            uri: ""
        });
    };



    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if (user) {
                that.setState({
                    loggedin: true
                });

            } else {
                that.setState({
                    loggedin: false
                });


            }


        });


    }



    render() {

        return (


            <View style={{ flex: 1 }}>
                {this.state.loggedin == true ? (


                    <View style={{ flex: 1 }}>

                        {/* check if image is selected */}
                        {this.state.imageSelected == true ? (
                            <View style={{ flex: 1 }}>

                                <View style={{ padding: 5 }}>
                                    <Text style={{ marginTop: 5 }}>Caption:</Text>
                                    <TextInput
                                        editable={true}
                                        placeholder={'Enter the captin'}
                                        maxLength={150}
                                        multiline={true}
                                        numberOfLines={4}
                                        onChangeText={(text) => this.setState({ caption: text })}
                                        style={{
                                            marginVertical: 10, height: 100, padding: 5, borderColor: 'grey',
                                            borderWidth: 1, borderRadius: 3, backgroundColor: 'white',
                                            color: 'black', textAlignVertical: 'top'

                                        }}

                                    />
<TouchableOpacity
onPress={()=>this.uploadPublish()}
style={{alignSelf:'center',width:170,marginHorizontal:'auto'

,backgroundColor:'blue',borderRadius:5,paddingVertical:10,paddingHorizontal:20
}}

>

<Text style={{textAlign:'center',color:'white'}}>Share</Text>

</TouchableOpacity>

{this.state.uploading==true?(

<View style={{marginTop:10}} >
<Text style={{alignContent:'center',textAlign:"center"}}>{this.state.progress}%</Text>
{this.state.progress!=100 ?(
    <ActivityIndicator size='small' color='blue'
    
    ></ActivityIndicator>
):(
<Text>Processing</Text>

)}



</View>
):(
<View></View>

)}

<Image source={{uri:this.state.uri}}
style={{marginTop:10,resizeMode:'cover',width:'100%',height:275}}

/>





                                </View>



                            </View>




                        ) : (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 30, paddingBottom: 15 }}>
                                        Upload

</Text>
                                    <TouchableOpacity
                                        onPress={() => this.choosePickingMethod()}
                                        style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'blue', alignItems: 'center', borderRadius: 5 }}
                                    >
                                        <Text style={{ color: 'white' }}>Select Photo +</Text>

                                    </TouchableOpacity>



                                </View>

                            )}
                    </View>

                ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>You Are Not Logged in </Text>

                            <Text>Please, login to upload photoes</Text>


                        </View>



                    )}




            </View>

        );


    }



}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
