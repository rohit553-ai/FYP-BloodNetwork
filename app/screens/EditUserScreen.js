import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, Alert } from "react-native";
import colors from "../config/colors";
import districts from "../config/districts";

import PickerComponent from "../components/PickerComponent";
import AppButton from "../components/AppButton";
import baseUrl from "../config/baseUrl";
import { Popup } from "popup-ui";

function EditUserScreen(props) {
  const { detail } = props.route.params;
  const [firstName, setFirstName] = useState(detail.firstName);
  const [lastName, setLastName] = useState(detail.lastName);
  const [address, setAddress] = useState(detail.address);
  const [userDistrict, setUserDistrict] = useState(detail.userDistrict);

  const checkFirstName = (val) => {
    setFirstName(val);
  };
  const checkLastName = (val) => {
    setLastName(val);
  };
  const checkAddress = (val) => {
    setAddress(val);
  };

  const handleUpdate = () => {
    console.log(userDistrict, firstName, lastName, address);
    fetch(`${baseUrl.url}/api/users`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        address: address,
        userDistrict: userDistrict,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === "success") {
          Popup.show({
            type: "Success",
            title: "User updated",
            button: true,
            textBody: "Details of user have been updated successfully",
            buttontext: "Ok",
            callback: () => {
              Popup.hide();
              props.navigation.navigate("Profile");
            },
          });
        } else {
          Popup.show({
            type: "Danger",
            title: "User updated",
            button: true,
            textBody: "Details of user have been updated successfully",
            autoClose: true,
            buttontext: "Ok",
            callback: () => {
              Popup.hide();
            },
          });
        }
      })
      .catch((error) => {
        Alert.alert("Sorry, Something went wrong");
      });
  };
  return (
    <View style={styles.container}>
      <Text
        style={{
          alignSelf: "flex-start",
          fontWeight: "600",
          fontSize: 15,
          marginLeft: 20,
          color: colors.blood,
        }}
      >
        First Name
      </Text>
      <TextInput
        value={firstName}
        onChangeText={(value) => checkFirstName(value)}
        style={[styles.textInput, { borderWidth: 2 }]}
        placeholder="First Name"
        keyboardType="default"
        //maxLength={6}
      />

      <Text
        style={{
          alignSelf: "flex-start",
          fontWeight: "600",
          fontSize: 15,
          marginLeft: 20,
          color: colors.blood,
        }}
      >
        Last Name
      </Text>
      <TextInput
        value={lastName}
        onChangeText={(value) => checkLastName(value)}
        style={[styles.textInput, { borderWidth: 2 }]}
        placeholder="Last Name"
        keyboardType="default"
        //maxLength={6}
      />

      <Text
        style={{
          alignSelf: "flex-start",
          fontWeight: "600",
          fontSize: 15,
          marginLeft: 20,
          color: colors.blood,
        }}
      >
        Address
      </Text>
      <TextInput
        value={address}
        onChangeText={(value) => checkAddress(value)}
        style={[styles.textInput, { borderWidth: 2 }]}
        placeholder="Address"
        keyboardType="default"
        //maxLength={6}
      />
      <Text
        style={{
          alignSelf: "flex-start",
          fontWeight: "600",
          fontSize: 15,
          marginLeft: 20,
          color: colors.blood,
        }}
      >
        District
      </Text>

      <PickerComponent
        title={userDistrict}
        items={districts.districts}
        selectedItem={userDistrict}
        onSelectedItem={(item) => setUserDistrict(item.label)}
        style={{ height: 50, width: "90%", borderRadius: 5, margin: 15 }}
      />

      <AppButton
        title="Update details"
        onPress={() => handleUpdate()}
        style={{
          backgroundColor: colors.blood,
          borderRadius: 8,
          marginTop: 10,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  textInput: {
    height: 50,
    borderWidth: 2,
    margin: 10,
    width: "90%",
    borderRadius: 5,
    padding: 10,
    borderColor: colors.blood,
  },
});

export default EditUserScreen;
