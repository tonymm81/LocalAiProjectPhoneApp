import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PromptWindow from "../components/PromptWindow";
import Analytics from "../components/Analytics";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer theme={{ dark: true, colors: { primary: "#4fb0ff", background: "#0f1115", card: "#121417", text: "#e6eef6", border: "#1b1f24", notification: "#4fb0ff" }, fonts: { regular: { fontFamily: "System", fontWeight: "400" }, medium: { fontFamily: "System", fontWeight: "500" }, bold: { fontFamily: "System", fontWeight: "700" }, heavy: { fontFamily: "System", fontWeight: "900" } } }} >
            <Stack.Navigator screenOptions={{
                headerStyle: { backgroundColor: "#121417" },
                headerTintColor: "#e6eef6",
                headerTitleStyle: { fontWeight: "bold" }
            }} >
                <Stack.Screen name="Prompt" component={PromptWindow} options={{ title: "Local AI" }} />
                <Stack.Screen name="Analytics" component={Analytics} options={{ title: "Analytics" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}