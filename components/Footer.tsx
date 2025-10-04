import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h4>Products</h4>
            <ul>
              <li><a href="/finance">Finance</a></li>
              <li><a href="/projects">Projects</a></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h4>Resources</h4>
            <ul>
              <li><a href="/support">Support</a></li>
              <li><a href="/documentation">Documentation</a></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2025 All rights reserved.
          </p>
          <div className={styles.links}>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
