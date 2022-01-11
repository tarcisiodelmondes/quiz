import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '../services/api';
import styles from '../styles/pages/PageQuestions.module.scss';
import { shuffle } from '../utils/shuffle';

type Results = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: Array<string>;
};

type PageQuestionsProps = {
  results: Results[];
  allAnswerShuffle: Array<string[]>;
};

export default function PageQuestions({
  results,
  allAnswerShuffle,
}: PageQuestionsProps) {
  const [answerCorrect, setAnswerCorrect] = useState(0);
  const [answerIncorrect, setAnswerIncorrect] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [hasStyleCorrectOrIncorrect, setHasStyleCorrectOrIncorrect] =
    useState(false);

  function nextQuestion() {
    setCurrentQuestion(currentQuestion + 1);
    setHasStyleCorrectOrIncorrect(false);
  }

  function incrementAnswerCorrectOrIncorrect(answer: string) {
    answer === results[currentQuestion].correct_answer
      ? setAnswerCorrect(answerCorrect + 1)
      : setAnswerIncorrect(answerIncorrect + 1);
  }

  function addClassCorrectOrIncorrect(
    button: HTMLButtonElement,
    answer: string,
  ) {
    if (hasStyleCorrectOrIncorrect) return;

    answer === results[currentQuestion].correct_answer
      ? button.classList.add(styles.correct)
      : button.classList.add(styles.incorrect);
  }

  function checkAnswer(button: HTMLButtonElement, answer: string) {
    incrementAnswerCorrectOrIncorrect(answer);
    addClassCorrectOrIncorrect(button, answer);
    setHasStyleCorrectOrIncorrect(true);
  }

  return (
    <div className={styles.container}>
      {currentQuestion >= allAnswerShuffle.length ? (
        <div className={styles.containerResult}>
          <h1>Completed quiz</h1>

          <p>
            Correct answers:{' '}
            <span className={styles.totalCorrect}>{answerCorrect}</span>
          </p>

          <p>
            Incorrect answers:{' '}
            <span className={styles.totalIncorrect}>{answerIncorrect}</span>
          </p>

          <span className={styles.contentHitRat}>
            Hit rate: {(answerCorrect / allAnswerShuffle.length) * 100}%
          </span>

          <div className={styles.containerLink}>
            <Link href="/">
              <a>Go to home page</a>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.containerQuestion}>
            <h2>{results[currentQuestion].question}</h2>
          </div>

          {allAnswerShuffle[currentQuestion].map((answer) => {
            return (
              <button
                disabled={hasStyleCorrectOrIncorrect}
                key={answer}
                className={styles.containerAnswers}
                onClick={(event) => checkAnswer(event.currentTarget, answer)}
              >
                {answer}
              </button>
            );
          })}

          <div className={styles.containerButton}>
            <button
              disabled={!hasStyleCorrectOrIncorrect}
              onClick={() => nextQuestion()}
            >
              Next
            </button>
          </div>

          <div className={styles.containerProgress}>
            <span
              style={{
                width: `${(currentQuestion / allAnswerShuffle.length) * 100}%`,
              }}
              className={styles.progressBar}
            />
            <p>
              {currentQuestion} / <span>{allAnswerShuffle.length}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const { data } = await api.get<{ results: Results[] }>('/api.php', {
      params: {
        amount: 10,
        category: 21,
        difficulty: 'easy',
        type: 'multiple',
      },
    });

    const allAnswerShuffle = data.results.map((results) => {
      return shuffle([...results.incorrect_answers, results.correct_answer]);
    });

    return {
      props: {
        results: data.results,
        allAnswerShuffle,
      },
    };
  } catch (error) {
    return {
      redirect: { destination: '/500', permanent: false },
      props: {},
    };
  }
};
