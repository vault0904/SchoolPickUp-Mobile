import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useLayoutEffect} from 'react';
import {
  Linking
} from 'react-native';
import { StyleSheet, View, SafeAreaView, TextInput, TouchableOpacity, Button, ScrollView } from 'react-native';
import {Avatar, Title, Caption, Text, Card} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

//import username from login
import { usernameValue } from '../Login';
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';

//parent profile
const ParentProfile = ({ navigation }) => {
  //userData stores all the data of user from database
  const [userData, setUserData] = useState(null);
  //const [file, setFile] = useState(null);
  //username is equal to the username from login
  const username = usernameValue;
  //console.log ("username from context", username);
  const iSFocused = useIsFocused();

  const fetchData = () => {
    axios
      .get(`https://h4uz91dxm6.execute-api.ap-southeast-1.amazonaws.com/dev/api/parent/${username}`)
      .then((response) => {
        const userData = response.data;
        console.log('User data:', userData);
        setUserData(userData);
      })
      .catch((error) => {
        console.log('Error fetching data', error);
      });
  };


  useEffect(() => {
    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (iSFocused)  { 
      fetchData();
    }
  }, [iSFocused]);
  
  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  //file upload function
  const fileUpload = async (uri) => {
    if (uri) {
      try {
        const response = await axios.get(uri, { responseType: 'blob' });
        const blob = response.data;
        //const response = await fetch(uri);
        //const blob = await response.blob();
        const folName = "/parent";
        const reader = new FileReader(); // Fix the variable name here
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1];
          const fNameBef = uri.split("/ImagePicker/")[1];
          const fName = fNameBef; // Use fName instead of name
          console.log("fname" , fName);
          const fType = blob.type; // Use fType instead of type
  
          axios
            .post('https://46heb0y4ri.execute-api.us-east-1.amazonaws.com/dev/api/s3/uploadfile', {
              file: base64String,
              name: fName, // Use fName here
              folderName: folName,
              type: fType, // Use fType here
            })
            .then((res) => {
              const uploadedURI = res.data.imageURL;
              console.log(uploadedURI);
              const sendData = {
                userID : usernameValue,
                newImageURI : uploadedURI,
              };
              console.log(sendData);
              axios.put('https://h4uz91dxm6.execute-api.ap-southeast-1.amazonaws.com/dev/api/parent/updateImageURI', sendData)
              .then((response) => {
                console.log(response.data);
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  imageURI: uploadedURI,
                }));
                alert ('File uploaded successfully!');
              })
              .catch((error) => {
                console.error("Error updating user image: ", error);
                alert("An error occurred while changeing image!");
              })
            })
            .catch((err) => {
              alert('Error uploading file');
              console.log(err);
            });
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        alert('Error while reading image:', error);
      }
    } else {
      alert('FILE CANNOT BE EMPTY');
    }
  };

  //image picker to select image
  const handleChooseProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        console.log('Selected image URI:', result.assets[0].uri); // Updated key to access the selected image URI
        // You can set the selected image URI to state or do further processing here
        // For example: setProfilePicture(result.assets[0].uri);
        fileUpload(result.assets[0].uri);

      } else {
        console.log('Image picker canceled');
      }
    } catch (error) {
      console.log('Error while picking image:', error);
    }
  };



  //if user do not have an image, display default image
  const imageSource = userData.imageURI ? { uri: userData.imageURI } : require('../common/avatars/child.jpg');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userInfoSection}>
        {/* Top Profile Card */}
        <Card style={styles.cardDisplay}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Add TouchableOpacity to make the image clickable */}
            <TouchableOpacity onPress={handleChooseProfilePicture}>
              <Avatar.Image 
                source={imageSource}
                size={80}
              />
            </TouchableOpacity>
            <View style={{ marginLeft: 20 }}>
              <Title style={styles.title}>{userData.firstName + ' ' + userData.lastName}</Title>
              <Caption style={styles.caption}>Parent</Caption>
            </View>
          </View>
        </Card>

        {/* Profile Information */}
        <View style={styles.information}>
            <Text style={styles.profileInfo}>
                Profile Information
            </Text>
            <View>
              <TouchableOpacity key='edit' onPress={() => navigation.navigate('ParentEditProfile')}>
                <Icon name="pencil" size={20} color="#56844B" style={{ marginRight: 10 }} />
              </TouchableOpacity> 
            </View>
        </View>

        <View>
          <View style={styles.profileContainer}>
            <Text style={styles.profileTag}>Username</Text>
            <TextInput 
              style={styles.profileText} 
              value = {userData.parent_ID}
              placeholderTextColor='#56844B'
              editable = {false}
            />
          </View>

          <View style={styles.profileContainer}>
            <Text style={styles.profileTag}>Email</Text>
            <TextInput 
              style={styles.profileText} 
              value = {userData.email}
              placeholderTextColor='#56844B'
              editable = {false}
            />
          </View>

          <View style={styles.profileContainer}>
            <Text style={styles.profileTag}>Contact</Text>
            <TextInput 
              style={styles.profileText} 
              value = {userData.contactNo}
              placeholderTextColor='#56844B'
              editable = {false}
            />
          </View>


          <View style={styles.profileContainer}>
            <Text style={styles.profileTag}>Subscription</Text>
            <TextInput 
              style={styles.profileText} 
              value = {userData.subscription}
              placeholderTextColor='#56844B'
              editable = {false}
            />
          </View>

          <View style={styles.profileContainer}>
            <Text style={styles.profileTag}>Address</Text>
            <TextInput 
              style={styles.profileText} 
              multiline
              numberOfLines={3}
              value = {userData.address}
              placeholderTextColor='#56844B'
              editable = {false}
            />
          </View>

          <View style={styles.buttonGroupContainer}>
            {/* visit us button */}
            <TouchableOpacity onPress={() => Linking.openURL("https://xinyi0247.wixsite.com/marsupium")} style={styles.visitUsButton}>
              <Text style={styles.btnText1}>Visit Us</Text>
            </TouchableOpacity>

            {/* subsribe button */}
            <TouchableOpacity onPress={() =>navigation.navigate('Login')} style={styles.subscribeButton}>
              <Text style={styles.btnText1}>Subscribe</Text>
            </TouchableOpacity>
          </View>

          {/* logout button */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.logoutBtn}>
            <Text style={styles.btnText}>Logout</Text>
          </TouchableOpacity>


        </View>
      </View>
    </ScrollView>
  );
};


export default ParentProfile;

{/* styling for profile */}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardDisplay: {
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 130,
    backgroundColor: '#56844B',
    paddingTop: 15,
  },
  profileInfo: {
    color: '#56844B',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 2,
    justifyContent: 'flex-start',
  },
  editProfileBtn:{
    flex: 1,
    justifyContent: 'flex-end',
  },
  information :{
    marginTop: 35,
    marginBottom: 10,
    flexDirection: 'row'
  },
  profileContainer: {
    marginTop: 10,
    flexDirection: 'row'
  },
  profileTag:{
    color: '#707070',
    fontWeight: 'bold',
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 22,
    fontSize: 15
  },
  profileText:{
    height:50,
    borderBottomWidth: 1,
    borderBottomColor: '#56844B',
    flex: 2,
    justifyContent: 'flex-end',
    color: '#56844B',
    marginTop: 5
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
    marginTop: 35
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  caption: {
    fontSize: 15,
    lineHeight: 14,
    fontWeight: '500',
    color: '#ffffff'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  buttonGroupContainer:{
    marginTop: 30,
    marginVertical: 14,
    flexDirection: 'row',
  },
  visitUsButton: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#56844B',
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 20, 
    marginRight: 10
  },
  subscribeButton: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#56844B',
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginLeft: 10
  },
  btnText1:{
    padding: 5,
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  logoutBtn:{
    backgroundColor: '#FFA500',
    marginVertical: 14,
    borderRadius: 10,
    height: 50,
    alignItems:'center',
    marginTop: 10,
    marginBottom: 50,
  },
  btnText:{
    padding: 15,
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});
