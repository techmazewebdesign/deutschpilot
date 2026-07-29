-- A1 Room 06 – Getting Around (fixed: HTML content, escaped apostrophes,
-- corrected Lesson 4 column list — was missing slug, had spurious is_published)
-- Course ID: a0000000-0000-0000-0000-000000000006

INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES (
  'a0000000-0000-0000-0000-000000000006',
  'a1-getting-around',
  'A1 Room 06 – Getting Around',
  'Learn to name places in the city, ask for directions, use public transport, and describe locations with prepositions.',
  'A1', 'de', true, NOW()
) ON CONFLICT (id) DO NOTHING;

-- Lesson 1: Orte in der Stadt
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0006-000000000001',
  'a0000000-0000-0000-0000-000000000006',
  'orte-in-der-stadt',
  'Orte in der Stadt',
  '<h2>Orte in der Stadt</h2>
<h3>Places in the City</h3>
<table>
<thead><tr><th>German</th><th>English</th></tr></thead>
<tbody>
<tr><td>der Bahnhof</td><td>train station</td></tr>
<tr><td>die Post</td><td>post office</td></tr>
<tr><td>das Krankenhaus</td><td>hospital</td></tr>
<tr><td>die Bank</td><td>bank</td></tr>
<tr><td>der Supermarkt</td><td>supermarket</td></tr>
<tr><td>die Apotheke</td><td>pharmacy</td></tr>
<tr><td>der Park</td><td>park</td></tr>
<tr><td>das Museum</td><td>museum</td></tr>
</tbody>
</table>
<h3>Talking About Places</h3>
<ul>
<li>Wo ist der Bahnhof? (Where is the train station?)</li>
<li>Es gibt hier eine Apotheke. (There is a pharmacy here.)</li>
<li>Ich gehe zur Post. (I am going to the post office.)</li>
</ul>',
  1, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0006-0001-000000000001', 'a0000000-0000-0000-0006-000000000001', 'multiple_choice',
   'How do you say "train station" in German?',
   '["der Bahnhof","die Post","der Park","das Museum"]'::jsonb, 'der Bahnhof', NOW()),
  ('a0000000-0000-0006-0001-000000000002', 'a0000000-0000-0000-0006-000000000001', 'multiple_choice',
   'What is "die Apotheke" in English?',
   '["pharmacy","bank","hospital","supermarket"]'::jsonb, 'pharmacy', NOW()),
  ('a0000000-0000-0006-0001-000000000003', 'a0000000-0000-0000-0006-000000000001', 'fill_blank',
   'Complete: Wo ist der ___? (train station)',
   null, 'Bahnhof', NOW()),
  ('a0000000-0000-0006-0001-000000000004', 'a0000000-0000-0000-0006-000000000001', 'word_order',
   'Arrange: "I am going to the post office."',
   '["Ich","gehe","zur","Post","."]'::jsonb, 'Ich gehe zur Post .', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lesson 2: Nach dem Weg fragen
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0006-000000000002',
  'a0000000-0000-0000-0000-000000000006',
  'nach-dem-weg-fragen',
  'Nach dem Weg fragen',
  '<h2>Nach dem Weg fragen</h2>
<h3>Asking for Directions</h3>
<ul>
<li>Entschuldigung, wo ist der Bahnhof? (Excuse me, where is the train station?)</li>
<li>Wie komme ich zur Bank? (How do I get to the bank?)</li>
<li>Ist das weit von hier? (Is that far from here?)</li>
</ul>
<h3>Giving Directions</h3>
<ul>
<li>Gehen Sie geradeaus. (Go straight ahead.)</li>
<li>Biegen Sie links/rechts ab. (Turn left/right.)</li>
<li>Es ist neben der Post. (It is next to the post office.)</li>
<li>Es ist gegenüber vom Park. (It is across from the park.)</li>
<li>Das ist nicht weit. (That is not far.)</li>
</ul>
<h3>A Short Dialogue</h3>
<p><strong>Tourist:</strong> Entschuldigung, wie komme ich zum Museum? (Excuse me, how do I get to the museum?)<br>
<strong>Passant:</strong> Gehen Sie geradeaus und dann links. Es ist neben der Bank. (Go straight ahead and then left. It is next to the bank.)<br>
<strong>Tourist:</strong> Vielen Dank! (Thank you very much!)</p>',
  2, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0006-0002-000000000001', 'a0000000-0000-0000-0006-000000000002', 'multiple_choice',
   'How do you ask "How do I get to the bank?"',
   '["Wie komme ich zur Bank?","Wo wohnst du?","Was ist die Bank?","Hast du eine Bank?"]'::jsonb, 'Wie komme ich zur Bank?', NOW()),
  ('a0000000-0000-0006-0002-000000000002', 'a0000000-0000-0000-0006-000000000002', 'multiple_choice',
   'What does "Gehen Sie geradeaus" mean?',
   '["Go straight ahead.","Turn left.","Turn right.","Stop here."]'::jsonb, 'Go straight ahead.', NOW()),
  ('a0000000-0000-0006-0002-000000000003', 'a0000000-0000-0000-0006-000000000002', 'fill_blank',
   'Complete: Biegen Sie ___ ab. (turn left)',
   null, 'links', NOW()),
  ('a0000000-0000-0006-0002-000000000004', 'a0000000-0000-0000-0006-000000000002', 'word_order',
   'Arrange: "It is next to the post office."',
   '["Es","ist","neben","der","Post","."]'::jsonb, 'Es ist neben der Post .', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lesson 3: Öffentliche Verkehrsmittel
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0006-000000000003',
  'a0000000-0000-0000-0000-000000000006',
  'oeffentliche-verkehrsmittel',
  'Öffentliche Verkehrsmittel',
  '<h2>Öffentliche Verkehrsmittel</h2>
<h3>Public Transport Vocabulary</h3>
<table>
<thead><tr><th>German</th><th>English</th></tr></thead>
<tbody>
<tr><td>der Bus</td><td>bus</td></tr>
<tr><td>die Bahn / der Zug</td><td>train</td></tr>
<tr><td>die U-Bahn</td><td>subway / metro</td></tr>
<tr><td>die Straßenbahn</td><td>tram</td></tr>
<tr><td>die Haltestelle</td><td>bus/tram stop</td></tr>
<tr><td>der Fahrschein / das Ticket</td><td>ticket</td></tr>
</tbody>
</table>
<h3>Useful Phrases</h3>
<ul>
<li>Wo ist die nächste Haltestelle? (Where is the nearest stop?)</li>
<li>Welcher Bus fährt zum Bahnhof? (Which bus goes to the train station?)</li>
<li>Ich brauche ein Ticket, bitte. (I need a ticket, please.)</li>
<li>Wann fährt der nächste Zug? (When does the next train leave?)</li>
</ul>',
  3, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0006-0003-000000000001', 'a0000000-0000-0000-0006-000000000003', 'multiple_choice',
   'How do you say "subway/metro" in German?',
   '["die U-Bahn","der Bus","die Bahn","die Straßenbahn"]'::jsonb, 'die U-Bahn', NOW()),
  ('a0000000-0000-0006-0003-000000000002', 'a0000000-0000-0000-0006-000000000003', 'multiple_choice',
   'What is "die Haltestelle"?',
   '["bus/tram stop","train station","ticket","bus"]'::jsonb, 'bus/tram stop', NOW()),
  ('a0000000-0000-0006-0003-000000000003', 'a0000000-0000-0000-0006-000000000003', 'fill_blank',
   'Complete: Ich brauche ein ___, bitte. (ticket)',
   null, 'Ticket', NOW()),
  ('a0000000-0000-0006-0003-000000000004', 'a0000000-0000-0000-0006-000000000003', 'word_order',
   'Arrange: "When does the next train leave?"',
   '["Wann","fährt","der","nächste","Zug","?"]'::jsonb, 'Wann fährt der nächste Zug ?', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lesson 4: Präpositionen des Ortes (column list fixed: slug added, is_published removed)
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0006-000000000004',
  'a0000000-0000-0000-0000-000000000006',
  'praepositionen-des-ortes',
  'Präpositionen des Ortes',
  '<h2>Präpositionen des Ortes</h2>
<h3>Prepositions of Place</h3>
<table>
<thead><tr><th>German</th><th>English</th></tr></thead>
<tbody>
<tr><td>neben</td><td>next to</td></tr>
<tr><td>zwischen</td><td>between</td></tr>
<tr><td>gegenüber</td><td>across from / opposite</td></tr>
<tr><td>vor</td><td>in front of</td></tr>
<tr><td>hinter</td><td>behind</td></tr>
<tr><td>in</td><td>in</td></tr>
<tr><td>auf</td><td>on</td></tr>
</tbody>
</table>
<h3>Examples (Dative case for location)</h3>
<ul>
<li>Die Bank ist <strong>neben der</strong> Post. (The bank is next to the post office.)</li>
<li>Der Park ist <strong>zwischen dem</strong> Museum und <strong>der</strong> Bank. (The park is between the museum and the bank.)</li>
<li>Das Café ist <strong>gegenüber vom</strong> Bahnhof. (The café is across from the train station.)</li>
<li>Die Haltestelle ist <strong>vor dem</strong> Supermarkt. (The stop is in front of the supermarket.)</li>
</ul>
<h3>Note</h3>
<p>When describing a fixed location (not motion), these prepositions take the dative case: <em>der → dem</em>, <em>die → der</em>, <em>das → dem</em>.</p>',
  4, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0006-0004-000000000001', 'a0000000-0000-0000-0006-000000000004', 'multiple_choice',
   'How do you say "between" in German?',
   '["zwischen","neben","hinter","vor"]'::jsonb, 'zwischen', NOW()),
  ('a0000000-0000-0006-0004-000000000002', 'a0000000-0000-0000-0006-000000000004', 'multiple_choice',
   'What does "gegenüber" mean?',
   '["across from","behind","in front of","in"]'::jsonb, 'across from', NOW()),
  ('a0000000-0000-0006-0004-000000000003', 'a0000000-0000-0000-0006-000000000004', 'fill_blank',
   'Complete: Die Bank ist ___ der Post. (next to)',
   null, 'neben', NOW()),
  ('a0000000-0000-0006-0004-000000000004', 'a0000000-0000-0000-0006-000000000004', 'word_order',
   'Arrange: "The stop is in front of the supermarket."',
   '["Die","Haltestelle","ist","vor","dem","Supermarkt","."]'::jsonb, 'Die Haltestelle ist vor dem Supermarkt .', NOW())
ON CONFLICT (id) DO NOTHING;

-- Lesson 5: Reisen planen
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0006-000000000005',
  'a0000000-0000-0000-0000-000000000006',
  'reisen-planen',
  'Reisen planen',
  '<h2>Reisen planen</h2>
<h3>Planning a Trip</h3>
<ul>
<li>Ich möchte nach Berlin fahren. (I would like to travel to Berlin.)</li>
<li>Wann fährt der Zug ab? (When does the train depart?)</li>
<li>Muss ich umsteigen? (Do I have to change/transfer?)</li>
<li>Ich brauche eine Hin- und Rückfahrkarte. (I need a round-trip ticket.)</li>
</ul>
<h3>Vocabulary</h3>
<table>
<thead><tr><th>German</th><th>English</th></tr></thead>
<tbody>
<tr><td>die Abfahrt</td><td>departure</td></tr>
<tr><td>die Ankunft</td><td>arrival</td></tr>
<tr><td>umsteigen</td><td>to change/transfer</td></tr>
<tr><td>die Hinfahrt</td><td>outbound trip</td></tr>
<tr><td>die Rückfahrt</td><td>return trip</td></tr>
<tr><td>der Fahrplan</td><td>timetable</td></tr>
</tbody>
</table>
<h3>A Short Dialogue</h3>
<p><strong>Reisender:</strong> Ich möchte eine Fahrkarte nach München, bitte. (I would like a ticket to Munich, please.)<br>
<strong>Beamter:</strong> Hin- und Rückfahrt oder nur Hinfahrt? (Round trip or one-way?)<br>
<strong>Reisender:</strong> Hin- und Rückfahrt, bitte. Muss ich umsteigen? (Round trip, please. Do I have to transfer?)<br>
<strong>Beamter:</strong> Nein, der Zug fährt direkt. (No, the train goes direct.)</p>',
  5, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0006-0005-000000000001', 'a0000000-0000-0000-0006-000000000005', 'multiple_choice',
   'How do you say "departure" in German?',
   '["die Abfahrt","die Ankunft","der Fahrplan","die Rückfahrt"]'::jsonb, 'die Abfahrt', NOW()),
  ('a0000000-0000-0006-0005-000000000002', 'a0000000-0000-0000-0006-000000000005', 'multiple_choice',
   'What does "umsteigen" mean?',
   '["to change/transfer","to depart","to arrive","to buy a ticket"]'::jsonb, 'to change/transfer', NOW()),
  ('a0000000-0000-0006-0005-000000000003', 'a0000000-0000-0000-0006-000000000005', 'fill_blank',
   'Complete: Muss ich ___? (transfer)',
   null, 'umsteigen', NOW()),
  ('a0000000-0000-0006-0005-000000000004', 'a0000000-0000-0000-0006-000000000005', 'word_order',
   'Arrange: "I would like to travel to Berlin."',
   '["Ich","möchte","nach","Berlin","fahren","."]'::jsonb, 'Ich möchte nach Berlin fahren .', NOW())
ON CONFLICT (id) DO NOTHING;

-- Quiz (order_index 99)
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0006-000000000099',
  'a0000000-0000-0000-0000-000000000006',
  'room-06-quiz-getting-around',
  'Room 06 Quiz – Getting Around',
  '<h2>Checkpoint Quiz</h2><p>Test your knowledge of city places, directions, public transport, prepositions, and trip planning.</p>',
  99, NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, created_at)
VALUES
  ('a0000000-0000-0006-0099-000000000001', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'What is "der Bahnhof" in English?',
   '["train station","bus stop","airport","museum"]'::jsonb, 'train station', NOW()),
  ('a0000000-0000-0006-0099-000000000002', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'How do you ask "Where is the train station?"',
   '["Wo ist der Bahnhof?","Wie heißt du?","Was ist das?","Wann kommst du?"]'::jsonb, 'Wo ist der Bahnhof?', NOW()),
  ('a0000000-0000-0006-0099-000000000003', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'What does "Gehen Sie geradeaus" mean?',
   '["Go straight ahead.","Turn around.","Stop.","Wait here."]'::jsonb, 'Go straight ahead.', NOW()),
  ('a0000000-0000-0006-0099-000000000004', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'How do you say "ticket" in German?',
   '["das Ticket","die Haltestelle","der Fahrplan","die Abfahrt"]'::jsonb, 'das Ticket', NOW()),
  ('a0000000-0000-0006-0099-000000000005', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'What does "zwischen" mean?',
   '["between","next to","behind","in front of"]'::jsonb, 'between', NOW()),
  ('a0000000-0000-0006-0099-000000000006', 'a0000000-0000-0000-0006-000000000099', 'fill_blank',
   'Translate "arrival" into German.',
   null, 'die Ankunft', NOW()),
  ('a0000000-0000-0006-0099-000000000007', 'a0000000-0000-0000-0006-000000000099', 'fill_blank',
   'Complete: Die Bank ist ___ der Post. (next to)',
   null, 'neben', NOW()),
  ('a0000000-0000-0006-0099-000000000008', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'What does "umsteigen" mean?',
   '["to transfer","to buy","to travel","to wait"]'::jsonb, 'to transfer', NOW()),
  ('a0000000-0000-0006-0099-000000000009', 'a0000000-0000-0000-0006-000000000099', 'word_order',
   'Arrange: "How do I get to the museum?"',
   '["Wie","komme","ich","zum","Museum","?"]'::jsonb, 'Wie komme ich zum Museum ?', NOW()),
  ('a0000000-0000-0006-0099-000000000010', 'a0000000-0000-0000-0006-000000000099', 'multiple_choice',
   'What is "die U-Bahn" in English?',
   '["subway/metro","bus","tram","train"]'::jsonb, 'subway/metro', NOW())
ON CONFLICT (id) DO NOTHING;
