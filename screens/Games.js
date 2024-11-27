import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Image, Modal, TouchableOpacity, FlatList, TextInput, Button } from "react-native";
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from "../firebaseConfig";

export default function Games() {
  const [gameTitle, setGameTitle] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [gameImageUrl, setGameImageUrl] = useState("");
  const [games, setGames] = useState([]); //prazan niz
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        console.log(firestore);
        const gamesCollection = collection(firestore, "games");
        const gamesSnapshot = await getDocs(gamesCollection);
        const gamesList = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // map je funkcija koja se izvrsava nad listom, prolazi kroz listu i podatke u pogodan oblik pretvara
        setGames(gamesList);
      } catch (error) {
        console.error("error loading games: ", error);
      }
    };

    fetchGames();
  }, []); //[] ceka bilo koju promjenu

  const handleAddGame = async () => {
    // koristi http pa je async
    if (gameTitle != "" && gameDescription != "" && gameImageUrl != "") {
      const newGame = {
        title: gameTitle,
        description: gameDescription,
        imageUrl: gameImageUrl
      };
      //...spread operator razbija listu ili rijecnik u komponente i dodaje neke elemente
      const docRef = await addDoc(collection(firestore, "games"), newGame);
      setGames([...games, { id: docRef.id, ...newGame }]);
      setGameTitle("");
      setGameDescription("");
      setGameImageUrl("");
      Alert.alert("Igrica je dodana u bazu podataka.");
    } else {
      Alert.alert("Morate unjeti sva polja.");
    }
  };

  const renderGameItem = ({ item }) => (
    <View>
      <Image source={{ uri: item.imageUrl }} />
      <View>
        <Text>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Igrice</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} >
        <Text>Dodaj novu igricu</Text>
      </TouchableOpacity>
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
      />
      <Modal visible={modalVisible} animationType='slide' transparent={true}>
        <View>
          <TextInput value={gameTitle} onChangeText={setGameTitle} placeholder="Naslov igrice" />
          <TextInput value={gameDescription} onChangeText={setGameDescription} placeholder="Opis igrice" />
          <TextInput value={gameImageUrl} onChangeText={setGameImageUrl} placeholder="URL slike igrice" />
          <Button title="Dodaj" onPress={handleAddGame} />
          <Button title="Zatvori" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
});
