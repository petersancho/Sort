import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Welcome - Finance & Projects Portal</title>
        <meta name="description" content="Elegant project and finance management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <h1 className={styles.title}>Welcome</h1>
            <p className={styles.subtitle}>
              Simplicity meets sophistication.
            </p>
            
            <div className={styles.buttonGroup}>
              <Link href="/finance">
                <button className={styles.primaryButton}>Finance</button>
              </Link>
              <Link href="/projects">
                <button className={styles.secondaryButton}>Projects</button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
