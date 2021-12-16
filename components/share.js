import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TextInput } from "react-native";
import { ListItem } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import {
  query,
  where,
  collection,
  doc,
  getDocs,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

const ShareScreen = ({ route }) => {
  const navigation = useNavigation();
  const data = route.params;
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [newAmount, setNewAmount] = useState("");
  const [amounts, setAmounts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setIsLoading(true);

    const unsub = onSnapshot(doc(db, data.shareid, data.user.email), (doc) => {
      console.log("Current amount: ", doc.data().amount);
      setAmount(doc.data().amount);
    });

    const querySnapshot = getDocs(
      query(collection(db, data.shareid), where("user", "==", true))
    ).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const shareDetails = doc.data();
        users.push(shareDetails);
        amounts.push(shareDetails.amount);
      });
      //https://stackoverflow.com/questions/62358365/react-js-get-sum-of-numbers-in-array answered Jun 13 '20 at 10:24 Vivek Doshi
      let sum = users.reduce((a, v) => (a = a + v.amount), 0);
      console.log(sum);
      setTotal(parseInt(sum));
      setIsLoading(false);
    });
  }, []);

  const addMoney = () => {
    const docRef = doc(db, data.shareid, `${auth.currentUser?.email}`);
    updateDoc(docRef, {
      amount: amount + parseInt(newAmount),
    });

    navigation.push("Share", {
      user: data.user,
      sharename: data.sharename,
      shareid: data.shareid,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <Text style={{ alignSelf: "center", paddingTop: 300 }}>LOADING</Text>
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={{ fontSize: 30 }}>{data.sharename}</Text>
            <Text style={{ fontSize: 15 }}>
              Logged in as {data.user.username}
            </Text>
          </View>
          <View
            style={{
              marginTop: 40,
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>username</Text>
            <Text>amount paid</Text>
            <Text>status</Text>
          </View>
          <FlatList
            style={{ width: "90%", maxHeight: "65%" }}
            data={users}
            renderItem={({ item }) => (
              <ListItem bottomDivider>
                <ListItem.Content>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItem.Title>{item.username}</ListItem.Title>
                    <ListItem.Title style={{ fontWeight: "bold" }}>
                      {item.amount}
                    </ListItem.Title>
                    <ListItem.Title>
                      {item.amount - total / users.length}
                    </ListItem.Title>
                  </View>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={styles.share}>
            <TextInput
              placeholder="Amount to add"
              value={newAmount}
              keyboardType="numeric"
              onChangeText={(text) => setNewAmount(text)}
              style={styles.input}
            />
            <TouchableOpacity onPress={addMoney} style={styles.addbutton}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.push("Welcome");
            }}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Return</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ShareScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingTop: 30,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#0782F9",
    height: 55,
    width: 140,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  header: {
    position: "absolute",
    top: 10,
    fontSize: 30,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  signoutbutton: {
    backgroundColor: "#0782F9",
    height: 55,
    width: 140,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  input: {
    height: 55,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  share: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  addbutton: {
    backgroundColor: "#0782F9",
    height: 55,
    width: 140,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    maxHeight: 60,
    maxWidth: 80,
  },
});
