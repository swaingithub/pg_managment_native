import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function FilterRoomListScreen({ route, navigation }) {
    const { share_room, studentId } = route.params; // Ensure studentId is passed from previous screen
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`http://192.168.68.112:3000/api/floors/rooms/share?room_share=${share_room}`);
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
                Alert.alert('Error', 'Failed to load rooms');
            }
        };

        fetchRooms();
    }, [share_room]);

    const handleRoomPress = async (roomId) => {
        try {
            // Call the endpoint to approve the student and save data
            const response = await axios.post(`http://192.168.68.112:3000/api/students/approve-and-save/${studentId}`, {
                roomId, // Pass the roomId along with any other required data
            });

            Alert.alert('Success', response.data.message);
            // Optionally navigate to a different screen or refresh the list
            navigation.navigate('Home'); // Go back or navigate to the desired screen
        } catch (error) {
            console.error('Error approving student:', error);
            Alert.alert('Error', 'Failed to approve student');
        }
    };

    const renderRoom = ({ item }) => (
        <TouchableOpacity
            style={styles.roomItem}
            onPress={() => handleRoomPress(item.id)} // Call handleRoomPress instead
        >
            <Text style={styles.roomText}>{item.room_name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Rooms</Text>
            {rooms.length === 0 ? (
                <Text>No rooms found for this share type</Text>
            ) : (
                <FlatList
                    data={rooms}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderRoom}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    roomItem: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 12,
    },
    roomText: {
        fontSize: 18,
    },
});
