import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package if not already

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        setErrorMessage(''); // Reset error message
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
                await AsyncStorage.setItem('currentUser', JSON.stringify({
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    role: data.role,
                }));
                console.log('User data stored in AsyncStorage');

                if (data.role === 'admin') {
                    Alert.alert('Login Successful', 'Welcome Admin!');
                    navigation.navigate('Home');
                } else if (data.role === 'user') {
                    Alert.alert('Login Successful', 'Welcome User!');
                    navigation.navigate('UserDashboard');
                } else {
                    Alert.alert('Login Failed', 'Unknown user role');
                }
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Welcome Back!</Text>
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#aaa" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#aaa"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={!passwordVisible} // Toggle based on state
                        placeholderTextColor="#aaa"
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                        <Ionicons
                            name={passwordVisible ? "eye" : "eye-off"} // Change icon based on visibility
                            size={20}
                            color="#aaa"
                            style={styles.eyeIcon}
                        />
                    </TouchableOpacity>
                </View>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
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
        // Add a gradient background
        backgroundColor: 'linear-gradient(45deg, #00BFFF, #1E90FF)',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
        marginBottom: 24,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderColor: '#007bff',
        borderWidth: 1,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 15,
        height: 50,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});
