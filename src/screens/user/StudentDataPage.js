import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; // For icons
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const StudentDataPage = () => {
    const [name, setName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [work, setWork] = useState('');
    const [aadhaarPhoto, setAadhaarPhoto] = useState(null);
    const [passportPhoto, setPassportPhoto] = useState(null);
    const [share, setShare] = useState('1');

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const pickImage = async (setImage) => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const handleSubmit = async () => {
        if (!name || !fatherName || !phone || !email || !work || !aadhaarPhoto || !passportPhoto) {
            Alert.alert('Error', 'Please fill all fields and upload both photos.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('fatherName', fatherName);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('work', work);
            formData.append('aadhaarPhoto', {
                uri: aadhaarPhoto,
                type: 'image/jpeg',
                name: 'aadhaar.jpg',
            });
            formData.append('passportPhoto', {
                uri: passportPhoto,
                type: 'image/jpeg',
                name: 'passport.jpg',
            });
            formData.append('share', share);

            const response = await axios.post('https://pg-management-ykhm.onrender.com/api/student/temporary', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Your data has been sent to admin for review');
                setName('');
                setFatherName('');
                setPhone('');
                setEmail('');
                setWork('');
                setAadhaarPhoto(null);
                setPassportPhoto(null);
                setShare('1');
            } else {
                Alert.alert('Error', 'Failed to send data');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        
        <ScrollView contentContainerStyle={styles.container}>
        
            <Text style={styles.title}>Student Information</Text>
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
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Work"
                value={work}
                onChangeText={setWork}
            />

            <View style={styles.imageUploadContainer}>
                <Text style={styles.imageLabel}>Aadhaar Photo:</Text>
                <TouchableOpacity style={styles.imageUploadBox} onPress={() => pickImage(setAadhaarPhoto)}>
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
                <TouchableOpacity style={styles.imageUploadBox} onPress={() => pickImage(setPassportPhoto)}>
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

            <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Share:</Text>
                <Picker
                    selectedValue={share}
                    style={styles.dropdown}
                    onValueChange={(itemValue) => setShare(itemValue)}
                >
                    <Picker.Item label="1 Share" value="1" />
                    <Picker.Item label="2 Shares" value="2" />
                    <Picker.Item label="3 Shares" value="3" />
                    <Picker.Item label="4 Shares" value="4" />
                </Picker>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

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
    dropdownContainer: {
        marginVertical: 20,
    },
    dropdownLabel: {
        fontSize: 18,
        marginBottom: 10,
        color: '#3a3d46',
    },
    dropdown: {
        height: 50,
        borderColor: '#d0d3db',
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: '#fff',
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

export default StudentDataPage;
