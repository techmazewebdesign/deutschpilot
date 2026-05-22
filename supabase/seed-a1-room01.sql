-- ============================================================
-- DeutschPilot – A1 Room 01: Greetings & Introductions
-- Run AFTER schema-courses.sql in Supabase SQL Editor.
-- Safe to re-run (ON CONFLICT DO NOTHING).
-- ============================================================

-- ── COURSE ──────────────────────────────────────────────────
INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'greetings',
  'A1 Room 01 – Greetings & Introductions',
  'Your first step into German. Master essential greetings, introduce yourself, and hold your first basic conversations with confidence.',
  'A1', 'de', TRUE, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ── LESSONS ─────────────────────────────────────────────────

-- Lesson 1: Hallo & Begrüßungen
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0001-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'a1-hallo-begrussungen',
  'Hallo & Begrüßungen',
  '<h2>Hallo! – Greetings in German</h2>
<p>In this lesson you will learn the most important German greetings for different times of day and different situations – both formal and informal.</p>

<h3>1. Greetings by Time of Day</h3>
<table>
  <thead><tr><th>German</th><th>English</th><th>When</th></tr></thead>
  <tbody>
    <tr><td><strong>Guten Morgen</strong></td><td>Good morning</td><td>Until ~10:00 am</td></tr>
    <tr><td><strong>Guten Tag</strong></td><td>Good day / Hello</td><td>10:00 – 18:00</td></tr>
    <tr><td><strong>Guten Abend</strong></td><td>Good evening</td><td>After 18:00</td></tr>
    <tr><td><strong>Gute Nacht</strong></td><td>Good night</td><td>Before sleeping</td></tr>
  </tbody>
</table>

<h3>2. Casual / Informal Greetings</h3>
<ul>
  <li><strong>Hallo</strong> – Hello (any time, with friends and family)</li>
  <li><strong>Hi</strong> – Hi (very casual, mostly with young people)</li>
  <li><strong>Hey</strong> – Hey (very informal)</li>
  <li><strong>Servus</strong> – Hey / Bye (southern Germany and Austria)</li>
  <li><strong>Moin</strong> – Morning / Hello (northern Germany)</li>
</ul>

<h3>3. Grammar Note – Formal vs. Informal</h3>
<p>German has two ways to address people:</p>
<ul>
  <li>Use <strong>du</strong> (informal) with friends, family, children, and peers.</li>
  <li>Use <strong>Sie</strong> (formal) with strangers, officials, and older people.</li>
</ul>
<p>When in doubt, use the formal <em>Sie</em> – it is always polite.</p>

<h3>4. Key Vocabulary</h3>
<ul>
  <li><strong>der Gruß</strong> – the greeting</li>
  <li><strong>begrüßen</strong> – to greet</li>
  <li><strong>formell</strong> – formal</li>
  <li><strong>informell</strong> – informal</li>
  <li><strong>willkommen</strong> – welcome</li>
</ul>

<h3>5. Example Sentences</h3>
<ul>
  <li>Guten Morgen, Frau Müller! – Good morning, Ms. Müller!</li>
  <li>Hallo! Wie geht es dir? – Hello! How are you? (informal)</li>
  <li>Guten Tag! Wie heißen Sie? – Good day! What is your name? (formal)</li>
  <li>Guten Abend! Schön, Sie zu sehen. – Good evening! Nice to see you.</li>
</ul>

<h3>6. Mini Dialogue</h3>
<p><strong>Anna:</strong> Hallo! Guten Morgen!<br>
<strong>Ben:</strong> Guten Morgen, Anna! Wie geht es dir?<br>
<strong>Anna:</strong> Danke, gut. Und dir?<br>
<strong>Ben:</strong> Auch gut, danke! Schönen Tag noch!<br>
<strong>Anna:</strong> Dir auch!</p>',
  1, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 2: Ich heiße / Mein Name ist
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0001-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'a1-ich-heisse',
  'Ich heiße … / Mein Name ist …',
  '<h2>Sich vorstellen – Introducing Yourself</h2>
<p>In this lesson you will learn how to introduce yourself in German: your name, your age, and how to ask others for their name.</p>

<h3>1. Saying Your Name</h3>
<table>
  <thead><tr><th>German phrase</th><th>English meaning</th></tr></thead>
  <tbody>
    <tr><td><strong>Ich heiße …</strong></td><td>My name is … (I am called …)</td></tr>
    <tr><td><strong>Mein Name ist …</strong></td><td>My name is …</td></tr>
    <tr><td><strong>Ich bin …</strong></td><td>I am …</td></tr>
  </tbody>
</table>

<h3>2. Grammar – Verb "heißen" (to be called)</h3>
<table>
  <thead><tr><th>Pronoun</th><th>Form</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>ich</td><td>heiße</td><td>Ich heiße Lena.</td></tr>
    <tr><td>du</td><td>heißt</td><td>Wie heißt du?</td></tr>
    <tr><td>er / sie / es</td><td>heißt</td><td>Er heißt Thomas.</td></tr>
    <tr><td>wir</td><td>heißen</td><td>Wir heißen Anna und Tom.</td></tr>
    <tr><td>Sie (formal)</td><td>heißen</td><td>Wie heißen Sie?</td></tr>
  </tbody>
</table>

<h3>3. Asking for Someone's Name</h3>
<ul>
  <li><strong>Wie heißt du?</strong> – What is your name? (informal)</li>
  <li><strong>Wie heißen Sie?</strong> – What is your name? (formal)</li>
  <li><strong>Wie ist dein Name?</strong> – What is your name? (casual written)</li>
  <li><strong>Darf ich fragen, wie Sie heißen?</strong> – May I ask your name? (very polite)</li>
</ul>

<h3>4. Key Vocabulary</h3>
<ul>
  <li><strong>der Vorname</strong> – first name</li>
  <li><strong>der Nachname / Familienname</strong> – last name / surname</li>
  <li><strong>das Alter</strong> – age</li>
  <li><strong>Ich bin … Jahre alt.</strong> – I am … years old.</li>
  <li><strong>Wie alt bist du?</strong> – How old are you? (informal)</li>
  <li><strong>Schön, dich kennenzulernen!</strong> – Nice to meet you! (informal)</li>
  <li><strong>Schön, Sie kennenzulernen!</strong> – Nice to meet you! (formal)</li>
</ul>

<h3>5. Example Sentences</h3>
<ul>
  <li>Hallo! Ich heiße Sara. Wie heißt du? – Hello! My name is Sara. What is your name?</li>
  <li>Mein Name ist Klaus Bauer. – My name is Klaus Bauer.</li>
  <li>Ich bin 28 Jahre alt. – I am 28 years old.</li>
  <li>Schön, dich kennenzulernen, Marco! – Nice to meet you, Marco!</li>
</ul>

<h3>6. Mini Dialogue</h3>
<p><strong>Sara:</strong> Hallo! Ich heiße Sara. Wie heißt du?<br>
<strong>Kerim:</strong> Hallo Sara! Ich heiße Kerim. Schön, dich kennenzulernen!<br>
<strong>Sara:</strong> Schön, dich auch kennenzulernen. Wie alt bist du, Kerim?<br>
<strong>Kerim:</strong> Ich bin 28 Jahre alt. Und du?<br>
<strong>Sara:</strong> Ich bin 25. Woher kommst du?<br>
<strong>Kerim:</strong> Ich komme aus der Türkei. Und du?<br>
<strong>Sara:</strong> Ich komme aus Brasilien.</p>',
  2, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 3: Wie geht es dir?
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0001-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'a1-wie-geht-es-dir',
  'Wie geht es dir?',
  '<h2>Wie geht es dir? – How Are You?</h2>
<p>In this lesson you will learn how to ask someone how they are and how to respond naturally in German.</p>

<h3>1. How to Ask "How Are You?"</h3>
<table>
  <thead><tr><th>German</th><th>English</th><th>Register</th></tr></thead>
  <tbody>
    <tr><td><strong>Wie geht es dir?</strong></td><td>How are you?</td><td>Informal</td></tr>
    <tr><td><strong>Wie geht es Ihnen?</strong></td><td>How are you?</td><td>Formal</td></tr>
    <tr><td><strong>Wie geht's?</strong></td><td>How's it going?</td><td>Very casual</td></tr>
    <tr><td><strong>Alles gut?</strong></td><td>All good?</td><td>Very casual</td></tr>
  </tbody>
</table>

<h3>2. How to Respond</h3>
<table>
  <thead><tr><th>German</th><th>English</th></tr></thead>
  <tbody>
    <tr><td><strong>Sehr gut, danke!</strong></td><td>Very good, thank you!</td></tr>
    <tr><td><strong>Gut, danke.</strong></td><td>Good, thank you.</td></tr>
    <tr><td><strong>Es geht.</strong></td><td>So-so. / Not bad.</td></tr>
    <tr><td><strong>Nicht so gut.</strong></td><td>Not so good.</td></tr>
    <tr><td><strong>Schlecht.</strong></td><td>Bad.</td></tr>
    <tr><td><strong>Super! Prima!</strong></td><td>Super! Great!</td></tr>
    <tr><td><strong>Müde, aber gut.</strong></td><td>Tired, but good.</td></tr>
  </tbody>
</table>

<h3>3. Grammar – "es geht mir …"</h3>
<p>The structure <em>Es geht mir gut</em> uses the dative pronoun:</p>
<ul>
  <li>Es geht <strong>mir</strong> gut. – I am doing well. (lit. "It goes well for me.")</li>
  <li>Es geht <strong>dir</strong> gut. – You are doing well. (informal)</li>
  <li>Es geht <strong>ihm/ihr</strong> gut. – He/She is doing well.</li>
  <li>Wie geht es <strong>Ihnen</strong>? – How are you? (formal)</li>
</ul>

<h3>4. Key Vocabulary</h3>
<ul>
  <li><strong>danke</strong> – thank you</li>
  <li><strong>bitte</strong> – please / you're welcome</li>
  <li><strong>und dir? / und Ihnen?</strong> – and you? (informal / formal)</li>
  <li><strong>müde</strong> – tired</li>
  <li><strong>krank</strong> – sick / ill</li>
  <li><strong>glücklich</strong> – happy</li>
  <li><strong>gestresst</strong> – stressed</li>
</ul>

<h3>5. Example Sentences</h3>
<ul>
  <li>Wie geht es dir, Maria? – How are you, Maria?</li>
  <li>Danke, sehr gut! Und dir? – Thank you, very good! And you?</li>
  <li>Es geht mir nicht so gut heute. – I am not feeling so well today.</li>
  <li>Prima, danke! Wie geht es Ihnen? – Great, thank you! How are you? (formal)</li>
</ul>

<h3>6. Mini Dialogue</h3>
<p><strong>Lena:</strong> Hallo, Max! Wie geht's?<br>
<strong>Max:</strong> Hallo, Lena! Gut, danke. Und dir?<br>
<strong>Lena:</strong> Nicht so gut. Ich bin ein bisschen müde.<br>
<strong>Max:</strong> Oh, das tut mir leid. Ich hoffe, es geht dir bald besser!<br>
<strong>Lena:</strong> Danke, das ist sehr nett von dir!</p>',
  3, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 4: Woher kommst du?
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0001-000000000004',
  'a0000000-0000-0000-0000-000000000001',
  'a1-woher-kommst-du',
  'Woher kommst du?',
  '<h2>Woher kommst du? – Where Are You From?</h2>
<p>In this lesson you will learn how to say where you are from and ask others about their origin.</p>

<h3>1. Asking About Origin</h3>
<table>
  <thead><tr><th>German</th><th>English</th><th>Register</th></tr></thead>
  <tbody>
    <tr><td><strong>Woher kommst du?</strong></td><td>Where are you from?</td><td>Informal</td></tr>
    <tr><td><strong>Woher kommen Sie?</strong></td><td>Where are you from?</td><td>Formal</td></tr>
    <tr><td><strong>Wo bist du aufgewachsen?</strong></td><td>Where did you grow up?</td><td>Informal</td></tr>
    <tr><td><strong>Aus welchem Land kommst du?</strong></td><td>What country are you from?</td><td>Informal</td></tr>
  </tbody>
</table>

<h3>2. Saying Where You Are From</h3>
<ul>
  <li><strong>Ich komme aus Deutschland.</strong> – I am from Germany.</li>
  <li><strong>Ich komme aus dem Iran.</strong> – I am from Iran.</li>
  <li><strong>Ich komme aus der Türkei.</strong> – I am from Turkey.</li>
  <li><strong>Ich komme aus den USA.</strong> – I am from the USA.</li>
  <li>Note: Use <em>dem</em> for masculine/neuter countries, <em>der</em> for feminine countries, <em>den</em> for plural country names.</li>
</ul>

<h3>3. Grammar – Verb "kommen" (to come)</h3>
<table>
  <thead><tr><th>Pronoun</th><th>Form</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>ich</td><td>komme</td><td>Ich komme aus Brasilien.</td></tr>
    <tr><td>du</td><td>kommst</td><td>Woher kommst du?</td></tr>
    <tr><td>er / sie / es</td><td>kommt</td><td>Sie kommt aus Frankreich.</td></tr>
    <tr><td>wir</td><td>kommen</td><td>Wir kommen aus der Schweiz.</td></tr>
    <tr><td>Sie (formal)</td><td>kommen</td><td>Woher kommen Sie?</td></tr>
  </tbody>
</table>

<h3>4. Country Vocabulary</h3>
<ul>
  <li><strong>Deutschland</strong> – Germany</li>
  <li><strong>Österreich</strong> – Austria</li>
  <li><strong>die Schweiz</strong> – Switzerland</li>
  <li><strong>die Türkei</strong> – Turkey</li>
  <li><strong>der Iran</strong> – Iran</li>
  <li><strong>Großbritannien</strong> – Great Britain</li>
  <li><strong>die USA / Amerika</strong> – the USA / America</li>
  <li><strong>Brasilien</strong> – Brazil</li>
  <li><strong>China</strong> – China</li>
  <li><strong>Indien</strong> – India</li>
  <li><strong>die Arabische Welt</strong> – the Arab world</li>
</ul>

<h3>5. Example Sentences</h3>
<ul>
  <li>Ich komme aus Österreich. Und du? – I am from Austria. And you?</li>
  <li>Woher kommen Sie, Herr Schmidt? – Where are you from, Mr. Schmidt?</li>
  <li>Sie kommt aus Japan. Er kommt aus Ägypten. – She is from Japan. He is from Egypt.</li>
</ul>

<h3>6. Mini Dialogue</h3>
<p><strong>Paula:</strong> Hallo! Ich bin Paula. Woher kommst du?<br>
<strong>Ali:</strong> Hallo Paula! Ich komme aus dem Iran, aus Teheran. Und du?<br>
<strong>Paula:</strong> Ich komme aus Deutschland, aus Berlin.<br>
<strong>Ali:</strong> Oh, interessant! Ich lerne jetzt in Deutschland.<br>
<strong>Paula:</strong> Super! Wie lange bist du schon hier?<br>
<strong>Ali:</strong> Seit drei Monaten. Ich lerne Deutsch bei DeutschPilot!</p>',
  4, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 5: Tschüss, bis bald
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0001-000000000005',
  'a0000000-0000-0000-0000-000000000001',
  'a1-tschuss-bis-bald',
  'Tschüss, bis bald!',
  '<h2>Auf Wiedersehen! – Saying Goodbye in German</h2>
<p>In this lesson you will learn the many ways to say goodbye in German and which to use in different situations.</p>

<h3>1. Common Farewells</h3>
<table>
  <thead><tr><th>German</th><th>English</th><th>Register</th></tr></thead>
  <tbody>
    <tr><td><strong>Auf Wiedersehen!</strong></td><td>Goodbye! (lit. "Until we see again")</td><td>Formal</td></tr>
    <tr><td><strong>Tschüss!</strong></td><td>Bye! / Cheerio!</td><td>Informal</td></tr>
    <tr><td><strong>Tschau!</strong></td><td>Ciao! / Bye!</td><td>Very casual</td></tr>
    <tr><td><strong>Bis bald!</strong></td><td>See you soon!</td><td>Casual</td></tr>
    <tr><td><strong>Bis später!</strong></td><td>See you later!</td><td>Casual</td></tr>
    <tr><td><strong>Bis morgen!</strong></td><td>See you tomorrow!</td><td>Casual</td></tr>
    <tr><td><strong>Bis dann!</strong></td><td>See you then!</td><td>Casual</td></tr>
    <tr><td><strong>Gute Nacht!</strong></td><td>Good night!</td><td>Both</td></tr>
    <tr><td><strong>Schönen Tag noch!</strong></td><td>Have a nice day!</td><td>Both</td></tr>
    <tr><td><strong>Schönes Wochenende!</strong></td><td>Have a nice weekend!</td><td>Both</td></tr>
    <tr><td><strong>Servus!</strong></td><td>Goodbye! (southern Germany/Austria)</td><td>Casual</td></tr>
  </tbody>
</table>

<h3>2. Grammar – "bis" (until)</h3>
<p>The word <em>bis</em> is used to form many farewell expressions:</p>
<ul>
  <li><strong>bis bald</strong> – until soon (= see you soon)</li>
  <li><strong>bis später</strong> – until later (= see you later)</li>
  <li><strong>bis morgen</strong> – until tomorrow</li>
  <li><strong>bis nächste Woche</strong> – until next week</li>
  <li><strong>bis Montag</strong> – until Monday</li>
</ul>

<h3>3. Polite Additions</h3>
<ul>
  <li><strong>Vielen Dank!</strong> – Thank you very much!</li>
  <li><strong>Danke schön!</strong> – Thank you kindly!</li>
  <li><strong>Es war schön, dich zu sehen.</strong> – It was nice to see you. (informal)</li>
  <li><strong>Alles Gute!</strong> – All the best!</li>
  <li><strong>Pass auf dich auf!</strong> – Take care! (informal)</li>
  <li><strong>Mach's gut!</strong> – Take care! (informal, lit. "Do it well!")</li>
</ul>

<h3>4. Example Sentences</h3>
<ul>
  <li>Tschüss, Lisa! Bis morgen! – Bye, Lisa! See you tomorrow!</li>
  <li>Auf Wiedersehen, Herr Meier. Schönes Wochenende! – Goodbye, Mr. Meier. Have a nice weekend!</li>
  <li>Mach's gut! Bis bald! – Take care! See you soon!</li>
  <li>Gute Nacht! Schlaf gut! – Good night! Sleep well!</li>
</ul>

<h3>5. Mini Dialogue</h3>
<p><strong>Tom:</strong> Es war schön, mit dir zu reden, Mia!<br>
<strong>Mia:</strong> Ja, wirklich! Wir müssen das wiederholen.<br>
<strong>Tom:</strong> Absolut! Wann sehen wir uns wieder?<br>
<strong>Mia:</strong> Vielleicht am Donnerstag?<br>
<strong>Tom:</strong> Super! Bis Donnerstag dann!<br>
<strong>Mia:</strong> Tschüss, Tom! Mach's gut!<br>
<strong>Tom:</strong> Du auch! Auf Wiedersehen!</p>',
  5, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Checkpoint Quiz Lesson (order_index = 99 marks it as quiz)
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0001-000000000099',
  'a0000000-0000-0000-0000-000000000001',
  'a1-room01-checkpoint',
  'A1 Room 01 – Checkpoint Quiz',
  '',
  99, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ── EXERCISES – Lesson 1: Hallo & Begrüßungen ──────────────

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  (
    'a0000000-0000-0001-0001-000000000001',
    'a0000000-0000-0000-0001-000000000001',
    'Was bedeutet "Guten Morgen"?',
    'multiple_choice',
    '["Good morning", "Good evening", "Good night", "Goodbye"]'::jsonb,
    'Good morning',
    '"Guten Morgen" is used until approximately 10:00 am.',
    NOW()
  ),
  (
    'a0000000-0000-0001-0001-000000000002',
    'a0000000-0000-0000-0001-000000000001',
    'Which greeting is FORMAL in German?',
    'multiple_choice',
    '["Hallo", "Hi", "Guten Tag", "Hey"]'::jsonb,
    'Guten Tag',
    '"Guten Tag" (Good day) is the standard formal daytime greeting.',
    NOW()
  ),
  (
    'a0000000-0000-0001-0001-000000000003',
    'a0000000-0000-0000-0001-000000000001',
    'Fill in the blank: "___ Abend!" (Good evening)',
    'fill_blank',
    NULL,
    'Guten',
    '"Guten Abend" means "Good evening" and is used after 18:00.',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ── EXERCISES – Lesson 2: Ich heiße ──────────────────────

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  (
    'a0000000-0000-0001-0002-000000000001',
    'a0000000-0000-0000-0001-000000000002',
    'How do you say "My name is" in German?',
    'multiple_choice',
    '["Ich heiße", "Du heißt", "Er heißt", "Wir heißen"]'::jsonb,
    'Ich heiße',
    '"Ich heiße …" is the standard way to say "My name is …" in the first person.',
    NOW()
  ),
  (
    'a0000000-0000-0001-0002-000000000002',
    'a0000000-0000-0000-0001-000000000002',
    'What is the correct formal question for "What is your name?"',
    'multiple_choice',
    '["Wie heißt du?", "Wie heißen Sie?", "Wie ist dein Name?", "Wie bin ich?"]'::jsonb,
    'Wie heißen Sie?',
    '"Wie heißen Sie?" uses the formal pronoun "Sie" and is used with strangers and in professional contexts.',
    NOW()
  ),
  (
    'a0000000-0000-0001-0002-000000000003',
    'a0000000-0000-0000-0001-000000000002',
    'Correct the sentence: "Ich heiße 30 Jahre alt."',
    'correction',
    NULL,
    'Ich bin 30 Jahre alt.',
    'Age is expressed with "sein" (to be): "Ich bin … Jahre alt." not "heißen".',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ── EXERCISES – Lesson 3: Wie geht es dir? ───────────────

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  (
    'a0000000-0000-0001-0003-000000000001',
    'a0000000-0000-0000-0001-000000000003',
    'How do you say "How are you?" informally?',
    'multiple_choice',
    '["Wie geht es Ihnen?", "Wie geht es dir?", "Wie heißt du?", "Woher kommst du?"]'::jsonb,
    'Wie geht es dir?',
    '"Wie geht es dir?" uses the informal "dir". The formal version is "Wie geht es Ihnen?".',
    NOW()
  ),
  (
    'a0000000-0000-0001-0003-000000000002',
    'a0000000-0000-0000-0001-000000000003',
    'Which response means "So-so / Not bad"?',
    'multiple_choice',
    '["Sehr gut", "Schlecht", "Es geht", "Super"]'::jsonb,
    'Es geht',
    '"Es geht" means "so-so" or "not bad" – a neutral, moderate response.',
    NOW()
  ),
  (
    'a0000000-0000-0001-0003-000000000003',
    'a0000000-0000-0000-0001-000000000003',
    'Fill in the blank: "Es geht ___ gut." (I am doing well.)',
    'fill_blank',
    NULL,
    'mir',
    '"Es geht mir gut" uses the dative pronoun "mir" (to me). This is the standard structure.',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ── EXERCISES – Lesson 4: Woher kommst du? ───────────────

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  (
    'a0000000-0000-0001-0004-000000000001',
    'a0000000-0000-0000-0001-000000000004',
    'How do you say "I am from Germany"?',
    'multiple_choice',
    '["Ich komme aus Deutschland.", "Ich bin aus Deutschland.", "Ich gehe nach Deutschland.", "Ich heiße Deutschland."]'::jsonb,
    'Ich komme aus Deutschland.',
    '"Ich komme aus …" (I come from …) is the standard structure for saying where you are from.',
    NOW()
  ),
  (
    'a0000000-0000-0001-0004-000000000002',
    'a0000000-0000-0000-0001-000000000004',
    'What is the German word for "Turkey"?',
    'multiple_choice',
    '["Türkei", "Turkei", "Turkiye", "Türkie"]'::jsonb,
    'Türkei',
    'The German word for Turkey is "die Türkei" (feminine article "die").',
    NOW()
  ),
  (
    'a0000000-0000-0001-0004-000000000003',
    'a0000000-0000-0000-0001-000000000004',
    'Fill in the blank: "Woher ___ du?" (Where are you from? – informal)',
    'fill_blank',
    NULL,
    'kommst',
    '"Woher kommst du?" – "kommen" conjugated for "du" is "kommst".',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ── EXERCISES – Lesson 5: Tschüss, bis bald ──────────────

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  (
    'a0000000-0000-0001-0005-000000000001',
    'a0000000-0000-0000-0001-000000000005',
    'Which farewell is FORMAL in German?',
    'multiple_choice',
    '["Tschüss!", "Tschau!", "Auf Wiedersehen!", "Mach's gut!"]'::jsonb,
    'Auf Wiedersehen!',
    '"Auf Wiedersehen" is the formal goodbye, used in professional and official contexts.',
    NOW()
  ),
  (
    'a0000000-0000-0001-0005-000000000002',
    'a0000000-0000-0000-0001-000000000005',
    'What does "Bis morgen!" mean?',
    'multiple_choice',
    '["See you soon!", "See you tomorrow!", "See you later!", "Goodbye forever!"]'::jsonb,
    'See you tomorrow!',
    '"Bis morgen" = until tomorrow = see you tomorrow.',
    NOW()
  ),
  (
    'a0000000-0000-0001-0005-000000000003',
    'a0000000-0000-0000-0001-000000000005',
    'Fill in the blank: "___ bald!" (See you soon!)',
    'fill_blank',
    NULL,
    'Bis',
    '"Bis bald!" = "Until soon!" = See you soon. "Bis" means "until".',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ── CHECKPOINT QUIZ – 10 Questions ───────────────────────

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  (
    'a0000000-0000-0001-0099-000000000001',
    'a0000000-0000-0000-0001-000000000099',
    'What does "Guten Morgen" mean?',
    'multiple_choice',
    '["Good morning", "Good evening", "Good night", "Good day"]'::jsonb,
    'Good morning',
    '"Guten Morgen" means "Good morning" and is used until about 10:00 am.',
    NOW()
  ),
  (
    'a0000000-0000-0001-0099-000000000002',
    'a0000000-0000-0000-0001-000000000099',
    'How do you say "My name is Ana"?',
    'multiple_choice',
    '["Mein Name ist Ana.", "Du heißt Ana.", "Er heißt Ana.", "Ich bin Ana heißen."]'::jsonb,
    'Mein Name ist Ana.',
    '"Mein Name ist …" and "Ich heiße …" are both correct ways to state your name.',
    NOW()
  ),
  (
    'a0000000-0000-0001-0099-000000000003',
    'a0000000-0000-0000-0001-000000000099',
    'Which is the INFORMAL way to ask "How are you?"',
    'multiple_choice',
    '["Wie geht es Ihnen?", "Wie geht es dir?", "Wie heißen Sie?", "Woher kommen Sie?"]'::jsonb,
    'Wie geht es dir?',
    '"Wie geht es dir?" is informal. The formal version is "Wie geht es Ihnen?".',
    NOW()
  ),
  (
    'a0000000-0000-0001-0099-000000000004',
    'a0000000-0000-0000-0001-000000000099',
    'Fill in the blank: "Ich komme ___ Deutschland."',
    'fill_blank',
    NULL,
    'aus',
    '"Ich komme aus …" means "I am from …". The preposition is "aus".',
    NOW()
  ),
  (
    'a0000000-0000-0001-0099-000000000005',
    'a0000000-0000-0000-0001-000000000099',
    'What is the formal goodbye in German?',
    'multiple_choice',
    '["Tschüss", "Tschau", "Auf Wiedersehen", "Mach's gut"]'::jsonb,
    'Auf Wiedersehen',
    '"Auf Wiedersehen" is the formal goodbye. "Tschüss" and "Tschau" are casual.',
    NOW()
  ),
  (
    'a0000000-0000-0001-0099-000000000006',
    'a0000000-0000-0000-0001-000000000099',
    'When do you use "Sie" instead of "du"?',
    'multiple_choice',
    '["With close friends", "With children", "With strangers and in formal situations", "With classmates your own age"]'::jsonb,
    'With strangers and in formal situations',
    '"Sie" (capital S) is the formal form of address. Use it with strangers, officials, and older people.',
    NOW()
  ),
  (
    'a0000000-0000-0001-0099-000000000007',
    'a0000000-0000-0000-0001-000000000099',
    'What does "Bis bald!" mean?',
    'multiple_choice',
    '["Goodbye forever", "See you soon", "Good night", "See you tomorrow"]'::jsonb,
    'See you soon',
    '"Bis bald" = until soon = See you soon. "bis" means "until".',
    NOW()
  ),
  (
    'a0000000-0000-0001-0099-000000000008',
    'a0000000-0000-0000-0001-000000000099',
    'Correct the error: "Wie geht es du?"',
    'correction',
    NULL,
    'Wie geht es dir?',
    'The dative case is required: "dir" not "du". The correct phrase is "Wie geht es dir?".',
    NOW()
  ),
  (
    'a0000000-0000-0001-0099-000000000009',
    'a0000000-0000-0000-0001-000000000099',
    'How do you say "I am 25 years old"?',
    'multiple_choice',
    '["Ich heiße 25 Jahre alt.", "Ich komme 25 Jahre alt.", "Ich bin 25 Jahre alt.", "Ich gehe 25 Jahre alt."]'::jsonb,
    'Ich bin 25 Jahre alt.',
    'Age is expressed with "sein" (to be): "Ich bin … Jahre alt." The verb "sein" conjugates to "bin" for "ich".',
    NOW()
  ),
  (
    'a0000000-0000-0001-0099-000000000010',
    'a0000000-0000-0000-0001-000000000099',
    'Fill in the blank: "Guten ___!" (Good evening)',
    'fill_blank',
    NULL,
    'Abend',
    '"Guten Abend!" means "Good evening!" and is used after 18:00.',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;
