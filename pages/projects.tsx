import React from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import styles from '../styles/Projects.module.css';

const Projects: React.FC = () => {
  return (
    <>
      <Head>
        <title>Projects - Build Something Great</title>
        <meta name="description" content="Manage and collaborate on projects with elegance" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <h1 className={styles.title}>Projects</h1>
            <p className={styles.subtitle}>
              Collaborate seamlessly. Build beautifully.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className={styles.grid}>
              <div className="card">
                <div className={styles.cardHeader}>
                  <span className={styles.status}>Active</span>
                </div>
                <h3>Design System 2.0</h3>
                <p>
                  A comprehensive redesign of our component library with enhanced
                  accessibility and modern aesthetics.
                </p>
                <div className={styles.projectMeta}>
                  <span className={styles.metaItem}>
                    <span className={styles.metaLabel}>Progress</span>
                    <span className={styles.metaValue}>75%</span>
                  </span>
                  <span className={styles.metaItem}>
                    <span className={styles.metaLabel}>Team</span>
                    <span className={styles.metaValue}>8 members</span>
                  </span>
                </div>
              </div>

              <div className="card">
                <div className={styles.cardHeader}>
                  <span className={`${styles.status} ${styles.statusInProgress}`}>In Progress</span>
                </div>
                <h3>Mobile App Launch</h3>
                <p>
                  Native iOS and Android applications delivering our core
                  experience to mobile users.
                </p>
                <div className={styles.projectMeta}>
                  <span className={styles.metaItem}>
                    <span className={styles.metaLabel}>Progress</span>
                    <span className={styles.metaValue}>45%</span>
                  </span>
                  <span className={styles.metaItem}>
                    <span className={styles.metaLabel}>Team</span>
                    <span className={styles.metaValue}>12 members</span>
                  </span>
                </div>
              </div>

              <div className="card">
                <div className={styles.cardHeader}>
                  <span className={`${styles.status} ${styles.statusPlanning}`}>Planning</span>
                </div>
                <h3>Analytics Platform</h3>
                <p>
                  Real-time data visualization and insights platform for
                  enterprise customers.
                </p>
                <div className={styles.projectMeta}>
                  <span className={styles.metaItem}>
                    <span className={styles.metaLabel}>Progress</span>
                    <span className={styles.metaValue}>15%</span>
                  </span>
                  <span className={styles.metaItem}>
                    <span className={styles.metaLabel}>Team</span>
                    <span className={styles.metaValue}>6 members</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`section ${styles.capabilitiesSection}`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Everything you need</h2>
            <div className={styles.capabilitiesGrid}>
              <div className={styles.capability}>
                <div className={styles.capabilityIcon}>🎨</div>
                <h3>Design Tools</h3>
                <p>
                  Integrated design collaboration with real-time feedback
                  and version control.
                </p>
              </div>

              <div className={styles.capability}>
                <div className={styles.capabilityIcon}>👥</div>
                <h3>Team Collaboration</h3>
                <p>
                  Seamless communication and file sharing across distributed
                  teams.
                </p>
              </div>

              <div className={styles.capability}>
                <div className={styles.capabilityIcon}>📈</div>
                <h3>Progress Tracking</h3>
                <p>
                  Visual timelines and milestone tracking to keep everyone
                  aligned.
                </p>
              </div>

              <div className={styles.capability}>
                <div className={styles.capabilityIcon}>🔄</div>
                <h3>Agile Workflows</h3>
                <p>
                  Flexible project management adapted to your team's preferred
                  methodology.
                </p>
              </div>

              <div className={styles.capability}>
                <div className={styles.capabilityIcon}>📝</div>
                <h3>Documentation</h3>
                <p>
                  Rich text editing and knowledge base integration for
                  comprehensive project docs.
                </p>
              </div>

              <div className={styles.capability}>
                <div className={styles.capabilityIcon}>🚀</div>
                <h3>Deploy Pipeline</h3>
                <p>
                  Automated deployment workflows with continuous integration
                  and delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={`section ${styles.testimonialSection}`}>
          <div className="container">
            <div className={styles.testimonial}>
              <p className={styles.quote}>
                "The simplicity and elegance of this platform transformed how our
                team approaches project management. It just works."
              </p>
              <p className={styles.author}>— Sarah Chen, Product Lead</p>
            </div>
          </div>
        </section>

        <section className={`section ${styles.ctaSection}`}>
          <div className="container">
            <div className={styles.cta}>
              <h2>Start your next project</h2>
              <p>Transform ideas into reality with tools designed for creators.</p>
              <button className={styles.ctaButton}>Create Project</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Projects;
