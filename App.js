import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // If using Expo

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

  return (
    <View style={styles.qrContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>PDI SYSTEM</Text>
      </View>

      <Text style={styles.qrTitle}>Scan QR Code</Text>
      <View style={styles.qrBox}>
        <TouchableOpacity onPress={() => Alert.alert('Camera permission required')}>
          <MaterialCommunityIcons name="camera" size={40} color="black" />
        </TouchableOpacity>
      </View>

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
            <Text>Chassis No: {carInfo.chassis}</Text>
            <Text>Colour: {carInfo.color}</Text>
            <Text>Engine No: {carInfo.engine}</Text>
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
  // Main Menu Styles
  containerMenu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingTop: 50, // Ensures content does not overlap with status bar
  },
  
  /* Header section positioned at the top */
  header: {
    width: '85%',
    backgroundColor: '#E75B26',
    paddingVertical: 15,
    alignItems: 'center',
    position: 'absolute', // Makes the header stick at the top
    top: 60, // Positions the header at the top
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  /* Menu option styling */
  optionBox: {
    backgroundColor: '#FFE6CC', // Background color of the menu options
    paddingVertical: 25, // Vertical padding inside the button
    paddingHorizontal: 40, // Horizontal padding inside the button
    borderRadius: 10, // Rounded corners for a smooth look
    marginBottom: 55, // Space between each menu box (Increase to add more space)
    width: '50%', // Width of the menu box
    alignItems: 'center', // Centers text inside the button
    top: 35,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  
  /* Footer styling */
  footer: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    color: 'gray',
  },

  // QR Code Page Styles
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  qrTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  qrBox: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  cameraIcon: {
    width: 40,
    height: 40,
  },
  orText: {
    fontSize: 16,
    marginVertical: 10,
  },
  dropdownContainer: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  picker: {
    width: '100%',
    height: 50, // Tinggikan picker untuk ruang lebih besar
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    bottom: -30, 
    justifyContent: 'space-between', // Jika mahu jarak maksimum antara butang
    gap: 40, // Jika mahu jarak tetap antara butang
  },
  backButton: {
    width: '23%',
    backgroundColor: '#ccc',
    padding: 10,
    alignItems: 'center', // Pusatkan teks secara mendatar
    justifyContent: 'center', // Pusatkan teks secara menegak
  },
  enterButton: {
    width: '25%',
    backgroundColor: '#f4c542',
    padding: 10,
    alignItems: 'center', // Pusatkan teks secara mendatar
    justifyContent: 'center', // Pusatkan teks secara menegak
  },
  buttonText: {
    textAlign: 'center', 
    fontWeight: 'bold', 
  },

  // Modal Styles
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#eee', width: '80%', padding: 20, borderRadius: 10 },
  modalHeader: { backgroundColor: 'orange', padding: 10, textAlign: 'center', fontWeight: 'bold', fontSize: 18 },
  modalMessage: { marginTop: 10, fontSize: 14, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  cancelButton: { borderWidth: 1, padding: 10, width: '40%', alignItems: 'center' },
  startButton: { backgroundColor: 'orange', padding: 10, width: '40%', alignItems: 'center' },
  startButtonText: { color: 'white', fontWeight: 'bold' },
});