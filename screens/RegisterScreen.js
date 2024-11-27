import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import LoginInput from '../components/ui/LoginInput'; 

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');


  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Lozinke se ne podudaraju');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Unesite ispravnu email adresu');
      return;
    }
   

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        dob,
        score
      });
      
      Alert.alert(
        'Success', 
        'Registracija uspjesna, molimo prijavite se.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Login');
            }
          }
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error(error.message);
      Alert.alert('Error', 'An error occurred during registration');
    }
  };

  return (
    <View style={styles.container}>
      <LoginInput
        placeholder="Ime"
        value={name}
        onChangeText={setName}
      />
      <LoginInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <LoginInput
        placeholder="Lozinka"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <LoginInput
        placeholder="Potvrda lozinke"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />
      <LoginInput
        placeholder="Datum rodjenja (YYYY-MM-DD)"
        value={dob}
        onChangeText={setDob}
      />
      <Button title="Registriraj se!" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default RegisterScreen;
