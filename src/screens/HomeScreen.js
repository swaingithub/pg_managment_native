import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

export default function HomeScreen({ navigation }) {
  const [floors, setFloors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedFloors, setSortedFloors] = useState([]);
  const [notifications, setNotifications] = useState([]); // State to hold notifications

  const fetchFloors = async () => {
    try {
      const response = await fetch('http://192.168.68.101:3000/api/floors');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFloors(data);
      setSortedFloors(data);
    } catch (error) {
      console.error('Error fetching floors:', error);
      Alert.alert('Error', 'Failed to load floors');
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://192.168.68.101:3000/api/notifications');
      setNotifications(response.data);
      console.log('Fetched Notifications:', response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFloors();
      fetchNotifications(); // Fetch notifications when screen is focused
    }, [])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filteredFloors = floors.filter(floor =>
        floor.floor_name.toLowerCase().includes(query.toLowerCase())
      );
      setSortedFloors(filteredFloors);
    } else {
      setSortedFloors(floors);
    }
  };

  const handleSort = () => {
    const sorted = [...sortedFloors].sort((a, b) => a.floor_name.localeCompare(b.floor_name));
    setSortedFloors(sorted);
  };

  const handleAddFloor = () => {
    navigation.navigate('AddFloor');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Floors</Text>
        <TouchableOpacity style={styles.actionButton} onPress={handleAddFloor}>
          <Ionicons name="add-circle-outline" size={24} color="#007bff" />
          <Text style={styles.actionText}>Add Floor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notifications} onPress={() => navigation.navigate('NotificationScreen')}>
          <FontAwesome name="bell" size={24} color={notifications.length ? 'red' : 'gray'} />
          {notifications.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notifications.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Floors..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
          <FontAwesome name="sort-alpha-asc" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {sortedFloors.length === 0 ? (
        <Text style={styles.noFloorsText}>No floors available.</Text>
      ) : (
        <FlatList
          data={sortedFloors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Floor', { floorId: item.id, floorName: item.floor_name })}
            >
              <View style={styles.cardContent}>
                <FontAwesome name="building" size={24} color="#007bff" />
                <View style={styles.textContainer}>
                  <Text style={styles.floorText}>{item.floor_name}</Text>
                  <Text style={styles.studentCount}>{`Students: ${item.students_count}`}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007bff',
    marginLeft: 8,
  },
  notifications: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sortButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  floorText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#495057',
  },
  studentCount: {
    fontSize: 16,
    color: '#6c757d',
  },
  noFloorsText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginVertical: 20,
  },
});
