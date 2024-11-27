import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

export default function Leaderboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(firestore, "users"));
            const userList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            userList.sort((a, b) => b.score - a.score); // Sortiraj po bodovima
            setUsers(userList);
        };
        fetchUsers();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.name}>{item.name || item.email}</Text>
                        <Text style={styles.score}>{item.score}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        paddingBottom: 5,
    },
    name: {
        fontSize: 18,
    },
    score: {
        fontSize: 18,
        fontWeight: "bold",
    },
});
