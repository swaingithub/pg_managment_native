import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDashboard = ({ navigation }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('currentUser');
                if (storedUser) {
                    setCurrentUser(JSON.parse(storedUser));
                }
            } catch (error) {
                setError('Error fetching current user');
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Dashboard</Text>

            {loading ? (
                <Text>Loading...</Text>
            ) : error ? (
                <Text>{error}</Text>
            ) : (
                currentUser && (
                    <View style={styles.currentUser}>
                        <Text style={styles.currentUserTitle}>Currently Logged-In User</Text>
                        <Text>Name: {currentUser.username}</Text>
                        <Text>Email: {currentUser.email || 'No Email'}</Text>
                        <Button
                            title="Send Your Data"
                            onPress={() => navigation.navigate('StudentDataPage')}
                        />
                    </View>
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    currentUser: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    currentUserTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default UserDashboard;
