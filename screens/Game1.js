import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Alert } from "react-native";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; 

export default function Game1({ route }) {
    const { userId } = route.params;
    const [showGame, setShowGame] = useState(false);
    const [numbers, setNumbers] = useState([]);
    const [currentNumber, setCurrentNumber] = useState(null);
    const [userInput, setUserInput] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [score, setScore] = useState(0); 

    
    useEffect(() => {
        const fetchScore = async () => {
            if (!userId) return; 
            try {
                const userDoc = await getDoc(doc(firestore, "users", userId));
                if (userDoc.exists()) {
                    setScore(userDoc.data().score || 0); // postavlja score iz firestore-a
                } else {
                    console.error("User not found in Firestore.");
                }
            } catch (error) {
                console.error("Error fetching score: ", error);
                Alert.alert("Error", "There was an issue fetching your score. Please try again later.");
            }
        };
        fetchScore();
    }, [userId]); // Re-fetch score ako se userId promjeni

    
    const updateScore = async (change) => {
        const newScore = score + change;
        setScore(newScore); 
        try {
            await updateDoc(doc(firestore, "users", userId), { score: newScore });
        } catch (error) {
            console.error("Error updating score: ", error);
            Alert.alert("Error", "Problem s učitavanjem score-a.");
        }
    };

    
    const generateRandomNumbers = () => {
        setResultMessage(""); 
        const generatedNumbers = [];
        let lastNumber = null;
        for (let i = 0; i < 10; i++) {
            let randomNumber;
            do {
                randomNumber = Math.floor(Math.random() * 10);
            } while (randomNumber === lastNumber); // brojevi se ne ponavljaju jedan za drugim
            generatedNumbers.push(randomNumber);
            lastNumber = randomNumber;
        }
        setNumbers(generatedNumbers);
        setShowGame(true);

        let index = 0;
        const intervalId = setInterval(() => {
            if (index < generatedNumbers.length) {
                setCurrentNumber(generatedNumbers[index]);
                index++;
            } else {
                clearInterval(intervalId);
                setShowGame(false);
                setShowInput(true);
            }
        }, 800); // 800ms interval 

        return () => clearInterval(intervalId);
    };

    
    const handleSubmit = async () => {
        const sum = numbers.reduce((a, b) => a + b, 0);
        const isCorrect = parseInt(userInput) === sum;

        try {
            if (isCorrect) {
                await updateScore(5); 
                setResultMessage("Čestitamo! Uneseni broj je točan.");
            } else {
                await updateScore(-7); 
                setResultMessage("Pogrešno! Uneseni broj nije točan.");
            }
        } catch (error) {
            console.error("Error updating score: ", error);
        } finally {
            setShowInput(false);
            setNumbers([]);
            setCurrentNumber(null);
            setUserInput(""); 
        }
    };

    return (
        <View style={styles.container}>
            {/* Display current score */}
            <Text style={styles.score}>Trenutni bodovi: {score}</Text>

            {!showGame && !showInput && (
                <TouchableOpacity style={styles.dugme} onPress={generateRandomNumbers}>
                    <Text style={styles.text}>POKRENI!</Text>
                </TouchableOpacity>
            )}

            {showGame && (
                <View style={styles.numbersContainer}>
                    <Text style={styles.number}>{currentNumber}</Text>
                </View>
            )}

            {showInput && (
                <View>
                    <TextInput
                        style={styles.input}
                        value={userInput}
                        onChangeText={setUserInput}
                        placeholder="Unesi zbroj"
                        keyboardType="numeric"
                    />
                    <Button title="Submit" onPress={handleSubmit} />
                </View>
            )}

            {resultMessage !== "" && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>{resultMessage}</Text>
                </View>
            )}
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
    numbersContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    number: {
        fontSize: 40,
        fontWeight: "bold",
        margin: 5,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: 200,
        textAlign: "center",
    },
    resultContainer: {
        marginTop: 20,
    },
    resultText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    dugme: {
        height: 100,
        width: 100,
        borderColor: "blue",
        borderWidth: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        textAlign: "center",
        fontWeight: "bold",
    },
    score: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
});
