import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '../services/api';
import styles from '../styles/pages/PageQuestions.module.scss';

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
  allAnswerShuffle: Array<any>;
};

export default function PageQuestions({
  results,
  allAnswerShuffle,
}: PageQuestionsProps) {
  const [answerCorrect, setAnswerCorrect] = useState(0);
  const [answerIncorrect, setAnswerIncorrect] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [hasStyleCorrectOrIncorrect, setHasStyleCorrectOrIncorrect] = useState(
    false,
  );

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

  function checkAnswer(event: HTMLButtonElement, answer: string) {
    incrementAnswerCorrectOrIncorrect(answer);
    addClassCorrectOrIncorrect(event, answer);
    setHasStyleCorrectOrIncorrect(true);
  }

  return (
    <div className={styles.container}>
      {currentQuestion >= allAnswerShuffle.length ? (
        <div className={styles.containerResult}>
          <h1>Completed quiz</h1>

          <p>Correct answers: {answerCorrect}</p>
          <p>Incorrect answers: {answerIncorrect}</p>

          <span>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get('/api.php', {
    params: {
      amount: 10,
      category: 21,
      difficulty: 'medium',
      type: 'multiple',
    },
  });

  function shuffle(array: string[]) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  const allAnswerShuffle = data.results.map((results) => {
    return shuffle([...results.incorrect_answers, results.correct_answer]);
  });

  return {
    props: {
      results: data.results,
      allAnswerShuffle,
    },
  };
};
