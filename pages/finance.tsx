import React from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import styles from '../styles/Finance.module.css';

const Finance: React.FC = () => {
  return (
    <>
      <Head>
        <title>Finance - Portfolio Management</title>
        <meta name="description" content="Manage your financial portfolio with elegance" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <h1 className={styles.title}>Finance</h1>
            <p className={styles.subtitle}>
              Intelligent portfolio management, reimagined.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className={styles.grid}>
              <div className="card">
                <h3>Portfolio Overview</h3>
                <p>
                  Track your investments across multiple accounts with real-time updates
                  and comprehensive analytics.
                </p>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>$125,430</span>
                  <span className={styles.metricLabel}>Total Value</span>
                </div>
              </div>

              <div className="card">
                <h3>Asset Allocation</h3>
                <p>
                  Diversify intelligently with automated recommendations based on
                  your risk tolerance and goals.
                </p>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>+12.5%</span>
                  <span className={styles.metricLabel}>YTD Growth</span>
                </div>
              </div>

              <div className="card">
                <h3>Market Insights</h3>
                <p>
                  Stay informed with curated market analysis and personalized
                  investment opportunities.
                </p>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>24/7</span>
                  <span className={styles.metricLabel}>Monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`section ${styles.featureSection}`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Built for simplicity</h2>
            <div className={styles.featureGrid}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>📊</div>
                <h3>Advanced Analytics</h3>
                <p>
                  Comprehensive reports and visualizations that help you understand
                  your financial position at a glance.
                </p>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>🔒</div>
                <h3>Bank-Level Security</h3>
                <p>
                  Your data is encrypted and protected with industry-leading
                  security protocols.
                </p>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>⚡</div>
                <h3>Real-Time Updates</h3>
                <p>
                  Instant notifications and live market data keep you informed
                  of every important change.
                </p>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>🎯</div>
                <h3>Goal Tracking</h3>
                <p>
                  Set financial goals and watch your progress with intuitive
                  milestone tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={`section ${styles.ctaSection}`}>
          <div className="container">
            <div className={styles.cta}>
              <h2>Start managing smarter today</h2>
              <p>Join thousands of users who trust us with their financial future.</p>
              <button className={styles.ctaButton}>Get Started</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Finance;
