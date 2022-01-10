import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/pages/home.module.scss';

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.containerImg}>
        <Image
          src="/question-mark.svg"
          alt="Image of a light bulb with a question mark"
          width={300}
          height={300}
        />
      </div>

      <h1>
        A quiz about sports in general.
        <br /> <span>simple</span> and <span>fun</span>
      </h1>

      <Link href="/page-questions">
        <a>Play Quiz</a>
      </Link>
    </main>
  );
}
