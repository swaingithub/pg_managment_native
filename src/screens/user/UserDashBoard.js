import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const UserDashboard = ({ navigation }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('currentUser');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    console.log('Fetched user:', user); // Log the user object
                    setCurrentUser(user);
                } else {
                    console.log('No user data found in AsyncStorage');
                }
            } catch (error) {
                setError('Error fetching current user');
                console.error(error); // Log the error
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('currentUser');
        navigation.navigate('Login');
    };

    const recentActivities = [
        "Attended orientation on 09/15",
        "Submitted documents on 09/10",
        "Updated profile on 09/01"
    ];

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={styles.loading} />
            ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
            ) : (
                        <>
                            {currentUser ? (
                                <View style={styles.currentUserCard}>
                                    <View style={styles.currentUserHeader}>
                                        <Text style={styles.currentUserTitle}>
                                            Hello, {currentUser.username}!
                                        </Text>
                                        <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
                                            <FontAwesome name="sign-out" size={20} color="#007bff" />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.userDetail}>
                                        Email: {currentUser.email || 'No Email'}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => navigation.navigate('StudentDataPage')}
                                    >
                                        <Text style={styles.buttonText}>Send Your Data</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text style={styles.noUserText}>No user data available.</Text>
                            )}

                            <View style={styles.statsContainer}>
                                <View style={styles.statCard}>
                                    <FontAwesome name="users" size={30} color="#007bff" />
                                    <Text style={styles.statText}>Total Students</Text>
                                    <Text style={styles.statValue}>150</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <FontAwesome name="bell" size={30} color="#007bff" />
                                    <Text style={styles.statText}>Notifications</Text>
                                    <Text style={styles.statValue}>3</Text>
                                </View>
                                <View style={styles.statCard}>
                                    <FontAwesome name="cog" size={30} color="#007bff" />
                                    <Text style={styles.statText}>Settings</Text>
                                </View>
                            </View>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Your Recent Activities:</Text>
                                <FlatList
                                    data={recentActivities}
                                    renderItem={({ item }) => (
                                        <View style={styles.activityCard}>
                                            <Text style={styles.activityText}>- {item}</Text>
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                        </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 30, // Add top margin here
        backgroundColor: '#f8f9fa',
    },
    loading: {
        marginTop: 20,
    },
    currentUserCard: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        marginBottom: 20,
    },
    currentUserHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    currentUserTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#495057',
    },
    logoutIcon: {
        marginLeft: 10,
    },
    userDetail: {
        fontSize: 16,
        color: '#6c757d',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noUserText: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        flexWrap: 'wrap',
    },
    statCard: {
        width: '30%',
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    statText: {
        fontSize: 16,
        color: '#495057',
        textAlign: 'center',
        marginTop: 10,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
        marginTop: 5,
    },
    footer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    footerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#495057',
    },
    activityCard: {
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        marginTop: 5,
    },
    activityText: {
        fontSize: 16,
        color: '#343a40',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
});

export default UserDashboard;
