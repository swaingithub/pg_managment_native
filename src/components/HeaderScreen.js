// components/HeaderComponent.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import localProfileImage from '../images/profile.png'; // Use a distinct name for the local image import

const HeaderComponent = ({ username }) => {
    const navigation = useNavigation();

    return (
        <SafeAreaView>
            <View style={styles.header}>
                <View style={styles.profileContainer}>
                    <Image
                        source={localProfileImage} // Use the local image import
                        style={styles.profileImage}
                    />
                    <Text style={styles.username}>{username}</Text>
                </View>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Ionicons name="log-out-outline" size={20} color="#007bff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
    },
    logoutButton: {
        padding: 8,
        borderRadius: 8,
    },
});

export default HeaderComponent;
