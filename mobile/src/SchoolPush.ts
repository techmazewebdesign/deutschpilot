import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { loadSchool, schoolCommand } from "./SchoolClient";
import { getFirebaseRuntime } from "./firebase";
const key = "deutschpilot:school-push:v1";
type Registration = { uid: string; token: string; pendingRemoval?: boolean };
async function stored(): Promise<Registration | null> {
  try {
    return JSON.parse((await AsyncStorage.getItem(key)) || "null");
  } catch {
    return null;
  }
}
export async function enableSchoolPush(uid: string) {
  if (Platform.OS === "web") throw new Error("Push wird hier nur in der nativen App eingerichtet.");
  const snapshot = await loadSchool(uid);
  if (!snapshot.capabilities.push)
    throw new Error(
      "Die Schule hat den Push-Dienst noch nicht vollständig eingerichtet. Das App-Postfach bleibt verfügbar."
    );
  if (Platform.OS === "android" && !Constants.expoConfig?.android?.googleServicesFile)
    throw new Error("Android-Push ist in dieser App-Version noch nicht eingerichtet. Das App-Postfach bleibt verfügbar.");
  const projectId =
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID ||
    Constants.easConfig?.projectId ||
    Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId || !/^[a-f0-9-]{36}$/i.test(projectId))
    throw new Error("Die native Push-Projektkennung fehlt.");
  if (Platform.OS === "android")
    await Notifications.setNotificationChannelAsync("school", {
      name: "Schule",
      importance: Notifications.AndroidImportance.DEFAULT,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
    });
  const current = await Notifications.getPermissionsAsync();
  const permission = current.granted ? current : await Notifications.requestPermissionsAsync();
  if (!permission.granted)
    throw new Error("Keine Benachrichtigungsfreigabe. Hinweise bleiben im Schulpostfach sichtbar.");
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  await schoolCommand(uid, { action: "device.register", token });
  await AsyncStorage.setItem(key, JSON.stringify({ uid, token }));
}
export async function disableSchoolPush(uid: string) {
  const registration = await stored();
  if (!registration || registration.uid !== uid) return;
  await schoolCommand(uid, { action: "device.unregister", token: registration.token });
  await AsyncStorage.removeItem(key);
}
export async function prepareSchoolSignOut() {
  const { auth } = await getFirebaseRuntime();
  if (!auth.currentUser) return false;
  try {
    await disableSchoolPush(auth.currentUser.uid);
    return false;
  } catch {
    const registration = await stored();
    if (registration?.uid === auth.currentUser.uid)
      await AsyncStorage.setItem(key, JSON.stringify({ ...registration, pendingRemoval: true }));
    return true;
  }
}
export async function forgetDeletedSchoolPush() {
  await AsyncStorage.removeItem(key);
}

export async function retrySchoolPushCleanup(uid: string) {
  const registration = await stored();
  if (registration?.uid === uid && registration.pendingRemoval) await disableSchoolPush(uid);
}
