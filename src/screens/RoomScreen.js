import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function RoomScreen({ route, navigation }) {
    const { floor } = route.params; // Get the selected floor from the route parameters
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await fetch(`http://192.168.68.101:3000/api/floors/${floor}/rooms`);
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            const data = await response.json();
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            Alert.alert('Error', 'Failed to load rooms');
        }
    };

    const handleAddRoom = () => {
        navigation.navigate('AddRoom', { floor });
    };

    const handleRoomPress = (room) => {
        // Check if the room has students
        const roomHasStudents = room.students && room.students.length > 0;
        // If the room has students, navigate with the student data, otherwise pass undefined
        navigation.navigate('Students', { floor, room: room.name, students: roomHasStudents ? room.students : undefined });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rooms in {floor}</Text>
            {rooms.length === 0 ? (
                <Text style={styles.noRoomsText}>No rooms available. Create a new room.</Text>
            ) : (
                <FlatList
                    data={rooms}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.roomItem}
                            onPress={() => handleRoomPress(item)}
                        >
                            <Text style={styles.roomName}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddRoom}
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
    noRoomsText: {
        fontSize: 18,
        color: '#6c757d',
        marginBottom: 20,
        textAlign: 'center',
    },
    roomItem: {
        padding: 15,
        backgroundColor: '#e9ecef',
        borderRadius: 8,
        marginBottom: 10,
    },
    roomName: {
        fontSize: 18,
        color: '#343a40',
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
