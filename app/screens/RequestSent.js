import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Linking,
} from "react-native";
import Constants from "expo-constants";
import baseUrl from "../config/baseUrl";
import ActivityIndicator from "../components/ActivityIndicator";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../config/colors";
import { Fontisto, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

function RequestSent(props) {
  const [requestSent, setRequestSent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReqSent = () => {
    fetch(`${baseUrl.url}/api/bloodRequest/sent`, { method: "GET" })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === "success") {
          setRequestSent(responseJson.results);
        } else {
          alert(responseJson.status);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      fetch(`${baseUrl.url}/api/bloodRequest/sent`, { method: "GET" })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.status === "success") {
            setRequestSent(responseJson.results);
            setLoading(false);
            //setLoading(false);
          } else {
            alert(responseJson.status);
          }
        })
        .catch((error) => console.error(error));
    });
    return unsubscribe;
  }, [props.navigation]);

  const handleDonated = async (requestId) => {
    //alert(requestId);
    fetch(`${baseUrl.url}/api/bloodRequest/mark_donated/${requestId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ decision: "marked donated" }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "success") {
          alert("request marked donated successfully");
          fetchReqSent();
        } else if (responseJson.status == "fail") {
          alert("something went wrong");
        } else {
          alert("Many things went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNotDonated = (requestId) => {
    fetch(`${baseUrl.url}/api/bloodRequest/not_donated/${requestId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == "fail") {
          alert("Something went wrong");
        } else if (responseJson.status == "success") {
          fetchReqSent();
          alert("Successful");
        } else if (responseJson.status == "error") {
          alert(responseJson.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading === true) {
    return <ActivityIndicator />;
  } else {
    return (
      <FlatList
        data={requestSent}
        keyExtractor={(item) => item.requestId.toString()}
        renderItem={({ item }) => {
          return (
            <View style={styles.container}>
              <View style={styles.detailCard}>
                <View style={styles.textContainer}>
                  <Fontisto
                    name="person"
                    size={20}
                    style={{ marginLeft: 10 }}
                  />
                  <Text style={styles.label}>Requested To: </Text>
                  <Text style={styles.textData}>
                    {item.firstName} {item.lastName}
                  </Text>
                </View>

                <View style={styles.textContainer}>
                  <Entypo
                    name="location-pin"
                    size={20}
                    style={{ marginLeft: 10 }}
                    color={colors.blood}
                  />
                  <Text style={[styles.textData, { marginLeft: 10 }]}>
                    {item.address}, {item.donorDistrict}
                  </Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.label}>Requested Date</Text>
                  <Text style={[styles.textData, { marginLeft: 10 }]}>
                    {moment(item.requestedDate).format("YYYY-MM-DD")}
                  </Text>
                </View>

                <View
                  style={{
                    height: 1,
                    backgroundColor: "#f2f2f2",
                    width: "100%",
                  }}
                />

                <View style={styles.textContainer}>
                  <Text style={styles.label}>Donor's Contact: </Text>
                  <Text
                    style={styles.textData}
                    onPress={() => {
                      Linking.openURL(`tel:${item.donorContact}`);
                    }}
                  >
                    <MaterialCommunityIcons name="cellphone" size={20} />
                    {item.showContact ? item.donorContact : "Contact is hidden"}
                  </Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.label}>Requested Blood: </Text>
                  <Text style={styles.textData}>{item.bloodType}</Text>
                </View>

                <View
                  style={[styles.textContainer, { flexDirection: "column" }]}
                >
                  <Text style={styles.label}>Your Message: </Text>
                  <Text style={[styles.textData, { marginLeft: 10 }]}>
                    {item.donationDetails}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#f2f2f2",
                    height: 1,
                    width: "100%",
                  }}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Request Status: </Text>
                  <Text style={styles.textData}>{item.requestStatus}</Text>
                </View>

                <View
                  style={[styles.textContainer, { flexDirection: "column" }]}
                >
                  <Text style={styles.label}>Donor's response: </Text>
                  <Text style={[styles.textData, { marginLeft: 10 }]}>
                    {item.donorResponse}
                  </Text>
                </View>

                {item.requestStatus === "accepted" ? (
                  <View>
                    <Text style={{ marginLeft: 10, color: "grey" }}>
                      <MaterialCommunityIcons
                        name="information-outline"
                        size={18}
                        color="grey"
                      />
                      Your request is accepted. Mark request as donated if donor
                      has donated the blood
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                      }}
                    >
                      <TouchableOpacity
                        style={[
                          styles.donatedButton,
                          { backgroundColor: colors.success, marginRight: 20 },
                        ]}
                        onPress={() => {
                          handleDonated(item.requestId);
                        }}
                      >
                        <Text style={styles.texts}>Donated</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.donatedButton,
                          { backgroundColor: colors.blood },
                        ]}
                        onPress={() => handleNotDonated(item.requestId)}
                      >
                        <Text style={styles.texts}>Not Donated</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          );
        }}
      />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
  },
  textContainer: {
    flexDirection: "row",
    padding: 5,
  },
  detailCard: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 5,
    shadowColor: "grey",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {
      height: 10,
      width: -10,
    },
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  textData: {
    fontSize: 16,
    fontWeight: "500",
    // flexGrow: 1,
  },

  donatedButton: {
    width: width / 2.8,
    backgroundColor: "white",
    height: 40,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  texts: { fontSize: 16, fontWeight: "400", color: "#fff" },
});

export default RequestSent;
