import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button, Image, ScrollView } from 'react-native';

export default function EditStudentScreen({ route, navigation }) {
    const { student, roomId } = route.params;

    // Initialize state with passed student data
    const [name, setName] = useState(student.name || '');
    const [fatherName, setFatherName] = useState(student.father_name || '');
    const [phoneNumber, setPhoneNumber] = useState(student.phone_number || '');
    const [email, setEmail] = useState(student.email || '');
    const [work, setWork] = useState(student.work || '');
    const [aadhaarPhoto, setAadhaarPhoto] = useState(student.aadhaar_photo || null);
    const [passportPhoto, setPassportPhoto] = useState(student.passport_photo || null);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const handleFileUpload = async (type) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            if (type === 'aadhaar') {
                setAadhaarPhoto(imageUri);
            } else if (type === 'passport') {
                setPassportPhoto(imageUri);
            }
        }
    };

    const handleEditStudent = async () => {
        try {
            // Constructing form data
            const formData = new FormData();
            formData.append('id', student.id);
            formData.append('name', name);
            formData.append('father_name', fatherName);
            formData.append('phone_number', phoneNumber);
            formData.append('email', email);
            formData.append('work', work);
            formData.append('room_id', roomId);

            // Append Aadhaar and Passport photos if available
            if (aadhaarPhoto) {
                const filename = aadhaarPhoto.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;

                formData.append('aadhaar_photo', {
                    uri: aadhaarPhoto,
                    type: type,
                    name: filename,
                });
            }

            if (passportPhoto) {
                const filename = passportPhoto.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;

                formData.append('passport_photo', {
                    uri: passportPhoto,
                    type: type,
                    name: filename,
                });
            }

            // Sending the request with form data
            const response = await axios.post(`https://pg-management-ykhm.onrender.com/api/students/${student.id}`, formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status !== 200) {
                throw new Error(`Failed to edit student: ${response.statusText}`);
            }

            Alert.alert('Success', 'Student edited successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error editing student:', error.response || error.message || error);

            if (error.response) {
                console.error('Server Response Data:', error.response.data);
                console.error('Server Response Status:', error.response.status);
                console.error('Server Response Headers:', error.response.headers);
                Alert.alert('Error', `Failed to edit student: ${error.response.data || error.response.status}`);
            } else if (error.request) {
                console.error('Request Made, No Response:', error.request);
                Alert.alert('Error', 'No response from server. Please check the server or network.');
            } else {
                console.error('Error Message:', error.message);
                Alert.alert('Error', `Failed to edit student: ${error.message}`);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Edit Student</Text>
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
                style={styles.editButton}
                onPress={handleEditStudent}
            >
                <Text style={styles.editButtonText}>Edit Student</Text>
            </TouchableOpacity>
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
    editButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#28a745',
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 18,
        color: '#fff',
    },
});
