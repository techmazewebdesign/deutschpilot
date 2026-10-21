#!/usr/bin/env bash
set -euo pipefail
# This wrapper never prints signing environment values.
mobile_root="$(cd "$(dirname "$0")/.." && pwd)"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
if [[ -z "${JAVA_HOME:-}" && -d /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home ]]; then
  export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
fi
build_mode="${1:-signed}"
allow_unsigned=false
if [[ "$build_mode" == unsigned ]]; then
  allow_unsigned=true
elif [[ "$build_mode" != signed ]]; then
  printf 'Usage: %s [signed|unsigned]\n' "$0" >&2
  exit 2
fi
# arm64 is intentional for the bounded local candidate. Override explicitly if needed.
exec "$mobile_root/android/gradlew" -p "$mobile_root/android" :app:bundleRelease :app:assembleRelease \
  "-Pdeutschpilot.allowUnsignedCandidate=$allow_unsigned" "-PreactNativeArchitectures=${ANDROID_ABIS:-arm64-v8a}" \
  --max-workers=1 --no-daemon --console=plain \
  "-Dorg.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=512m" -Pkotlin.compiler.execution.strategy=in-process
