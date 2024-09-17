import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function FloorScreen({ route, navigation }) {
    const { floorId, floorName } = route.params;
    const [rooms, setRooms] = useState([]);

    // Define the fetchRooms function using useCallback
    const fetchRooms = useCallback(async () => {
        try {
            const response = await fetch(`http://192.168.68.101:3000/api/floors/${floorId}/rooms`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    }, [floorId]);

    // Use useFocusEffect to call fetchRooms when the screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchRooms();
        }, [fetchRooms])
    );

    const handleAddRoomPress = () => {
        navigation.navigate('AddRoom', { floorId }); // Pass floorId to AddRoomScreen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{floorName}</Text>
            {rooms.length > 0 ? (
                <FlatList
                    data={rooms}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => navigation.navigate('StudentList', { floorId, roomId: item.id })}
                        >
                            <Text style={styles.itemText}>{item.room_name}</Text>
                            <Text style={styles.itemText}>Students: {item.students_count}</Text>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <Text style={styles.noRoomsText}>No rooms available. Create a new room.</Text>
            )}
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddRoomPress}
            >
                <Text style={styles.addButtonText}>Add New Room</Text>
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
        marginBottom: 10,
    },
    item: {
        padding: 15,
        backgroundColor: '#e9ecef',
        borderRadius: 8,
        marginBottom: 10,
    },
    itemText: {
        fontSize: 18,
    },
    noRoomsText: {
        fontSize: 18,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 20,
    },
    addButton: {
        marginTop: 20,
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
