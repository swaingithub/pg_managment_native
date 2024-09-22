import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import axios from 'axios';

export default function StudentApprovalScreen({ route, navigation }) {
    const { studentId } = route.params;
    const [studentDetails, setStudentDetails] = useState(null);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await axios.get(`http://192.168.68.112:3000/api/student/${studentId}`);
                setStudentDetails(response.data);
            } catch (error) {
                console.error('Error fetching student details:', error);
                Alert.alert('Error', 'Failed to load student details');
            }
        };

        fetchStudentDetails();
    }, [studentId]);

    const handleApprove = async () => {
        try {
            await axios.post(`http://192.168.68.112:3000/api/student/approve/${studentId}`);
            Alert.alert('Success', 'Student approved successfully');

            // Navigate to RoomListScreen with studentId and share_room
            navigation.navigate('FilterRoomListScreen', {
                studentId,
                share_room: studentDetails.share,  // Assuming 'share' is the room_share value
            });
        } catch (error) {
            console.error('Error approving student:', error);
            Alert.alert('Error', 'Failed to approve student');
        }
    };

    const handleReject = async () => {
        try {
            await axios.post(`http://192.168.68.112:3000/api/student/reject/${studentId}`);
            Alert.alert('Success', 'Student rejected successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error rejecting student:', error);
            Alert.alert('Error', 'Failed to reject student');
        }
    };

    if (!studentDetails) {
        return (
            <View style={styles.container}>
                <Text>Loading student details...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Student Approval</Text>

            <Text style={styles.label}>Name: {studentDetails.name}</Text>
            <Text style={styles.label}>Father's Name: {studentDetails.father_name}</Text>
            <Text style={styles.label}>Phone: {studentDetails.phone}</Text>
            <Text style={styles.label}>Email: {studentDetails.email}</Text>
            <Text style={styles.label}>Work: {studentDetails.work}</Text>

            <Text style={styles.label}>Aadhaar Photo:</Text>
            <Image
                source={{ uri: studentDetails.aadhaar_photo }}
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={styles.label}>Passport Photo:</Text>
            <Image
                source={{ uri: studentDetails.passport_photo }}
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={styles.label}>Share: {studentDetails.share}</Text>

            <View style={styles.buttonContainer}>
                <Button title="Approve" onPress={handleApprove} />
                <Button title="Reject" onPress={handleReject} color="red" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f4f6f9',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});
