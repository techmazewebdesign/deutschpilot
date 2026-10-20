import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { schoolReturnTarget, schoolSignInUrl, signInDestination } from "../lib/school/auth-return";

for (const locale of ["de", "en"]) {
  test(`${locale}: school return works for every role; ordinary destinations unchanged`, () => {
    for (const role of ["student", "teacher", "admin"]) {
      assert.equal(signInDestination(locale, role, `/${locale}/school`), `/${locale}/school`);
    }
    assert.equal(signInDestination(locale, "student"), `/${locale}/rooms`);
    assert.equal(signInDestination(locale, "teacher"), `/${locale}/teacher`);
    assert.equal(signInDestination(locale, "admin"), `/${locale}/admin`);
    const link = new URL(schoolSignInUrl(locale), "https://synthetic.test");
    assert.equal(
      schoolReturnTarget(link.searchParams.get("returnTo"), locale),
      `/${locale}/school`
    );
  });
}
test("return destinations reject external, ambiguous, encoded and cross-locale inputs", () => {
  for (const target of [
    undefined,
    null,
    ["/de/school"],
    "https://evil.test/de/school",
    "//evil.test",
    "\\\\evil.test",
    "/\\evil.test",
    "%2F%2Fevil.test",
    "/de/%73chool",
    "/de/school%2f%2fevil.test",
    "/de/school?next=//evil.test",
    "/de/school#evil",
    "/de/school/../admin",
    "/en/school",
    " /de/school",
    "/de/school\n",
    "javascript:alert(1)",
  ]) {
    assert.equal(schoolReturnTarget(target, "de"), null);
    assert.equal(signInDestination("de", "student", target), "/de/rooms");
  }
});

// Execute the production helper with privileged dependencies stubbed; no auth/provider access.
const loaded: Record<string, any> = {};
vm.runInNewContext(
  ts.transpileModule(readFileSync("lib/legacyLearningAccess.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText,
  { exports: loaded, require: () => ({}), console }
);

test("missing placement relation is an explicit failure, never zero progress or a default level", () => {
  const failed = { data: null, error: { code: "PGRST205", message: "private SQL detail" } };
  assert.throws(
    () => loaded.requireQuery(failed, "rooms.placement"),
    (error: any) => {
      assert.match(error.message, /rooms.placement; PGRST205/);
      assert.doesNotMatch(error.message, /private SQL detail/);
      return true;
    }
  );
});
test("permission/network errors remain failures while a genuinely empty successful query stays empty", () => {
  for (const code of ["42501", "57014", undefined]) {
    assert.throws(() => loaded.requireQuery({ data: [], error: { code } }, "rooms.progress"));
  }
  const empty = { data: [], error: null };
  assert.equal(loaded.requireQuery(empty, "rooms.progress"), empty);
});

function moduleWithMocks(
  file: string,
  mocks: Record<string, unknown>,
  extras: Record<string, unknown> = {}
) {
  const output: Record<string, any> = {};
  vm.runInNewContext(
    ts.transpileModule(readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    }).outputText,
    {
      exports: output,
      require: (name: string) => {
        if (!(name in mocks)) throw Error(`Unexpected dependency ${name}`);
        return mocks[name];
      },
      process: { env: { NODE_ENV: "test" } },
      console,
      ...extras,
    }
  );
  return output;
}
const returnHelpers = { schoolReturnTarget, schoolSignInUrl, signInDestination };
function findElement(node: any, predicate: (node: any) => boolean): any {
  if (!node || typeof node !== "object") return null;
  if (predicate(node)) return node;
  for (const child of [node.props?.children].flat(Infinity)) {
    const found = findElement(child, predicate);
    if (found) return found;
  }
  return null;
}
const hooks = {
  useState: (value: unknown) => [value, () => {}],
  useEffect: () => {},
  useRef: () => ({ current: null }),
};
test("actual password form follows approved school return only after successful session creation", async () => {
  for (const ok of [true, false]) {
    const destinations: string[] = [];
    const component = moduleWithMocks(
      "components/auth/signin-form-client.tsx",
      {
        react: hooks,
        "react/jsx-runtime": require("react/jsx-runtime"),
        "next/link": { default: "a" },
        "next/navigation": {
          useRouter: () => ({ push: (dest: string) => destinations.push(dest), refresh() {} }),
        },
        "next-intl": { useTranslations: () => (key: string) => key },
        "firebase/auth": {
          signInWithEmailAndPassword: async () => ({
            user: {
              emailVerified: true,
              getIdTokenResult: async () => ({ claims: { role: "student" } }),
              getIdToken: async () => "synthetic-token",
            },
          }),
        },
        "@/lib/firebase": { firebaseAuth: {} },
        "@/lib/school/auth-return": returnHelpers,
        "@/components/auth/google-signin-button": { GoogleSigninButton: "google-button" },
      },
      { fetch: async () => ({ ok }) }
    );
    const tree = component.SigninFormClient({ locale: "de", returnTo: "/de/school" });
    const form = findElement(tree, (node) => node.type === "form");
    await form.props.onSubmit({ preventDefault() {} });
    assert.deepEqual(destinations, ok ? ["/de/school"] : []);
  }
});
test("actual Google button forwards approved school return and navigates there after authentication", async () => {
  const destinations: string[] = [];
  let passed: unknown;
  const component = moduleWithMocks("components/auth/google-signin-button.tsx", {
    react: hooks,
    "react/jsx-runtime": require("react/jsx-runtime"),
    "next/navigation": {
      useRouter: () => ({ push: (dest: string) => destinations.push(dest), refresh() {} }),
    },
    "next-intl": { useTranslations: () => (key: string) => key },
    "@/hooks/use-native-platform": { useNativePlatform: () => "web" },
    "@/lib/googleAuth": {
      signInWithGoogle: async (options: unknown) => {
        passed = options;
        return { role: "student" };
      },
      googleAuthErrorMessage() {},
    },
    "@/lib/school/auth-return": returnHelpers,
  });
  const tree = component.GoogleSigninButton({ locale: "de", returnTo: "/de/school" });
  await findElement(tree, (node) => node.type === "button").props.onClick();
  assert.equal((passed as any).returnTo, "/de/school");
  assert.deepEqual(destinations, ["/de/school"]);
});
test("actual Google helper skips legacy profile only for approved school return; failed sessions never succeed", async () => {
  for (const [target, ok] of [
    ["/de/school", true],
    ["//evil.test", true],
    ["/de/school", false],
  ] as const) {
    const calls: string[] = [];
    const helper = moduleWithMocks(
      "lib/googleAuth.ts",
      {
        "@/lib/school/auth-return": returnHelpers,
        "firebase/auth": {
          signInWithPopup: async () => ({
            user: {
              getIdToken: async () => "synthetic",
              getIdTokenResult: async () => ({ claims: { role: "student" } }),
            },
          }),
        },
        "@/lib/firebase": { firebaseAuth: {}, googleAuthProvider: {} },
      },
      {
        fetch: async (path: string) => {
          calls.push(path);
          return { ok, json: async () => ({ profile: { role: "student" } }) };
        },
      }
    );
    if (!ok) await assert.rejects(helper.signInWithGoogle({ locale: "de", returnTo: target }));
    else await helper.signInWithGoogle({ locale: "de", returnTo: target });
    assert.deepEqual(
      calls,
      target === "/de/school" ? ["/api/auth/session"] : ["/api/auth/session", "/api/auth/profile"]
    );
  }
});
test("localized recovery renders truthful unavailable state, retry and school route without private totals", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  for (const locale of ["en", "de"]) {
    let retried = false;
    const component = moduleWithMocks("app/[locale]/dashboard/recovery.tsx", {
      react: hooks,
      "react/jsx-runtime": require("react/jsx-runtime"),
      "next/link": { default: (props: any) => require("react").createElement("a", props) },
      "next/navigation": { useParams: () => ({ locale }) },
      "@/lib/school/auth-return": returnHelpers,
    });
    const tree = component.LearningRecovery({
      locale,
      reset: () => {
        retried = true;
      },
    });
    findElement(tree, (node) => node.type === "button").props.onClick();
    assert.equal(retried, true);
    const html = renderToStaticMarkup(tree);
    assert.match(html, new RegExp(`href="/${locale}/school"`));
    assert.match(html, /role="alert"/);
    assert.match(html, locale === "de" ? /nicht angezeigt/ : /not displayed/);
    assert.doesNotMatch(html, /0%|Total Students|Aktive Klassen/);
    const profile = renderToStaticMarkup(
      component.LearningRecovery({ locale, missingProfile: true })
    );
    assert.match(profile, locale === "de" ? /verknüpftes Lernprofil/ : /linked learning profile/);
  }
});
