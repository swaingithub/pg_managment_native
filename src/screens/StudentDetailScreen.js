import axios from 'axios';
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

const StudentDetailScreen = ({ route, navigation }) => {
  const { student, roomId } = route.params;

  // const handleClose = () => {
  //   navigation.goBack();
  // };

  const handleEdit = () => {
    // Navigate to the Edit screen with student details
    navigation.navigate('EditStudent', { student, roomId });
  };

  const handleDeleteStudent = async () => {
    console.log(student.id);

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this student?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await axios.delete(`http://192.168.68.101:3000/api/students/${student.id}`);

              if (response.status !== 200) {
                throw new Error(`Failed to delete student: ${response.statusText}`);
              }

              Alert.alert('Success', 'Student deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting student:', error.response || error.message || error);

              if (error.response) {
                Alert.alert('Error', `Failed to delete student: ${error.response.data || error.response.status}`);
              } else if (error.request) {
                Alert.alert('Error', 'No response from server. Please check the server or network.');
              } else {
                Alert.alert('Error', `Failed to delete student: ${error.message}`);
              }
            }
          }
        }
      ]
    );
  };


  if (!student) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Student details not available.</Text>
        <TouchableOpacity style={styles.button} onPress={handleClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Student Details</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDeleteStudent}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
        {/*<TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>*/}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.detailText}>{student.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Father's Name:</Text>
          <Text style={styles.detailText}>{student.father_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.detailText}>{student.phone_number}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.detailText}>{student.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Work:</Text>
          <Text style={styles.detailText}>{student.work}</Text>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Text style={styles.imageDescription}>Passport Photo:</Text>
        <Image
          source={{ uri: student.passport_photo }}
          style={styles.photo}
          resizeMode="cover"
        />
        <Text style={styles.imageDescription}>Aadhaar Photo:</Text>
        <Image
          source={{ uri: student.aadhaar_photo }}
          style={styles.photo}
          resizeMode="cover"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: '40%',
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    width: '60%',
  },
  imageContainer: {
    marginBottom: 20,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  imageDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default StudentDetailScreen;
