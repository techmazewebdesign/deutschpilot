"use client";

import { useEffect, useState } from "react";
import { runtimePlatform, type RuntimePlatform } from "@/lib/native-platform";

export function useNativePlatform(): RuntimePlatform | null {
  const [platform, setPlatform] = useState<RuntimePlatform | null>(null);

  useEffect(() => {
    setPlatform(runtimePlatform());
  }, []);

  return platform;
}
