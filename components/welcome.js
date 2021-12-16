import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { ListItem } from "react-native-elements";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [currentuser, setCurrentuser] = useState({});
  const [sharename, setSharename] = useState("");
  const [shareid, setShareid] = useState("");
  const [shares, setShares] = useState([]);
  const [rip, setRip] = useState("");

  useEffect(() => {
    const querySnapshot = getDocs(
      collection(db, `${auth.currentUser?.email}_shares`)
    ).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const shareDetails = doc.data();
        shares.push(shareDetails);
      });
    });
    const docSnap = getDoc(doc(db, "users", auth.currentUser?.email)).then(
      (docSnap) => {
        if (docSnap.exists()) {
          setCurrentuser(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    );
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.push("Home");
      })
      .catch((error) => alert(error.message));
  };

  const createShare = () => {
    try {
      const docRef = setDoc(
        doc(db, `${auth.currentUser?.email}_shares`, sharename),
        {
          sharename: sharename,
          shareid: `${auth.currentUser?.email}_${sharename}`,
        }
      );
      console.log("New share", sharename, "created succesfully!");
    } catch (e) {
      console.error("Error creating share: ", e);
    }
    try {
      const docRef = setDoc(
        doc(
          db,
          `${auth.currentUser?.email}_${sharename}`,
          `${auth.currentUser?.email}_${sharename}`
        ),
        { sharename: sharename }
      );
    } catch (e) {
      console.error("Error: ", e);
    }
    try {
      const docRef = setDoc(
        doc(
          db,
          `${auth.currentUser?.email}_${sharename}`,
          auth.currentUser?.email
        ),
        { username: currentuser.username, amount: 0, user: true }
      );
    } catch (e) {
      console.error("Error: ", e);
    }
    navigation.push("Welcome");
  };

  const joinShare = () => {
    const docSnap = getDoc(doc(db, shareid, shareid)).then((docSnap) => {
      if (docSnap.exists()) {
        const sharename = docSnap.data().sharename;
        try {
          const docRef = setDoc(doc(db, shareid, auth.currentUser?.email), {
            username: currentuser.username,
            amount: 0,
            user: true,
          });
          console.log(shareid, "joined succesfully!");
        } catch (e) {
          console.error("Error joining share: ", e);
        }
        try {
          const docRef = setDoc(
            doc(db, `${auth.currentUser?.email}_shares`, sharename),
            {
              sharename: sharename,
              shareid: shareid,
            }
          );
        } catch (e) {
          console.error("Error: ", e);
        }
      } else {
        alert("Could not find share!");
        console.log("Share was not found!");
      }
      navigation.push("Welcome");
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 30 }}>Hello {currentuser.username}!</Text>
        <TouchableOpacity
          onPress={handleSignOut}
          style={[styles.signoutButton]}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.share}>
        <TextInput
          placeholder="Give a name for your new Share!"
          value={sharename}
          onChangeText={(text) => setSharename(text)}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={createShare}
          style={[styles.button, { maxHeight: 60, maxWidth: 80 }]}
        >
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.share}>
        <TextInput
          placeholder="         Enter ID to join a Share         "
          value={shareid}
          onChangeText={(text) => setShareid(text)}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={joinShare}
          style={[styles.button, { maxHeight: 60, maxWidth: 80 }]}
        >
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 30, marginTop: 10 }}>Your Shares:</Text>
      <FlatList
        style={{ paddingTop: 10, width: "90%", height: "52%" }}
        data={shares}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            onPress={() =>
              navigation.push("Share", {
                user: currentuser,
                sharename: item.sharename,
                shareid: item.shareid,
              })
            }
          >
            <ListItem.Content>
              <ListItem.Title>{item.sharename}</ListItem.Title>
              <ListItem.Subtitle>ID: {item.shareid}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0782F9",
    height: 55,
    width: 140,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
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
  share: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  input: {
    height: 55,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  header: {
    fontSize: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  signoutButton: {
    backgroundColor: "red",
    height: 40,
    width: 90,
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  deletebutton: {
    backgroundColor: "red",
    height: 55,
    width: 140,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
});
