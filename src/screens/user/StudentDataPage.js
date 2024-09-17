import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, Picker } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const StudentDataPage = () => {
    const [name, setName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [work, setWork] = useState('');
    const [aadhaarPhoto, setAadhaarPhoto] = useState(null);
    const [passportPhoto, setPassportPhoto] = useState(null);
    const [share, setShare] = useState('1'); // Default to '1 share'

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const pickImage = async (setImage) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
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

            const response = await axios.post('http://192.168.68.101:3000/api/student/temporary', formData, {
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
                setShare('1'); // Reset share to default
            } else {
                Alert.alert('Error', 'Failed to send data');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Send Your Data to Admin</Text>
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

            {/* Aadhaar Photo Picker */}
            <View style={styles.imageContainer}>
                <Text style={styles.imageLabel}>Upload Aadhaar Photo:</Text>
                <Button title="Select Aadhaar Photo" onPress={() => pickImage(setAadhaarPhoto)} />
                {aadhaarPhoto && <Image source={{ uri: aadhaarPhoto }} style={styles.image} />}
            </View>

            {/* Passport Photo Picker */}
            <View style={styles.imageContainer}>
                <Text style={styles.imageLabel}>Upload Passport Photo:</Text>
                <Button title="Select Passport Photo" onPress={() => pickImage(setPassportPhoto)} />
                {passportPhoto && <Image source={{ uri: passportPhoto }} style={styles.image} />}
            </View>

            {/* Share Dropdown */}
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

            <Button title="Submit" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
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
    dropdownContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    dropdownLabel: {
        fontSize: 16,
        marginBottom: 10,
    },
    dropdown: {
        width: 150,
        height: 50,
    },
});

export default StudentDataPage;
