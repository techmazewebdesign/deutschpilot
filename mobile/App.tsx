import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  AppState,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import type { User } from "firebase/auth";
import { lessons, vocabulary } from "./src/content";
import { deleteAccountPermanently, login, logout, register, resetPassword, resendVerification, watchUser } from "./src/auth";
import { applyStudyAction, clearProgress, emptyProgress, loadProgress, saveProgress, type StudyAction } from "./src/progress";
import type { Lesson, Level, LocalProgress } from "./src/models";
import { ThemeProvider, useTheme, type Colors } from "./src/theme";
import { LoadingScreen } from "./src/LoadingScreen";
import { loginWithGoogle } from "./src/social";
import { getFirebaseRuntime } from "./src/firebase";
import { validEmail } from './src/validation';
import { TodayScreen, LearnScreen, WordsScreen, PracticeScreen, speakGerman, NativeLessonModal } from './src/LearningScreens';
function useStyles() { const theme = useTheme(); return { ...theme, s: useMemo(() => createStyles(theme.C), [theme.C]) }; }

type Tab = "today" | "learn" | "words" | "practice" | "account";
const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];
const tabs: Array<{ id: Tab; icon: string; label: string }> = [
  { id: "today", icon: "⌂", label: "HEUTE" },
  { id: "learn", icon: "▤", label: "LERNEN" },
  { id: "words", icon: "Aa", label: "WÖRTER" },
  { id: "practice", icon: "✓", label: "ÜBEN" },
  { id: "account", icon: "◉", label: "KONTO" },
];

function AccountScreen({ user, progress, openAuth, openDelete, onLogout, onClear }: { user: User | null; progress: LocalProgress; openAuth: () => void; openDelete: () => void; onLogout: () => void; onClear: () => void }) {
  const { s, C, mode: colorMode, toggle } = useStyles();
  return <ScrollView contentContainerStyle={s.scroll}><Text style={s.kicker}>DEIN KONTO</Text><Text style={s.pageTitle}>{user ? `Hallo, ${user.displayName || user.email?.split("@")[0] || "Lernende:r"}.` : "Lerne sofort. Verbinde später."}</Text>
    <View style={[s.accountCard, { backgroundColor: C.panel, borderColor: C.line, borderWidth: 1 }]}>{user ? <><Text style={s.accountMail}>{user.email}</Text><Text style={s.accountState}>{user.emailVerified ? "E-MAIL BESTÄTIGT" : "E-MAIL NOCH NICHT BESTÄTIGT"}</Text>{!user.emailVerified && <Pressable accessibilityRole="button" onPress={openAuth} style={s.textButton}><Text style={s.textButtonLabel}>E-Mail bestätigen / erneut anmelden</Text></Pressable>}<Pressable accessibilityRole="button" onPress={onLogout} style={s.lightButton}><Text style={s.lightButtonText}>Abmelden</Text></Pressable></> : <><Text style={s.accountLead}>Dein lokaler Lernfortschritt funktioniert ohne Konto. Melde dich an, um dieselbe DeutschPilot-Identität wie im Web zu verwenden.</Text><Pressable accessibilityRole="button" onPress={openAuth} style={s.goldButton}><Text style={s.goldButtonText}>Anmelden oder registrieren</Text></Pressable></>}</View>
    <View style={s.settingsCard}><View style={s.settingRow}><View><Text style={s.settingTitle}>Lokaler Fortschritt</Text><Text style={s.muted}>{progress.completed.length} Lektionen · {progress.xp} XP</Text></View><Pressable accessibilityRole="button" hitSlop={12} style={{ minHeight: 44, justifyContent: "center" }} onPress={onClear}><Text style={s.dangerLink}>Zurücksetzen</Text></Pressable></View>{user && <View style={s.settingRow}><View style={s.settingCopy}><Text style={s.settingTitle}>Cloud-Konto löschen</Text><Text style={s.muted}>Entfernt Anmeldung und verbundene persönliche Daten dauerhaft.</Text></View><Pressable accessibilityRole="button" hitSlop={12} style={{ minHeight: 44, justifyContent: "center" }} onPress={openDelete}><Text style={s.dangerLink}>Löschen</Text></Pressable></View>}</View>
    <View style={s.promise}><Text style={s.promiseTitle}>Datenschutz im Kern.</Text><Text style={s.promiseCopy}>Deine Anmeldung verwendet dasselbe Konto wie die Website. Offline-Lernfortschritt wird auf diesem Gerät gespeichert und noch nicht mit der Website synchronisiert.</Text><View style={{ flexDirection: "row", gap: 20, marginTop: 12 }}><Pressable accessibilityRole="link" onPress={() => Linking.openURL("https://www.deutschpilot.de/de/privacy")}><Text style={s.textButtonLabel}>Datenschutz</Text></Pressable><Pressable accessibilityRole="link" onPress={() => Linking.openURL("https://www.deutschpilot.de/de/terms")}><Text style={s.textButtonLabel}>AGB</Text></Pressable></View><View style={{ marginTop: 16, gap: 10 }}><Pressable accessibilityRole="link" onPress={() => Linking.openURL("https://www.deutschpilot.de/de/impressum")} style={s.textButton}><Text style={s.textButtonLabel}>Impressum</Text></Pressable><Pressable accessibilityRole="link" onPress={() => Linking.openURL("mailto:info@deutschpilot.de")} style={s.textButton}><Text style={s.textButtonLabel}>Hilfe · info@deutschpilot.de</Text></Pressable></View></View>
  </ScrollView>;
}

function AuthModal({ visible, close }: { visible: boolean; close: () => void }) {
  const { s, C } = useStyles();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [working, setWorking] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [confirming, setConfirming] = useState(false); const [cooldown, setCooldown] = useState(0);
  useEffect(() => { if (!cooldown) return; const timer = setTimeout(() => setCooldown(c => c - 1), 1000); return () => clearTimeout(timer); }, [cooldown]);
  useEffect(() => {
    if (!visible) { setPassword(""); return; }
    let active = true;
    setError(""); setMessage(""); setMode("login");
    getFirebaseRuntime().then(({ auth }) => {
      if (!active) return;
      setConfirming(Boolean(auth.currentUser && !auth.currentUser.emailVerified));
      if (auth.currentUser?.email) setEmail(auth.currentUser.email);
    }).catch(showError);
    return () => { active = false; };
  }, [visible]);
  const showError = (error: unknown) => setError(error instanceof Error ? error.message : "Bitte versuche es erneut.");
  const submit = async () => {
    setWorking(true); setError(""); setMessage("");
    try {
      if (mode === "register") {
        const result = await register(email, password, name);
        setConfirming(true); setPassword("");
        if (result.verificationSent) { setMessage("Bestätigungs-E-Mail gesendet. Öffne den Link in deinem Postfach (auch Spam prüfen). Danach kannst du dich auf der Anmeldeseite anmelden."); setCooldown(60); }
        else setError("Dein Konto wurde erstellt, aber die Bestätigungs-E-Mail konnte nicht gesendet werden. Bitte unten erneut senden.");
      } else {
        const user = await login(email, password);
        if (!user.emailVerified) { setConfirming(true); setMessage("Bitte bestätige zuerst deine E-Mail-Adresse. Du kannst den Link unten erneut anfordern."); }
        else { setPassword(""); close(); }
      }
    } catch (error) { showError(error); } finally { setWorking(false); }
  };
  const resend = async () => { setWorking(true); setError(""); try { const verified = await resendVerification(); setMessage(verified ? "E-Mail bestätigt. Du kannst dich jetzt anmelden." : "Bestätigungs-E-Mail erneut gesendet."); setCooldown(60); } catch (error) { showError(error); } finally { setWorking(false); } };
  const backToLogin = async () => { setWorking(true); try { await logout(); setConfirming(false); setMode("login"); setMessage("Bitte melde dich nach der E-Mail-Bestätigung an."); setError(""); } catch (error) { showError(error); } finally { setWorking(false); } };
  const reset = async () => {
    if (!validEmail(email)) { setError("Trage zuerst eine gültige E-Mail-Adresse ein."); return; }
    setWorking(true); setError(""); try { await resetPassword(email); setMessage("Wenn ein Konto existiert, erhältst du einen Link zum Zurücksetzen. Prüfe auch den Spam-Ordner."); } catch (error) { showError(error); } finally { setWorking(false); }
  };
  const google = async () => { setWorking(true); setError(""); try { const user = await loginWithGoogle(); if (user) close(); } catch (error) { showError(error); } finally { setWorking(false); } };
  const valid = validEmail(email) && password.length >= (mode === "register" ? 8 : 1) && (mode === "login" || (name.trim().length >= 2 && accepted));
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={() => { if (!working) close(); }}>
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.backdrop}>
      <Pressable accessibilityLabel="Anmeldung schließen" disabled={working} style={StyleSheet.absoluteFill} onPress={close} />
      <ScrollView style={{ maxHeight: "92%", flexGrow: 0 }} keyboardShouldPersistTaps="handled" contentContainerStyle={s.sheet}>
        <View style={s.sheetHandle} />
        <Pressable accessibilityRole="button" disabled={working} onPress={close} accessibilityLabel="Schließen"><Text style={s.textButtonLabel}>Schließen ×</Text></Pressable>
        {working ? <LoadingScreen compact message="Sichere Verbindung wird hergestellt …" /> : <>
          <Image source={require("./assets/logo.png")} style={{ width: 48, height: 48, borderRadius: 12, alignSelf: "center" }} />
          {confirming ? <>
            <Text style={s.sheetTitle}>Prüfe dein Postfach.</Text>
            <Text style={s.muted}>{email.trim()}</Text>
            <Pressable accessibilityRole="button" disabled={cooldown > 0} onPress={resend} style={[s.goldButton, cooldown > 0 && s.disabled]}><Text style={s.goldButtonText}>{cooldown > 0 ? `Erneut senden in ${cooldown}s` : "Bestätigungslink erneut senden"}</Text></Pressable>
            <Pressable accessibilityRole="button" onPress={backToLogin} style={s.textButton}><Text style={s.textButtonLabel}>Zur Anmeldung</Text></Pressable>
          </> : <>
            <View style={s.authTabs}>{(["login", "register"] as const).map(item => <Pressable accessibilityRole="button" key={item} onPress={() => { setMode(item); setError(""); setMessage(""); }} style={[s.authTab, mode === item && s.authTabOn]}><Text style={[s.authTabText, mode === item && s.authTabTextOn]}>{item === "login" ? "ANMELDEN" : "REGISTRIEREN"}</Text></Pressable>)}</View>
            <Text style={s.sheetTitle}>{mode === "login" ? "Willkommen zurück." : "Dein Lernweg beginnt."}</Text>
            {mode === "register" && <TextInput accessibilityLabel="Dein Name" autoComplete="name" value={name} onChangeText={setName} placeholder="Dein Name" placeholderTextColor={C.muted} style={s.input} />}
            <TextInput accessibilityLabel="E-Mail-Adresse" keyboardType="email-address" autoComplete="email" autoCapitalize="none" autoCorrect={false} value={email} onChangeText={setEmail} placeholder="E-Mail-Adresse" placeholderTextColor={C.muted} style={s.input} />
            <TextInput accessibilityLabel="Passwort" secureTextEntry autoCapitalize="none" autoCorrect={false} textContentType={mode === "login" ? "password" : "newPassword"} value={password} onChangeText={setPassword} placeholder={mode === "register" ? "Passwort · mindestens 8 Zeichen" : "Passwort"} placeholderTextColor={C.muted} style={s.input} />
            {mode === "register" && <><Pressable accessibilityRole="checkbox" accessibilityState={{ checked: accepted }} onPress={() => setAccepted(v => !v)}><Text style={s.muted}>{accepted ? "☑" : "☐"} Ich akzeptiere die AGB und habe die Datenschutzhinweise gelesen.</Text></Pressable><View style={{ flexDirection: "row", gap: 20 }}><Pressable accessibilityRole="button" onPress={() => Linking.openURL("https://www.deutschpilot.de/de/terms")}><Text style={s.textButtonLabel}>AGB</Text></Pressable><Pressable accessibilityRole="button" onPress={() => Linking.openURL("https://www.deutschpilot.de/de/privacy")}><Text style={s.textButtonLabel}>Datenschutz</Text></Pressable></View></>}
            <Pressable accessibilityRole="button" disabled={!valid} onPress={submit} style={[s.goldButton, !valid && s.disabled]}><Text style={s.goldButtonText}>{mode === "login" ? "Sicher anmelden" : "Konto erstellen"}</Text></Pressable>
            {mode === "login" && <Pressable accessibilityRole="button" onPress={reset} style={s.textButton}><Text style={s.textButtonLabel}>Passwort vergessen?</Text></Pressable>}
            {Platform.OS !== "ios" && <Pressable accessibilityRole="button" onPress={google} style={[s.option, { justifyContent: "center" }]}><Text style={{ color: C.white, fontWeight: "700" }}>Mit Google anmelden</Text></Pressable>}
          </>}
          {!!message && <Text accessibilityLiveRegion="polite" style={s.muted}>{message}</Text>}
          {!!error && <Text accessibilityRole="alert" style={{ color: C.red, lineHeight: 21 }}>{error}</Text>}
        </>}
      </ScrollView>
    </KeyboardAvoidingView>
  </Modal>;
}

function DeleteModal({ visible, close }: { visible: boolean; close: () => void }) {
  const { s, C, mode: colorMode, toggle } = useStyles();
  const phrase = "DELETE MY DEUTSCHPILOT ACCOUNT"; const [value, setValue] = useState(""); const [working, setWorking] = useState(false);
  useEffect(() => { if (!visible) setValue(""); }, [visible]);
  const remove = async () => { setWorking(true); try { await deleteAccountPermanently(value); setValue(""); close(); Alert.alert("Konto gelöscht", "Dein Cloud-Konto wurde dauerhaft gelöscht."); } catch (error) { Alert.alert("Nicht gelöscht", error instanceof Error ? error.message : "Bitte versuche es erneut."); } finally { setWorking(false); } };
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={() => { if (!working) close(); }}><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.backdrop}><Pressable disabled={working} style={StyleSheet.absoluteFill} onPress={close} /><View style={s.sheet}><View style={s.sheetHandle} /><Text style={s.kicker}>ENDGÜLTIGE AKTION</Text><Text style={s.sheetTitle}>Cloud-Konto löschen?</Text><Text style={s.muted}>Aktive Web-Abonnements werden zuerst gekündigt. Danach werden Profil, Fortschritt, Kommentare, Nutzung und Anmeldung gelöscht. Dies kann nicht rückgängig gemacht werden.</Text><Text style={s.noteLabel}>{phrase} EINGEBEN</Text><TextInput autoCapitalize="characters" autoCorrect={false} value={value} onChangeText={setValue} placeholder={phrase} placeholderTextColor={C.muted} style={s.input} /><Pressable accessibilityRole="button" disabled={value !== phrase || working} onPress={remove} style={[s.deleteButton, (value !== phrase || working) && s.disabled]}>{working ? <ActivityIndicator color={C.white} /> : <Text style={s.deleteButtonText}>Dauerhaft löschen</Text>}</Pressable><Pressable accessibilityRole="button" disabled={working} onPress={close} style={s.textButton}><Text style={s.textButtonLabel}>Behalten und schließen</Text></Pressable></View></KeyboardAvoidingView></Modal>;
}

function AppContent() {
  const { s, C, mode: colorMode, toggle } = useStyles();
  const [loading, setLoading] = useState(true); const [connectionError, setConnectionError] = useState(false); const [connectionAttempt, setConnectionAttempt] = useState(0);
  const [tab, setTab] = useState<Tab>("today"); const [progress, setProgress] = useState<LocalProgress>(emptyProgress); const [selected, setSelected] = useState<Lesson | null>(null); const [user, setUser] = useState<User | null>(null); const [cloudReady, setCloudReady] = useState(false); const [authOpen, setAuthOpen] = useState(false); const [deleteOpen, setDeleteOpen] = useState(false);
  const progressRef = useRef(progress);
  const writes = useRef<Promise<void>>(Promise.resolve());
  const [storageError, setStorageError] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const finishLock = useRef(false);
  useEffect(() => { loadProgress().then(value => { progressRef.current = value; setProgress(value); }).catch(() => setStorageError(true)).finally(() => setLoading(false)); }, []);
  // Serialize read/modify/write operations so rapid taps cannot overwrite newer progress.
  const update = (action: StudyAction) => {
    const task = writes.current.catch(() => undefined).then(async () => {
      if (storageError) throw new Error("storage unavailable");
      const next = applyStudyAction(progressRef.current, action);
      await saveProgress(next); progressRef.current = next; setProgress(next);
    });
    writes.current = task;
    return task.catch(error => { Alert.alert("Fortschritt nicht gespeichert", "Dein Gerätespeicher ist nicht verfügbar. Bitte versuche es erneut. Die Übung bleibt geöffnet."); throw error; });
  };
  const updateScreen = (action: StudyAction) => update(action).catch(error => {
    if (action.type !== "preferences") throw error;
  });
  useEffect(() => {
    let active = true; let stop: (() => void) | undefined;
    setConnectionError(false);
    watchUser(next => { if (active) { setUser(next); setCloudReady(true); } }).then(unsubscribe => { if (!active) unsubscribe(); else stop = unsubscribe; }).catch(() => { if (active) { setCloudReady(false); setConnectionError(true); } });
    const subscription = AppState.addEventListener("change", state => { if (state === "active") { getFirebaseRuntime().then(async ({ auth }) => { if (auth.currentUser) { await auth.currentUser.reload(); if (active) setUser(auth.currentUser); } }).catch(() => { if (active) setConnectionAttempt(n => n + 1); }); } });
    return () => { active = false; stop?.(); subscription.remove(); };
  }, [connectionAttempt]);

  const finish = async (lesson: Lesson) => {
    if (finishLock.current) return; finishLock.current = true; setFinishing(true);
    const repeated = progressRef.current.completed.includes(lesson.id);
    try { await update({ type: "lesson", id: lesson.id }); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined); setSelected(null); Alert.alert(repeated ? "Gut wiederholt" : "Etappe geschafft", repeated ? "Deine Wiederholung zählt zu deinem Tagesziel." : "+20 XP · Ein weiterer Schritt auf deinem Lernweg."); } catch { /* leave lesson open for retry */ } finally { finishLock.current = false; setFinishing(false); }
  };
  const reset = () => Alert.alert("Lokalen Fortschritt löschen?", "Entfernt XP, Serie, Wortwiederholungen, Tagesziel und abgeschlossene Lektionen auf diesem Gerät.", [{ text: "Abbrechen", style: "cancel" }, { text: "Zurücksetzen", style: "destructive", onPress: () => {
    writes.current = writes.current.catch(() => undefined).then(async () => { await clearProgress(); const fresh = { ...emptyProgress, completed: [], reviews: {} }; progressRef.current = fresh; setProgress(fresh); setStorageError(false); }).catch(() => Alert.alert("Nicht zurückgesetzt", "Der Gerätespeicher ist nicht verfügbar. Bitte erneut versuchen."));
  } }]);
  const screen = tab === "today" ? <TodayScreen progress={progress} update={updateScreen} openLesson={setSelected} setTab={setTab} /> : tab === "learn" ? <LearnScreen progress={progress} update={updateScreen} openLesson={setSelected} /> : tab === "words" ? <WordsScreen progress={progress} update={updateScreen} /> : tab === "practice" ? <PracticeScreen progress={progress} update={updateScreen} /> : <AccountScreen user={user} progress={progress} openAuth={() => setAuthOpen(true)} openDelete={() => setDeleteOpen(true)} onLogout={() => logout().catch(() => Alert.alert("Abmeldung fehlgeschlagen"))} onClear={reset} />;
  if (loading) return <LoadingScreen />;
  return <SafeAreaView edges={["top", "bottom"]} style={s.safe}><StatusBar style={colorMode === "dark" ? "light" : "dark"} /><View style={s.topStatus}><Text style={s.topStatusText}>DEIN DEUTSCH. DEIN TEMPO.</Text><Pressable accessibilityRole="switch" accessibilityLabel="Dunkler Modus" accessibilityState={{ checked: colorMode === "dark" }} onPress={toggle} style={{ minHeight: 44, justifyContent: "center" }}><Text style={{ color: C.white, fontSize: 13 }}>{colorMode === "dark" ? "☀ Hell" : "☾ Dunkel"}</Text></Pressable></View>{connectionError && <Pressable accessibilityRole="button" onPress={() => setConnectionAttempt(n => n + 1)} style={{ padding: 12 }}><Text style={{ color: C.red }}>Konto-Verbindung fehlgeschlagen · Erneut versuchen</Text></Pressable>}{storageError && <View style={{ padding: 16 }}><Text accessibilityRole="alert" style={{ color: C.red }}>Der lokale Fortschritt konnte nicht geladen werden. Deine Daten werden nicht überschrieben.</Text><Pressable accessibilityRole="button" onPress={() => { loadProgress().then(value => { progressRef.current = value; setProgress(value); setStorageError(false); }).catch(() => Alert.alert("Speicher nicht verfügbar", "Bitte prüfe den freien Gerätespeicher.")); }} style={s.textButton}><Text style={s.textButtonLabel}>Erneut laden</Text></Pressable></View>}<View style={s.body}>{screen}</View><View style={s.tabs}>{tabs.map((item) => <Pressable accessibilityRole="tab" accessibilityState={{ selected: tab === item.id }} key={item.id} onPress={() => setTab(item.id)} style={s.tab}><Text style={[s.tabIcon, tab === item.id && s.tabOn]}>{item.icon}</Text><Text style={[s.tabLabel, tab === item.id && s.tabOn]}>{item.label}</Text></Pressable>)}</View><NativeLessonModal busy={finishing} lesson={selected} visible={Boolean(selected)} close={() => setSelected(null)} completed={Boolean(selected && progress.completed.includes(selected.id))} finish={lesson => { if (!finishing) void finish(lesson); }} /><AuthModal visible={authOpen} close={() => setAuthOpen(false)} /><DeleteModal visible={deleteOpen} close={() => setDeleteOpen(false)} /></SafeAreaView>;
}

export default function App() { return <SafeAreaProvider><ThemeProvider><AppContent /></ThemeProvider></SafeAreaProvider>; }

const createStyles = (C: Colors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.navy }, body: { flex: 1 }, topStatus: { height: 48, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: C.line }, topStatusText: { color: C.green, fontSize: 11, fontWeight: "900", letterSpacing: 1.2 }, topProgress: { color: C.muted, fontSize: 12, fontWeight: "800" }, scroll: { width: "100%", maxWidth: 760, alignSelf: "center", padding: 20, paddingBottom: 36, gap: 18 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 54 }, brandMark: { width: 42, height: 42, borderRadius: 13, backgroundColor: C.gold, alignItems: "center", justifyContent: "center" }, brandD: { color: C.ink, fontSize: 23, fontWeight: "900" }, brandName: { color: C.white, fontSize: 14, fontWeight: "900", letterSpacing: 1.1 }, brandSub: { color: C.muted, fontSize: 11, fontWeight: "800", letterSpacing: 1.5, marginTop: 3 }, cloudDot: { marginLeft: "auto", width: 8, height: 8, borderRadius: 4, backgroundColor: C.muted }, cloudDotOn: { backgroundColor: C.green },
  hero: { borderRadius: 28, overflow: "hidden", backgroundColor: C.panel, borderColor: C.line, borderWidth: 1 }, heroCopy: { flex: 1, paddingRight: 12 }, kicker: { color: C.gold, fontSize: 12, fontWeight: "900", letterSpacing: 1.5 }, heroTitle: { color: C.white, fontSize: 35, lineHeight: 39, fontWeight: "900", marginTop: 15 }, heroSub: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: 9 }, goldButton: { minHeight: 50, backgroundColor: C.gold, borderRadius: 15, paddingHorizontal: 18, alignItems: "center", justifyContent: "center", marginTop: 20 }, goldButtonText: { color: C.ink, fontSize: 16, fontWeight: "900" }, ring: { width: 92, height: 92, borderRadius: 46, borderWidth: 10, borderColor: C.gold, alignItems: "center", justifyContent: "center" }, ringNumber: { color: C.white, fontSize: 20, fontWeight: "900" }, ringLabel: { color: C.muted, fontSize: 11, fontWeight: "900", marginTop: 2 },
  statsRow: { flexDirection: "row", gap: 10 }, stat: { flex: 1, minHeight: 88, borderRadius: 19, borderWidth: 1, borderColor: C.line, backgroundColor: C.panel, padding: 15, justifyContent: "center" }, statNumber: { color: C.white, fontSize: 23, fontWeight: "900" }, statLabel: { color: C.muted, fontSize: 11, fontWeight: "900", letterSpacing: 1, marginTop: 5 }, sectionHead: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }, sectionTitle: { color: C.white, fontSize: 26, fontWeight: "900", marginTop: 5 }, offlineBadge: { color: C.green, borderColor: C.green, borderWidth: 1, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5, fontSize: 11, fontWeight: "900" }, featureGrid: { flexDirection: "row", gap: 12 }, feature: { flex: 1, minHeight: 160, borderRadius: 23, padding: 18, justifyContent: "flex-end" }, featureIcon: { color: "#061526", fontSize: 28, fontWeight: "900", marginBottom: "auto" }, featureTitle: { color: "#061526", fontSize: 16, fontWeight: "900" }, featureCopy: { color: "#395269", fontSize: 10, marginTop: 5 }, promise: { borderRadius: 22, borderWidth: 1, borderColor: C.line, padding: 18, backgroundColor: C.panel }, promiseTitle: { color: C.white, fontSize: 16, fontWeight: "900" }, promiseCopy: { color: C.muted, fontSize: 12, lineHeight: 19, marginTop: 8 },
  pageTitle: { color: C.white, fontSize: 34, lineHeight: 39, fontWeight: "900" }, levelRow: { gap: 8, paddingRight: 18 }, level: { width: 52, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.line, alignItems: "center", justifyContent: "center" }, levelOn: { backgroundColor: C.gold, borderColor: C.gold }, levelText: { color: C.muted, fontWeight: "900", fontSize: 11 }, levelTextOn: { color: C.ink }, lessonCard: { minHeight: 106, flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 21, borderWidth: 1, borderColor: C.line, backgroundColor: C.panel, padding: 15 }, lessonIndex: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.panel2, alignItems: "center", justifyContent: "center" }, lessonDone: { backgroundColor: C.green }, lessonIndexText: { color: C.white, fontWeight: "900" }, lessonBody: { flex: 1 }, lessonMeta: { color: C.gold, fontSize: 11, fontWeight: "900", letterSpacing: 1.1 }, lessonTitle: { color: C.white, fontSize: 17, fontWeight: "900", marginTop: 5 }, lessonSub: { color: C.muted, fontSize: 11, marginTop: 4 }, arrow: { color: C.gold, fontSize: 28 }, empty: { minHeight: 150, borderRadius: 21, borderWidth: 1, borderColor: C.line, padding: 22, justifyContent: "center" }, emptyTitle: { color: C.white, fontSize: 17, fontWeight: "900", marginBottom: 8 }, muted: { color: C.muted, fontSize: 15, lineHeight: 23 },
  cardCounter: { color: C.muted, fontSize: 10, fontWeight: "800", textAlign: "center" }, wordCard: { minHeight: 330, borderRadius: 28, borderWidth: 1, borderColor: C.line, backgroundColor: C.panel, padding: 26, alignItems: "center", justifyContent: "center" }, wordLevel: { position: "absolute", top: 20, left: 20, color: C.gold, fontSize: 12, fontWeight: "900" }, wordMain: { color: C.white, fontSize: 34, fontWeight: "900", textAlign: "center" }, wordExample: { color: C.gold, fontSize: 14, lineHeight: 21, fontStyle: "italic", textAlign: "center", marginTop: 18 }, tapHint: { position: "absolute", bottom: 20, color: C.muted, fontSize: 11, fontWeight: "900", letterSpacing: 1 }, wordActions: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12 }, circleButton: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: C.gold, alignItems: "center", justifyContent: "center", marginTop: 20 }, circleText: { color: C.gold, fontSize: 13 },
  questionCard: { borderRadius: 25, borderWidth: 1, borderColor: C.line, backgroundColor: C.panel, padding: 19, gap: 12 }, questionCount: { color: C.gold, fontSize: 11, fontWeight: "900", letterSpacing: 1.2 }, question: { color: C.white, fontSize: 20, lineHeight: 27, fontWeight: "900", marginVertical: 7 }, option: { minHeight: 58, borderRadius: 16, borderWidth: 1, borderColor: C.line, flexDirection: "row", alignItems: "center", padding: 12, gap: 12 }, optionSelected: { borderColor: C.gold }, optionCorrect: { borderColor: C.green, backgroundColor: C.correct }, optionWrong: { borderColor: C.red, backgroundColor: C.wrong }, optionLetter: { width: 30, height: 30, lineHeight: 30, textAlign: "center", borderRadius: 15, overflow: "hidden", color: C.gold, backgroundColor: C.panel2, fontWeight: "900" }, optionText: { flex: 1, color: C.white, fontSize: 16, lineHeight: 24 }, feedback: { borderTopWidth: 1, borderTopColor: C.line, paddingTop: 16, marginTop: 6 }, feedbackTitle: { color: C.green, fontSize: 17, fontWeight: "900", marginBottom: 7 },
  accountCard: { borderRadius: 26, padding: 22 }, accountMail: { color: C.white, fontSize: 18, fontWeight: "900" }, accountState: { color: C.green, fontSize: 11, fontWeight: "900", letterSpacing: 1, marginTop: 8 }, accountLead: { color: C.white, fontSize: 14, lineHeight: 21 }, lightButton: { minHeight: 48, borderRadius: 14, backgroundColor: C.white, alignItems: "center", justifyContent: "center", marginTop: 18 }, lightButtonText: { color: C.ink, fontWeight: "900" }, settingsCard: { borderRadius: 22, borderWidth: 1, borderColor: C.line, backgroundColor: C.panel, paddingHorizontal: 17 }, settingRow: { minHeight: 78, borderBottomWidth: 1, borderBottomColor: C.line, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, settingCopy: { flex: 1 }, settingTitle: { color: C.white, fontSize: 13, fontWeight: "900", marginBottom: 4 }, dangerLink: { color: C.red, fontSize: 11, fontWeight: "900" },
  tabs: { minHeight: 72, marginHorizontal: 10, marginBottom: 4, borderRadius: 23, backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, flexDirection: "row", alignItems: "center" }, tab: { flex: 1, minHeight: 56, justifyContent: "center", alignItems: "center", gap: 5 }, tabIcon: { color: C.muted, fontSize: 17, fontWeight: "900" }, tabLabel: { color: C.muted, fontSize: 10, fontWeight: "900" }, tabOn: { color: C.gold },
  modalPage: { flex: 1, backgroundColor: C.navy }, modalHead: { height: 58, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: C.line }, closeButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.panel, alignItems: "center", justifyContent: "center" }, closeText: { color: C.white, fontSize: 25, lineHeight: 27 }, closeSpacer: { width: 38 }, lessonScroll: { padding: 20, paddingBottom: 50, gap: 15 }, phraseStack: { gap: 10, marginTop: 8 }, phrase: { minHeight: 78, borderRadius: 18, backgroundColor: C.panel, borderWidth: 1, borderColor: C.line, padding: 13, flexDirection: "row", alignItems: "center", gap: 13 }, playMini: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.gold, alignItems: "center", justifyContent: "center" }, playMiniText: { color: C.ink, fontSize: 10 }, phraseCopy: { flex: 1 }, phraseDe: { color: C.white, fontSize: 16, fontWeight: "900" }, phraseEn: { color: C.muted, fontSize: 11, marginTop: 4 }, note: { borderRadius: 18, padding: 16, backgroundColor: C.panel2, borderLeftWidth: 3, borderLeftColor: C.green }, noteLabel: { color: C.gold, fontSize: 11, fontWeight: "900", letterSpacing: 1.1, marginTop: 8 }, noteText: { color: C.white, fontSize: 13, lineHeight: 20, marginTop: 8 }, disabled: { opacity: 0.4 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,.55)", justifyContent: "flex-end" }, sheet: { backgroundColor: C.panel, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 22, paddingBottom: 35, gap: 12 }, sheetHandle: { width: 44, height: 5, borderRadius: 3, backgroundColor: C.line, alignSelf: "center", marginBottom: 5 }, sheetTitle: { color: C.white, fontSize: 28, fontWeight: "900", marginVertical: 5 }, authTabs: { flexDirection: "row", borderRadius: 999, backgroundColor: C.navy, padding: 4 }, authTab: { flex: 1, minHeight: 40, borderRadius: 999, alignItems: "center", justifyContent: "center" }, authTabOn: { backgroundColor: C.gold }, authTabText: { color: C.muted, fontSize: 11, fontWeight: "900" }, authTabTextOn: { color: C.ink }, input: { minHeight: 52, borderWidth: 1, borderColor: C.line, borderRadius: 14, backgroundColor: C.navy, paddingHorizontal: 15, color: C.white }, textButton: { minHeight: 44, alignItems: "center", justifyContent: "center" }, textButtonLabel: { color: C.gold, fontSize: 11, fontWeight: "800" }, legalSmall: { color: C.muted, fontSize: 12, lineHeight: 14, textAlign: "center" }, deleteButton: { minHeight: 52, borderRadius: 14, backgroundColor: "#A52C3A", alignItems: "center", justifyContent: "center", marginTop: 10 }, deleteButtonText: { color: C.white, fontWeight: "900" },
});
