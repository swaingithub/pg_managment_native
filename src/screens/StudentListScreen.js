import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function StudentListScreen({ route, navigation }) {
  const { floorId, roomId } = route.params;
  const [students, setStudents] = useState([]);

  // Define the fetchStudents function using useCallback
  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch(`http://192.168.68.101:3000/api/rooms/${roomId}/students`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched Students:', data); // Log fetched students

      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, [roomId]);

  // Use useFocusEffect to call fetchStudents when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchStudents();
    }, [fetchStudents])
  );

  const handleAddStudentPress = () => {
    navigation.navigate('AddStudent', { floorId, roomId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room {roomId} Students</Text>
      {students.length > 0 ? (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                console.log('Navigating with student:', item); // Log the student data
                navigation.navigate('StudentDetail', { student: item, roomId });
              }}
            >
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noStudentsText}>No students in this room.</Text>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddStudentPress}
      >
        <Text style={styles.addButtonText}>Add New Student</Text>
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
  noStudentsText: {
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
