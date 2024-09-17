import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AddStudentScreen({ route, navigation }) {
  const { floorId, roomId, studentId } = route.params || {}; // Include studentId for delete operations
  console.log('Extracted Floor ID:', floorId);
  console.log('Extracted Room ID:', roomId);
  console.log('Student ID for deletion:', studentId);

  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [work, setWork] = useState('');
  const [aadhaarPhoto, setAadhaarPhoto] = useState(null);
  const [passportPhoto, setPassportPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleFileUpload = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    console.log('Image Picker Result:', result); // Log the entire result

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      if (type === 'aadhaar') {
        setAadhaarPhoto(imageUri);
      } else if (type === 'passport') {
        setPassportPhoto(imageUri);
      }
    } else {
      console.log('Image picking was canceled or no assets found');
    }
  };

  const handleAddStudent = async () => {
    if (!aadhaarPhoto || !passportPhoto) {
      Alert.alert('Error', 'Please upload both Aadhaar and Passport photos');
      return;
    }

    try {
      const formData = new FormData();

      // Append text fields
      formData.append('name', name);
      formData.append('father_name', fatherName);
      formData.append('phone_number', phoneNumber);
      formData.append('email', email);
      formData.append('work', work);

      // Append IDs if available
      if (floorId) {
        formData.append('floor_id', floorId.toString());
      }

      if (roomId) {
        formData.append('room_id', roomId.toString());
      }

      // Append Aadhaar and Passport photo files
      formData.append('aadhaar_photo', {
        uri: aadhaarPhoto,
        type: 'image/jpeg',
        name: 'aadhaar_photo.jpg',
      });

      formData.append('passport_photo', {
        uri: passportPhoto,
        type: 'image/jpeg',
        name: 'passport_photo.jpg',
      });

      // Send the request
      const response = await fetch('http://192.168.68.101:3000/api/students', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check for success
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add student: ${errorText}`);
      }

      // Handle success
      Alert.alert('Success', 'Student added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('Error', `Failed to add student: ${error.message}`);
    }
  };


  const handleDeleteStudent = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this student?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await axios.delete(`http://192.168.68.101:3000/api/students/${student.id}`);

              if (response.status !== 200) {
                throw new Error(`Failed to delete student: ${response.statusText}`);
              }

              Alert.alert('Success', 'Student deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting student:', error.response || error.message || error);

              if (error.response) {
                Alert.alert('Error', `Failed to delete student: ${error.response.data || error.response.status}`);
              } else if (error.request) {
                Alert.alert('Error', 'No response from server. Please check the server or network.');
              } else {
                Alert.alert('Error', `Failed to delete student: ${error.message}`);
              }
            }
          }
        }
      ]
    );
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Student</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Father's Name"
        value={fatherName}
        onChangeText={setFatherName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Work"
        value={work}
        onChangeText={setWork}
      />

      <View style={styles.imageContainer}>
        <Text style={styles.imageLabel}>Upload Aadhaar Photo:</Text>
        <Button title="Select Aadhaar Photo" onPress={() => handleFileUpload('aadhaar')} />
        {aadhaarPhoto && (
          <Image source={{ uri: aadhaarPhoto }} style={styles.image} />
        )}
      </View>

      <View style={styles.imageContainer}>
        <Text style={styles.imageLabel}>Upload Passport Photo:</Text>
        <Button title="Select Passport Photo" onPress={() => handleFileUpload('passport')} />
        {passportPhoto && (
          <Image source={{ uri: passportPhoto }} style={styles.image} />
        )}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddStudent}
      >
        <Text style={styles.addButtonText}>Add Student</Text>
      </TouchableOpacity>

      {studentId && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteStudent}
        >
          <Text style={styles.deleteButtonText}>Delete Student</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginVertical: 10,
    resizeMode: 'cover',
  },
  addButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  deleteButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});
