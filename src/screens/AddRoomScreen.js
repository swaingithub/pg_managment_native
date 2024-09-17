import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function AddRoomScreen({ route, navigation }) {
    const { floorId } = route.params; // Extract floorId from route parameters
    console.log('floorId:', floorId); // Check if floorId is correctly received

    const [roomName, setRoomName] = useState('');

    const handleAddRoom = async () => {
        if (roomName.trim() === '') {
            Alert.alert('Error', 'Please enter a room name');
            return;
        }

        try {
            const response = await fetch(`http://192.168.68.101:3000/api/floors/${floorId}/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ room_name: roomName }),
            });

            if (!response.ok) {
                throw new Error('Failed to add room');
            }

            Alert.alert('Success', 'Room added successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error('Error adding room:', error);
            Alert.alert('Error', 'Failed to add room');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Room</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter room name"
                value={roomName}
                onChangeText={setRoomName}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddRoom}>
                <Text style={styles.addButtonText}>Add Room</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 18,
    },
    addButton: {
        padding: 15,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 18,
        color: '#fff',
    },
});
