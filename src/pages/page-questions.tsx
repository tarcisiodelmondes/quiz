import { GetServerSideProps } from 'next';
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

type ResultsProps = {
  results: Results;
  allAnswerShuffle: Array<any>;
};

export default function PageQuestions(result: ResultsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [hasStyleCorrectOrIncorrect, setHasStyleCorrectOrIncorrect] = useState(
    false,
  );

  function nextQuestion() {
    setCurrentQuestion(currentQuestion + 1);
    setHasStyleCorrectOrIncorrect(false);
  }

  function addClassCorrectOrIncorrect(
    button: HTMLButtonElement,
    answer: string,
  ) {
    if (hasStyleCorrectOrIncorrect) return;

    answer === result.results[currentQuestion].correct_answer
      ? button.classList.add(styles.correct)
      : button.classList.add(styles.incorrect);
  }

  function checkAnswer(event: HTMLButtonElement, answer: string) {
    addClassCorrectOrIncorrect(event, answer);
    setHasStyleCorrectOrIncorrect(true);
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerQuestion}>
        <h2>{result.results[currentQuestion].question}</h2>
      </div>

      {result.allAnswerShuffle[currentQuestion].map((answer) => {
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
        <button onClick={() => nextQuestion()}>Proxima</button>
      </div>
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

  const result = {
    results: data.results,
    allAnswerShuffle,
  };

  return {
    props: result,
  };
};
