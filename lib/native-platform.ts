import { Capacitor } from "@capacitor/core";

export type RuntimePlatform = "ios" | "android" | "web";

export function runtimePlatform(): RuntimePlatform {
  if (!Capacitor.isNativePlatform()) return "web";
  const platform = Capacitor.getPlatform();
  return platform === "ios" || platform === "android" ? platform : "web";
}

export function isNativeIOS(): boolean {
  return runtimePlatform() === "ios";
}
