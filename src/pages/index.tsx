import Link from 'next/link';
import styles from '../styles/pages/home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <Link href="/page-questions">
        <a>Play Quiz</a>
      </Link>
    </div>
  );
}
