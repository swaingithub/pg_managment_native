import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleSignUp = async () => {
        console.log(username);
        console.log(email);
        console.log(password);



        try {
            // Making a POST request to the backend API
            const response = await axios.post('http://192.168.68.101:3000/api/auth/signup', {
                username,
                email,
                password,
            });

            if (response.status === 200 || response.status === 201) {
                Alert.alert('Success', 'Account created successfully');
                navigation.navigate('Login');
            } else {
                throw new Error(`Failed to sign up: ${response.statusText}`);
            }

        } catch (error) {
            console.error('Error signing up:', error.response || error.message || error);
            Alert.alert('Error', `Failed to sign up: ${error.response?.data || error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign up</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Sign up" onPress={handleSignUp} />
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>If You are already SignedUp</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signupLink}>Log in</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 32,
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
    signupContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    signupText: {
        fontSize: 16,
        color: '#333',
    },
    signupLink: {
        fontSize: 16,
        color: '#007bff',
        marginTop: 5,
    },
});
