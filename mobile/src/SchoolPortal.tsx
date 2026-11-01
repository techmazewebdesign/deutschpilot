import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { User } from "firebase/auth";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { letterPrintHtml } from "./SchoolLetter";
import { enableSchoolPush, disableSchoolPush } from "./SchoolPush";
import { checkedSchoolSnapshot, mergeSchoolPage, type SchoolSection } from "./SchoolPagination";
import { teacherAbsenceRows } from "./SchoolAbsence";
import { lessons } from "./content";
import { SchoolChat } from "./SchoolChat";
import { useTheme, type Colors } from "./theme";
import {
  isSchoolAccessDenial,
  loadSchool,
  schoolCommand,
  uploadSchoolDocument,
  fetchSchoolDocument,
  type SchoolAction,
  type SchoolSnapshot,
  type SchoolDocument,
} from "./SchoolClient";
import type { Attendance, SchoolRole } from "../../lib/school/contract";
const lessonTitle = (id: string) =>
  lessons.find((lesson) => lesson.id === id)?.title ||
  (id.startsWith("web:")
    ? "Web-Lektion"
    : id.startsWith("room-task:")
      ? "Lernraum-Aufgabe"
      : "Lerneinheit");
const date = () => new Date().toLocaleDateString("sv-SE");
const roleName: Record<SchoolRole, string> = {
  owner: "Schulleitung",
  office: "Schulbüro",
  teacher: "Lehrkraft",
  student: "Schüler:in",
};
const statusName: Record<Attendance["status"], string> = {
  present: "Anwesend",
  late: "Verspätet",
  absent: "Abwesend",
  excused: "Entschuldigt",
};
const categoryName: Record<SchoolDocument["category"], string> = {
  general: "Allgemein",
  medical: "Ärztlicher Nachweis",
  jobcenter: "Jobcenter",
  signed_letter: "Unterschriebenes Schreiben",
};
type Section =
  "overview" | "classes" | "absences" | "documents" | "letters" | "inbox" | "team" | "chat";
export function SchoolPortal({ user, openAuth }: { user: User | null; openAuth: () => void }) {
  const { C } = useTheme();
  const s = useMemo(() => styles(C), [C]);
  const [snapshot, setSnapshot] = useState<SchoolSnapshot | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [values, setValues] = useState<Record<string, string>>({});
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [invite, setInvite] = useState("");
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;
  const generation = useRef(0);
  const lock = useRef(false);
  const clearSchoolAccess = () => {
    setSnapshot(null);
    setValues({});
    setSelectedStudents([]);
    setSelectedTeachers([]);
    setSelectedClass("");
    setInvite("");
  };
  const field = (key: string, label: string, multiline = false) => (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={values[key] || ""}
        onChangeText={(v) => setValues((old) => ({ ...old, [key]: v }))}
        style={[s.input, multiline && { minHeight: 110, textAlignVertical: "top" }]}
        placeholderTextColor={C.muted}
        multiline={multiline}
        autoCapitalize="none"
      />
    </View>
  );
  const button = (label: string, onPress: () => void, quiet = false, disabled = false) => (
    <Pressable
      accessibilityRole="button"
      disabled={busy || disabled}
      onPress={onPress}
      style={[s.button, quiet && s.quiet, (busy || disabled) && { opacity: 0.45 }]}
    >
      <Text style={[s.buttonText, quiet && { color: C.gold }]}>{label}</Text>
    </Pressable>
  );
  const card = (title: string, children: ReactNode) => (
    <View key={title} style={s.card}>
      <Text style={s.heading}>{title}</Text>
      {children}
    </View>
  );
  const copy = (text: string) => <Text style={s.copy}>{text}</Text>;
  const refresh = useCallback(async () => {
    if (!user) return;
    const current = generation.current;
    setLoading(true);
    setError("");
    try {
      const data = await loadSchool(user.uid);
      if (current === generation.current) setSnapshot(data);
    } catch (e) {
      if (isSchoolAccessDenial(e)) clearSchoolAccess();
      if (current === generation.current) {
        setSnapshot(null);
        setError(e instanceof Error ? e.message : "Schule konnte nicht geladen werden.");
      }
    } finally {
      if (current === generation.current) setLoading(false);
    }
  }, [user?.uid]);
  useEffect(() => {
    generation.current++;
    setSnapshot(null);
    setValues({});
    setInvite("");
    setSelectedStudents([]);
    setSelectedTeachers([]);
    setSelectedClass("");
    setError("");
    void refresh();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => {
      generation.current++;
      subscription.remove();
    };
  }, [refresh]);
  const run = async (action: SchoolAction) => {
    if (!user || lock.current) return;
    lock.current = true;
    const current = generation.current;
    setBusy(true);
    setError("");
    try {
      const result = await schoolCommand(user.uid, action);
      if (current !== generation.current) return;
      setSnapshot(checkedSchoolSnapshot(result, user.uid));
      setInvite(result.inviteCode || "");
      if (
        ["letter.send", "absence.report", "document.request", "invite.create"].includes(
          action.action
        )
      ) {
        setValues({});
        setSelectedStudents([]);
      }
    } catch (e) {
      if (isSchoolAccessDenial(e)) clearSchoolAccess();
      if (current === generation.current)
        setError(e instanceof Error ? e.message : "Nicht gespeichert. Bitte neu laden.");
    } finally {
      lock.current = false;
      if (current === generation.current) setBusy(false);
    }
  };
  const loadMore = async (sectionName: SchoolSection) => {
    if (!user || !snapshot || lock.current) return;
    const before = snapshot.pageCursors?.[sectionName];
    if (!before) {
      setError("Die nächste Seite ist nicht verfügbar. Bitte neu laden.");
      return;
    }
    const current = generation.current;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await schoolCommand(user.uid, {
        action: "section.page",
        section: sectionName,
        before,
      });
      if (current !== generation.current) return;
      const fresh = checkedSchoolSnapshot(result, user.uid);
      const visible = snapshotRef.current;
      if (!visible) return;
      if (fresh.version !== visible.version) {
        if (fresh.version > visible.version) setSnapshot(fresh);
        setError(
          "Die Schuldaten wurden geändert. Bitte aktualisieren und ältere Einträge erneut öffnen."
        );
        return;
      }
      setSnapshot(mergeSchoolPage(visible, result, sectionName, user.uid));
    } catch (e) {
      if (isSchoolAccessDenial(e)) clearSchoolAccess();
      if (current === generation.current)
        setError(e instanceof Error ? e.message : "Weitere Einträge konnten nicht geladen werden.");
    } finally {
      lock.current = false;
      if (current === generation.current) setBusy(false);
    }
  };
  const upload = async (
    category: SchoolDocument["category"],
    links: { absenceId?: string; letterId?: string; requestId?: string } = {}
  ) => {
    if (!user || lock.current) return;
    const selection = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/jpeg", "image/png"],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (selection.canceled) return;
    const asset = selection.assets[0];
    const current = generation.current;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      await uploadSchoolDocument(user.uid, asset, {
        title: values.documentTitle?.trim() || categoryName[category],
        category,
        ...links,
      });
      if (current === generation.current) {
        await refresh();
        Alert.alert(
          "Datei empfangen",
          "Der Nachweis wird erst nach der Sicherheitsprüfung freigegeben."
        );
      }
    } catch (e) {
      if (isSchoolAccessDenial(e)) clearSchoolAccess();
      if (current === generation.current)
        setError(e instanceof Error ? e.message : "Upload nicht bestätigt.");
    } finally {
      await FileSystem.deleteAsync(asset.uri, { idempotent: true }).catch(() => undefined);
      lock.current = false;
      if (current === generation.current) setBusy(false);
    }
  };
  const download = (document: SchoolDocument) =>
    Alert.alert(
      "Private Datei öffnen?",
      "Die Datei wird vorübergehend auf diesem Gerät geöffnet. Teile sie nur mit berechtigten Personen. Exportierte Kopien liegen außerhalb des Schulportals.",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Öffnen",
          onPress: async () => {
            if (!user || lock.current) return;
            lock.current = true;
            setBusy(true);
            const current = generation.current;
            let uri: string | null = null;
            try {
              const blob = await fetchSchoolDocument(user.uid, document.id);
              const data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result).split(",")[1]);
                reader.onerror = () => reject(new Error("Datei konnte nicht geöffnet werden."));
                reader.readAsDataURL(blob);
              });
              if (current !== generation.current) return;
              uri = `${FileSystem.cacheDirectory}school-${document.id}.${document.mime === "application/pdf" ? "pdf" : document.mime === "image/png" ? "png" : "jpg"}`;
              await FileSystem.writeAsStringAsync(uri, data, {
                encoding: FileSystem.EncodingType.Base64,
              });
              if (!(await Sharing.isAvailableAsync()))
                throw new Error("Dateivorschau ist auf diesem Gerät nicht verfügbar.");
              await Sharing.shareAsync(uri, {
                mimeType: document.mime,
                dialogTitle: "Private Schuldatei",
              });
            } catch (e) {
              if (isSchoolAccessDenial(e)) clearSchoolAccess();
              if (current === generation.current)
                setError(e instanceof Error ? e.message : "Datei nicht verfügbar.");
            } finally {
              if (uri)
                await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => undefined);
              lock.current = false;
              if (current === generation.current) setBusy(false);
            }
          },
        },
      ]
    );
  const printLetter = async (letter: SchoolSnapshot["letters"][number]) => {
    if (!snapshot || lock.current) return;
    lock.current = true;
    setBusy(true);
    let uri: string | undefined;
    try {
      const result = await Print.printToFileAsync({ html: letterPrintHtml(letter, snapshot) });
      uri = result.uri;
      if (!(await Sharing.isAvailableAsync()))
        throw new Error("Dateiexport ist auf diesem Gerät nicht verfügbar.");
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        UTI: "com.adobe.pdf",
        dialogTitle: "Schreiben ausdrucken / unterschreiben",
      });
    } catch (e) {
      if (isSchoolAccessDenial(e)) clearSchoolAccess();
      setError(e instanceof Error ? e.message : "Druckkopie konnte nicht erstellt werden.");
    } finally {
      if (uri) await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => undefined);
      lock.current = false;
      setBusy(false);
    }
  };
  if (!user)
    return (
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.kicker}>DEINE SCHULE</Text>
        <Text style={s.title}>Alles für deinen Schultag.</Text>
        {copy(
          "Klassen, Anwesenheit, Nachweise und Schulpost an einem Ort. Melde dich mit deinem eingeladenen Schulkonto an."
        )}
        {button("Mit Schulkonto anmelden", openAuth)}
        {copy("Die Lernbereiche bleiben auch ohne Schulkonto offline verfügbar.")}
      </ScrollView>
    );
  const actor = snapshot?.actor;
  const manager = actor?.role === "owner" || actor?.role === "office";
  const student = actor?.role === "student";
  const teacher = actor?.role === "teacher";
  const memberName = (id: string) =>
    snapshot?.members.find((m) => m.id === id)?.name ||
    (id === actor?.id ? actor.name : "Schulmitglied");
  const toggle = (list: string[], set: (next: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const choices = (
    items: { id: string; label: string }[],
    selected: string[],
    select: (id: string) => void
  ) => (
    <View style={s.choices}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: selected.includes(item.id) }}
          disabled={busy}
          onPress={() => select(item.id)}
          style={[
            s.choice,
            selected.includes(item.id) && { borderColor: C.gold, backgroundColor: C.panel2 },
          ]}
        >
          <Text style={s.copy}>
            {selected.includes(item.id) ? "☑ " : "☐ "}
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
  const tabs: { id: Section; label: string }[] = [
    { id: "overview", label: "Übersicht" },
    { id: "classes", label: "Klassen" },
    { id: "chat", label: "Klassenchat" },
    { id: "absences", label: "Abwesenheit" },
    { id: "documents", label: "Dokumente" },
    { id: "letters", label: "Schulpost" },
    {
      id: "inbox",
      label: `Hinweise ${snapshot?.notifications.filter((n) => !n.readAt).length || ""}`,
    },
    ...(manager ? [{ id: "team" as const, label: "Team & Klassen" }] : []),
  ];
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={() => void refresh()} tintColor={C.gold} />
      }
      contentContainerStyle={s.container}
    >
      <Text style={s.kicker}>SCHULPORTAL · {actor ? roleName[actor.role] : "ANMELDUNG"}</Text>
      <Text style={s.title}>{snapshot?.settings.name || "Deine Schule"}</Text>
      {loading && <ActivityIndicator color={C.gold} />}
      {busy && (
        <Text accessibilityLiveRegion="polite" style={s.copy}>
          Sichere Übertragung …
        </Text>
      )}
      {!!error && (
        <View style={s.card}>
          <Text accessibilityRole="alert" style={{ color: C.red, lineHeight: 23 }}>
            {error}
          </Text>
          {button("Neu laden / Status prüfen", () => void refresh(), true)}
        </View>
      )}
      {!snapshot &&
        !loading &&
        card(
          "Einladung zur Schule",
          <>
            {copy(
              "Dein Konto muss von der Schule freigeschaltet werden. Gib den persönlich erhaltenen Einladungscode ein. Fehler bei der Verbindung sind keine Bestätigung deiner Mitgliedschaft."
            )}
            {field("inviteCode", "Einladungscode")}
            {button(
              "Einladung annehmen",
              () => void run({ action: "invite.accept", code: values.inviteCode?.trim() || "" }),
              false,
              !values.inviteCode?.trim()
            )}
          </>
        )}
      {snapshot && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {tabs.map((t) => (
              <Pressable
                key={t.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: section === t.id }}
                onPress={() => setSection(t.id)}
                style={[s.choice, section === t.id && { borderColor: C.gold }]}
              >
                <Text style={{ color: section === t.id ? C.gold : C.muted, fontWeight: "700" }}>
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          {section === "overview" && (
            <>
              {card(
                `Hallo, ${actor!.name}`,
                <>
                  {copy(
                    `${snapshot.classes.length} Klassen · ${snapshot.notifications.filter((n) => !n.readAt).length} ungelesene Hinweise`
                  )}
                  {copy(
                    "Ziehe zum Aktualisieren nach unten. Schulaktionen benötigen eine bestätigte Internetverbindung. Vertrauliche Schulunterlagen werden nicht offline gespeichert."
                  )}
                  {copy(
                    `Verantwortlich: ${snapshot.settings.operator || "Von der Schule noch einzutragen"}\nDatenschutz: ${snapshot.settings.privacyContact || "Von der Schule noch einzutragen"}`
                  )}
                </>
              )}
              {card(
                "Lernfortschritt",
                snapshot.progress.length
                  ? snapshot.progress.map((p) => (
                      <Text key={p.id} style={s.copy}>
                        {memberName(p.studentId)} · {lessonTitle(p.lessonId)} ·{" "}
                        {p.completed ? "Abgeschlossen" : "In Arbeit"}
                        {p.score > 0 ? ` · ${p.score}%` : ""}
                      </Text>
                    ))
                  : copy(
                      "Noch kein synchronisierter Lernfortschritt. Kontogebundene Abschlüsse werden bei Verbindung synchronisiert."
                    )
              )}
              {copy(
                "Benachrichtigungen erscheinen im Schulpostfach. Push kann im Bereich Hinweise aktiviert werden, wenn die Schule den Dienst eingerichtet hat. Unterschriftskopien und Empfangsbestätigungen ersetzen keine qualifizierte elektronische Signatur."
              )}
            </>
          )}
          {section === "classes" && (
            <>
              {snapshot.classes.length === 0 && copy("Noch keine zugewiesenen Klassen.")}
              {snapshot.classes.map((c) =>
                card(
                  c.name,
                  <View key={c.id} style={{ gap: 10 }}>
                    {copy(c.schedule || "Stundenplan noch nicht hinterlegt")}
                    {copy(
                      `Lehrkräfte: ${c.teacherIds.map(memberName).join(", ") || "Noch nicht zugewiesen"}`
                    )}
                    {(manager || teacher) && (
                      <>
                        {field(`date-${c.id}`, `Datum (JJJJ-MM-TT), leer = heute ${date()}`)}
                        {c.studentIds.map((id) => (
                          <View key={id} style={s.row}>
                            <Text style={s.heading}>{memberName(id)}</Text>
                            {copy(
                              snapshot.attendance
                                .filter(
                                  (a) =>
                                    a.classId === c.id &&
                                    a.studentId === id &&
                                    a.date === (values[`date-${c.id}`] || date())
                                )
                                .map((a) => statusName[a.status])
                                .join(", ") || "Noch nicht erfasst"
                            )}
                            {choices(
                              Object.entries(statusName).map(([id, label]) => ({ id, label })),
                              snapshot.attendance
                                .filter(
                                  (a) =>
                                    a.classId === c.id &&
                                    a.studentId === id &&
                                    a.date === (values[`date-${c.id}`] || date())
                                )
                                .map((a) => a.status),
                              (status) =>
                                void run({
                                  action: "attendance.set",
                                  classId: c.id,
                                  studentId: id,
                                  date: values[`date-${c.id}`] || date(),
                                  status: status as Attendance["status"],
                                })
                            )}
                          </View>
                        ))}
                      </>
                    )}
                    {student &&
                      snapshot.attendance
                        .filter((a) => a.classId === c.id)
                        .map((a) => (
                          <Text key={a.id} style={s.copy}>
                            {a.date} · {statusName[a.status]}
                          </Text>
                        ))}
                  </View>
                )
              )}
            </>
          )}
          {section === "absences" && (
            <>
              {teacher &&
                teacherAbsenceRows(snapshot).map((summary) => (
                  <View key={summary.id} style={s.card}>
                    <Text style={s.heading}>{memberName(summary.studentId)}</Text>
                    {copy(
                      `${summary.from} bis ${summary.to} · ${{ pending: "Geplant / Prüfung offen", approved: "Genehmigt", rejected: "Abgelehnt" }[summary.status]}`
                    )}
                    {copy(
                      "Für die Unterrichtsplanung. Private Gründe und Nachweise sind ausschließlich im berechtigten Schulbüro sichtbar."
                    )}
                  </View>
                ))}
              {student &&
                card(
                  "Abwesenheit melden",
                  <>
                    {field("from", "Von (JJJJ-MM-TT)")}
                    {field("to", "Bis (JJJJ-MM-TT)")}
                    {choices(
                      [
                        { id: "illness", label: "Krankheit" },
                        { id: "personal", label: "Persönlich" },
                        { id: "other", label: "Sonstiges" },
                      ],
                      [values.reason || "illness"],
                      (reason) => setValues((v) => ({ ...v, reason }))
                    )}
                    {copy(
                      "Keine Diagnose eingeben. Ein ärztlicher Nachweis ist nur bei freigeschalteter, rechtlich geklärter Verarbeitung möglich."
                    )}
                    {button(
                      "Abwesenheit verbindlich melden",
                      () =>
                        void run({
                          action: "absence.report",
                          from: values.from || "",
                          to: values.to || "",
                          reason: (values.reason || "illness") as "illness" | "personal" | "other",
                        }),
                      false,
                      !values.from || !values.to
                    )}
                  </>
                )}
              {snapshot.absences.length === 0 &&
                (!teacher || !snapshot.absenceSummaries?.length) &&
                copy("Keine Abwesenheitsmeldungen vorhanden.")}
              {snapshot.absences.map((a) => (
                <View key={a.id} style={s.card}>
                  <Text style={s.heading}>
                    {memberName(a.studentId)} · {a.from} bis {a.to}
                  </Text>
                  {copy(
                    `Status: ${{ pending: "Offen", approved: "Genehmigt", rejected: "Abgelehnt" }[a.status]}`
                  )}
                  {student &&
                    a.studentId === actor?.id &&
                    snapshot.capabilities.sensitiveUploads &&
                    button(
                      "Ärztlichen Nachweis hochladen",
                      () => void upload("medical", { absenceId: a.id }),
                      true
                    )}
                  {manager && a.status === "pending" && (
                    <>
                      {button(
                        "Genehmigen",
                        () =>
                          void run({
                            action: "absence.review",
                            absenceId: a.id,
                            status: "approved",
                          })
                      )}
                      {button(
                        "Ablehnen",
                        () =>
                          void run({
                            action: "absence.review",
                            absenceId: a.id,
                            status: "rejected",
                          }),
                        true
                      )}
                    </>
                  )}
                </View>
              ))}
            </>
          )}
          {section === "documents" && (
            <>
              {student &&
                card(
                  "Private Unterlagen",
                  <>
                    {field("documentTitle", "Titel des Dokuments")}
                    {copy(
                      "PDF, JPEG oder PNG, maximal 10 MB. Keine zusätzlichen Diagnosen oder nicht angeforderten Unterlagen hochladen."
                    )}
                    {button("Allgemeines Dokument auswählen", () => void upload("general"))}
                    {snapshot.capabilities.sensitiveUploads &&
                      button("Jobcenter-Unterlage auswählen", () => void upload("jobcenter"), true)}
                    {!snapshot.capabilities.sensitiveUploads &&
                      copy("Sensible Uploads sind von der Schule noch nicht freigeschaltet.")}
                  </>
                )}
              {snapshot.documentRequests.map((r) => (
                <View key={r.id} style={s.card}>
                  <Text style={s.heading}>{r.title}</Text>
                  {copy(
                    `${memberName(r.studentId)} · Frist ${r.dueDate} · ${r.fulfilledBy ? "Eingegangen" : "Offen"}`
                  )}
                  {student &&
                    !r.fulfilledBy &&
                    button(
                      "Angeforderten Nachweis auswählen",
                      () => void upload(r.category, { requestId: r.id }),
                      true,
                      r.category !== "general" && !snapshot.capabilities.sensitiveUploads
                    )}
                </View>
              ))}
              {snapshot.documents.map((d) => (
                <View key={d.id} style={s.card}>
                  <Text style={s.heading}>{d.title}</Text>
                  {copy(
                    `${memberName(d.studentId)} · ${categoryName[d.category]} · ${d.scanStatus === "clean" ? "Freigegeben" : d.scanStatus === "rejected" ? "Abgelehnt" : "Sicherheitsprüfung offen"}`
                  )}
                  {copy(`Automatische Löschfrist: ${d.expiresAt.slice(0, 10)}`)}
                  {button(
                    "Private Datei öffnen",
                    () => download(d),
                    true,
                    d.scanStatus !== "clean"
                  )}
                </View>
              ))}
              {manager &&
                card(
                  "Dokument anfordern",
                  <>
                    {choices(
                      snapshot.members
                        .filter((m) => m.role === "student" && m.active)
                        .map((m) => ({ id: m.id, label: m.name })),
                      selectedStudents,
                      (id) => setSelectedStudents([id])
                    )}
                    {field("requestTitle", "Angeforderte Unterlage")}
                    {field("requestDue", "Frist (JJJJ-MM-TT)")}
                    {choices(
                      Object.entries(categoryName).map(([id, label]) => ({ id, label })),
                      [values.category || "general"],
                      (category) => setValues((v) => ({ ...v, category }))
                    )}
                    {button(
                      "Anforderung senden",
                      () =>
                        void run({
                          action: "document.request",
                          studentId: selectedStudents[0],
                          title: values.requestTitle || "",
                          category: (values.category || "general") as SchoolDocument["category"],
                          dueDate: values.requestDue || "",
                        }),
                      false,
                      selectedStudents.length !== 1 || !values.requestTitle || !values.requestDue
                    )}
                  </>
                )}
              {snapshot.documents.length === 0 &&
                copy("Keine für dein Konto sichtbaren Dokumente.")}
            </>
          )}
          {section === "letters" && (
            <>
              {snapshot.letters.map((letter) => (
                <View key={letter.id} style={s.card}>
                  <Text style={s.heading}>{letter.title}</Text>
                  {copy(letter.body)}
                  {copy(`Frist: ${letter.dueDate}`)}
                  {student &&
                    button(
                      "Schreiben als PDF drucken / speichern",
                      () =>
                        Alert.alert(
                          "Private Druckkopie erstellen?",
                          "Eine PDF-Kopie wird vorübergehend auf dem Gerät erstellt. Exportierte Kopien liegen außerhalb des Schulportals.",
                          [
                            { text: "Abbrechen", style: "cancel" },
                            { text: "PDF erstellen", onPress: () => void printLetter(letter) },
                          ]
                        ),
                      true
                    )}
                  {student ? (
                    <>
                      {copy(
                        letter.acknowledgements[actor!.id]
                          ? `Bestätigt: ${letter.acknowledgements[actor!.id].slice(0, 10)}`
                          : "Empfang noch nicht bestätigt"
                      )}
                      {!letter.readBy[actor!.id] &&
                        button(
                          "Als gelesen markieren",
                          () => void run({ action: "letter.read", letterId: letter.id }),
                          true
                        )}
                      {!letter.acknowledgements[actor!.id] &&
                        button("Empfang bestätigen", () =>
                          Alert.alert(
                            "Empfang bestätigen?",
                            "Du bestätigst den Erhalt dieses Schreibens. Dies ist keine qualifizierte elektronische Unterschrift.",
                            [
                              { text: "Abbrechen", style: "cancel" },
                              {
                                text: "Bestätigen",
                                onPress: () =>
                                  void run({ action: "letter.acknowledge", letterId: letter.id }),
                              },
                            ]
                          )
                        )}
                      {copy(
                        letter.returnedDocuments[actor!.id]
                          ? "Unterschriebene Kopie eingegangen."
                          : "Wenn eine Unterschrift erforderlich ist: Schreiben herunterladen bzw. von der Schule erhalten, unterschreiben und hier als Kopie zurückgeben."
                      )}
                      {button(
                        "Unterschriebene Kopie zurückgeben",
                        () => void upload("signed_letter", { letterId: letter.id }),
                        true
                      )}
                    </>
                  ) : (
                    letter.studentIds.map((id) => (
                      <Text key={id} style={s.copy}>
                        {memberName(id)} ·{" "}
                        {letter.acknowledgements[id]
                          ? "Bestätigt"
                          : letter.readBy[id]
                            ? "Gelesen"
                            : "Ungelesen"}{" "}
                        · {letter.returnedDocuments[id] ? "Kopie zurückgegeben" : "Keine Rückgabe"}
                      </Text>
                    ))
                  )}
                </View>
              ))}
              {snapshot.letters.length === 0 && copy("Keine Schulpost vorhanden.")}
              {manager &&
                card(
                  "Schreiben senden",
                  <>
                    {choices(
                      snapshot.members
                        .filter((m) => m.role === "student" && m.active)
                        .map((m) => ({ id: m.id, label: m.name })),
                      selectedStudents,
                      (id) => toggle(selectedStudents, setSelectedStudents, id)
                    )}
                    {field("letterTitle", "Betreff")}
                    {field("letterBody", "Schreiben", true)}
                    {field("letterDue", "Frist (JJJJ-MM-TT)")}
                    {button(
                      "An ausgewählte Personen senden",
                      () =>
                        void run({
                          action: "letter.send",
                          studentIds: selectedStudents,
                          title: values.letterTitle || "",
                          body: values.letterBody || "",
                          dueDate: values.letterDue || "",
                        }),
                      false,
                      !selectedStudents.length ||
                        !values.letterTitle ||
                        !values.letterBody ||
                        !values.letterDue
                    )}
                  </>
                )}
            </>
          )}
          {section === "chat" && (
            <SchoolChat
              snapshot={snapshot}
              onSnapshot={(value) => (value ? setSnapshot(value) : clearSchoolAccess())}
            />
          )}
          {section === "inbox" && (
            <>
              {copy(
                snapshot.capabilities.push
                  ? "Push optional aktivieren. Mitteilungen enthalten ausschließlich einen allgemeinen Hinweis auf das Schulpostfach."
                  : "Hinweise werden im App-Postfach zugestellt. Push ist auf dem Schulserver noch nicht eingerichtet."
              )}
              {button(
                "Push-Mitteilungen aktivieren",
                () => {
                  void enableSchoolPush(user.uid)
                    .then(() =>
                      Alert.alert(
                        "Gerät registriert",
                        "Dieses Gerät ist für allgemeine Schulhinweise registriert. Die tatsächliche Zustellung hängt von Gerätefreigabe und Push-Dienst ab."
                      )
                    )
                    .catch((e) => setError(e.message));
                },
                true,
                !snapshot.capabilities.push
              )}
              {button(
                "Push für dieses Gerät abmelden",
                () => {
                  void disableSchoolPush(user.uid)
                    .then(() =>
                      Alert.alert(
                        "Abgemeldet",
                        "Die Push-Registrierung dieses Kontos wurde entfernt."
                      )
                    )
                    .catch((e) => setError(e.message));
                },
                true
              )}
              {snapshot.notifications.length === 0 && copy("Keine Hinweise vorhanden.")}
              {snapshot.notifications.map((n) => (
                <View key={n.id} style={s.card}>
                  <Text style={s.heading}>
                    {n.readAt ? "" : "● "}
                    {n.title}
                  </Text>
                  {copy(n.body)}
                  {copy(new Date(n.createdAt).toLocaleString("de-DE"))}
                  {!n.readAt &&
                    button(
                      "Als gelesen markieren",
                      () => void run({ action: "notification.read", notificationId: n.id }),
                      true
                    )}
                </View>
              ))}
            </>
          )}
          {section === "team" && manager && (
            <>
              {actor?.role === "owner" &&
                card(
                  "Mitglied einladen",
                  <>
                    {field("memberName", "Name")}
                    {field("memberEmail", "E-Mail-Adresse")}
                    {choices(
                      Object.entries(roleName).map(([id, label]) => ({ id, label })),
                      [values.memberRole || "student"],
                      (memberRole) => setValues((v) => ({ ...v, memberRole }))
                    )}
                    {button(
                      "Einladung erstellen",
                      () =>
                        void run({
                          action: "invite.create",
                          name: values.memberName || "",
                          email: values.memberEmail || "",
                          role: (values.memberRole || "student") as SchoolRole,
                        }),
                      false,
                      !values.memberName || !values.memberEmail
                    )}
                    {!!invite && (
                      <Text selectable style={s.copy}>
                        Persönlicher Einladungscode: {invite}\nSicher direkt an die eingeladene
                        Person weitergeben. Es wurde keine E-Mail versendet.
                      </Text>
                    )}
                  </>
                )}
              {snapshot.members.map((m) => (
                <View key={m.id} style={s.card}>
                  <Text style={s.heading}>{m.name}</Text>
                  {copy(`${roleName[m.role]} · ${m.active ? "Aktiv" : "Gesperrt"}\n${m.email}`)}
                  {actor?.role === "owner" &&
                    m.id !== actor.id &&
                    button(
                      m.active ? "Zugang sperren" : "Zugang aktivieren",
                      () =>
                        Alert.alert("Zugang ändern?", m.name, [
                          { text: "Abbrechen", style: "cancel" },
                          {
                            text: "Bestätigen",
                            onPress: () =>
                              void run({
                                action: "member.update",
                                memberId: m.id,
                                role: m.role,
                                active: !m.active,
                              }),
                          },
                        ]),
                      true
                    )}
                </View>
              ))}
              {card(
                "Klasse einrichten / bearbeiten",
                <>
                  {choices(
                    snapshot.classes.map((c) => ({ id: c.id, label: c.name })),
                    selectedClass ? [selectedClass] : [],
                    (id) => {
                      const c = snapshot.classes.find((c) => c.id === id)!;
                      setSelectedClass(id);
                      setValues((v) => ({ ...v, className: c.name, schedule: c.schedule }));
                      setSelectedStudents(c.studentIds);
                      setSelectedTeachers(c.teacherIds);
                    }
                  )}
                  {button(
                    "Neue Klasse",
                    () => {
                      setSelectedClass("");
                      setValues({});
                      setSelectedStudents([]);
                      setSelectedTeachers([]);
                    },
                    true
                  )}
                  {field("className", "Klassenname")}
                  {field("schedule", "Stundenplan / Raum", true)}
                  {copy("Lehrkräfte")}
                  {choices(
                    snapshot.members
                      .filter((m) => m.role === "teacher" && m.active)
                      .map((m) => ({ id: m.id, label: m.name })),
                    selectedTeachers,
                    (id) => toggle(selectedTeachers, setSelectedTeachers, id)
                  )}
                  {copy("Schüler:innen")}
                  {choices(
                    snapshot.members
                      .filter((m) => m.role === "student" && m.active)
                      .map((m) => ({ id: m.id, label: m.name })),
                    selectedStudents,
                    (id) => toggle(selectedStudents, setSelectedStudents, id)
                  )}
                  {button(
                    "Klasse speichern",
                    () =>
                      void run({
                        action: "class.save",
                        ...(selectedClass ? { id: selectedClass } : {}),
                        name: values.className || "",
                        schedule: values.schedule || "",
                        teacherIds: selectedTeachers,
                        studentIds: selectedStudents,
                      }),
                    false,
                    !values.className
                  )}
                </>
              )}
              {copy(
                "Betreiberangaben, Rechtsgrundlagen und Aufbewahrungsregeln werden vor Aktivierung im Web durch die Schulleitung eingerichtet."
              )}
            </>
          )}
          {(
            (section === "overview"
              ? ["progress"]
              : section === "classes"
                ? ["classes", "members", "attendance"]
                : section === "absences"
                  ? ["absences", "absenceSummaries", "members"]
                  : section === "documents"
                    ? ["documents", "documentRequests", "members"]
                    : section === "letters"
                      ? ["letters", "members"]
                      : section === "inbox"
                        ? ["notifications"]
                        : section === "team"
                          ? ["members", "classes"]
                          : []) as SchoolSection[]
          )
            .filter((key) => snapshot.pagination?.[key])
            .map((key) => (
              <View key={`more-${key}`} style={s.card}>
                {button(
                  `Weitere ${{ members: "Schulmitglieder", classes: "Klassen", attendance: "Anwesenheiten", absences: "Abwesenheiten", absenceSummaries: "Abwesenheitsübersichten", documents: "Dokumente", documentRequests: "Dokumentanforderungen", letters: "Schreiben", notifications: "Hinweise", progress: "Lernfortschritte" }[key]} laden`,
                  () => void loadMore(key),
                  true
                )}
              </View>
            ))}
        </>
      )}
    </ScrollView>
  );
}
const styles = (C: Colors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      paddingBottom: 40,
      gap: 16,
      maxWidth: 780,
      width: "100%",
      alignSelf: "center",
    },
    kicker: { color: C.gold, fontSize: 11, letterSpacing: 1.2, fontWeight: "900" },
    title: { color: C.white, fontSize: 30, fontWeight: "900" },
    card: {
      backgroundColor: C.panel,
      borderWidth: 1,
      borderColor: C.line,
      borderRadius: 20,
      padding: 18,
      gap: 12,
    },
    heading: { color: C.white, fontSize: 18, fontWeight: "800" },
    copy: { color: C.muted, fontSize: 15, lineHeight: 23 },
    field: { gap: 7 },
    label: { color: C.white, fontSize: 13, fontWeight: "700" },
    input: {
      borderWidth: 1,
      borderColor: C.line,
      color: C.white,
      backgroundColor: C.navy,
      minHeight: 50,
      borderRadius: 12,
      padding: 12,
    },
    button: {
      minHeight: 48,
      backgroundColor: C.gold,
      borderRadius: 12,
      padding: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: { color: C.ink, fontWeight: "800", fontSize: 14, textAlign: "center" },
    quiet: { backgroundColor: C.panel2, borderWidth: 1, borderColor: C.line },
    choices: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    choice: {
      minHeight: 46,
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: C.line,
      justifyContent: "center",
    },
    row: { borderTopColor: C.line, borderTopWidth: 1, paddingTop: 14, gap: 8 },
  });
