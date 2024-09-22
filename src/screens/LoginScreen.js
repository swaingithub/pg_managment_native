import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.68.112:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log('Login response data:', data);

            if (response.ok) {
                // Store user data in AsyncStorage
                await AsyncStorage.setItem('currentUser', JSON.stringify({
                    id: data.id,          // Ensure your API returns an id
                    username: data.username, // The name or username to display
                    email: data.email,    // Store the email returned from the API
                    role: data.role,
                }));
                console.log('User data stored in AsyncStorage');

                if (data.role === 'admin') {
                    Alert.alert('Login Successful', 'Welcome Admin!');
                    navigation.navigate('Home'); // Navigate to Admin Dashboard
                } else if (data.role === 'user') {
                    Alert.alert('Login Successful', 'Welcome User!');
                    navigation.navigate('UserDashboard'); // Navigate to User Dashboard
                } else {
                    Alert.alert('Login Failed', 'Unknown user role');
                }
            } else {
                Alert.alert('Login Failed', data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signupLink}>Sign Up</Text>
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
