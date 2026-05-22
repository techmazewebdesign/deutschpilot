-- A1 Room 03 – Family & Personal Life
-- Course ID: a0000000-0000-0000-0000-000000000003

INSERT INTO courses (id, slug, title, description, level, language, is_published, created_at)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'a1-family-life',
  'A1 Room 03 – Family & Personal Life',
  'Learn to talk about your family, describe people, hobbies, personality, and daily routines.',
  'A1', 'de', true, NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lesson 1: Familie – Die Familienmitglieder
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0003-000000000001',
  'a0000000-0000-0000-0000-000000000003',
  'familie-die-familienmitglieder',
  'Familie – Die Familienmitglieder',
  '# Familie – Die Familienmitglieder

## Vocabulary

| German | English |
|--------|---------|
| die Mutter | mother |
| der Vater | father |
| der Bruder | brother |
| die Schwester | sister |
| die Großmutter / die Oma | grandmother |
| der Großvater / der Opa | grandfather |
| der Onkel | uncle |
| die Tante | aunt |
| der Cousin | cousin (male) |
| die Cousine | cousin (female) |

## Possessive Articles

| Person | masculine | feminine | neutral |
|--------|-----------|----------|---------|
| ich | mein | meine | mein |
| du | dein | deine | dein |

**Examples:**
- Das ist **mein** Vater. (This is my father.)
- Das ist **meine** Mutter. (This is my mother.)
- Das ist **mein** Bruder. (This is my brother.)
- Wie heißt **deine** Schwester? (What is your sister called?)',
  1
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0003-0001-000000000001', 'a0000000-0000-0000-0003-000000000001', 'multiple_choice',
   'How do you say "mother" in German?',
   '["die Mutter","der Vater","die Schwester","der Bruder"]', 'die Mutter', 1),
  ('a0000000-0000-0003-0001-000000000002', 'a0000000-0000-0000-0003-000000000001', 'multiple_choice',
   'Fill in: Das ist ___ Bruder. (my brother)',
   '["mein","meine","dein","deine"]', 'mein', 2),
  ('a0000000-0000-0003-0001-000000000003', 'a0000000-0000-0000-0003-000000000001', 'fill_blank',
   'Translate: "This is my grandmother." → Das ist ___ Oma.',
   null, 'meine', 3),
  ('a0000000-0000-0003-0001-000000000004', 'a0000000-0000-0000-0003-000000000001', 'word_order',
   'Arrange: "This is my uncle."',
   '["Das","ist","mein","Onkel","."]', 'Das ist mein Onkel .', 4)
ON CONFLICT (id) DO NOTHING;

-- Lesson 2: Meine Familie beschreiben
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0003-000000000002',
  'a0000000-0000-0000-0000-000000000003',
  'meine-familie-beschreiben',
  'Meine Familie beschreiben',
  '# Meine Familie beschreiben

## Adjectives

| German | English |
|--------|---------|
| groß | tall / big |
| klein | short / small |
| alt | old |
| jung | young |
| freundlich | friendly |
| nett | nice |
| lustig | funny |
| ruhig | quiet |

## Sentence Patterns

Use **er ist** (he is) or **sie ist** (she is):

- Mein Vater ist **groß**. (My father is tall.)
- Meine Mutter ist **freundlich**. (My mother is friendly.)
- Mein Bruder ist **jung**. (My brother is young.)
- Meine Schwester ist **lustig**. (My sister is funny.)

## Question

- Wie ist dein Vater? — **Er ist nett und freundlich.**
- Wie ist deine Mutter? — **Sie ist ruhig und groß.**',
  2, true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0003-0002-000000000001', 'a0000000-0000-0000-0003-000000000002', 'multiple_choice',
   'Which adjective means "friendly"?',
   '["freundlich","groß","alt","ruhig"]', 'freundlich', 1),
  ('a0000000-0000-0003-0002-000000000002', 'a0000000-0000-0000-0003-000000000002', 'multiple_choice',
   'Complete: Mein Vater ist ___. (tall)',
   '["groß","klein","jung","alt"]', 'groß', 2),
  ('a0000000-0000-0003-0002-000000000003', 'a0000000-0000-0000-0003-000000000002', 'fill_blank',
   'Translate: "My sister is funny." → Meine Schwester ist ___.',
   null, 'lustig', 3),
  ('a0000000-0000-0003-0002-000000000004', 'a0000000-0000-0000-0003-000000000002', 'word_order',
   'Arrange: "My mother is friendly and nice."',
   '["Meine","Mutter","ist","freundlich","und","nett","."]', 'Meine Mutter ist freundlich und nett .', 4)
ON CONFLICT (id) DO NOTHING;

-- Lesson 3: Hobbys und Freizeit
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0003-000000000003',
  'a0000000-0000-0000-0000-000000000003',
  'hobbys-und-freizeit',
  'Hobbys und Freizeit',
  '# Hobbys und Freizeit

## Vocabulary

| German | English |
|--------|---------|
| das Hobby | hobby |
| spielen | to play |
| lesen | to read |
| kochen | to cook |
| schwimmen | to swim |
| wandern | to hike |
| Musik hören | to listen to music |
| zeichnen | to draw |
| Fußball spielen | to play football |

## Verb Conjugation: spielen

| Person | Form |
|--------|------|
| ich | spiele |
| du | spielst |
| er/sie/es | spielt |
| wir | spielen |

## Examples

- Ich **spiele** gern Fußball. (I like playing football.)
- Du **spielst** Gitarre. (You play guitar.)
- Er **spielt** Tennis. (He plays tennis.)
- Was machst du in der Freizeit? (What do you do in your free time?)
- Mein Hobby ist **Lesen**. (My hobby is reading.)',
  3, true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0003-0003-000000000001', 'a0000000-0000-0000-0003-000000000003', 'multiple_choice',
   'What is "to swim" in German?',
   '["schwimmen","spielen","lesen","wandern"]', 'schwimmen', 1),
  ('a0000000-0000-0003-0003-000000000002', 'a0000000-0000-0000-0003-000000000003', 'multiple_choice',
   'Complete: Ich ___ gern Fußball. (I like playing football)',
   '["spiele","spielst","spielt","spielen"]', 'spiele', 2),
  ('a0000000-0000-0003-0003-000000000003', 'a0000000-0000-0000-0003-000000000003', 'fill_blank',
   'Complete: Er ___ Tennis. (he plays)',
   null, 'spielt', 3),
  ('a0000000-0000-0003-0003-000000000004', 'a0000000-0000-0000-0003-000000000003', 'word_order',
   'Arrange: "My hobby is reading."',
   '["Mein","Hobby","ist","Lesen","."]', 'Mein Hobby ist Lesen .', 4)
ON CONFLICT (id) DO NOTHING;

-- Lesson 4: Wie bist du? – Persönlichkeit
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0003-000000000004',
  'a0000000-0000-0000-0000-000000000003',
  'wie-bist-du-persoenlichkeit',
  'Wie bist du? – Persönlichkeit',
  '# Wie bist du? – Persönlichkeit

## Personality Adjectives

| German | English |
|--------|---------|
| freundlich | friendly |
| ruhig | calm / quiet |
| lustig | funny |
| fleißig | hardworking |
| neugierig | curious |
| kreativ | creative |
| schüchtern | shy |
| selbstbewusst | confident |
| geduldig | patient |

## Describing Yourself

Use **Ich bin ...** (I am ...):

- Ich bin **freundlich**. (I am friendly.)
- Ich bin **neugierig und kreativ**. (I am curious and creative.)
- Ich bin manchmal **schüchtern**. (I am sometimes shy.)

## Asking About Personality

- Wie bist du? (What are you like?)
- Bist du geduldig? — Ja, ich bin sehr geduldig. (Are you patient? — Yes, I am very patient.)
- Er ist sehr **fleißig**. (He is very hardworking.)',
  4, true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0003-0004-000000000001', 'a0000000-0000-0000-0003-000000000004', 'multiple_choice',
   'What does "fleißig" mean?',
   '["hardworking","funny","shy","curious"]', 'hardworking', 1),
  ('a0000000-0000-0003-0004-000000000002', 'a0000000-0000-0000-0003-000000000004', 'multiple_choice',
   'Complete: Ich ___ neugierig.',
   '["bin","bist","ist","sind"]', 'bin', 2),
  ('a0000000-0000-0003-0004-000000000003', 'a0000000-0000-0000-0003-000000000004', 'fill_blank',
   'Translate "curious" into German.',
   null, 'neugierig', 3),
  ('a0000000-0000-0003-0004-000000000004', 'a0000000-0000-0000-0003-000000000004', 'word_order',
   'Arrange: "I am friendly and patient."',
   '["Ich","bin","freundlich","und","geduldig","."]', 'Ich bin freundlich und geduldig .', 4)
ON CONFLICT (id) DO NOTHING;

-- Lesson 5: Mein Alltag
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0003-000000000005',
  'a0000000-0000-0000-0000-000000000003',
  'mein-alltag',
  'Mein Alltag',
  '# Mein Alltag

## Separable Verbs (Trennbare Verben)

| Verb | Meaning | ich-form |
|------|---------|----------|
| aufstehen | to get up | ich stehe ... auf |
| frühstücken | to have breakfast | ich frühstücke |
| arbeiten | to work | ich arbeite |
| schlafen | to sleep | ich schlafe |
| einkaufen | to shop | ich kaufe ... ein |
| aufräumen | to tidy up | ich räume ... auf |

## Time Expressions

- um 7 Uhr (at 7 o'clock)
- morgens (in the morning)
- mittags (at noon)
- abends (in the evening)
- dann (then)
- danach (after that)

## My Daily Routine

- Ich **stehe** um 7 Uhr **auf**. (I get up at 7.)
- Dann **frühstücke** ich. (Then I have breakfast.)
- Ich **arbeite** von 9 bis 17 Uhr. (I work from 9 to 5.)
- Abends **schlafe** ich um 22 Uhr. (In the evening I sleep at 10.)',
  5, true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0003-0005-000000000001', 'a0000000-0000-0000-0003-000000000005', 'multiple_choice',
   'What does "aufstehen" mean?',
   '["to get up","to sleep","to work","to eat"]', 'to get up', 1),
  ('a0000000-0000-0003-0005-000000000002', 'a0000000-0000-0000-0003-000000000005', 'multiple_choice',
   'How do you say "in the evening" in German?',
   '["abends","morgens","mittags","nachts"]', 'abends', 2),
  ('a0000000-0000-0003-0005-000000000003', 'a0000000-0000-0000-0003-000000000005', 'fill_blank',
   'Complete: Ich stehe um 7 Uhr ___. (separable verb part)',
   null, 'auf', 3),
  ('a0000000-0000-0003-0005-000000000004', 'a0000000-0000-0000-0003-000000000005', 'word_order',
   'Arrange: "I have breakfast at 8."',
   '["Ich","frühstücke","um","8","Uhr","."]', 'Ich frühstücke um 8 Uhr .', 4)
ON CONFLICT (id) DO NOTHING;

-- Quiz (order_index 99)
INSERT INTO lessons (id, course_id, slug, title, content, order_index)
VALUES (
  'a0000000-0000-0000-0003-000000000099',
  'a0000000-0000-0000-0000-000000000003',
  'room-03-quiz-family-personal-life',
  'Room 03 Quiz – Family & Personal Life',
  'Test your knowledge of family vocabulary, descriptions, hobbies, personality, and daily routines.',
  99
) ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, lesson_id, type, question, options, correct_answer)
VALUES
  ('a0000000-0000-0003-0099-000000000001', 'a0000000-0000-0000-0003-000000000099', 'multiple_choice',
   'How do you say "grandmother" in German?',
   '["die Großmutter","die Mutter","die Schwester","die Tante"]', 'die Großmutter', 1),
  ('a0000000-0000-0003-0099-000000000002', 'a0000000-0000-0000-0003-000000000099', 'multiple_choice',
   'Fill in: Das ist ___ Schwester. (my sister)',
   '["meine","mein","dein","seine"]', 'meine', 2),
  ('a0000000-0000-0003-0099-000000000003', 'a0000000-0000-0000-0003-000000000099', 'multiple_choice',
   'What does "neugierig" mean?',
   '["curious","shy","patient","funny"]', 'curious', 3),
  ('a0000000-0000-0003-0099-000000000004', 'a0000000-0000-0000-0003-000000000099', 'multiple_choice',
   'Complete: Ich ___ gern Musik. (I like listening to music)',
   '["höre","hörst","hört","hören"]', 'höre', 4),
  ('a0000000-0000-0003-0099-000000000005', 'a0000000-0000-0000-0003-000000000099', 'multiple_choice',
   'Which means "hardworking"?',
   '["fleißig","ruhig","lustig","groß"]', 'fleißig', 5),
  ('a0000000-0000-0003-0099-000000000006', 'a0000000-0000-0000-0003-000000000099', 'fill_blank',
   'Translate "brother" into German.',
   null, 'der Bruder', 6),
  ('a0000000-0000-0003-0099-000000000007', 'a0000000-0000-0000-0003-000000000099', 'fill_blank',
   'Complete: Ich stehe um 7 Uhr ___.',
   null, 'auf', 7),
  ('a0000000-0000-0003-0099-000000000008', 'a0000000-0000-0000-0003-000000000099', 'multiple_choice',
   'What does "aufstehen" mean?',
   '["to get up","to sleep","to cook","to hike"]', 'to get up', 8),
  ('a0000000-0000-0003-0099-000000000009', 'a0000000-0000-0000-0003-000000000099', 'word_order',
   'Arrange: "My father is tall and friendly."',
   '["Mein","Vater","ist","groß","und","freundlich","."]', 'Mein Vater ist groß und freundlich .', 9),
  ('a0000000-0000-0003-0099-000000000010', 'a0000000-0000-0000-0003-000000000099', 'multiple_choice',
   'How do you say "I am calm" in German?',
   '["Ich bin ruhig.","Ich bin groß.","Ich bin jung.","Ich bin fleißig."]', 'Ich bin ruhig.', 10)
ON CONFLICT (id) DO NOTHING;
   'Arrange: "My father is tall and friendly."',
   '["Mein","Vater","ist","groß","und","freundlich","."]', 'Mein Vater ist groß und freundlich .', 9),
  ('a0000000-0000-0003-0099-000000000010', 'a0000000-0000-0000-0003-000000000099', 'multiple_choice',
   'How do you say "I am calm" in German?',
   '["Ich bin ruhig.","Ich bin groß.","Ich bin jung.","Ich bin fleißig."]', 'Ich bin ruhig.', 10)
ON CONFLICT (id) DO NOTHING;
