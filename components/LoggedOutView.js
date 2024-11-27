import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function LoggedOutView() {
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useContext(AuthContext);

  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Login'); 
  };

  const handleRegister = () => {
    navigation.navigate('Register'); 
  };

  return (
    <View style={styles.container}>
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <Button title="Prijavi se" onPress={handleLogin} />

      <Text style={styles.separator}>ili</Text>

      <Button title="Registriraj se" onPress={handleRegister} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 10,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  separator: {
    marginVertical: 10,
    textAlign: "center",
  },
  link: {
    color: "blue",
    textAlign: "center",
    marginTop: 15,
  },
});
