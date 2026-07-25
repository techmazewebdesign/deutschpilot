-- ============================================================
-- DeutschPilot – C1 Rooms 01–03 (Wissenschaft, Literatur, Wirtschaft)
-- Same pattern as the B2 rooms: one course per room, 3 content
-- lessons + checkpoint quiz (order_index 99). Additive only,
-- ON CONFLICT DO NOTHING.
-- ============================================================

-- ── COURSES ─────────────────────────────────────────────────
INSERT INTO public.courses (id, slug, title, description, level, language, is_published, created_at)
VALUES
  ('c1000000-0000-0000-0000-000000000001','science-research-c1',
   'C1 Room 01 – Wissenschaft & Forschung',
   'Master academic register: advanced Nominalstil, cautious hedging with Konjunktiv II, citing sources, and research methodology vocabulary.',
   'C1','de',TRUE,NOW()),
  ('c1000000-0000-0000-0000-000000000002','literature-style-analysis-c1',
   'C1 Room 02 – Literatur & Stilanalyse',
   'Analyse literary texts, name rhetorical devices with precision, discuss narrative perspective, and write a proper Textinterpretation.',
   'C1','de',TRUE,NOW()),
  ('c1000000-0000-0000-0000-000000000003','business-negotiation-c1',
   'C1 Room 03 – Wirtschaft & Verhandlung',
   'Negotiate in idiomatic business German, report business speech in Konjunktiv I, and disagree diplomatically over contracts.',
   'C1','de',TRUE,NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 01 – Wissenschaft & Forschung
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('c1000000-0000-0000-0001-000000000001','c1000000-0000-0000-0000-000000000001',
   'c1-nominalstil-advanced','Nominalstil auf C1-Niveau',
   '<h2>Nominalstil auf C1-Niveau</h2>
<h3>1. Vom B2- zum C1-Nominalstil</h3>
<p>Auf B2 reicht es, einzelne Verben zu Nomen zu verdichten (<em>untersuchen → die Untersuchung</em>). Auf C1 verdichtest du ganze Satzketten: mehrere Nominalisierungen werden über Genitive und Präpositionen zu einer einzigen, kompakten Nominalphrase gestapelt — der typische Stil von Fachaufsätzen und Dissertationen.</p>
<h3>2. Gestapelte Nominalphrasen</h3>
<ul>
<li>Verbal: <em>Weil die Forscher die Daten systematisch ausgewertet haben und weil sich dabei Auffälligkeiten zeigten, wurde die Hypothese revidiert.</em></li>
<li>Nominal (C1): <em><strong>Die systematische Auswertung der Daten durch die Forscher</strong> führte <strong>infolge der dabei aufgetretenen Auffälligkeiten</strong> zu <strong>einer Revision der Hypothese</strong>.</em></li>
</ul>
<p>Muster: Nomen1 (Auswertung) + Genitiv (der Daten) + <em>durch</em> + Akkusativ (die Forscher); zweiter Block mit <em>infolge</em> + Genitiv (der aufgetretenen Auffälligkeiten); dritter Block mit <em>zu</em> + Genitiv (einer Revision der Hypothese).</p>
<h3>3. Erweiterte Attribute vor dem Nomen</h3>
<p>Ein weiteres C1-Kennzeichen: das erweiterte Partizipialattribut, das mehrere Informationen vor das Nomen packt, statt einen Relativsatz anzuhängen.</p>
<ul>
<li>Relativsatz: <em>die Studie, die 2022 an drei Universitäten mit über 400 Teilnehmenden durchgeführt wurde</em></li>
<li>Erweitertes Attribut: <em>die <strong>2022 an drei Universitäten mit über 400 Teilnehmenden durchgeführte</strong> Studie</em></li>
</ul>
<h3>4. Präpositions-Register für Kausalität und Folge</h3>
<table>
<thead><tr><th>Nominal</th><th>Bedeutung</th><th>Beispiel</th></tr></thead>
<tbody>
<tr><td>infolge + Gen.</td><td>Folge von</td><td>infolge der Datenlage</td></tr>
<tr><td>aufgrund + Gen.</td><td>Grund</td><td>aufgrund methodischer Einschränkungen</td></tr>
<tr><td>im Hinblick auf + Akk.</td><td>Bezug</td><td>im Hinblick auf die Stichprobengröße</td></tr>
<tr><td>im Rahmen + Gen.</td><td>Kontext</td><td>im Rahmen der vorliegenden Studie</td></tr>
</tbody>
</table>
<h3>5. Die Kehrseite: Lesbarkeit</h3>
<p>Guter wissenschaftlicher Stil auf C1 stapelt nicht endlos — nach zwei, maximal drei Nominalisierungen in Folge lohnt sich ein neuer Satz. Wer alles in einen Bandwurmsatz presst, schreibt nicht akademisch, sondern unverständlich.</p>',
   1,NOW()),
  ('c1000000-0000-0000-0001-000000000002','c1000000-0000-0000-0000-000000000001',
   'c1-vorsichtig-formulieren','Vorsichtig formulieren: Hedging im Wissenschaftsstil',
   '<h2>Vorsichtig formulieren: Hedging im Wissenschaftsstil</h2>
<h3>1. Warum Wissenschaftler vorsichtig formulieren</h3>
<p>Eine seriöse Studie behauptet selten etwas absolut. Ergebnisse gelten unter Vorbehalt, Stichproben sind begrenzt, Kausalität ist schwer zu beweisen. Diese Vorsicht drückt sich sprachlich im <strong>Hedging</strong> aus — der bewussten Abschwächung von Aussagen.</p>
<h3>2. Konjunktiv II als Vorsichts-Werkzeug</h3>
<ul>
<li><em>Es <strong>lässt sich vermuten</strong>, dass der beobachtete Effekt auf externe Faktoren zurückzuführen <strong>wäre</strong>.</em></li>
<li><em>Man <strong>könnte</strong> argumentieren, dass die Stichprobe zu klein <strong>gewesen sei</strong>, um verallgemeinerbare Aussagen zuzulassen.</em></li>
<li><em>Es <strong>wäre</strong> denkbar, dass weitere Variablen eine Rolle spielen.</em></li>
</ul>
<p>Der Konjunktiv II signalisiert hier nicht Irrealität, sondern <strong>epistemische Zurückhaltung</strong>: die Aussage bleibt eine begründete Möglichkeit, keine Tatsachenbehauptung.</p>
<h3>3. Das Hedging-Baukasten-Set</h3>
<table>
<thead><tr><th>Ausdruck</th><th>Grad der Vorsicht</th></tr></thead>
<tbody>
<tr><td>es ist davon auszugehen, dass ...</td><td>relativ sicher</td></tr>
<tr><td>es lässt sich vermuten, dass ...</td><td>vorsichtige Vermutung</td></tr>
<tr><td>tendenziell zeigt sich, dass ...</td><td>Tendenz, kein Beweis</td></tr>
<tr><td>die Daten deuten darauf hin, dass ...</td><td>Indiz, keine Gewissheit</td></tr>
<tr><td>unter Vorbehalt der begrenzten Stichprobe ...</td><td>explizite Einschränkung</td></tr>
</tbody>
</table>
<h3>4. Grenzen der Studie benennen</h3>
<p>Ein eigener Abschnitt (<em>Limitationen</em>) ist Standard: <em>Einschränkend ist anzumerken, dass die Stichprobe nicht repräsentativ war und die Ergebnisse daher nicht ohne Weiteres auf die Gesamtbevölkerung übertragen werden können.</em></p>
<h3>5. Übertreiben vermeiden</h3>
<p>Zu starkes Hedging ("könnte eventuell vielleicht möglicherweise") wirkt unsicher statt seriös. Eine präzise Abstufung — sicher, wahrscheinlich, denkbar, unwahrscheinlich — reicht völlig aus.</p>',
   2,NOW()),
  ('c1000000-0000-0000-0001-000000000003','c1000000-0000-0000-0000-000000000001',
   'c1-quellen-methodik','Quellen zitieren & Forschungsmethodik',
   '<h2>Quellen zitieren & Forschungsmethodik</h2>
<h3>1. Quellen einbauen, ohne den Satzfluss zu brechen</h3>
<ul>
<li><em>Laut Müller (2020) <strong>lässt sich</strong> der Effekt <strong>auf</strong> soziale Faktoren <strong>zurückführen</strong>.</em></li>
<li><em>Wie Schmidt et al. (2019) <strong>zeigen konnten</strong>, korreliert die Variable X signifikant mit Y.</em></li>
<li><em><strong>Dem widerspricht</strong> die Untersuchung von Weber (2021), <strong>der zufolge</strong> kein Zusammenhang nachweisbar ist.</em></li>
<li><em>In Anlehnung an die Terminologie von X <strong>wird im Folgenden</strong> von "Y" gesprochen.</em></li>
</ul>
<h3>2. Der Kern-Wortschatz der Forschungsmethodik</h3>
<table>
<thead><tr><th>Begriff</th><th>Bedeutung</th></tr></thead>
<tbody>
<tr><td>die Hypothese</td><td>die zu prüfende Annahme</td></tr>
<tr><td>die Stichprobe</td><td>die untersuchte Teilgruppe</td></tr>
<tr><td>die Erhebung</td><td>die Datensammlung (Befragung, Messung)</td></tr>
<tr><td>die Signifikanz</td><td>statistische Aussagekraft eines Ergebnisses</td></tr>
<tr><td>die Validität</td><td>Gültigkeit / Genauigkeit der Messung</td></tr>
<tr><td>die Reliabilität</td><td>Zuverlässigkeit bei Wiederholung</td></tr>
<tr><td>die Korrelation</td><td>statistischer Zusammenhang (nicht: Ursache!)</td></tr>
</tbody>
</table>
<h3>3. Komplexe Nebensatzketten für Methodikbeschreibungen</h3>
<p>Forschungsberichte reihen oft mehrere Nebensätze, um Bedingungen und Einschränkungen präzise zu benennen:</p>
<p><em>Da die Stichprobe, <strong>die</strong> aus 214 Teilnehmenden bestand, <strong>die</strong> nicht zufällig ausgewählt worden waren, <strong>obwohl</strong> dies methodisch wünschenswert gewesen wäre, keine repräsentative Auswahl darstellte, <strong>müssen</strong> die Ergebnisse mit Vorsicht interpretiert werden.</em></p>
<p>Lesetechnik: zuerst Hauptsatz-Kern suchen (Ergebnisse müssen mit Vorsicht interpretiert werden), dann jede eingeschobene <em>die/dass/obwohl</em>-Klammer einzeln entpacken.</p>
<h3>4. Kausalität vs. Korrelation — die wichtigste Unterscheidung</h3>
<p><em>Ein Zusammenhang zwischen X und Y</em> beweist noch keine <em>Verursachung</em>. Seriöse Texte markieren das ausdrücklich: <em>Die Daten legen einen Zusammenhang nahe, erlauben jedoch keine kausalen Schlüsse.</em></p>',
   3,NOW()),
  ('c1000000-0000-0000-0001-000000000099','c1000000-0000-0000-0000-000000000001',
   'c1-room01-quiz','Checkpoint: Wissenschaft & Forschung',
   '<h2>Checkpoint Quiz</h2><p>Nominalstil, Hedging und Forschungsmethodik — der Wissenschafts-Check auf C1-Niveau!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('c1000000-0000-0001-0001-000000000001','c1000000-0000-0000-0001-000000000001',
   '"Weil die Forscher die Daten ausgewertet haben" nominal, C1-Stil:','multiple_choice',
   '["Die Auswertung der Daten durch die Forscher", "Wegen der Forscher und Daten", "Die Forscher, die auswerten", "Bei der Datenauswertung durch"]'::jsonb,
   'Die Auswertung der Daten durch die Forscher',
   'Nomen + Genitiv + durch + Akkusativ ist das Standardmuster gestapelter Nominalphrasen.',NOW()),
  ('c1000000-0000-0001-0001-000000000002','c1000000-0000-0000-0001-000000000001',
   '"infolge" verlangt welchen Kasus?','multiple_choice',
   '["Genitiv", "Dativ", "Akkusativ", "Nominativ"]'::jsonb,
   'Genitiv',
   'infolge der Datenlage — wie die meisten Präpositionen des Nominalstils steht infolge mit Genitiv.',NOW()),
  ('c1000000-0000-0001-0001-000000000003','c1000000-0000-0000-0001-000000000001',
   'Warum sollte man nicht endlos Nominalisierungen stapeln?','multiple_choice',
   '["Es geht auf Kosten der Lesbarkeit", "Es ist grammatisch verboten", "Es klingt zu locker", "Es verändert die Bedeutung"]'::jsonb,
   'Es geht auf Kosten der Lesbarkeit',
   'Nach zwei bis drei Nominalisierungen lohnt sich ein neuer Satz.',NOW()),

  ('c1000000-0000-0001-0002-000000000001','c1000000-0000-0000-0001-000000000002',
   '"Es lässt sich vermuten, dass ..." drückt aus:','multiple_choice',
   '["Eine vorsichtige Vermutung", "Eine bewiesene Tatsache", "Eine Ablehnung", "Eine Frage"]'::jsonb,
   'Eine vorsichtige Vermutung',
   'Konjunktiv II + lässt sich = epistemische Zurückhaltung, keine Tatsachenbehauptung.',NOW()),
  ('c1000000-0000-0001-0002-000000000002','c1000000-0000-0000-0001-000000000002',
   'Der vorsichtigste Ausdruck in dieser Liste ist:','multiple_choice',
   '["tendenziell zeigt sich, dass ...", "es ist davon auszugehen, dass ...", "es steht fest, dass ...", "zweifellos gilt, dass ..."]'::jsonb,
   'tendenziell zeigt sich, dass ...',
   '"tendenziell" markiert eine Tendenz, keinen Beweis — schwächer als "davon auszugehen".',NOW()),
  ('c1000000-0000-0001-0002-000000000003','c1000000-0000-0000-0001-000000000002',
   'Ein Limitationen-Abschnitt dient dazu:','multiple_choice',
   '["Die Grenzen der Studie zu benennen", "Die Ergebnisse zu übertreiben", "Quellen zu verstecken", "Den Text zu kürzen"]'::jsonb,
   'Die Grenzen der Studie zu benennen',
   'Einschränkungen wie Stichprobengröße gehören explizit benannt.',NOW()),

  ('c1000000-0000-0001-0003-000000000001','c1000000-0000-0000-0001-000000000003',
   '"Dem widerspricht die Untersuchung von Weber, ___ zufolge kein Zusammenhang nachweisbar ist."','multiple_choice',
   '["der", "die", "dessen", "denen"]'::jsonb,
   'der',
   '"der ... zufolge" bezieht sich auf die (feminine) Untersuchung im Dativ nachgestellt.',NOW()),
  ('c1000000-0000-0001-0003-000000000002','c1000000-0000-0000-0001-000000000003',
   'Die "Validität" einer Studie meint:','multiple_choice',
   '["Die Gültigkeit / Genauigkeit der Messung", "Die Anzahl der Teilnehmenden", "Das Erscheinungsjahr", "Die Zuverlässigkeit bei Wiederholung"]'::jsonb,
   'Die Gültigkeit / Genauigkeit der Messung',
   'Validität ≠ Reliabilität (Wiederholbarkeit) — häufige Verwechslung.',NOW()),
  ('c1000000-0000-0001-0003-000000000003','c1000000-0000-0000-0001-000000000003',
   'Eine Korrelation zwischen X und Y beweist:','multiple_choice',
   '["Noch keine Verursachung", "Immer eine Verursachung", "Dass X falsch ist", "Nichts Messbares"]'::jsonb,
   'Noch keine Verursachung',
   'Korrelation und Kausalität sind streng zu trennen.',NOW()),

  ('c1000000-0000-0001-0099-000000000001','c1000000-0000-0000-0001-000000000099',
   'Die "Stichprobe" ist:','multiple_choice',
   '["Die untersuchte Teilgruppe", "Die gesamte Bevölkerung", "Die Forschungsfrage", "Das Endergebnis"]'::jsonb,
   'Die untersuchte Teilgruppe',
   'Nicht zu verwechseln mit der Grundgesamtheit.',NOW()),
  ('c1000000-0000-0001-0099-000000000002','c1000000-0000-0000-0001-000000000099',
   '"aufgrund" verlangt:','multiple_choice',
   '["Genitiv", "Dativ", "Akkusativ", "Nominativ"]'::jsonb,
   'Genitiv',
   'aufgrund methodischer Einschränkungen — Genitiv wie die meisten Nominalstil-Präpositionen.',NOW()),
  ('c1000000-0000-0001-0099-000000000003','c1000000-0000-0000-0001-000000000099',
   'Ein erweitertes Partizipialattribut ersetzt typischerweise:','multiple_choice',
   '["Einen Relativsatz", "Ein Modalverb", "Eine Präposition", "Ein Adverb"]'::jsonb,
   'Einen Relativsatz',
   '"die 2022 durchgeführte Studie" statt "die Studie, die 2022 durchgeführt wurde".',NOW()),
  ('c1000000-0000-0001-0099-000000000004','c1000000-0000-0000-0001-000000000099',
   'Zu starkes Hedging ("könnte eventuell vielleicht") wirkt:','multiple_choice',
   '["Unsicher statt seriös", "Besonders wissenschaftlich", "Neutral", "Objektiv"]'::jsonb,
   'Unsicher statt seriös',
   'Eine klare Abstufung reicht — Übertreibung schadet der Glaubwürdigkeit.',NOW()),
  ('c1000000-0000-0001-0099-000000000005','c1000000-0000-0000-0001-000000000099',
   '"Wie Schmidt et al. (2019) zeigen konnten, ..." ist eine Formel für:','multiple_choice',
   '["Das Einbauen einer Quelle in den Satzfluss", "Eine direkte Rede", "Eine Ablehnung der Quelle", "Eine Fußnote ohne Text"]'::jsonb,
   'Das Einbauen einer Quelle in den Satzfluss',
   'So wird zitiert, ohne den Satz mit Klammern zu unterbrechen.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 02 – Literatur & Stilanalyse
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('c1000000-0000-0000-0002-000000000001','c1000000-0000-0000-0000-000000000002',
   'c1-rhetorische-mittel','Rhetorische Mittel erkennen und benennen',
   '<h2>Rhetorische Mittel erkennen und benennen</h2>
<h3>1. Warum Stilmittel-Vokabular zählt</h3>
<p>Auf C1 reicht es nicht, einen Text zu verstehen — du musst benennen können, <strong>wie</strong> er wirkt. Literaturkritik und Textanalyse verlangen ein präzises Metavokabular.</p>
<h3>2. Die wichtigsten Stilmittel</h3>
<table>
<thead><tr><th>Stilmittel</th><th>Definition</th><th>Beispiel</th></tr></thead>
<tbody>
<tr><td><strong>die Metapher</strong></td><td>bildhafte Übertragung ohne "wie"</td><td>"Das Leben ist eine Reise."</td></tr>
<tr><td><strong>der Vergleich</strong></td><td>Übertragung mit "wie" / "als ob"</td><td>"Er kämpfte wie ein Löwe."</td></tr>
<tr><td><strong>die Ironie</strong></td><td>das Gegenteil des Gemeinten sagen</td><td>"Na, das hast du ja toll hinbekommen." (bei einem Missgeschick)</td></tr>
<tr><td><strong>die Personifikation</strong></td><td>Dinge/Abstrakta als Person darstellen</td><td>"Der Wind flüsterte durch die Bäume."</td></tr>
<tr><td><strong>die Anapher</strong></td><td>Wiederholung am Satzanfang</td><td>"Wir kämpfen. Wir hoffen. Wir gewinnen."</td></tr>
<tr><td><strong>die Antithese</strong></td><td>Gegenüberstellung von Gegensätzen</td><td>"Der eine lebt, um zu essen; der andere isst, um zu leben."</td></tr>
<tr><td><strong>das Symbol</strong></td><td>konkretes Bild für abstrakte Idee</td><td>die Taube als Symbol des Friedens</td></tr>
</tbody>
</table>
<h3>3. Wirkung beschreiben, nicht nur benennen</h3>
<p>Ein Stilmittel zu erkennen genügt für C1 nicht — die Analyse braucht die Wirkung: <em>Durch die Anapher "Wir kämpfen, wir hoffen, wir gewinnen" entsteht ein steigernder Rhythmus, der Entschlossenheit suggeriert.</em></p>
<h3>4. Formulierungen für die Stilanalyse</h3>
<ul>
<li><em>Auffällig ist die Verwendung von ...</em></li>
<li><em>Der Autor bedient sich einer Metapher, um ... zu verdeutlichen.</em></li>
<li><em>Dadurch wird beim Leser der Eindruck erzeugt, dass ...</em></li>
<li><em>Diese Ironie entlarvt ...</em></li>
</ul>',
   1,NOW()),
  ('c1000000-0000-0000-0002-000000000002','c1000000-0000-0000-0000-000000000002',
   'c1-erzaehlperspektive','Erzählperspektive analysieren',
   '<h2>Erzählperspektive analysieren</h2>
<h3>1. Die vier klassischen Erzählperspektiven</h3>
<table>
<thead><tr><th>Perspektive</th><th>Merkmal</th></tr></thead>
<tbody>
<tr><td><strong>auktorial</strong></td><td>allwissender Erzähler, kommentiert, kennt alle Gedanken der Figuren</td></tr>
<tr><td><strong>personal</strong></td><td>Geschehen aus Sicht einer Figur, deren Innenleben zugänglich ist</td></tr>
<tr><td><strong>Ich-Erzähler</strong></td><td>Figur erzählt selbst, begrenzter Wissensstand ("Ich sah ...")</td></tr>
<tr><td><strong>neutral</strong></td><td>reine Außensicht, keine Gedanken, wie eine Kamera</td></tr>
</tbody>
</table>
<h3>2. Zuverlässigkeit des Erzählers</h3>
<p>Ein zentrales C1-Konzept ist der <strong>unzuverlässige Erzähler</strong> (unreliable narrator): Er berichtet, aber der Text signalisiert Widersprüche, die Zweifel an seiner Version wecken. <em>Der Ich-Erzähler behauptet, unschuldig zu sein — doch seine eigenen Beschreibungen widersprechen dieser Behauptung.</em></p>
<h3>3. Erzählzeit vs. erzählte Zeit</h3>
<ul>
<li><strong>Zeitdeckend:</strong> Erzählzeit = erzählte Zeit (Dialoge in Echtzeit)</li>
<li><strong>Zeitraffend:</strong> Jahre werden in wenigen Sätzen zusammengefasst</li>
<li><strong>Zeitdehnend:</strong> ein kurzer Moment wird seitenlang ausgebreitet (innerer Monolog)</li>
</ul>
<h3>4. Formulierungen für die Analyse</h3>
<ul>
<li><em>Der Roman wird aus der Perspektive eines auktorialen Erzählers geschildert, der wiederholt kommentierend eingreift.</em></li>
<li><em>Durch den personalen Erzähler erhält der Leser exklusiven Zugang zu den Gedanken der Protagonistin.</em></li>
<li><em>Die Zuverlässigkeit des Erzählers wird durch ... infrage gestellt.</em></li>
</ul>',
   2,NOW()),
  ('c1000000-0000-0000-0002-000000000003','c1000000-0000-0000-0000-000000000002',
   'c1-textinterpretation','Die Textinterpretation schreiben',
   '<h2>Die Textinterpretation schreiben</h2>
<h3>1. Der klassische Aufbau</h3>
<ol>
<li><strong>Einleitung:</strong> Autor, Titel, Erscheinungsjahr, Textsorte, kurze Einordnung, These</li>
<li><strong>Hauptteil:</strong> Inhaltsangabe (knapp, im Präsens!) → Aufbau/Struktur → sprachlich-stilistische Analyse mit Belegen → Deutung</li>
<li><strong>Schluss:</strong> Zusammenfassung der Deutung, ggf. Bezug zum historischen/gesellschaftlichen Kontext</li>
</ol>
<h3>2. Das literarische Präsens</h3>
<p>Über literarische Texte spricht man im Präsens, auch wenn die Handlung "in der Vergangenheit" spielt: <em>Werther verliebt sich in Lotte, obwohl sie bereits verlobt ist.</em> — nicht "verliebte sich".</p>
<h3>3. Belege korrekt einbinden</h3>
<ul>
<li><em>Wie es im Text heißt: "..." (Z. 14 f.), zeigt sich hier ...</em></li>
<li><em>Diese Deutung stützt sich auf die Formulierung "..." in Zeile 22.</em></li>
</ul>
<h3>4. Der deutsche Kanon — kurz und knapp</h3>
<p>Zwei Namen, die in jeder Interpretations-Übung auftauchen: <strong>Goethe</strong> (Klassik, z. B. <em>Die Leiden des jungen Werthers</em> — Gefühl vs. Vernunft) und <strong>Kafka</strong> (Moderne, z. B. <em>Die Verwandlung</em> — Entfremdung, das Absurde). Für die Interpretationsübung reicht es, Epoche und Grundthema einordnen zu können, ohne die Werke im Detail zu kennen.</p>
<h3>5. Typische Deutungsformeln</h3>
<ul>
<li><em>Der Text lässt sich als Kritik an ... lesen.</em></li>
<li><em>Auf einer symbolischen Ebene steht ... für ...</em></li>
<li><em>Die Ambivalenz des Schlusses lädt zu mehreren Lesarten ein.</em></li>
</ul>',
   3,NOW()),
  ('c1000000-0000-0000-0002-000000000099','c1000000-0000-0000-0000-000000000002',
   'c1-room02-quiz','Checkpoint: Literatur & Stilanalyse',
   '<h2>Checkpoint Quiz</h2><p>Stilmittel, Erzählperspektive und Textinterpretation — der Feuilleton-Check auf C1-Niveau!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('c1000000-0000-0002-0001-000000000001','c1000000-0000-0000-0002-000000000001',
   '"Das Leben ist eine Reise" ist ein Beispiel für:','multiple_choice',
   '["Eine Metapher", "Einen Vergleich", "Eine Ironie", "Eine Antithese"]'::jsonb,
   'Eine Metapher',
   'Bildhafte Übertragung ohne "wie" = Metapher; mit "wie" wäre es ein Vergleich.',NOW()),
  ('c1000000-0000-0002-0001-000000000002','c1000000-0000-0000-0002-000000000001',
   '"Wir kämpfen. Wir hoffen. Wir gewinnen." ist eine:','multiple_choice',
   '["Anapher", "Ironie", "Personifikation", "Metapher"]'::jsonb,
   'Anapher',
   'Wiederholung am Satzanfang erzeugt einen steigernden Rhythmus.',NOW()),
  ('c1000000-0000-0002-0001-000000000003','c1000000-0000-0000-0002-000000000001',
   'Eine gute Stilanalyse benennt nicht nur das Mittel, sondern auch:','multiple_choice',
   '["Die Wirkung auf den Leser", "Das Erscheinungsjahr", "Die Seitenzahl", "Den Verlag"]'::jsonb,
   'Die Wirkung auf den Leser',
   'Reines Benennen reicht auf C1 nicht — die Wirkung muss erklärt werden.',NOW()),

  ('c1000000-0000-0002-0002-000000000001','c1000000-0000-0000-0002-000000000002',
   'Ein Erzähler, der alle Gedanken aller Figuren kennt und kommentiert, ist:','multiple_choice',
   '["Auktorial", "Personal", "Neutral", "Ich-Erzähler"]'::jsonb,
   'Auktorial',
   'Der allwissende, kommentierende Erzähler ist der auktoriale Typ.',NOW()),
  ('c1000000-0000-0002-0002-000000000002','c1000000-0000-0000-0002-000000000002',
   'Ein "unzuverlässiger Erzähler" ist erkennbar an:','multiple_choice',
   '["Widersprüchen zur eigenen Version im Text", "Perfekter Chronologie", "Fehlender wörtlicher Rede", "Kurzen Sätzen"]'::jsonb,
   'Widersprüchen zur eigenen Version im Text',
   'Der Text selbst liefert Hinweise, die die Darstellung des Erzählers infrage stellen.',NOW()),
  ('c1000000-0000-0002-0002-000000000003','c1000000-0000-0000-0002-000000000002',
   'Wenn ein kurzer Moment seitenlang ausgebreitet wird, nennt man das:','multiple_choice',
   '["Zeitdehnend", "Zeitraffend", "Zeitdeckend", "Zeitlos"]'::jsonb,
   'Zeitdehnend',
   'Innere Monologe sind das klassische Beispiel für zeitdehnendes Erzählen.',NOW()),

  ('c1000000-0000-0002-0003-000000000001','c1000000-0000-0000-0002-000000000003',
   'Über literarische Texte spricht man im:','multiple_choice',
   '["Literarischen Präsens", "Präteritum", "Perfekt", "Futur I"]'::jsonb,
   'Literarischen Präsens',
   '"Werther verliebt sich" — nicht "verliebte sich", auch wenn die Handlung fiktiv in der Vergangenheit spielt.',NOW()),
  ('c1000000-0000-0002-0003-000000000002','c1000000-0000-0000-0002-000000000003',
   'Kafkas Grundthema wird meist verbunden mit:','multiple_choice',
   '["Entfremdung und dem Absurden", "Aufklärung und Vernunft", "Ritterromantik", "Naturlyrik"]'::jsonb,
   'Entfremdung und dem Absurden',
   'Wie in "Die Verwandlung" — ein Klassiker der literarischen Moderne.',NOW()),
  ('c1000000-0000-0002-0003-000000000003','c1000000-0000-0000-0002-000000000003',
   'Ein Beleg im Interpretationstext wird eingebunden als:','multiple_choice',
   '["Wie es im Text heißt: \"...\" (Z. 14 f.)", "Irgendwo stand mal", "Man liest so", "Ich glaube, dass"]'::jsonb,
   'Wie es im Text heißt: "..." (Z. 14 f.)',
   'Wörtliche Zitate mit Zeilenangabe stützen jede Deutung.',NOW()),

  ('c1000000-0000-0002-0099-000000000001','c1000000-0000-0000-0002-000000000099',
   'Ein Symbol unterscheidet sich von einer Metapher dadurch, dass es:','multiple_choice',
   '["Ein konkretes Bild für eine abstrakte Idee ist, oft kulturell etabliert", "Immer mit \"wie\" gebildet wird", "Nur in Gedichten vorkommt", "Keine Bedeutung trägt"]'::jsonb,
   'Ein konkretes Bild für eine abstrakte Idee ist, oft kulturell etabliert',
   'Die Taube als Symbol des Friedens ist kulturell verankert, nicht spontan gebildet wie eine Metapher.',NOW()),
  ('c1000000-0000-0002-0099-000000000002','c1000000-0000-0000-0002-000000000099',
   '"Der eine lebt, um zu essen; der andere isst, um zu leben" ist eine:','multiple_choice',
   '["Antithese", "Anapher", "Personifikation", "Ironie"]'::jsonb,
   'Antithese',
   'Gegenüberstellung von Gegensätzen = Antithese.',NOW()),
  ('c1000000-0000-0002-0099-000000000003','c1000000-0000-0000-0002-000000000099',
   'Der Hauptteil einer Textinterpretation beginnt typischerweise mit:','multiple_choice',
   '["Einer knappen Inhaltsangabe im Präsens", "Einer ausführlichen Nacherzählung im Präteritum", "Der eigenen Meinung", "Einem Zitat ohne Kontext"]'::jsonb,
   'Einer knappen Inhaltsangabe im Präsens',
   'Kurz und im literarischen Präsens, danach folgt die Analyse.',NOW()),
  ('c1000000-0000-0002-0099-000000000004','c1000000-0000-0000-0002-000000000099',
   'Der personale Erzähler unterscheidet sich vom Ich-Erzähler dadurch, dass er:','multiple_choice',
   '["In der dritten Person erzählt, aber Zugang zum Innenleben einer Figur hat", "Immer allwissend ist", "Nie Gedanken kennt", "Nur äußere Handlungen zeigt"]'::jsonb,
   'In der dritten Person erzählt, aber Zugang zum Innenleben einer Figur hat',
   'Personal = dritte Person + begrenzte Innensicht einer Figur.',NOW()),
  ('c1000000-0000-0002-0099-000000000005','c1000000-0000-0000-0002-000000000099',
   '"Der Text lässt sich als Kritik an ... lesen" ist eine typische:','multiple_choice',
   '["Deutungsformel", "Inhaltsangabe", "Quellenangabe", "Ironie"]'::jsonb,
   'Deutungsformel',
   'Solche Formeln leiten den interpretierenden Teil der Analyse ein.',NOW())
ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ROOM 03 – Wirtschaft & Verhandlung
-- ════════════════════════════════════════════════════════════
INSERT INTO public.lessons (id, course_id, slug, title, content, order_index, created_at)
VALUES
  ('c1000000-0000-0000-0003-000000000001','c1000000-0000-0000-0000-000000000003',
   'c1-verhandlungssprache','Verhandlungssprache & Idiomatik',
   '<h2>Verhandlungssprache & Idiomatik</h2>
<h3>1. Die Eröffnung einer Verhandlung</h3>
<ul>
<li><em>Lassen Sie uns zunächst die Eckpunkte abstecken, bevor wir ins Detail gehen.</em></li>
<li><em>Wo stehen wir aus Ihrer Sicht aktuell?</em></li>
</ul>
<h3>2. Idiomatische Business-Wendungen</h3>
<table>
<thead><tr><th>Redewendung</th><th>Bedeutung</th></tr></thead>
<tbody>
<tr><td>etwas auf den Tisch bringen</td><td>ein Thema/Angebot einbringen</td></tr>
<tr><td>an einem Strang ziehen</td><td>zusammenarbeiten, gleiches Ziel verfolgen</td></tr>
<tr><td>die Katze im Sack kaufen</td><td>ohne Prüfung etwas Ungewisses akzeptieren</td></tr>
<tr><td>auf Augenhöhe verhandeln</td><td>als gleichwertige Partner verhandeln</td></tr>
<tr><td>einen Kompromiss ausloten</td><td>vorsichtig prüfen, wie weit man sich annähern kann</td></tr>
<tr><td>etwas ist verhandelbar / nicht verhandelbar</td><td>zeigt Spielraum bzw. eine feste Grenze an</td></tr>
</tbody>
</table>
<h3>3. Zugeständnisse machen, ohne zu viel zu verlieren</h3>
<ul>
<li><em>Wir könnten uns vorstellen, beim Preis entgegenzukommen, sofern die Liefermenge steigt.</em></li>
<li><em>Das ist für uns nur unter der Voraussetzung darstellbar, dass ...</em></li>
<li><em>Bis zu diesem Punkt können wir mitgehen, darüber hinaus wird es schwierig.</em></li>
</ul>
<h3>4. Verhandlungen elegant abschließen</h3>
<p><em>Ich fasse zusammen: Wir einigen uns auf einen Preis von ..., die Lieferung erfolgt bis ..., Details regeln wir schriftlich. Sind wir uns einig?</em></p>',
   1,NOW()),
  ('c1000000-0000-0000-0003-000000000002','c1000000-0000-0000-0000-000000000003',
   'c1-konjunktiv-1-geschaeft','Konjunktiv I in der indirekten Geschäftsrede',
   '<h2>Konjunktiv I in der indirekten Geschäftsrede</h2>
<h3>1. Warum Konjunktiv I im Geschäftsbericht</h3>
<p>Genau wie im Journalismus markiert der Konjunktiv I: <strong>Das ist die Aussage des anderen, nicht meine Bestätigung.</strong> In Protokollen, Berichten und E-Mails über Verhandlungen ist das entscheidend, um sich rechtlich und diplomatisch nicht festzulegen.</p>
<h3>2. Beispiele aus der Geschäftswelt</h3>
<ul>
<li><em>Der Lieferant teilte mit, die Verzögerung <strong>sei</strong> auf einen Rohstoffmangel zurückzuführen.</em></li>
<li><em>Die Geschäftsführung erklärte, man <strong>werde</strong> die Investition prüfen.</em></li>
<li><em>Der Kunde behauptete, er <strong>habe</strong> bereits eine Anzahlung geleistet.</em></li>
<li><em>Man ließ verlauten, ein Angebot der Konkurrenz <strong>liege</strong> bereits vor.</em></li>
</ul>
<h3>3. Ausweichen auf Konjunktiv II</h3>
<p>Wo Konjunktiv I mit dem Indikativ identisch aussieht (z. B. bei "sie haben"), springt Konjunktiv II ein: <em>Die Kunden erklärten, sie <strong>hätten</strong> (nicht: "haben") bereits reklamiert.</em></p>
<h3>4. Die diplomatische Funktion</h3>
<p>Ein Protokoll mit Konjunktiv I schützt: <em>Der Verhandlungspartner erklärte, das Angebot sei sein letztes Wort gewesen</em> — das Protokoll gibt die Aussage wieder, ohne sie zu bewerten oder zu bestätigen. Genau diese Distanz ist im Geschäftsleben Gold wert.</p>',
   2,NOW()),
  ('c1000000-0000-0000-0003-000000000003','c1000000-0000-0000-0000-000000000003',
   'c1-vertrag-widerspruch','Vertragsvokabular & diplomatischer Widerspruch',
   '<h2>Vertragsvokabular & diplomatischer Widerspruch</h2>
<h3>1. Kern-Vokabular für Verträge</h3>
<table>
<thead><tr><th>Begriff</th><th>Bedeutung</th></tr></thead>
<tbody>
<tr><td>die Vertragspartei</td><td>eine der Seiten des Vertrags</td></tr>
<tr><td>die Klausel</td><td>einzelne Vertragsbestimmung</td></tr>
<tr><td>die Kündigungsfrist</td><td>Zeitraum bis zum Vertragsende nach Kündigung</td></tr>
<tr><td>die Vertragsstrafe</td><td>Zahlung bei Vertragsverletzung</td></tr>
<tr><td>rechtsverbindlich</td><td>rechtlich bindend</td></tr>
<tr><td>die Nachverhandlung</td><td>erneutes Verhandeln bereits vereinbarter Punkte</td></tr>
</tbody>
</table>
<h3>2. Diplomatisch widersprechen — die Eskalationsleiter</h3>
<ol>
<li><strong>Vorsichtig einleiten:</strong> <em>Ich verstehe Ihren Standpunkt, allerdings sehe ich das etwas anders.</em></li>
<li><strong>Sachlich begründen:</strong> <em>Aus unserer Sicht lässt sich das nicht ohne Weiteres so umsetzen, da ...</em></li>
<li><strong>Klare Grenze setzen, höflich verpackt:</strong> <em>Das ist für uns leider keine Option, wir sind aber offen für Alternativen.</em></li>
</ol>
<h3>3. Formulierungen für Uneinigkeit ohne Eskalation</h3>
<ul>
<li><em>Da gehen unsere Einschätzungen offenbar auseinander.</em></li>
<li><em>Lassen Sie uns das aus einem anderen Blickwinkel betrachten.</em></li>
<li><em>Ich kann Ihren Punkt nachvollziehen, möchte aber zu bedenken geben, dass ...</em></li>
<li><em>Bevor wir uns festlegen, sollten wir die Konsequenzen beider Optionen abwägen.</em></li>
</ul>
<h3>4. Konflikte um Klauseln höflich formulieren</h3>
<p><em>Wir bitten um eine Anpassung von Klausel 4.2, da die dort genannte Frist aus unserer Sicht zu knapp bemessen ist. Wären zwei zusätzliche Wochen denkbar?</em></p>',
   3,NOW()),
  ('c1000000-0000-0000-0003-000000000099','c1000000-0000-0000-0000-000000000003',
   'c1-room03-quiz','Checkpoint: Wirtschaft & Verhandlung',
   '<h2>Checkpoint Quiz</h2><p>Verhandlungssprache, Konjunktiv I im Geschäftsleben und Vertragsvokabular!</p>',
   99,NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercises (id, lesson_id, question, type, options, correct_answer, explanation, created_at)
VALUES
  ('c1000000-0000-0003-0001-000000000001','c1000000-0000-0000-0003-000000000001',
   '"An einem Strang ziehen" bedeutet:','multiple_choice',
   '["Zusammenarbeiten, gleiches Ziel verfolgen", "Sich streiten", "Ein Seil kaufen", "Aufgeben"]'::jsonb,
   'Zusammenarbeiten, gleiches Ziel verfolgen',
   'Ein Bild aus dem gemeinsamen Ziehen — beide Seiten arbeiten zusammen.',NOW()),
  ('c1000000-0000-0003-0001-000000000002','c1000000-0000-0000-0003-000000000001',
   '"Die Katze im Sack kaufen" heißt:','multiple_choice',
   '["Ohne Prüfung etwas Ungewisses akzeptieren", "Ein Haustier kaufen", "Ein gutes Geschäft machen", "Vorsichtig verhandeln"]'::jsonb,
   'Ohne Prüfung etwas Ungewisses akzeptieren',
   'Eine Warnung vor unüberlegten Zusagen.',NOW()),
  ('c1000000-0000-0003-0001-000000000003','c1000000-0000-0000-0003-000000000001',
   '"Wir könnten uns vorstellen, beim Preis entgegenzukommen, ___ die Menge steigt."','multiple_choice',
   '["sofern", "obwohl", "trotzdem", "weil nicht"]'::jsonb,
   'sofern',
   'sofern = unter der Bedingung, dass — passt zum konditionalen Zugeständnis.',NOW()),

  ('c1000000-0000-0003-0002-000000000001','c1000000-0000-0000-0003-000000000002',
   '"Der Lieferant teilte mit, die Verzögerung ___ auf einen Rohstoffmangel zurückzuführen."','multiple_choice',
   '["sei", "ist", "wäre gewesen", "war"]'::jsonb,
   'sei',
   'Konjunktiv I gibt die fremde Aussage distanziert wieder.',NOW()),
  ('c1000000-0000-0003-0002-000000000002','c1000000-0000-0000-0003-000000000002',
   '"Die Kunden erklärten, sie ___ bereits reklamiert." (Ausweichform, da Indikativ und Konj. I gleich wären)','multiple_choice',
   '["hätten", "haben", "habe", "hatten"]'::jsonb,
   'hätten',
   'Bei Formgleichheit mit dem Indikativ ("sie haben") springt Konjunktiv II ein.',NOW()),
  ('c1000000-0000-0003-0002-000000000003','c1000000-0000-0000-0003-000000000002',
   'Konjunktiv I in einem Geschäftsprotokoll dient vor allem dazu:','multiple_choice',
   '["Aussagen wiederzugeben, ohne sie zu bestätigen", "Höflicher zu klingen", "Vergangenheit auszudrücken", "Befehle zu mildern"]'::jsonb,
   'Aussagen wiederzugeben, ohne sie zu bestätigen',
   'Diplomatische Distanz zur wiedergegebenen Aussage — wichtig im Geschäftsleben.',NOW()),

  ('c1000000-0000-0003-0003-000000000001','c1000000-0000-0000-0003-000000000003',
   'Eine "Vertragsstrafe" ist:','multiple_choice',
   '["Eine Zahlung bei Vertragsverletzung", "Ein Bonus für gute Leistung", "Eine Kündigungsfrist", "Ein Rabatt"]'::jsonb,
   'Eine Zahlung bei Vertragsverletzung',
   'Sanktion, wenn eine Vertragspartei ihre Pflichten verletzt.',NOW()),
  ('c1000000-0000-0003-0003-000000000002','c1000000-0000-0000-0003-000000000003',
   'Diplomatisch widersprechen beginnt am besten mit:','multiple_choice',
   '["Ich verstehe Ihren Standpunkt, allerdings ...", "Das ist völlig falsch.", "Sie irren sich.", "Nein, auf keinen Fall."]'::jsonb,
   'Ich verstehe Ihren Standpunkt, allerdings ...',
   'Erst Verständnis zeigen, dann den eigenen Standpunkt einbringen.',NOW()),
  ('c1000000-0000-0003-0003-000000000003','c1000000-0000-0000-0003-000000000003',
   'Die "Kündigungsfrist" bezeichnet:','multiple_choice',
   '["Den Zeitraum bis zum Vertragsende nach Kündigung", "Die Vertragsstrafe", "Das Datum der Unterschrift", "Die Nachverhandlung"]'::jsonb,
   'Den Zeitraum bis zum Vertragsende nach Kündigung',
   'Wichtiger Begriff, um zu wissen, ab wann ein Vertrag tatsächlich endet.',NOW()),

  ('c1000000-0000-0003-0099-000000000001','c1000000-0000-0000-0003-000000000099',
   '"Auf Augenhöhe verhandeln" bedeutet:','multiple_choice',
   '["Als gleichwertige Partner verhandeln", "Laut verhandeln", "Im Stehen verhandeln", "Schnell verhandeln"]'::jsonb,
   'Als gleichwertige Partner verhandeln',
   'Keine Seite hat von vornherein die Oberhand.',NOW()),
  ('c1000000-0000-0003-0099-000000000002','c1000000-0000-0000-0003-000000000099',
   '"Man ließ verlauten, ein Angebot der Konkurrenz ___ bereits vor."','multiple_choice',
   '["liege", "liegt", "läge vor gewesen", "lag"]'::jsonb,
   'liege',
   'Konjunktiv I: liegen → liege (er/sie/es).',NOW()),
  ('c1000000-0000-0003-0099-000000000003','c1000000-0000-0000-0003-000000000099',
   'Eine "Klausel" ist:','multiple_choice',
   '["Eine einzelne Vertragsbestimmung", "Der gesamte Vertrag", "Eine Unterschrift", "Ein Anhang ohne Bedeutung"]'::jsonb,
   'Eine einzelne Vertragsbestimmung',
   'Verträge bestehen aus mehreren Klauseln.',NOW()),
  ('c1000000-0000-0003-0099-000000000004','c1000000-0000-0000-0003-000000000099',
   '"Das ist für uns leider keine Option, wir sind aber offen für Alternativen" ist ein Beispiel für:','multiple_choice',
   '["Eine höflich verpackte klare Grenze", "Eine Zusage", "Eine Beleidigung", "Eine Frage"]'::jsonb,
   'Eine höflich verpackte klare Grenze',
   'Ablehnung + Gesprächsbereitschaft = diplomatisch, aber eindeutig.',NOW()),
  ('c1000000-0000-0003-0099-000000000005','c1000000-0000-0000-0003-000000000099',
   '"Wir bitten um eine Anpassung von Klausel 4.2, ___ die Frist zu knapp ist."','multiple_choice',
   '["da", "obwohl", "damit", "als ob"]'::jsonb,
   'da',
   'da = weil, begründend — passt zur höflichen Bitte um Anpassung.',NOW())
ON CONFLICT (id) DO NOTHING;
