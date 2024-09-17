// AddFloorScreen.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

export default function AddFloorScreen({ navigation }) {
    const [newFloorName, setNewFloorName] = useState('');

    const handleCreateFloor = async () => {
        if (!newFloorName.trim()) {
            Alert.alert('Error', 'Please enter a valid floor name');
            return;
        }

        try {
            const response = await fetch('http://192.168.68.101:3000/api/floors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ floor_name: newFloorName }),
            });
            if (response.ok) {
                setNewFloorName('');  // Clear the input field
                Alert.alert('Success', 'Floor added successfully');
                navigation.goBack(); // Navigate back to FloorScreen
            } else {
                Alert.alert('Error', 'Failed to create floor');
            }
        } catch (error) {
            console.error('Error creating floor:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Floor</Text>
            <TextInput
                style={styles.input}
                placeholder="New Floor Name"
                value={newFloorName}
                onChangeText={setNewFloorName}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleCreateFloor}
            >
                <Text style={styles.addButtonText}>Add Floor</Text>
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
