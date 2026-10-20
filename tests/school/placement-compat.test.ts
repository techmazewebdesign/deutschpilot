import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const container = process.env.SCHOOL_TEST_POSTGRES_CONTAINER || "deutschpilot-school-test-20261020";
const database = `placement_compat_${Date.now()}`;
function sql(query: string, db = database) {
  return execFileSync(
    "/usr/local/bin/docker",
    ["exec", "-i", container, "psql", "-U", "postgres", "-d", db, "-Atq", "-v", "ON_ERROR_STOP=1"],
    { input: query, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
  ).trim();
}
test("additive placement repair runs on real PostgreSQL, denies browser roles and preserves unrelated tables", () => {
  sql(`CREATE DATABASE ${database}`, "postgres");
  try {
    sql(
      "CREATE TABLE public.synthetic_existing(id integer); GRANT SELECT ON public.synthetic_existing TO anon;"
    );
    const original = sql(
      "SELECT relacl::text FROM pg_class WHERE oid='public.synthetic_existing'::regclass"
    );
    assert.throws(() => sql("SELECT level_result FROM public.placement_tests"));
    const migration = readFileSync("supabase/migration-learning-placement-compat.sql", "utf8");
    sql(migration);
    assert.equal(
      sql("SELECT relacl::text FROM pg_class WHERE oid='public.synthetic_existing'::regclass"),
      original
    );
    for (const role of ["anon", "authenticated"]) {
      assert.equal(
        sql(
          `SELECT has_table_privilege('${role}', 'public.placement_tests', 'SELECT,INSERT,UPDATE,DELETE')`
        ),
        "f"
      );
      assert.throws(() => sql(`SET ROLE ${role}; SELECT * FROM public.placement_tests`));
      assert.throws(() =>
        sql(`SET ROLE ${role}; INSERT INTO public.placement_tests(user_id) VALUES('synthetic')`)
      );
    }
    assert.equal(
      sql("SELECT relrowsecurity FROM pg_class WHERE oid='public.placement_tests'::regclass"),
      "t"
    );
    sql(
      "SET ROLE service_role; INSERT INTO public.placement_tests(user_id,level_result,score,answers) VALUES('synthetic-student','A2',4,'{}');"
    );
    assert.equal(
      sql(
        "SET ROLE service_role; SELECT level_result||':'||score FROM public.placement_tests WHERE user_id='synthetic-student'"
      ),
      "A2:4"
    );
    assert.throws(() =>
      sql(
        "SET ROLE service_role; INSERT INTO public.placement_tests(user_id,score) VALUES('synthetic-student',99)"
      )
    );
    const acl = sql(
      "SELECT relacl::text FROM pg_class WHERE oid='public.placement_tests'::regclass"
    );
    sql(migration);
    assert.equal(
      sql("SELECT relacl::text FROM pg_class WHERE oid='public.placement_tests'::regclass"),
      acl
    );
    assert.equal(sql("SELECT count(*) FROM public.placement_tests"), "1");
  } finally {
    sql(`DROP DATABASE ${database}`, "postgres");
  }
});
