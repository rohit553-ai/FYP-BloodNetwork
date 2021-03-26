import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Linking } from "react-native";
import Constants from "expo-constants";
import baseUrl from "../config/baseUrl";
import ActivityIndicator from "../components/ActivityIndicator";
import { Fontisto, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

function RequestHistory(props) {
  const [requestHistory, setRequestHistory] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      fetch(`${baseUrl.url}/api/bloodRequest/history`, { method: "GET" })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status === "success") {
            console.log(responseJson);
            setRequestHistory(responseJson.results);
            setLoading(false);
            //setLoading(false);
          } else {
            console.log(responseJson);
            alert(responseJson.status);
          }
        })
        .catch((error) => console.error(error));
    });
    return unsubscribe;
  }, [props.navigation]);

  if (loading === true) {
    return <ActivityIndicator />;
  } else {
    console.log("Details: ", requestHistory);
    return (
      <View style={styles.container}>
        <FlatList
          data={requestHistory}
          style={{ width: "100%" }}
          keyExtractor={(item) => item.requestId.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.detailCard}>
                <View
                  style={[
                    styles.textContainer,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.label}>Donation Type: </Text>
                    <Text style={styles.textData}>{item.donationType}</Text>
                  </View>
                  <Text style={styles.textData}>
                    Within {item.requirementDays}
                  </Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.label}>Required Blood: </Text>
                  <Text style={styles.textData}>{item.bloodType}</Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#f5f5f5",
                    height: 1,
                    width: "100%",
                  }}
                />

                <View style={styles.textContainer}>
                  <Fontisto
                    name="person"
                    size={20}
                    style={{ marginLeft: 10 }}
                  />
                  <Text style={styles.label}>Request From: </Text>
                  <Text style={styles.textData}>{item.receiverName}</Text>
                </View>

                <View style={styles.textContainer}>
                  {/* <Text style={styles.label}>Requester's Address: </Text> */}
                  <Entypo
                    name="location-pin"
                    size={20}
                    style={{ marginHorizontal: 10 }}
                    color={colors.blood}
                  />
                  <Text style={styles.textData}>{item.receiverAddress}</Text>
                </View>

                <View style={styles.textContainer}>
                  {/* <Text style={styles.label}>Requester's Contact: </Text> */}
                  <MaterialCommunityIcons
                    name="cellphone"
                    size={20}
                    style={{ marginHorizontal: 10 }}
                  />
                  <Text
                    style={styles.textData}
                    onPress={() => {
                      Linking.openURL(`tel:${item.receiverNumber}`);
                    }}
                  >
                    {item.receiverNumber}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#f5f5f5",
                    height: 1,
                    width: "100%",
                  }}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Decision: </Text>
                  <Text
                    style={[
                      styles.textData,
                      {
                        color:
                          item.requestStatus === "accepted" ? "green" : "red",
                      },
                    ]}
                  >
                    {item.requestStatus}
                  </Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.label}>Your Response: </Text>
                  <Text style={styles.textData}>{item.donorResponse}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
  },
  detailCard: {
    alignSelf: "center",
    width: "85%",
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "grey",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {
      height: 10,
      width: -10,
    },
  },
  textContainer: {
    flexDirection: "row",
    padding: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  textData: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default RequestHistory;
