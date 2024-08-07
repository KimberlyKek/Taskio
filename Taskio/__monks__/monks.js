import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Alert } from 'react-native';

// Mock Firebase
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({
      onAuthStateChanged: jest.fn(),
      currentUser: jest.fn(),
    })),
    signInWithCredential: jest.fn(),
    GoogleAuthProvider: jest.fn(() => ({
      setCustomParameters: jest.fn(),
    })),
    FacebookAuthProvider: {
      credential: jest.fn(() => 'mock_credential'),
    },
    getReactNativePersistence: jest.fn(),
    initializeAuth: jest.fn(),
    createUserWithEmailAndPassword : jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
  }));
  
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn()
}));
  
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ empty: true })),
  addDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  
}));
  
//Mock async storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  AsyncStorage: jest.fn(),
  multiSet: jest.fn(),
  setItem: jest.fn(),
}));
  
//Mock drawer nav
jest.mock('@react-navigation/drawer', () => ({

  DrawerContentScrollView: ({ children }) => children,
  DrawerItemList: () => null,
  DrawerItem: ({ onPress }) => (
    <button onClick={onPress} />
  ),
  createDrawerNavigator: jest.fn(() => ({
    Navigator: jest.fn(),
    Screen: jest.fn()
  })),
}));
  
//Mock expo notifications
jest.mock('expo-notifications', () => ({
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn(),
}));
  
//Mock popup menu
jest.mock('react-native-popup-menu', () => ({
  MenuProvider: ({ children }) => <>{children}</>,
  Menu: ({ children }) => <>{children}</>,
  MenuTrigger:({ children }) => <button testID='menu-triggle' >{children}</button>,
  MenuOptions: ({ children }) => <>{children}</>,
  MenuOption: ({ children, onSelect }) => (
    <button type="button" onClick={onSelect}>
      {children}
    </button>
  ),
}));

// Mock the necessary components
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ component }) => <>{component}</>,
  }),
}));

// Mock Calendar component
jest.mock('react-native-calendars', () => ({
  Calendar: ({ onDayPress, markedDates }) => (
    <div>
      <button  testID='selectdate' onClick={() => onDayPress({ dateString: '2024-08-07' })}>Select Date</button>
    </div>
  )
}));


// Mock navigation and route
jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(() => ({
    params: {
      DocId: 'test-doc-id',
    },
  })),
  NavigationContainer: ({ children }) => <>{children}</>,
}));

//Spy alert
jest.spyOn(Alert, 'alert')