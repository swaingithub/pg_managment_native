import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';  // For API calls

export default function NotificationScreen({ navigation }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://192.168.68.101:3000/api/notifications');
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                Alert.alert('Error', 'Failed to load notifications');
            }
        };

        fetchNotifications();
    }, []);

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            style={styles.notification}
            onPress={() => {
                console.log('Navigating to StudentApproval with studentId:', item.student_id); // Log studentId
                navigation.navigate('StudentApproval', { studentId: item.student_id });
            }}
        >
            <Text style={styles.notificationText}>{item.message}</Text>
            <Text style={styles.notificationDate}>{new Date(item.created_at).toLocaleString()}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Notifications</Text>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderNotification}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f6f9',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    notification: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    notificationText: {
        fontSize: 16,
        color: '#333',
    },
    notificationDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
});
