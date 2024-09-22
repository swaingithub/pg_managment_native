import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import FloorScreen from '../screens/FloorScreen';
import RoomScreen from '../screens/RoomScreen';
import LoginScreen from '../screens/LoginScreen';
import HeaderComponent from '../components/HeaderScreen'; // Import your custom header component
import AddStudentScreen from '../screens/AddStudentScreen';
import StudentListScreen from '../screens/StudentListScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';
import AddFloorScreen from '../screens/AddFloorScreen';
import AddRoomScreen from '../screens/AddRoomScreen';
import EditStudentScreen from '../screens/EditStudentScreen';
import SignUpScreen from '../screens/user/SignUpScreen';
import UserDashBoard from '../screens/user/UserDashBoard';
import StudentDataPage from '../screens/user/StudentDataPage';
import NotificationScreen from '../screens/NotificationScreen';
import StudentApprovalScreen from '../screens/StudentApprovalScreen';
import FilterRoomListScreen from '../screens/FilteredRoom';

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: null }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: () => <HeaderComponent username="Admin" profileImage="https://www.example.com/profile-pic.jpg" />, // Customize the profile image URL and username
        }}
      />
      <Stack.Screen
        name="Floor"
        component={FloorScreen}
        options={{ title: 'Rooms' }}
      />
      <Stack.Screen
        name="Room"
        component={RoomScreen}
        options={{ title: 'Room Details' }}
      />
      <Stack.Screen name="AddStudent" component={AddStudentScreen} />
      <Stack.Screen name="StudentList" component={StudentListScreen} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} /> 
      <Stack.Screen name="AddFloor" component={AddFloorScreen} />
      <Stack.Screen name="AddRoom" component={AddRoomScreen} />
      <Stack.Screen name="EditStudent" component={EditStudentScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen
        name="UserDashboard"
        component={UserDashBoard}
        options={{
          headerShown: false, // Hide the header for UserDashboard
        }}
      />
      <Stack.Screen name="StudentDataPage" component={StudentDataPage}  />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="StudentApproval" component={StudentApprovalScreen} options={{ title: 'StudentApprovalScreen' }} />
      <Stack.Screen name="FilterRoomListScreen" component={FilterRoomListScreen} options={{ title: 'FilterRoomListScreen' }} />
    </Stack.Navigator>
  );
}
