// Offline build-time import of this project's SQL seeds. Never executes SQL or connects to a service.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const base = new URL('../../supabase/', import.meta.url);
const out = new URL('../src/data/', import.meta.url);
const unquote = text => text.replaceAll("''", "'");
const decode = text => unquote(text).replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'");
const plain = text => decode(text.replace(/<[^>]+>/g, '')).trim();
const sources = ['seed-vocabulary-a1-b2.sql', 'seed-vocabulary-expansion.sql'];
const vocabulary = []; const seen = new Set();
for (const file of sources) {
  const text = readFileSync(new URL(file, base), 'utf8');
  const pattern = /\('(A1|A2|B1|B2|C1)'\s*,\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'\s*,\s*'((?:[^']|'')*)'\s*,\s*(\d+)\)/g;
  let count = 0;
  for (const m of text.matchAll(pattern)) {
    count++;
    const [,level,category,de,en,example,exampleEn,order] = m.map(unquote);
    if (seen.has(`${level}:${de}`)) continue;
    seen.add(`${level}:${de}`);
    vocabulary.push({ id: `web-${level.toLowerCase()}-${order}`, level, category, de, en, example, exampleEn });
  }
  // A source format change must fail rather than silently discard vocabulary.
  const expected = [...text.matchAll(/^\('(A1|A2|B1|B2|C1)'/gm)].length;
  if (count !== expected) throw new Error(`${file}: parsed ${count}/${expected} vocabulary rows`);
}
const lessons = []; const manifest = []; const rejectedExercises = [];
const files = readdirSync(fileURLToPath(base)).filter(name => /^seed-(?:a1-room\d+|[abc][12]-rooms-\d+-\d+)\.sql$/.test(name)).filter(name => name !== 'seed-a1-room03.sql').sort();
const uuid = '[a-f0-9-]{36}';
for (const file of files) {
  const text = readFileSync(new URL(file, base), 'utf8');
  const exercises = new Map();
  const exercisePattern = new RegExp(`\\(\\s*'(${uuid})'\\s*,\\s*'(${uuid})'\\s*,\\s*'([\\s\\S]*?)'\\s*,\\s*'multiple_choice'\\s*,\\s*'(\\[[\\s\\S]*?\\])'::jsonb\\s*,\\s*'([\\s\\S]*?)'\\s*,\\s*'([\\s\\S]*?)'\\s*,\\s*NOW\\(\\)\\s*\\)`, 'g');
  // Two historical column orders exist; parse each explicitly and keep answers bound to their lesson.
  for (const statement of text.matchAll(/INSERT INTO (?:public\.)?exercises\s*\(([^)]*)\)\s*VALUES([\s\S]*?)ON CONFLICT/g)) {
    const typeFirst = /lesson_id,\s*type,\s*question/.test(statement[1]);
    const alternate = new RegExp(`\\(\\s*'(${uuid})'\\s*,\\s*'(${uuid})'\\s*,\\s*'multiple_choice'\\s*,\\s*'([\\s\\S]*?)'\\s*,\\s*'(\\[[\\s\\S]*?\\])'(?:\\s*::jsonb)?\\s*,\\s*'([\\s\\S]*?)'\\s*,\\s*NOW\\(\\)\\s*\\)`, 'g');
    for (const m of statement[2].matchAll(typeFirst ? alternate : exercisePattern)) {
      let [,id,lessonId,question,json,correct,note] = m;
      const options = JSON.parse(unquote(json));
      const answer = options.indexOf(unquote(correct));
      if (answer < 0 || options.length < 2) { rejectedExercises.push({ file, id, reason: 'Correct answer does not exactly match a choice' }); continue; }
      exercises.set(lessonId, [...(exercises.get(lessonId) ?? []), { question: unquote(question), options, answer, note: note ? unquote(note) : `Die passende Antwort lautet: ${unquote(correct)}` }]);
    }
  }
  const pattern = new RegExp(`\\(\\s*'(${uuid})'\\s*,\\s*'(${uuid})'\\s*,\\s*'([^']+)'\\s*,\\s*'([^]*?)'\\s*,\\s*'(<[^]*?)'\\s*,\\s*(\\d+)\\s*,\\s*NOW\\(\\)\\s*\\)`, 'g');
  let included = 0;
  for (const m of [...text.matchAll(/INSERT INTO (?:public\.)?lessons\s*\([^)]*\)\s*VALUES([\s\S]*?)ON CONFLICT/g)].flatMap(statement => [...statement[1].matchAll(pattern)])) {
    const [,id,course,slug,title,html,order] = m;
    if (Number(order) === 99) continue;
    const quiz = exercises.get(id);
    if (!quiz?.length) throw new Error(`${file}: no usable self-test for ${slug}`);
    const level = file.match(/seed-([abc][12])/i)[1].toUpperCase();
    const blocks = [];
    for (const block of html.matchAll(/<(h[1-6]|p|li|tr)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
      const value = plain(block[2].replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/t[dh]>\s*<t[dh][^>]*>/gi, ' · '));
      if (value) blocks.push({ type: block[1].startsWith('h') ? 'heading' : 'body', text: value });
    }
    if (!blocks.length) throw new Error(`${file}: missing native reading content ${slug}`);
    lessons.push({ id, level, title: unquote(title), subtitle: 'Lesen, verstehen und anwenden', minutes: Math.max(4, Math.ceil(blocks.map(b => b.text).join(' ').split(/\s+/).length / 100)), phrases: [], note: quiz[0].note, ...quiz[0], sections: blocks, exercises: quiz });
    included++;
  }
  if (!included) throw new Error(`${file}: no content lessons imported`);
  manifest.push({ file: `supabase/${file}`, lessons: included, selfTests: [...exercises.values()].reduce((n, q) => n + q.length, 0) });
}
for (const [file, value] of [['web-vocabulary.json', vocabulary], ['web-lessons.json', lessons], ['content-sources.json', { note: 'Project-owned seed snapshot, not proof of live database state or language accuracy. No third-party course material imported.', vocabularySources: sources.map(file => `supabase/${file}`), lessonSources: manifest, rejectedExercises, excluded: [{ file: 'supabase/seed-a1-room03.sql', reason: 'Legacy Markdown and inconsistent exercise column counts; excluded until source repair and review.' }] }]]) writeFileSync(new URL(file, out), JSON.stringify(value, null, 2) + '\n');
console.log(`Imported ${lessons.length} lessons and ${vocabulary.length} vocabulary entries from local project seeds.`);
