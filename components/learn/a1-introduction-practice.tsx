"use client";

import { useEffect, useRef, useState } from "react";
import { checkIntroduction, introductionQuestions, introductionText, practiceCopy, type PracticeAnswers, type PracticeLocale } from "@/lib/a1-introduction";
import styles from "./a1-introduction-practice.module.css";

export function A1IntroductionPractice({ locale }: { locale: PracticeLocale }) {
  const copy = practiceCopy[locale];
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<PracticeAnswers>({});
  const [result, setResult] = useState<ReturnType<typeof checkIntroduction>>(null);
  const form = useRef<HTMLFormElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => setReady(true), []);
  useEffect(() => { if (result) resultHeading.current?.focus(); }, [result]);

  function reset() {
    setAnswers({});
    setResult(null);
    form.current?.querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
  }

  return (
    <section id="a1-introduction-practice" className={styles.practice} aria-labelledby="a1-practice-title">
      <p className={styles.badge}>{copy.badge}</p>
      <h2 id="a1-practice-title">{copy.title}</h2>
      <p>{copy.intro}</p>
      <p className={styles.notice}>{copy.notice}</p>
      <noscript><p>{copy.fallback}</p></noscript>
      <form ref={form} aria-labelledby="a1-practice-title" onSubmit={event => {
        event.preventDefault();
        setResult(checkIntroduction(answers));
      }}>
        {(["reading", "questions"] as const).map(group => (
          <div key={group}>
            <h3>{group === "reading" ? copy.reading : copy.matching}</h3>
            {group === "reading" ? <blockquote lang="de">{introductionText}</blockquote> : <p>{copy.matchingHint}</p>}
            {introductionQuestions.filter(question => question.group === group).map(question => {
              const feedback = result?.results.find(item => item.id === question.id);
              return (
                <fieldset key={question.id} disabled={!ready} aria-describedby={feedback ? `a1-feedback-${question.id}` : undefined}>
                  <legend lang="de">{question.prompt}</legend>
                  <div className={styles.options}>
                    {question.options.map((option, index) => (
                      <label key={option}>
                        <input type="radio" name={`a1-${question.id}`} value={index} required checked={answers[question.id] === index} onChange={() => {
                          setAnswers(current => ({ ...current, [question.id]: index }));
                          setResult(null);
                        }} />
                        <span lang="de">{option}</span>
                      </label>
                    ))}
                  </div>
                  {feedback && <p id={`a1-feedback-${question.id}`} className={feedback.correct ? styles.correct : styles.wrong}>
                    <strong>{feedback.correct ? copy.correct : copy.wrong}</strong> {question.explanation[locale]}
                  </p>}
                </fieldset>
              );
            })}
          </div>
        ))}
        <p className={styles.notice}>{Object.keys(answers).length} / {introductionQuestions.length} {copy.progress}</p>
        <div className={styles.actions}>
          <button type="submit" disabled={!ready}>{copy.check}</button>
          <button type="button" className={styles.secondary} onClick={reset}>{copy.retry}</button>
        </div>
      </form>
      {result && <div className={styles.result}>
        <h3 ref={resultHeading} tabIndex={-1}>{copy.result}: {result.score} / {result.total} {copy.points}</h3>
        <p>{copy.resultHint}</p>
      </div>}
      <details className={styles.solutions}>
        <summary>{copy.answers}</summary>
        <ol>{introductionQuestions.map(question => <li key={question.id}>
          <p lang="de"><strong>{question.prompt}</strong> — {question.options[question.correct]}</p>
          <p>{question.explanation[locale]}</p>
        </li>)}</ol>
      </details>
      <h3>{copy.next}</h3>
      <p>{copy.nextBody}</p>
      <blockquote lang="de">Ich heiße … . Ich komme aus … . Ich wohne in … . Ich spreche … .</blockquote>
      <div className={styles.links}>
        <a href={`/${locale}/levels`}>{copy.links} →</a>
        <a href={`/${locale}/magazine/german-a1-exam-guide#a1-introduction-practice`}>{copy.permalink}</a>
      </div>
    </section>
  );
}
