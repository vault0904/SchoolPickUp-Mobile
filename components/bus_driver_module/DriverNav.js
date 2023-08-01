import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverHome from './DriverHome';
import DriverPickup from './DriverPickup';
import DriverScanQR from './DriverScanQR';
import DriverChat from './DriverChat';
import DriverProfile from './DriverProfile';
import DriverEditProfile from './DriverEditProfile';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DriverAnnouncements from '../common/DriverAnnouncements';
//import the userLastName from login
import {userLastName} from '../Login';

{/* For stack navigation between profile and edit profile page */}
const ProfileStack = createNativeStackNavigator();

const AnnouncementStack = createNativeStackNavigator();

function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator 
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#56844B',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerBackTitleVisible: false
            }}
        >
            <ProfileStack.Screen 
                name="DriverProfile" 
                component={DriverProfile}
                options={{
                    title:"Profile"
                }}
            />
            <ProfileStack.Screen 
                name="DriverEditProfile" 
                component={DriverEditProfile} 
                options={{
                    title:"Edit Profile"
                }}
            />
        </ProfileStack.Navigator>
    );
}

{/* For stack navigation between pickup and qr scanning page */}
const PickUpStack = createNativeStackNavigator();

function PickUpStackScreen() {
    return (
        <PickUpStack.Navigator 
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#56844B',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerBackTitleVisible: false
            }}
        >
            <PickUpStack.Screen 
                name="DriverPickup" 
                component={DriverPickup}
                options={{
                    title:"Pick Up"
                }}
            />
            <PickUpStack.Screen 
                name="DriverScanQR" 
                component={DriverScanQR} 
                options={{
                    title:"Scanning QR Code"
                }}
            />
        </PickUpStack.Navigator>
    );
}

function AnnouncementStackScreen() {
    //setting last name of user from login
    const Lname = userLastName;
    return (
      <AnnouncementStack.Navigator 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#56844B',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false
        }}
      >
        {/* main page */}
        <AnnouncementStack.Screen 
          name="DriverHome" 
          component={DriverHome}
          options={{
            title: "Welcome, "+ Lname
          }}
        />
  
        {/* page to route to from main */}
        <AnnouncementStack.Screen 
          name="DriverAnnouncementPage" 
          component={DriverAnnouncements} 
          options={{
            title:"Announcements"
          }}
        />
      </AnnouncementStack.Navigator>
    );
  }

const Tab = createBottomTabNavigator();


export default function DriverNav() {
    return (
      <Tab.Navigator 
        initialRouteName="Home" 
        screenOptions={{
            headerStyle: {
                backgroundColor: '#56844B'

            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            tabBarActiveTintColor: '#56844B',
        }}
      >
        <Tab.Screen 
            name="Hello"
            component={AnnouncementStackScreen}
            options={{
                headerShown: false,
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
            }} 
        />
        
        <Tab.Screen 
            name="PickUpStack" 
            component={PickUpStackScreen} 
            options={{
                headerShown: false,
                tabBarLabel: 'Pick up',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="account" color={color} size={size} />
                ),
            }} 
        />
        <Tab.Screen 
            name="Chat" 
            component={DriverChat} 
            options={{
                tabBarLabel: 'Chat',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="chat" color={color} size={size} />
                ),
            }} 
        />
        <Tab.Screen 
            name="ProfileStack" 
            component={ProfileStackScreen} 
            options={{
                headerShown: false,
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="cog" color={color} size={size} />
                ),
            }} 
        />
      </Tab.Navigator>
    );
  }