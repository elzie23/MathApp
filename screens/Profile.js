import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { AuthContext } from "../AuthContext";
import LoggedInView from "../components/LoggedInView"; 

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {/* Prikazivanje LoggedInView ako je korisnik prijavljen */}
      {user ? <LoggedInView /> : <Text style={styles.text}>Molimo vas da se prijavite.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});
