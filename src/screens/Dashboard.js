import React, { useState } from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
// import Button from '../components/Button'
import { Buton } from 'react-native-paper';
import TextInput from '../components/userInputs'
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { db, storage } from '../firebase'
import { addDoc, collection } from 'firebase/firestore'
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  ref,
  uploadBytesResumable,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";


export default function Dashboard({ navigation }) {
  const [name, setName] = useState(null)
  const [fatherName, setfatherName] = useState(null)
  const [cnic, setcnic] = useState(null)
  const [dob, setdob] = useState(null)
  const [fmember, setfmember] = useState(null)
  const [needType, setneedType] = useState(null)
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [cnicImage, setcnicImage] = React.useState(null);


  const [showAlert, setShowAlert] = useState(false)

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Monthly Ration', value: 'Monthly Ration' },
    { label: 'Daily 1 Time', value: 'Daily 1 Time' },
    { label: 'Daily 2 Time', value: 'Daily 2 Times' },
    { label: 'Daily 3 Time', value: 'Daily 3 Times' }
  ]);





  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
  };

  // cnic image func
  let openImagePickerAsync1 = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setcnicImage({
      localUri: pickerResult.uri
    });
  };
  const formSubmit = async () => {
    if (!name ||
      !fatherName ||
      !cnic ||
      !dob ||
      !fmember || !needType ||
      !selectedImage.localUri ||
      !cnicImage.localUri) {
      setShowAlert(true)
      return
    } else {
      const file = { profile: selectedImage.localUri, cnic: cnicImage.localUri };
      const storageRef = ref(storage, "users/");
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('File available at', downloadURL);
            const dbRef = collection(db, "ApplicationData")
            addDoc(dbRef, {
              name,
              fatherName,
              cnic,
              dob,
              fmember,
              needType,
              downloadURL,
              status: "pending"
            })
              .then(res => {
                console.log("your data is saved ", res);
              })
              .catch(err => console.log(err))

          });
        }
      );
    }



  }

  return (
    <ScrollView >

      <Background>
        <Logo />
        <View style={{
          width: "100%",
          // backgroundColor: "orange"
        }}>
          <TextInput
            label="Name"
            returnKeyType="done"
            onChangeText={(text) => setName(text)}
            placeholder="Enter Name"
          />
          <TextInput
            label="Father's Name"
            returnKeyType="done"
            onChangeText={(text) => setfatherName(text)}
            placeholder="Enter Father's Name"
          />
          <TextInput
            label="Enter CNIC"
            returnKeyType="done"
            onChangeText={(text) => setcnic(text)}
            placeholder="Enter CNIC Ex:11111-1111111-1"
          />
          <TextInput
            label="Enter D.O.B"
            returnKeyType="done"
            onChangeText={(text) => setdob(text)}
            placeholder="Date of Birth EX.12/06/1995"
          />
          <TextInput
            type="number"
            label="Family's Quantity"
            returnKeyType="done"
            onChangeText={(text) => setfmember(text)}
            placeholder="Number of Family Members"
          />

          <DropDownPicker
            style={{ marginVertical: 12, height: 58 }}
            open={open}
            value={needType}
            items={items}
            setOpen={setOpen}
            setValue={setneedType}
            setItems={setItems}
          />

          <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
            <Text style={styles.buttonText}>{selectedImage !== null ? selectedImage.localUri : "Click to Upload Face Front "}</Text>
            <Image source={require('../assets/camera.png')} style={styles.image1} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openImagePickerAsync1} style={styles.button}>
            <Text style={styles.buttonText}>{cnicImage !== null ? cnicImage.localUri : "Click to Upload Front And Back of CNIC"}</Text>
            <Image source={require('../assets/camera.png')} style={styles.image} />
          </TouchableOpacity>



          <TouchableOpacity onPress={() => {
            formSubmit()
          }}>
            <Text style={{
              backgroundColor: "#89C343",
              borderRadius: 8,
              justifyContent: "center",
              textAlign: "center",
              padding: 15
            }}>SUBMIT FORM </Text>
          </TouchableOpacity>
        </View>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Invalid Data"
          message="Enter Correct Data!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          // showCancelButton={true}
          showConfirmButton={true}
          // cancelText="No, cancel"
          confirmText="close"
          confirmButtonColor="#DD6B55"
          onConfirmPressed={() => {
            setShowAlert(false)

          }}
        />
      </Background>
    </ScrollView>
  )
}
const styles = StyleSheet.create({

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 6,
    borderColor: 'black',
    borderWidth: 1,
    marginVertical: 12
  },
  buttonText: {
    fontSize: 12,
    color: 'black',
  },
  image: {
    marginLeft: 20
  },
  image1: {
    marginLeft: 60
  }
});
