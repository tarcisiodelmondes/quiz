import styles from '../styles/pages/PageQuestions.module.scss';

export default function PageQuestions() {
  return (
    <div className={styles.container}>
      <div className={styles.containerQuestion}>
        <h2>Qual Tal teste?</h2>
      </div>

      <div className={styles.containerAnswers}>
        <p>Resposta 1</p>
      </div>
      <div className={styles.containerAnswers}>
        <p>Resposta 2</p>
      </div>
      <div className={styles.containerAnswers}>
        <p>Resposta 3</p>
      </div>
      <div className={styles.containerAnswers}>
        <p>Resposta 4</p>
      </div>

      <div className={styles.containerButton}>
        <button>Proxima</button>
      </div>
    </div>
  );
}
