import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import Firebase from "../../config/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const auth = Firebase.auth();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUserLogIn = async () => {
    try {
      if (email !== '' && password !== '') {
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setLoginError(error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <MaterialCommunityIcons
        style={{ marginBottom: 10 }}
        name="glass-mug-variant"
        size={64}
        color="black"
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleUserLogIn}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default LoginScreen;
