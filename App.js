import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Modal, AppState, Linking, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // If using Expo
import { CameraView, useCameraPermissions } from 'expo-camera';

const MainMenu = ({ navigation }) => {
  const showFeatureNotAvailableAlert = () => {
    Alert.alert("Feature Not Available", "This feature is not applicable at the moment.");
  };

  return (
    <View style={styles.containerMenu}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PDI SYSTEM</Text>
      </View>
      
      <TouchableOpacity style={styles.optionBox} onPress={() => navigation.navigate('ScanQRCode')}>
        <Text style={styles.optionText}>PDI</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.optionBox} onPress={showFeatureNotAvailableAlert}>
        <Text style={styles.optionText}>PDI Rectify</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.optionBox} onPress={showFeatureNotAvailableAlert}>
        <Text style={styles.optionText}>PDI SOP</Text>
      </TouchableOpacity>
      
      <Text style={styles.footer}>PDI System. Copyright © Flow Studios, 2024</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const ScanQRCode = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState('ID1');
  const [chassisNumber, setChassisNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [carInfo, setCarInfo] = useState({ chassis: '', color: '', engine: '' });
  const [permission, requestPermission] = useCameraPermissions();
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const showCarInfo = () => {
    if (chassisNumber.trim() !== '') {
      setCarInfo({
        chassis: chassisNumber,
        color: 'Red', // Example data
        engine: 'V8 Turbo', // Example data
      });
      setModalVisible(true);
    } else {
      Alert.alert('Error', 'Please enter a chassis number.');
    }
  };

  const handleQRCodeScanned = ({ data }) => {
    if (data && !qrLock.current) {
      qrLock.current = true;
      try {
        console.log("Scanned Data:", data); // Log the scanned data
  
        // Convert the plain text data into a JSON object
        const lines = data.split("\n"); // Split the data by newlines
        const scannedData = {};
  
        lines.forEach((line) => {
          const [key, value] = line.split(": "); // Split each line by ": "
          if (key && value) {
            scannedData[key.trim()] = value.trim(); // Trim whitespace and add to the object
          }
        });
  
        console.log("Parsed Data:", scannedData); // Log the parsed data
  
        // Update the car info state
        setCarInfo({
          model: scannedData.model || "Unknown",
          engine_no: scannedData.engine_no || "Unknown",
          chassis_no: scannedData.chassis_no || "Unknown",
          colour_code: scannedData.colour_code || "Unknown",
          entry_date: new Date(scannedData.entry_date).toString() || "Unknown",
        });
  
        setModalVisible(true); // Show the modal
      } catch (error) {
        console.error("Scan Error:", error); // Log the error
        Alert.alert("Scan Error", "Invalid QR Code data.");
      }
      setTimeout(() => {
        qrLock.current = false;
      }, 500);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.containerPermission}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.qrContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>PDI SYSTEM</Text>
      </View>

      <Text style={styles.qrTitle}>Scan QR Code</Text>
      
      {isCameraOpen ? (
        <View style={styles.qrBox}>
          <CameraView
            style={styles.qrBox}
            facing="back"
            onBarcodeScanned={handleQRCodeScanned}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsCameraOpen(false)}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.qrBox}>
          <TouchableOpacity onPress={() => setIsCameraOpen(true)}>
            <MaterialCommunityIcons name="camera" size={40} color="black" />
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.orText}>OR</Text>
      <Text>Manual type chassis no.</Text>

      {/* Dropdown */}
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedId}
          onValueChange={(itemValue) => setSelectedId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="ID1" value="ID1" />
          <Picker.Item label="ID2" value="ID2" />
          <Picker.Item label="ID3" value="ID3" />
          <Picker.Item label="ID4" value="ID4" />
        </Picker>
      </View>

      {/* Chassis Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Type here"
        value={chassisNumber}
        onChangeText={setChassisNumber}
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainMenu')}>
          <Text>&lt;&lt; Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.enterButton} onPress={showCarInfo}>
          <Text>Enter</Text>
        </TouchableOpacity>
      </View>

      {/* Popup Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Start PDI</Text>
            <Text>Model: {carInfo.model}</Text>
            <Text>Engine No: {carInfo.engine_no}</Text>
            <Text>Chassis No: {carInfo.chassis_no}</Text>
            <Text>Colour Code: {carInfo.colour_code}</Text>
            <Text>Entry Date: {carInfo.entry_date}</Text>

            <Text style={styles.modalMessage}>Confirm to start PDI? Timer will start</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => Alert.alert('Feature Not Available', 'This feature is under development.')}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.footer}>PDI System. Copyright © Flow Studios, 2024</Text>

      <StatusBar style="auto" />
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainMenu" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="ScanQRCode" component={ScanQRCode} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // ======================
  // Main Menu Styles
  // ======================
  containerMenu: {
    flex: 1, // Takes up the entire screen
    alignItems: 'center', // Centers content horizontally
    justifyContent: 'center', // Centers content vertically
    backgroundColor: '#fff', // White background
    paddingTop: 50, // Adds padding to avoid overlapping with the status bar
  },

  // Header Styles
  header: {
    width: '85%', // Takes up 85% of the parent width
    backgroundColor: '#E75B26', // Orange background
    paddingVertical: 15, // Adds vertical padding
    alignItems: 'center', // Centers content horizontally
    position: 'absolute', // Fixes the header at the top
    top: 60, // Positions the header 60 units from the top
  },
  headerText: {
    fontSize: 20, // Large font size
    fontWeight: 'bold', // Bold text
    color: '#fff', // White text color
  },

  // Menu Option Styles
  optionBox: {
    backgroundColor: '#FFE6CC', // Light orange background
    paddingVertical: 25, // Vertical padding inside the box
    paddingHorizontal: 40, // Horizontal padding inside the box
    borderRadius: 10, // Rounded corners
    marginBottom: 55, // Adds space between menu options
    width: '50%', // Takes up 50% of the parent width
    alignItems: 'center', // Centers content horizontally
    top: 35, // Positions the box 35 units from the top
  },
  optionText: {
    fontSize: 18, // Medium font size
    fontWeight: 'bold', // Bold text
    color: '#000', // Black text color
  },

  // Footer Styles
  footer: {
    position: 'absolute', // Fixes the footer at the bottom
    bottom: 20, // Positions the footer 20 units from the bottom
    fontSize: 12, // Small font size
    color: 'gray', // Gray text color
  },

  // ======================
  // QR Code Page Styles
  // ======================
  qrContainer: {
    flex: 1, // Takes up the entire screen
    alignItems: 'center', // Centers content horizontally
    justifyContent: 'center', // Centers content vertically
    backgroundColor: '#fff', // White background
  },
  qrTitle: {
    fontSize: 22, // Large font size
    fontWeight: 'bold', // Bold text
    color: '#000', // Black text color
  },
  qrBox: {
    width: 200, // Fixed width
    height: 200, // Fixed height
    borderWidth: 2, // Adds a border
    borderColor: '#000', // Black border color
    alignItems: 'center', // Centers content horizontally
    justifyContent: 'center', // Centers content vertically
    marginVertical: 10, // Adds vertical margin
  },
  cameraIcon: {
    width: 40, // Fixed width
    height: 40, // Fixed height
  },
  orText: {
    fontSize: 16, // Medium font size
    marginVertical: 10, // Adds vertical margin
  },
  dropdownContainer: {
    width: '80%', // Takes up 80% of the parent width
    borderWidth: 1, // Adds a border
    borderColor: '#ccc', // Light gray border color
    marginVertical: 10, // Adds vertical margin
  },
  picker: {
    width: '100%', // Takes up the full width of the container
    height: 50, // Fixed height
    fontSize: 16, // Medium font size
    textAlign: 'center', // Centers text horizontally
    color: '#000', // Black text color
  },
  input: {
    width: '80%', // Takes up 80% of the parent width
    height: 50, // Fixed height
    borderWidth: 1, // Adds a border
    borderColor: '#ccc', // Light gray border color
    padding: 10, // Adds padding inside the input
    marginVertical: 10, // Adds vertical margin
  },
  buttonContainer: {
    flexDirection: 'row', // Arranges buttons in a row
    marginTop: 20, // Adds top margin
    bottom: -30, // Positions the container 30 units from the bottom
    justifyContent: 'space-between', // Adds space between buttons
    gap: 40, // Adds a fixed gap between buttons
  },
  backButton: {
    width: '23%', // Takes up 23% of the parent width
    backgroundColor: '#ccc', // Light gray background
    padding: 10, // Adds padding
    alignItems: 'center', // Centers content horizontally
    justifyContent: 'center', // Centers content vertically
  },
  enterButton: {
    width: '25%', // Takes up 25% of the parent width
    backgroundColor: '#f4c542', // Yellow background
    padding: 10, // Adds padding
    alignItems: 'center', // Centers content horizontally
    justifyContent: 'center', // Centers content vertically
  },
  buttonText: {
    textAlign: 'center', // Centers text horizontally
    fontWeight: 'bold', // Bold text
  },

  // ======================
  // Modal Styles
  // ======================
  modalContainer: {
    flex: 1, // Takes up the entire screen
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent black background
  },
  modalContent: {
    backgroundColor: '#eee', // Light gray background
    width: '80%', // Takes up 80% of the parent width
    padding: 20, // Adds padding
    borderRadius: 10, // Rounded corners
  },
  modalHeader: {
    backgroundColor: 'orange', // Orange background
    padding: 10, // Adds padding
    textAlign: 'center', // Centers text horizontally
    fontWeight: 'bold', // Bold text
    fontSize: 18, // Medium font size
  },
  modalMessage: {
    marginTop: 10, // Adds top margin
    fontSize: 14, // Small font size
    textAlign: 'center', // Centers text horizontally
  },
  modalButtons: {
    flexDirection: 'row', // Arranges buttons in a row
    justifyContent: 'space-around', // Adds space around buttons
    marginTop: 20, // Adds top margin
  },
  cancelButton: {
    borderWidth: 1, // Adds a border
    padding: 10, // Adds padding
    width: '40%', // Takes up 40% of the parent width
    alignItems: 'center', // Centers content horizontally
  },
  startButton: {
    backgroundColor: 'orange', // Orange background
    padding: 10, // Adds padding
    width: '40%', // Takes up 40% of the parent width
    alignItems: 'center', // Centers content horizontally
  },
  startButtonText: {
    color: 'white', // White text color
    fontWeight: 'bold', // Bold text
  },
  closeButton: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // ======================
  // Permission Styles
  // ======================
  containerPermission: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF', // iOS blue color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});