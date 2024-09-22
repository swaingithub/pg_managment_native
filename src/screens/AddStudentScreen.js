import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function AddStudentScreen({ route, navigation }) {
  const { floorId, roomId, studentId } = route.params || {};
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
        Alert.alert('Permission required', 'Camera roll permissions are required to upload images.');
      }
    })();
  }, []);

  const handleFileUpload = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      type === 'aadhaar' ? setAadhaarPhoto(imageUri) : setPassportPhoto(imageUri);
    }
  };

  const handleAddStudent = async () => {
    if (!aadhaarPhoto || !passportPhoto) {
      Alert.alert('Error', 'Please upload both Aadhaar and Passport photos');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('father_name', fatherName);
      formData.append('phone_number', phoneNumber);
      formData.append('email', email);
      formData.append('work', work);
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

      const response = await fetch('http://192.168.68.112:3000/api/students', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add student');
      }

      Alert.alert('Success', 'Student added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
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

      <View style={styles.imageUploadContainer}>
        <Text style={styles.imageLabel}>Aadhaar Photo:</Text>
        <TouchableOpacity style={styles.imageUploadBox} onPress={() => handleFileUpload('aadhaar')}>
          {aadhaarPhoto ? (
            <Image source={{ uri: aadhaarPhoto }} style={styles.imagePreview} />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={36} color="#888" />
              <Text style={styles.imageUploadText}>Upload Aadhaar Photo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.imageUploadContainer}>
        <Text style={styles.imageLabel}>Passport Photo:</Text>
        <TouchableOpacity style={styles.imageUploadBox} onPress={() => handleFileUpload('passport')}>
          {passportPhoto ? (
            <Image source={{ uri: passportPhoto }} style={styles.imagePreview} />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={36} color="#888" />
              <Text style={styles.imageUploadText}>Upload Passport Photo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleAddStudent}>
        <Text style={styles.submitButtonText}>Add Student</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f4f7fb',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3a3d46',
  },
  input: {
    height: 50,
    borderColor: '#d0d3db',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  imageUploadContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: '#3a3d46',
  },
  imageUploadBox: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d0d3db',
    borderStyle: 'dashed',
    backgroundColor: '#eef0f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadText: {
    color: '#888',
    marginTop: 10,
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});

