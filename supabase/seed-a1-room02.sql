-- ============================================================
-- DeutschPilot – A1 Room 02: Numbers, Time & Dates
-- Run AFTER schema-courses.sql in Supabase SQL Editor.
-- Safe to re-run (ON CONFLICT DO NOTHING).
-- ============================================================

-- ── COURSE ──────────────────────────────────────────────────
INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'numbers-time',
  'A1 Room 02 – Numbers, Time & Dates',
  'Learn numbers from 0 to 100, ask and tell the time, talk about days of the week, months, dates, and make simple appointments in German.',
  'A1', 'de', TRUE, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ── LESSONS ─────────────────────────────────────────────────

-- Lesson 1: Zahlen von 0 bis 100
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0002-000000000001',
  'a0000000-0000-0000-0000-000000000002',
  'a1-zahlen-0-bis-100',
  'Zahlen von 0 bis 100',
  '<h2>Zahlen von 0 bis 100 – Numbers from 0 to 100</h2>
<p>Numbers are one of the most essential tools in any language. In this lesson you will learn to count, read, and use German numbers from 0 to 100.</p>

<h3>1. Numbers 0–20</h3>
<table>
  <thead><tr><th>Number</th><th>German</th><th>Number</th><th>German</th></tr></thead>
  <tbody>
    <tr><td>0</td><td><strong>null</strong></td><td>10</td><td><strong>zehn</strong></td></tr>
    <tr><td>1</td><td><strong>eins</strong></td><td>11</td><td><strong>elf</strong></td></tr>
    <tr><td>2</td><td><strong>zwei</strong></td><td>12</td><td><strong>zwölf</strong></td></tr>
    <tr><td>3</td><td><strong>drei</strong></td><td>13</td><td><strong>dreizehn</strong></td></tr>
    <tr><td>4</td><td><strong>vier</strong></td><td>14</td><td><strong>vierzehn</strong></td></tr>
    <tr><td>5</td><td><strong>fünf</strong></td><td>15</td><td><strong>fünfzehn</strong></td></tr>
    <tr><td>6</td><td><strong>sechs</strong></td><td>16</td><td><strong>sechzehn</strong></td></tr>
    <tr><td>7</td><td><strong>sieben</strong></td><td>17</td><td><strong>siebzehn</strong></td></tr>
    <tr><td>8</td><td><strong>acht</strong></td><td>18</td><td><strong>achtzehn</strong></td></tr>
    <tr><td>9</td><td><strong>neun</strong></td><td>19</td><td><strong>neunzehn</strong></td></tr>
  </tbody>
</table>

<h3>2. Tens 20–100</h3>
<table>
  <thead><tr><th>Number</th><th>German</th></tr></thead>
  <tbody>
    <tr><td>20</td><td><strong>zwanzig</strong></td></tr>
    <tr><td>30</td><td><strong>dreißig</strong></td></tr>
    <tr><td>40</td><td><strong>vierzig</strong></td></tr>
    <tr><td>50</td><td><strong>fünfzig</strong></td></tr>
    <tr><td>60</td><td><strong>sechzig</strong></td></tr>
    <tr><td>70</td><td><strong>siebzig</strong></td></tr>
    <tr><td>80</td><td><strong>achtzig</strong></td></tr>
    <tr><td>90</td><td><strong>neunzig</strong></td></tr>
    <tr><td>100</td><td><strong>hundert</strong></td></tr>
  </tbody>
</table>

<h3>3. Grammar Note – Compound Numbers 21–99</h3>
<p>German compound numbers follow the pattern: <strong>ones + und + tens</strong></p>
<ul>
  <li>21 = <strong>einundzwanzig</strong> (one-and-twenty)</li>
  <li>35 = <strong>fünfunddreißig</strong> (five-and-thirty)</li>
  <li>47 = <strong>siebenundvierzig</strong> (seven-and-forty)</li>
  <li>99 = <strong>neunundneunzig</strong> (nine-and-ninety)</li>
</ul>
<p>Note: the number <strong>1</strong> becomes <strong>ein</strong> in compounds (not <em>eins</em>).</p>

<h3>4. Key Vocabulary</h3>
<ul>
  <li><strong>die Zahl</strong> – the number</li>
  <li><strong>zählen</strong> – to count</li>
  <li><strong>wie viel?</strong> – how much / how many?</li>
  <li><strong>das Alter</strong> – the age</li>
  <li><strong>die Telefonnummer</strong> – the phone number</li>
</ul>

<h3>5. Example Sentences</h3>
<ul>
  <li>Ich bin <strong>dreißig</strong> Jahre alt. – I am 30 years old.</li>
  <li>Meine Telefonnummer ist <strong>null vier eins</strong>... – My phone number is 041...</li>
  <li>Das kostet <strong>fünfzehn</strong> Euro. – That costs 15 euros.</li>
  <li>Wir haben <strong>zwölf</strong> Studenten. – We have 12 students.</li>
</ul>

<h3>6. Mini Dialogue</h3>
<p><strong>A:</strong> Wie alt bist du?<br>
<strong>B:</strong> Ich bin vierundzwanzig Jahre alt. Und du?<br>
<strong>A:</strong> Ich bin siebenundzwanzig.</p>

<hr>
<p><em>Explanation (EN): German numbers 1–19 are unique words. From 21–99 they combine ones + "und" + tens. The number 1 in compounds becomes "ein" not "eins".</em></p>
<p><em>توضیح (FA): اعداد آلمانی از ۲۱ به بالا به صورت "یکان + und + دهگان" ساخته می‌شوند.</em></p>
<p><em>شرح (AR): الأعداد الألمانية من ٢١ إلى ٩٩ تُبنى بنمط: الآحاد + "und" + العشرات.</em></p>',
  1, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 2: Wie spät ist es?
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0002-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  'a1-wie-spaet-ist-es',
  'Wie spät ist es?',
  '<h2>Wie spät ist es? – What time is it?</h2>
<p>In this lesson you will learn how to ask and tell the time in German using both the official 24-hour clock and everyday informal expressions.</p>

<h3>1. Asking the Time</h3>
<ul>
  <li><strong>Wie spät ist es?</strong> – What time is it?</li>
  <li><strong>Wie viel Uhr ist es?</strong> – What o'clock is it?</li>
  <li><strong>Entschuldigung, haben Sie die Uhrzeit?</strong> – Excuse me, do you have the time?</li>
</ul>

<h3>2. Telling the Time – Official (24-hour)</h3>
<table>
  <thead><tr><th>Time</th><th>German</th></tr></thead>
  <tbody>
    <tr><td>8:00</td><td>Es ist acht Uhr.</td></tr>
    <tr><td>10:30</td><td>Es ist zehn Uhr dreißig.</td></tr>
    <tr><td>14:15</td><td>Es ist vierzehn Uhr fünfzehn.</td></tr>
    <tr><td>18:45</td><td>Es ist achtzehn Uhr fünfundvierzig.</td></tr>
  </tbody>
</table>

<h3>3. Telling the Time – Informal (Everyday)</h3>
<table>
  <thead><tr><th>Time</th><th>Informal German</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>3:00</td><td><strong>drei Uhr</strong></td><td>three o'clock</td></tr>
    <tr><td>3:15</td><td><strong>Viertel nach drei</strong></td><td>quarter past three</td></tr>
    <tr><td>3:30</td><td><strong>halb vier</strong></td><td>half four (= 3:30!)</td></tr>
    <tr><td>3:45</td><td><strong>Viertel vor vier</strong></td><td>quarter to four</td></tr>
  </tbody>
</table>
<p><strong>Important:</strong> <em>halb vier</em> means 3:30, NOT 4:30. "Halb" refers to the upcoming hour.</p>

<h3>4. Key Vocabulary</h3>
<ul>
  <li><strong>die Uhr</strong> – the clock / o'clock</li>
  <li><strong>die Uhrzeit</strong> – the time</li>
  <li><strong>nach</strong> – past / after</li>
  <li><strong>vor</strong> – before / to</li>
  <li><strong>halb</strong> – half (30 minutes before the next hour)</li>
  <li><strong>Viertel</strong> – quarter (15 minutes)</li>
  <li><strong>Mittag</strong> – noon / midday</li>
  <li><strong>Mitternacht</strong> – midnight</li>
</ul>

<h3>5. Example Sentences</h3>
<ul>
  <li><strong>Es ist halb neun.</strong> – It is 8:30.</li>
  <li><strong>Der Zug kommt um Viertel nach fünf.</strong> – The train arrives at 5:15.</li>
  <li><strong>Das Meeting beginnt um neun Uhr.</strong> – The meeting starts at 9:00.</li>
</ul>

<h3>6. Mini Dialogue</h3>
<p><strong>A:</strong> Wie spät ist es, bitte?<br>
<strong>B:</strong> Es ist halb elf.<br>
<strong>A:</strong> Danke sehr!<br>
<strong>B:</strong> Bitte schön!</p>

<hr>
<p><em>Explanation (EN): "halb vier" = 3:30 (half an hour before four). Always add one hour to "halb" to get the real time mentally. E.g. halb acht = 7:30.</em></p>
<p><em>توضیح (FA): در آلمانی "halb vier" یعنی ۳:۳۰، نه ۴:۳۰. "halb" به معنای "نیم ساعت مانده به ساعت بعدی" است.</em></p>
<p><em>شرح (AR): في الألمانية "halb vier" تعني الساعة ٣:٣٠ وليس ٤:٣٠ لأن "halb" تعني نصف ساعة قبل الساعة التالية.</em></p>',
  2, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 3: Tage der Woche
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0002-000000000003',
  'a0000000-0000-0000-0000-000000000002',
  'a1-tage-der-woche',
  'Tage der Woche',
  '<h2>Tage der Woche – Days of the Week</h2>
<p>In this lesson you will learn all seven days of the week and how to use them naturally in everyday German sentences.</p>

<h3>1. Days of the Week</h3>
<table>
  <thead><tr><th>Day</th><th>German</th><th>Abbreviation</th></tr></thead>
  <tbody>
    <tr><td>Monday</td><td><strong>Montag</strong></td><td>Mo</td></tr>
    <tr><td>Tuesday</td><td><strong>Dienstag</strong></td><td>Di</td></tr>
    <tr><td>Wednesday</td><td><strong>Mittwoch</strong></td><td>Mi</td></tr>
    <tr><td>Thursday</td><td><strong>Donnerstag</strong></td><td>Do</td></tr>
    <tr><td>Friday</td><td><strong>Freitag</strong></td><td>Fr</td></tr>
    <tr><td>Saturday</td><td><strong>Samstag</strong></td><td>Sa</td></tr>
    <tr><td>Sunday</td><td><strong>Sonntag</strong></td><td>So</td></tr>
  </tbody>
</table>

<h3>2. Grammar Note – Using Days</h3>
<ul>
  <li>Use <strong>am</strong> + day for "on [day]": <em>am Montag</em> = on Monday.</li>
  <li>Days are always <strong>masculine</strong> (der): <em>der Montag</em>.</li>
  <li>To say "every Monday": <em>jeden Montag</em></li>
</ul>

<h3>3. Useful Time Expressions</h3>
<ul>
  <li><strong>heute</strong> – today</li>
  <li><strong>morgen</strong> – tomorrow</li>
  <li><strong>gestern</strong> – yesterday</li>
  <li><strong>übermorgen</strong> – the day after tomorrow</li>
  <li><strong>das Wochenende</strong> – the weekend</li>
  <li><strong>die Woche</strong> – the week</li>
  <li><strong>werktags</strong> – on weekdays</li>
</ul>

<h3>4. Example Sentences</h3>
<ul>
  <li><strong>Am Montag habe ich Deutschkurs.</strong> – On Monday I have German class.</li>
  <li><strong>Heute ist Mittwoch.</strong> – Today is Wednesday.</li>
  <li><strong>Am Wochenende schlafe ich lang.</strong> – On the weekend I sleep in.</li>
  <li><strong>Jeden Dienstag gehe ich zum Sport.</strong> – Every Tuesday I go to sports.</li>
</ul>

<h3>5. Mini Dialogue</h3>
<p><strong>A:</strong> Welcher Tag ist heute?<br>
<strong>B:</strong> Heute ist Donnerstag.<br>
<strong>A:</strong> Und morgen ist Freitag – super!<br>
<strong>B:</strong> Ja, das Wochenende kommt bald!</p>

<hr>
<p><em>Explanation (EN): German days are always masculine. Use "am" before a day to say "on Monday" → "am Montag". The week starts on Monday (Montag) in German-speaking countries.</em></p>
<p><em>توضیح (FA): روزهای هفته در آلمانی مذکر هستند. برای گفتن "روز دوشنبه" از "am Montag" استفاده می‌شود.</em></p>
<p><em>شرح (AR): أيام الأسبوع في الألمانية مذكرة دائماً. نستخدم "am" قبل اسم اليوم للتعبير عن "في يوم...".</em></p>',
  3, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 4: Monate und Datum
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0002-000000000004',
  'a0000000-0000-0000-0000-000000000002',
  'a1-monate-und-datum',
  'Monate und Datum',
  '<h2>Monate und Datum – Months and Dates</h2>
<p>In this lesson you will learn the twelve months of the year and how to read, write, and say dates in German.</p>

<h3>1. Months of the Year</h3>
<table>
  <thead><tr><th>Month</th><th>German</th><th>Month</th><th>German</th></tr></thead>
  <tbody>
    <tr><td>January</td><td><strong>Januar</strong></td><td>July</td><td><strong>Juli</strong></td></tr>
    <tr><td>February</td><td><strong>Februar</strong></td><td>August</td><td><strong>August</strong></td></tr>
    <tr><td>March</td><td><strong>März</strong></td><td>September</td><td><strong>September</strong></td></tr>
    <tr><td>April</td><td><strong>April</strong></td><td>October</td><td><strong>Oktober</strong></td></tr>
    <tr><td>May</td><td><strong>Mai</strong></td><td>November</td><td><strong>November</strong></td></tr>
    <tr><td>June</td><td><strong>Juni</strong></td><td>December</td><td><strong>Dezember</strong></td></tr>
  </tbody>
</table>

<h3>2. Grammar Note – Dates</h3>
<ul>
  <li>Use <strong>im</strong> + month: <em>im Januar</em> = in January.</li>
  <li>Months are always <strong>masculine</strong> (der): <em>der März</em>.</li>
  <li>Dates use ordinal numbers: <em>der erste, der zweite, der dritte, der vierte...</em></li>
</ul>

<h3>3. Saying Dates</h3>
<p>To say "on the 3rd of May" use: <strong>am dritten Mai</strong></p>
<table>
  <thead><tr><th>Ordinal</th><th>German</th></tr></thead>
  <tbody>
    <tr><td>1st</td><td>erste(n)</td></tr>
    <tr><td>2nd</td><td>zweite(n)</td></tr>
    <tr><td>3rd</td><td>dritte(n)</td></tr>
    <tr><td>4th–19th</td><td>vierte(n)... + pattern "-te"</td></tr>
    <tr><td>20th+</td><td>zwanzigste(n)... + pattern "-ste"</td></tr>
  </tbody>
</table>
<p>Written date format: <strong>01.05.2024</strong> = 1. Mai 2024</p>

<h3>4. Key Vocabulary</h3>
<ul>
  <li><strong>der Monat</strong> – the month</li>
  <li><strong>das Jahr</strong> – the year</li>
  <li><strong>das Datum</strong> – the date</li>
  <li><strong>der Geburtstag</strong> – the birthday</li>
  <li><strong>Wann?</strong> – When?</li>
</ul>

<h3>5. Example Sentences</h3>
<ul>
  <li><strong>Im März beginnt der Frühling.</strong> – In March spring begins.</li>
  <li><strong>Mein Geburtstag ist am fünfzehnten Juli.</strong> – My birthday is on the 15th of July.</li>
  <li><strong>Das Meeting ist am ersten Dezember.</strong> – The meeting is on the 1st of December.</li>
</ul>

<h3>6. Mini Dialogue</h3>
<p><strong>A:</strong> Wann hast du Geburtstag?<br>
<strong>B:</strong> Am dritten März. Und du?<br>
<strong>A:</strong> Ich habe im Oktober Geburtstag – am zwanzigsten.<br>
<strong>B:</strong> Schön! Das ist bald!</p>

<hr>
<p><em>Explanation (EN): German months are masculine. Use "im" + month for "in January". For dates use "am" + ordinal number + month: "am fünften Mai" = on the 5th of May.</em></p>
<p><em>توضیح (FA): برای گفتن "در ژانویه" از "im Januar" استفاده می‌شود. تاریخ‌ها با اعداد ترتیبی بیان می‌شوند: "am fünften Mai" = پنجم مه.</em></p>
<p><em>شرح (AR): للتعبير عن "في يناير" نستخدم "im Januar". للتواريخ نستخدم "am" + العدد الترتيبي + الشهر.</em></p>',
  4, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 5: Termine und Uhrzeiten
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0002-000000000005',
  'a0000000-0000-0000-0000-000000000002',
  'a1-termine-und-uhrzeiten',
  'Termine und Uhrzeiten',
  '<h2>Termine und Uhrzeiten – Appointments and Times</h2>
<p>In this final lesson you will combine everything you have learned to schedule appointments, ask about availability, and confirm times in German.</p>

<h3>1. Making an Appointment</h3>
<ul>
  <li><strong>Ich möchte einen Termin machen.</strong> – I would like to make an appointment.</li>
  <li><strong>Wann haben Sie Zeit?</strong> – When do you have time?</li>
  <li><strong>Passt es Ihnen am Montag?</strong> – Does Monday work for you?</li>
  <li><strong>Um wie viel Uhr?</strong> – At what time?</li>
</ul>

<h3>2. Confirming and Declining</h3>
<ul>
  <li><strong>Ja, das passt gut.</strong> – Yes, that works well.</li>
  <li><strong>Leider kann ich nicht.</strong> – Unfortunately I cannot.</li>
  <li><strong>Können wir es auf Dienstag verschieben?</strong> – Can we move it to Tuesday?</li>
  <li><strong>Ich bestätige den Termin.</strong> – I confirm the appointment.</li>
</ul>

<h3>3. Common Time Prepositions</h3>
<table>
  <thead><tr><th>Preposition</th><th>Use</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><strong>um</strong></td><td>at (for clock time)</td><td>um 15 Uhr</td></tr>
    <tr><td><strong>am</strong></td><td>on (for days/dates)</td><td>am Freitag</td></tr>
    <tr><td><strong>im</strong></td><td>in (for months)</td><td>im September</td></tr>
    <tr><td><strong>von … bis …</strong></td><td>from … to …</td><td>von 9 bis 11 Uhr</td></tr>
  </tbody>
</table>

<h3>4. Key Vocabulary</h3>
<ul>
  <li><strong>der Termin</strong> – the appointment</li>
  <li><strong>die Uhrzeit</strong> – the time</li>
  <li><strong>verfügbar</strong> – available</li>
  <li><strong>verschieben</strong> – to postpone / reschedule</li>
  <li><strong>bestätigen</strong> – to confirm</li>
  <li><strong>absagen</strong> – to cancel</li>
</ul>

<h3>5. Example Sentences</h3>
<ul>
  <li><strong>Der Termin ist am Mittwoch um zehn Uhr.</strong> – The appointment is on Wednesday at 10:00.</li>
  <li><strong>Das Kurs beginnt von Montag bis Freitag.</strong> – The course runs Monday to Friday.</li>
  <li><strong>Ich habe am Donnerstag von 14 bis 16 Uhr Zeit.</strong> – I am free Thursday from 2 to 4 pm.</li>
</ul>

<h3>6. Mini Dialogue</h3>
<p><strong>A:</strong> Ich möchte gerne einen Termin vereinbaren.<br>
<strong>B:</strong> Natürlich! Wann passt es Ihnen?<br>
<strong>A:</strong> Am Dienstag um halb drei?<br>
<strong>B:</strong> Ja, das ist kein Problem. Also Dienstag um 14:30 Uhr.<br>
<strong>A:</strong> Perfekt, danke sehr!</p>

<hr>
<p><em>Explanation (EN): Use "um" for clock times, "am" for days and dates, "im" for months. These three short prepositions cover almost all scheduling in German.</em></p>
<p><em>توضیح (FA): برای بیان ساعت از "um"، برای روزها از "am" و برای ماه‌ها از "im" استفاده کنید.</em></p>
<p><em>شرح (AR): نستخدم "um" للساعة، "am" لليوم والتاريخ، "im" للشهر في تحديد المواعيد.</em></p>',
  5, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ── QUIZ LESSON (order_index = 99) ───────────────────────────
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES (
  'a0000000-0000-0000-0002-000000000099',
  'a0000000-0000-0000-0000-000000000002',
  'a1-room02-checkpoint',
  'A1 Room 02 – Checkpoint Quiz',
  '',
  99, NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ── EXERCISES – Lesson 1: Zahlen ─────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  (
    'a0000000-0000-0002-0001-000000000001',
    'a0000000-0000-0000-0002-000000000001',
    'How do you say 15 in German?',
    'multiple_choice',
    '["vierzehn", "fünfzehn", "sechzehn", "dreizehn"]'::jsonb,
    'fünfzehn',
    '"fünfzehn" = 15. It combines "fünf" (5) + "zehn" (10).',
    NOW()
  ),
  (
    'a0000000-0000-0002-0001-000000000002',
    'a0000000-0000-0000-0002-000000000001',
    'Fill in the blank: 47 in German is "siebenund___"',
    'fill_blank',
    NULL,
    'vierzig',
    '47 = siebenundvierzig. The pattern is: ones + "und" + tens.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0001-000000000003',
    'a0000000-0000-0000-0002-000000000001',
    'Correct the error: "Ich bin zwanzig und fünf Jahre alt."',
    'correction',
    NULL,
    'Ich bin fünfundzwanzig Jahre alt.',
    'Compound numbers are written as ONE word: "fünfundzwanzig" (25). No spaces.',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ── EXERCISES – Lesson 2: Wie spät ist es? ───────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  (
    'a0000000-0000-0002-0002-000000000001',
    'a0000000-0000-0000-0002-000000000002',
    'What does "halb vier" mean in German?',
    'multiple_choice',
    '["4:30", "3:30", "4:15", "3:45"]'::jsonb,
    '3:30',
    '"halb vier" = half an hour before four = 3:30. "halb" always refers to the next upcoming hour.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0002-000000000002',
    'a0000000-0000-0000-0002-000000000002',
    'How do you ask "What time is it?" in German?',
    'multiple_choice',
    '["Wie alt bist du?", "Wie spät ist es?", "Wo ist die Uhr?", "Was ist das?"]'::jsonb,
    'Wie spät ist es?',
    '"Wie spät ist es?" is the standard everyday question for the time.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0002-000000000003',
    'a0000000-0000-0000-0002-000000000002',
    'Fill in the blank: "Es ist ___ nach drei." (It is quarter past three.)',
    'fill_blank',
    NULL,
    'Viertel',
    '"Viertel nach drei" = quarter past three = 3:15.',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ── EXERCISES – Lesson 3: Tage der Woche ─────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  (
    'a0000000-0000-0002-0003-000000000001',
    'a0000000-0000-0000-0002-000000000003',
    'Which day comes after Mittwoch?',
    'multiple_choice',
    '["Dienstag", "Donnerstag", "Freitag", "Montag"]'::jsonb,
    'Donnerstag',
    'The order is: Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0003-000000000002',
    'a0000000-0000-0000-0002-000000000003',
    'Fill in the blank: "___ Montag habe ich Deutschkurs." (On Monday I have German class.)',
    'fill_blank',
    NULL,
    'Am',
    'Use "am" before days of the week: "Am Montag" = on Monday.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0003-000000000003',
    'a0000000-0000-0000-0002-000000000003',
    'Correct the error: "In Freitag gehe ich einkaufen."',
    'correction',
    NULL,
    'Am Freitag gehe ich einkaufen.',
    'Days of the week need "am" not "in": "Am Freitag" = on Friday.',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ── EXERCISES – Lesson 4: Monate und Datum ───────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  (
    'a0000000-0000-0002-0004-000000000001',
    'a0000000-0000-0000-0002-000000000004',
    'What is the German word for March?',
    'multiple_choice',
    '["Mai", "März", "August", "Januar"]'::jsonb,
    'März',
    '"März" = March. Note the umlaut ä. The months are mostly similar to English.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0004-000000000002',
    'a0000000-0000-0000-0002-000000000004',
    'Fill in the blank: "Mein Geburtstag ist ___ Juli." (My birthday is in July.)',
    'fill_blank',
    NULL,
    'im',
    'Use "im" before months: "im Juli" = in July.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0004-000000000003',
    'a0000000-0000-0000-0002-000000000004',
    'Correct the error: "Der Termin ist in den fünften März."',
    'correction',
    NULL,
    'Der Termin ist am fünften März.',
    'Use "am" + ordinal for dates: "am fünften März" = on the 5th of March.',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ── EXERCISES – Lesson 5: Termine ────────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  (
    'a0000000-0000-0002-0005-000000000001',
    'a0000000-0000-0000-0002-000000000005',
    'Which preposition means "at" for clock times in German?',
    'multiple_choice',
    '["am", "im", "um", "von"]'::jsonb,
    'um',
    '"um" is used with clock times: "um 9 Uhr" = at 9 o'clock.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0005-000000000002',
    'a0000000-0000-0000-0002-000000000005',
    'How do you say "from 9 to 11 o'clock" in German?',
    'multiple_choice',
    '["zwischen 9 und 11 Uhr", "von 9 bis 11 Uhr", "ab 9 nach 11 Uhr", "um 9 zu 11 Uhr"]'::jsonb,
    'von 9 bis 11 Uhr',
    '"von … bis …" = from … to …. This is the standard pattern for time ranges.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0005-000000000003',
    'a0000000-0000-0000-0002-000000000005',
    'Fill in the blank: "Ich habe ___ Dienstag Zeit." (I am free on Tuesday.)',
    'fill_blank',
    NULL,
    'am',
    '"am Dienstag" = on Tuesday. Use "am" before days.',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ── CHECKPOINT QUIZ – 10 Questions ───────────────────────────
INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  (
    'a0000000-0000-0002-0099-000000000001',
    'a0000000-0000-0000-0002-000000000099',
    'How do you say 30 in German?',
    'multiple_choice',
    '["zwanzig", "dreißig", "vierzig", "dreizehn"]'::jsonb,
    'dreißig',
    '30 = dreißig. Note the special spelling with "ß" (not "dreizzig").',
    NOW()
  ),
  (
    'a0000000-0000-0002-0099-000000000002',
    'a0000000-0000-0000-0002-000000000099',
    'What does "halb sieben" mean?',
    'multiple_choice',
    '["7:30", "6:30", "7:15", "6:45"]'::jsonb,
    '6:30',
    '"halb sieben" = half an hour before seven = 6:30. "halb" always refers to the next hour.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0099-000000000003',
    'a0000000-0000-0000-0002-000000000099',
    'Which preposition is used with days of the week?',
    'multiple_choice',
    '["im", "um", "am", "in"]'::jsonb,
    'am',
    '"am Montag" = on Monday. "am" is used with days (and dates).',
    NOW()
  ),
  (
    'a0000000-0000-0002-0099-000000000004',
    'a0000000-0000-0000-0002-000000000099',
    'Fill in the blank: 25 in German is "fünfund___"',
    'fill_blank',
    NULL,
    'zwanzig',
    '25 = fünfundzwanzig. The tens (zwanzig) come last in compound numbers.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0099-000000000005',
    'a0000000-0000-0000-0002-000000000099',
    'What is the German word for December?',
    'multiple_choice',
    '["November", "Oktober", "Dezember", "September"]'::jsonb,
    'Dezember',
    'December = Dezember in German. Most months are similar to English.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0099-000000000006',
    'a0000000-0000-0000-0002-000000000099',
    'How do you say "in March" in German?',
    'multiple_choice',
    '["am März", "im März", "um März", "an März"]'::jsonb,
    'im März',
    '"im März" = in March. Use "im" before all months.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0099-000000000007',
    'a0000000-0000-0000-0002-000000000099',
    'Which day comes after Donnerstag?',
    'multiple_choice',
    '["Mittwoch", "Freitag", "Samstag", "Dienstag"]'::jsonb,
    'Freitag',
    'Thursday (Donnerstag) is followed by Friday (Freitag).',
    NOW()
  ),
  (
    'a0000000-0000-0002-0099-000000000008',
    'a0000000-0000-0000-0002-000000000099',
    'Correct the error: "Der Kurs ist in Montag um neun Uhr."',
    'correction',
    NULL,
    'Der Kurs ist am Montag um neun Uhr.',
    'Use "am" before days, not "in": "am Montag" = on Monday.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0099-000000000009',
    'a0000000-0000-0000-0002-000000000099',
    'How do you ask "What time is it?" formally in German?',
    'multiple_choice',
    '["Wie spät bist du?", "Wie viel Uhr ist es?", "Was ist die Zeit?", "Hast du Uhr?"]'::jsonb,
    'Wie viel Uhr ist es?',
    '"Wie viel Uhr ist es?" is the formal/official way. "Wie spät ist es?" is also correct and more common in everyday speech.',
    NOW()
  ),
  (
    'a0000000-0000-0002-0099-000000000010',
    'a0000000-0000-0000-0002-000000000099',
    'Fill in the blank: "Der Termin ist ___ drei Uhr." (The appointment is at 3 o'clock.)',
    'fill_blank',
    NULL,
    'um',
    '"um drei Uhr" = at 3 o'clock. "um" is used with specific clock times.',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;
