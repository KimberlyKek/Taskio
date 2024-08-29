import React from 'react';
import '../__monks__/monks'
import { Alert } from 'react-native';
import {cleanup, render, fireEvent, waitFor, act} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


import LandingScreen from '../screens/landingscreen';
import WelcomeScreen from '../screens/welcome';
import SignUpScreen from '../screens/signup';
import LoginScreen from '../screens/login';
import { CalendarScreen, TaskScreen, AccountScreen } from '../screens/home';
import CreateTaskScreen from '../screens/createtask';
import ManageCategoriesScreen from '../screens/managecategories';
import EditTaskScreen from '../screens/edittask';
import TeamListScreen from '../screens/teamlist';

// Mock React Navigation
const mockNavigate = jest.fn();
const mockProps = {
  navigation: {
    navigate: mockNavigate,
  },
};

//Test landing screen
describe('LandingScreen', () => {

    afterEach(()=>{
        cleanup(); //Ensure the rendered component is removed after each test
        jest.clearAllMocks(); //Clear all mocks after each test
    });

    //Should render and display the conponents correctly
    it('Test if the screen renders correctly', () => {
        const { getByText } = render(<LandingScreen  {...mockProps} />);
        const TextContent = getByText('Welcome to Taskio')
        const continueButton = getByText('Continue');

        expect(continueButton).toBeOnTheScreen();
        expect(TextContent).toBeOnTheScreen();
    });

    //Should navigate to the Welcome screen when button press
    it('Test if navigate to the correct screen when button press', () => {
        const { getByText } = render(<LandingScreen  {...mockProps} />);
        const continueButton = getByText('Continue');
        fireEvent.press(continueButton);
        expect(mockNavigate).toHaveBeenCalledWith('Welcome');
    });

    //Should not navigate to the wrong screen when button press
    it('Test if navigate to the wrong screen when button press', () => {
        const { getByText } = render(<LandingScreen  {...mockProps} />);
        const continueButton = getByText('Continue');
        fireEvent.press(continueButton);
        expect(mockNavigate).not.toHaveBeenCalledWith('Test');
    });
});

//Test welcome screen
describe('WelcomeScreen', () => {

    afterEach(()=>{
        cleanup(); //Ensure the rendered component is removed after each test
        jest.clearAllMocks(); //Clear all mocks after each test
      });
    
    //Should render and display the conponents correctly
    it('Test if the screen renders correctly', () => {
        const { getByText } = render(<WelcomeScreen {...mockProps} />);
        const signupButton = getByText('Sign up');
        const loginButton = getByText('Login');
        const TextContent = getByText('Taskio');
        const TextContent2 = getByText('Organize your work and life');

        expect(TextContent).toBeOnTheScreen();
        expect(TextContent2).toBeOnTheScreen();
        expect(signupButton).toBeOnTheScreen();
        expect(loginButton).toBeOnTheScreen();

    });

    //Should navigate to the sign up screen when sign up button is pressed
    it('Test if navigate to the correct screen when sign up button press', () => {
        const { getByText } = render(<WelcomeScreen {...mockProps} />);
        const signupButton = getByText('Sign up');
        fireEvent.press(signupButton);

        expect(mockNavigate).toHaveBeenCalledWith('Signup');
    });

    //Should not navigate to the wrong screen when sign up button is pressed
    it('Test if navigate to the wrong screen when sign up button press', () => {
        const { getByText } = render(<WelcomeScreen {...mockProps} />);
        const signupButton = getByText('Sign up');
        fireEvent.press(signupButton);
        
        expect(mockNavigate).not.toHaveBeenCalledWith('Test');
    });

    //Should navigate to the correct screen when login button is pressed
    it('Test if navigate to the correct screen when login button press', () => {
        const { getByText } = render(<WelcomeScreen {...mockProps} />);
        const loginButton = getByText('Login');
        fireEvent.press(loginButton);

        expect(mockNavigate).toHaveBeenCalledWith('Login');
    });

    //Should not navigate to the wrong screen when login button is pressed
    it('Test if navigate to the wrong screen when login button press', () => {
        const { getByText } = render(<WelcomeScreen {...mockProps} />);
        const loginButton = getByText('Login');
        fireEvent.press(loginButton);

        expect(mockNavigate).not.toHaveBeenCalledWith('Test');
    });

  
});

//Test sign up screen
describe('SignUpScreen', () => {

    beforeEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    //Should render screen and display components correctly
    it('Test if the screen renders and display components correctly', () => {
        const { getByPlaceholderText, getByTestId } = render(<SignUpScreen />);
        const TextContent = getByTestId('SignUpText');
        const UsernameField = getByPlaceholderText('Username');
        const EmailField = getByPlaceholderText('Email');
        const PwdField = getByPlaceholderText('Password');
        const ConPwdField = getByPlaceholderText('Confirm Password');
        const SignupButton = getByTestId('SignUpBtn');

        expect(TextContent).toBeOnTheScreen();
        expect(UsernameField).toBeOnTheScreen();
        expect(EmailField).toBeOnTheScreen();
        expect(PwdField).toBeOnTheScreen();
        expect(ConPwdField).toBeOnTheScreen();
        expect(SignupButton).toBeOnTheScreen();

    });

    //Should display error messages if invalid input on the fields 
    it('Test if error messages are display when invalid input', async () => {
        const { getByPlaceholderText, getByTestId } = render(<SignUpScreen />);
        const UsernameField = getByPlaceholderText('Username');
        const EmailField = getByPlaceholderText('Email');
        const PwdField = getByPlaceholderText('Password');
        const ConPwdField = getByPlaceholderText('Confirm Password');
        const SignupButton = getByTestId('SignUpBtn');

        fireEvent.changeText(UsernameField, 'User');
        //Invalid email
        fireEvent.changeText(EmailField, '');
        //Invalid password
        fireEvent.changeText(PwdField, '12345');
        //Confirm Password not match with password
        fireEvent.changeText(ConPwdField, '123');
        fireEvent.press(SignupButton);

        await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
            'Error','Password and confirm password do not match!'
        );
        expect(Alert.alert).toHaveBeenCalledWith(
            'Error','You must input an email!'
        );
        expect(Alert.alert).toHaveBeenCalledWith(
            'Error','Password must be more than 6 characters!'
        );
        });
    });

    //Should successfully sign up a user
    it('Test if user signs up successfully', async () => {
        const { getByPlaceholderText, getByTestId } = render(<SignUpScreen {...mockProps}/>);
        
        getDocs.mockImplementation(() => Promise.resolve({ empty: true }));
        //Create a mock user data
        createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: '123', email: 'valid@example.com' } });
       
        addDoc.mockResolvedValue({});

        const UsernameField = getByPlaceholderText('Username');
        const EmailField = getByPlaceholderText('Email');
        const PwdField = getByPlaceholderText('Password');
        const ConPwdField = getByPlaceholderText('Confirm Password');
        const SignupButton = getByTestId('SignUpBtn');

        //Input the values into each field
        fireEvent.changeText(UsernameField, 'validUser');
        fireEvent.changeText(EmailField, 'valid@example.com');
        fireEvent.changeText(PwdField, 'validpassword');
        fireEvent.changeText(ConPwdField, 'validpassword');

        //Press the button
        fireEvent.press(SignupButton);

        await waitFor(() => {
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'valid@example.com', 'validpassword');
            expect(addDoc).toHaveBeenCalled();
            expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
                ['userEmail', 'valid@example.com'],
                ['userPassword', 'validpassword'],
                ['username', 'validUser']
            ]);
            expect(mockNavigate).toHaveBeenCalledWith('Login');
        });
    });

    });

//Test login screen
describe('LoginScreen', () => {
    
    beforeEach(() => {
        cleanup();
        jest.clearAllMocks(); // Clear previous mocks
    });

    //Should render screen and display components correctly
    it('Test if the screen renders and display components correctly', () => {
        const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
        const TextContent = getByTestId('loginText');
        const EmailField = getByPlaceholderText('Email');
        const PwdField = getByPlaceholderText('Password');

        expect(TextContent).toBeOnTheScreen();
        expect(EmailField).toBeOnTheScreen();
        expect(PwdField).toBeOnTheScreen();
    });

    //Should login successfully with the correct credentials
    it('Test if user login successfully', async () => {
        const { getByPlaceholderText, getByTestId } = render(<LoginScreen {...mockProps} />);
        const EmailField = getByPlaceholderText('Email');
        const PwdField = getByPlaceholderText('Password');
        const LoginBtn = getByTestId('LoginBtn');

        //Create a mock user data
        const mockSignIn = jest.fn().mockResolvedValue({
        user: {
            email: 'test@example.com',
            password: 'password1234'
        },
        });
        signInWithEmailAndPassword.mockImplementation(mockSignIn);

        //Input values to each field
        fireEvent.changeText(EmailField, 'test@example.com');
        fireEvent.changeText(PwdField, 'password123');
        //Press the button
        fireEvent.press(LoginBtn);

        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(),'test@example.com', 'password123');
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('userEmail', 'test@example.com');
            expect(mockNavigate).toHaveBeenCalledWith('Home', { email: 'test@example.com' });
        });
    });

    //Should display login fail error if invalid credentials
    it('Test if error alert on login failure', async () => {
        const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
        const EmailField = getByPlaceholderText('Email');
        const PwdField = getByPlaceholderText('Password');
        const LoginBtn = getByTestId('LoginBtn');

        //Create a mock error message
        const mockSignIn = jest.fn().mockRejectedValue(new Error("Your email or password is incorrect. Please try again."));
        signInWithEmailAndPassword.mockImplementation(mockSignIn);


        fireEvent.changeText(EmailField, 'wrong@example.com');
        fireEvent.changeText(PwdField, 'wrongpassword');
        fireEvent.press(LoginBtn);

        await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith(expect.anything(),'wrong@example.com', 'wrongpassword');
        expect(Alert.alert).toHaveBeenCalledWith('Error','Your email or password is incorrect. Please try again.');
        });
  });

    //Should naviagte to the correct screen when forgot password is pressed
    it('Test if navigate to the forgot password screen when button press', () => {
        
        const { getByText } = render(<LoginScreen {...mockProps} />);

        fireEvent.press(getByText('here'));

        expect(mockNavigate).toHaveBeenCalledWith('ResetPwd');
    });
});


describe('TaskScreen', () => {

  beforeEach(()=> {
    jest.clearAllMocks();
    cleanup();
  });

  it('Test if the screen renders correctly', () => {

    const { getByTestId } = render(<TaskScreen />);

    expect(getByTestId('CreateTaskBtn')).toBeOnTheScreen();
      
    });

  it ('Test if create task navigate to the correct screen when button press', () => {
    const { getByTestId } = render(<TaskScreen {...mockProps}/>);

    const createTaskBtn = getByTestId('CreateTaskBtn');

    fireEvent.press(createTaskBtn);
    expect(mockNavigate).toHaveBeenCalledWith('CreateTask');
  });

});

describe('CalendarScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
    cleanup();

  });

  it('Test if the screen renders correctly', () => {
    const { getByText } = render(<CalendarScreen />);

    expect(getByText('No task')).toBeOnTheScreen();
  });

  it('Test if date is selected when a day is pressed on the calendar', async() => {
    const { getByText, getByTestId } = render(<CalendarScreen />);

    fireEvent.press(getByTestId('selectdate'));
    await waitFor(()=> {
      expect(getByText('No task')).toBeOnTheScreen();
    });
  });

});


describe('AccountScreen', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
    cleanup();

    // Set up mock implementations for Firebase functions
    getDocs.mockImplementation(() => Promise.resolve({
        forEach: callback => {
        const mockData = [
            { data: () => ({username: 'user' }) },
          
        ];
        mockData.forEach(callback);
        }
    }));

    collection.mockImplementation((db, collectionName) => collectionName);
    doc.mockImplementation((db, collectionName, docId) => ({ id: docId }));
    query.mockImplementation(() => ({}));
    where.mockImplementation(() => ({}));
    getFirestore.mockImplementation(() => ({}));
  });

  //Should render and display conponents correctly
  it('Test if the screen render and display username correctly', async() => {
    const { getByText } = render(<AccountScreen />);
    await act(async () => {

      expect(getByText('Tasks Overview')).toBeOnTheScreen();
      expect(getByText('Completed Tasks')).toBeOnTheScreen();
      expect(getByText('Awaiting Tasks')).toBeOnTheScreen();
      
      await waitFor(()=> {
        expect(getByText('user')).toBeOnTheScreen();
        
      })
    });
  });


});

 


//Test create task screen
describe('CreateTaskScreen', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
    cleanup();

    // Set up mock implementations for Firebase functions
    addDoc.mockImplementation(() => Promise.resolve({ id: 'mockTaskId' }));
    collection.mockImplementation((db, collectionName) => collectionName);
    doc.mockImplementation((db, collectionName, docId) => ({ id: docId }));
    getFirestore.mockImplementation(() => ({}));
  });

  //Should render screen correctly
  it('Test if the screen is render correctly and interact with the UI elements', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<CreateTaskScreen />);

    expect(getByText('Create New Task')).toBeOnTheScreen();
    expect(getByPlaceholderText('New Task')).toBeOnTheScreen();

    fireEvent.press(getByTestId('toggle-subtask'));
    expect(getByPlaceholderText('New Sub Task')).toBeOnTheScreen();
  
  });

  //Should submit task successfully
  it('Test if the task is created successfully', async()=> {

    const { getByPlaceholderText, getByText } = render(<CreateTaskScreen />);
    const TaskField = getByPlaceholderText('New Task');
    const CreateBtn = getByText('Create');

    fireEvent.changeText(TaskField, 'Test Task');
    fireEvent.press(CreateBtn);
    
    await waitFor(() => {
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      Title: 'Test Task'
    }));
  });
  
  });


  //Should display error message if no task name is inputted
  it('Test if error message displayed when no task name input', async() => {
    const { getByText } = render(<CreateTaskScreen />);
    const CreateBtn = getByText('Create');

    fireEvent.press(CreateBtn);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error','Task name must not be blank!'
      );
    });
 
});
});

//Test manage categories screen
describe('ManageCategoriesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
    cleanup();

    // Set up mock implementations for Firebase functions
    getDocs.mockImplementation(() => Promise.resolve({
        forEach: callback => {
        const mockData = [
            { data: () => ({ Category_Title: 'Work', DocId: '1' }) },
            { data: () => ({ Category_Title: 'Personal', DocId: '2' }) }
        ];
        mockData.forEach(callback);
        }
    }));

    deleteDoc.mockImplementation(() => Promise.resolve());
    updateDoc.mockImplementation(() => Promise.resolve());
    collection.mockImplementation((db, collectionName) => collectionName);
    doc.mockImplementation((db, collectionName, docId) => ({ id: docId }));
    query.mockImplementation(() => ({}));
    where.mockImplementation(() => ({}));
    getFirestore.mockImplementation(() => ({}));
  });

  //Should render and display conponents correctly
  it('Test if the screen render and display categories correctly', async() => {
    const { getByText } = render(<ManageCategoriesScreen />);
    await act(async () => {

      expect(getByText('Manage Categories')).toBeOnTheScreen();
      
      await waitFor(()=> {
        expect(getByText('Work')).toBeOnTheScreen();
        expect(getByText('Personal')).toBeOnTheScreen();
      })
    });
  
  });

});

    
  
  
     