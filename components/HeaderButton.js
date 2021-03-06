import React from "react"
import { Platform } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const CustomHeaderButton = props => {
    return (
        <HeaderButton
            {...props}
            color={Platform.OS === "android" ? "white" : Colors.primary}
            iconSize={23}
            IconComponent={ Ionicons }
        />
    )
}

export default CustomHeaderButton