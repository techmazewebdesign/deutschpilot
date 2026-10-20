import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { checkedSchoolSnapshot } from "./SchoolPagination";
import * as Crypto from "expo-crypto";
import { useTheme } from "./theme";
import {
  schoolCommand,
  loadSchool,
  isSchoolAccessDenial,
  type SchoolSnapshot,
} from "./SchoolClient";
import type { SchoolChatMessage } from "../../lib/school/contract";
export function SchoolChat({
  snapshot,
  onSnapshot,
}: {
  snapshot: SchoolSnapshot;
  onSnapshot: (value: SchoolSnapshot | null) => void;
}) {
  const { C } = useTheme();
  const [classId, setClassId] = useState(snapshot.classes[0]?.id || "");
  const [draft, setDraft] = useState("");
  const [older, setOlder] = useState<SchoolChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [more, setMore] = useState(true);
  const lock = useRef(false);
  const uid = snapshot.actor.id;
  const pending = useRef({ body: "", id: "" });
  const styles = StyleSheet.create({
    copy: { color: C.muted, fontSize: 14, lineHeight: 22 },
    button: {
      padding: 12,
      minHeight: 48,
      borderWidth: 1,
      borderColor: C.line,
      borderRadius: 12,
      justifyContent: "center",
    },
    message: {
      padding: 14,
      borderRadius: 16,
      backgroundColor: C.panel,
      borderWidth: 1,
      borderColor: C.line,
      gap: 6,
    },
    input: {
      minHeight: 100,
      padding: 14,
      color: C.white,
      backgroundColor: C.panel2,
      borderRadius: 14,
      textAlignVertical: "top",
    },
  });
  useEffect(() => {
    setOlder([]);
    setDraft("");
    setMore(true);
    setError("");
  }, [classId, uid]);
  useEffect(() => {
    let active = true;
    const poll = async () => {
      if (lock.current || AppState.currentState !== "active") return;
      try {
        const value = await loadSchool(uid);
        if (active) {
          onSnapshot(value);
          setError("");
        }
      } catch (e) {
        if (active && isSchoolAccessDenial(e)) onSnapshot(null);
        if (active)
          setError(
            "Chat konnte nicht aktualisiert werden. Deine Nachricht ist noch nicht gesendet."
          );
      }
    };
    const timer = setInterval(() => void poll(), 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [uid]);
  const messages = useMemo(
    () =>
      !snapshot.classes.some((c) => c.id === classId)
        ? []
        : [
            ...new Map(
              [
                ...older.filter((m) => m.classId === classId),
                ...snapshot.chatMessages.filter((m) => m.classId === classId),
              ].map((m) => [m.id, m])
            ).values(),
          ].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [older, snapshot.chatMessages, snapshot.classes, classId]
  );
  const send = async (
    action: "chat.send" | "chat.read" | "chat.moderate" | "chat.history",
    messageId?: string
  ) => {
    if (lock.current || !classId) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      if (action === "chat.send" && (pending.current.body !== draft.trim() || !pending.current.id))
        pending.current = { body: draft.trim(), id: Crypto.randomUUID() };
      const result = await schoolCommand(
        uid,
        action === "chat.send"
          ? { action, classId, body: draft.trim(), clientMessageId: pending.current.id }
          : action === "chat.read"
            ? { action, classId }
            : action === "chat.moderate"
              ? { action, classId, messageId: messageId! }
              : { action, classId, before: messages[0]?.id }
      );
      onSnapshot(checkedSchoolSnapshot(result, uid));
      if (action === "chat.moderate")
        setOlder((old) =>
          old.map((m) =>
            m.id === messageId ? { ...m, body: "", deletedAt: new Date().toISOString() } : m
          )
        );
      if (action === "chat.send") {
        setDraft("");
        pending.current = { body: "", id: "" };
      }
      if (action === "chat.history") {
        const page = result.messages || [];
        setOlder((old) => [...page, ...old]);
        setMore(page.length === 100);
      }
    } catch (e) {
      if (isSchoolAccessDenial(e)) onSnapshot(null);
      setError(
        e instanceof Error ? e.message : "Aktion nicht bestätigt. Neu laden und Status prüfen."
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  return (
    <View style={{ gap: 14 }}>
      <Text style={styles.copy}>
        Klassenchat für Schüler:innen und alle zugewiesenen Lehrkräfte. Der Verlauf aktualisiert
        sich bei geöffneter App alle 15 Sekunden. Ärztliche Nachweise und persönliche Dokumente
        gehören in den privaten Dokumentbereich.
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {snapshot.classes.map((c) => {
          const read = snapshot.chatReads.find((r) => r.classId === c.id)?.readAt || "";
          const unread = snapshot.chatMessages.filter(
            (m) => m.classId === c.id && m.authorId !== uid && m.createdAt > read && !m.deletedAt
          ).length;
          return (
            <Pressable
              key={c.id}
              disabled={busy}
              accessibilityRole="tab"
              accessibilityState={{ selected: classId === c.id }}
              onPress={() => setClassId(c.id)}
              style={[styles.button, { borderColor: classId === c.id ? C.gold : C.line }]}
            >
              <Text style={{ color: C.gold, fontWeight: "800" }}>
                {c.name}
                {unread ? ` (${unread})` : ""}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {!classId && (
        <Text style={styles.copy}>
          Der Klassenchat wird nach deiner Klassenzuweisung verfügbar.
        </Text>
      )}
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: C.red }}>
          {error}
        </Text>
      )}
      {busy && <ActivityIndicator color={C.gold} />}
      {!!classId && (
        <>
          {more && (
            <Pressable
              disabled={busy}
              style={styles.button}
              onPress={() => void send("chat.history")}
            >
              <Text style={{ color: C.gold }}>Ältere Nachrichten laden</Text>
            </Pressable>
          )}
          {messages.length === 0 && (
            <Text style={styles.copy}>
              Noch keine Nachrichten. Starte den Austausch mit deiner Klasse.
            </Text>
          )}
          {messages.map((m) => (
            <View
              key={m.id}
              style={[styles.message, m.authorId === uid && { borderColor: C.gold }]}
            >
              <Text style={{ color: C.gold, fontWeight: "800" }}>
                {m.authorName} · {new Date(m.createdAt).toLocaleString("de-DE")}
              </Text>
              <Text
                selectable={!m.deletedAt}
                style={{ color: C.white, fontSize: 16, lineHeight: 24 }}
              >
                {m.deletedAt ? "Diese Nachricht wurde moderiert." : m.body}
              </Text>
              {snapshot.actor.role !== "student" && !m.deletedAt && (
                <Pressable
                  disabled={busy}
                  accessibilityRole="button"
                  style={styles.button}
                  onPress={() =>
                    Alert.alert(
                      "Nachricht moderieren?",
                      "Die Nachricht wird im Klassenchat ausgeblendet. Die Moderation wird protokolliert.",
                      [
                        { text: "Abbrechen", style: "cancel" },
                        {
                          text: "Ausblenden",
                          style: "destructive",
                          onPress: () => void send("chat.moderate", m.id),
                        },
                      ]
                    )
                  }
                >
                  <Text style={{ color: C.red }}>Moderieren</Text>
                </Pressable>
              )}
            </View>
          ))}
          <Pressable style={styles.button} disabled={busy} onPress={() => void send("chat.read")}>
            <Text style={{ color: C.gold }}>Klassenchat als gelesen markieren</Text>
          </Pressable>
          <TextInput
            accessibilityLabel="Nachricht an die Klasse"
            placeholder="Nachricht an deine Klasse …"
            placeholderTextColor={C.muted}
            multiline
            maxLength={2000}
            value={draft}
            onChangeText={setDraft}
            style={styles.input}
          />
          <Text style={styles.copy}>
            {draft.length}/2000 · Keine vertraulichen Unterlagen im Klassenchat.
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={busy || !draft.trim()}
            style={[
              styles.button,
              { backgroundColor: C.gold, opacity: busy || !draft.trim() ? 0.4 : 1 },
            ]}
            onPress={() => void send("chat.send")}
          >
            <Text style={{ color: C.ink, fontWeight: "900", textAlign: "center" }}>
              Nachricht senden
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
