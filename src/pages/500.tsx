import Link from 'next/link';

import styles from '../styles/pages/CustomPage500.module.scss';

export default function CustomPage500() {
  return (
    <main className={styles.container}>
      <div>
        <h1>Sorry we had an internal error</h1>

        <Link href="/">
          <a>Go to home</a>
        </Link>
      </div>
    </main>
  );
}
