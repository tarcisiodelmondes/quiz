import Head from 'next/head';

import '../styles/global.scss';
import '../styles/variables.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Quiz</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
