import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function FloorScreen({ route, navigation }) {
    const { floorId, floorName } = route.params;
    const [rooms, setRooms] = useState([]);

    const fetchRoomsWithCounts = useCallback(async () => {
        try {
            // Fetch rooms for the specific floor
            const roomsResponse = await fetch(`https://pg-management-ykhm.onrender.com/api/floors/${floorId}/rooms`);
            if (!roomsResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const roomsData = await roomsResponse.json();

            // Fetch student counts for all rooms
            const countResponse = await fetch(`https://pg-management-ykhm.onrender.com/api/rooms/count`);
            if (!countResponse.ok) {
                throw new Error('Failed to fetch student counts');
            }
            const countData = await countResponse.json();

            // Merge the room data with the student counts
            const mergedData = roomsData.map(room => {
                const roomCount = countData.find(count => count.room_id === room.id);
                return {
                    ...room,
                    students_count: roomCount ? roomCount.student_count : 0, // Default to 0 if not found
                };
            });

            setRooms(mergedData);
        } catch (error) {
            console.error('Error fetching rooms with counts:', error);
        }
    }, [floorId]);

    useFocusEffect(
        useCallback(() => {
            fetchRoomsWithCounts();
        }, [fetchRoomsWithCounts])
    );

    const handleAddRoomPress = () => {
        navigation.navigate('AddRoom', { floorId });
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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
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
