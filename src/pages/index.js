import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Heading from '@theme/Heading';
import styles from './index.module.css';

const profile = {
  name: 'Hiro',
  title: 'Full-Stack Product Engineer',
  avatar: '/img/avatar.jpg',
};

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/hiro2k-dev',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/pham-huy-328b041b5',
  },
  {
    name: 'Email',
    url: 'mailto:huyp26102000@gmail.com',
  },
];

const tools = [
  {
    name: 'Easy copy/paste online',
    url: 'https://easycopy.hirodev.space'
  },
  {
    name: "Posture Reminder Chrome Extension",
    url: 'https://chromewebstore.google.com/detail/posture-reminder/kiimkemiinjofphddpecefjjcjmpnhpf'
  },
  {
    name: "TU Dortmund dormitory registration reminder",
    url: 'http://t.me/tud_dorm_reminder_bot'
  },
  {
    name: "No Crop Image Bot",
    url: 'https://t.me/nocropimagebot'
  }
];

const devopsDocs = [
  {
    title: 'Docker Guide',
    url: '/docs/docker',
    description: 'Installation, Dockerfile, docker-compose basics',
  },
  {
    title: 'Deploy',
    url: '/docs/deploy-nginx',
    description: 'deploying applications with Nginx and PM2',
  },
  {
    title: 'Redis',
    url: '/docs/redis',
    description: 'In-memory data store setup and configuration',
  },
  {
    title: 'MongoDB',
    url: '/docs/mongodb',
    description: 'NoSQL database installation and usage',
  },
  {
    title: 'Node.js',
    url: '/docs/node',
    description: 'Node.js setup and configuration',
  },
  {
    title: 'Server Setup',
    url: '/docs/server',
    description: 'VPS and server configuration guide',
  },
  {
    title: 'UFW Firewall',
    url: '/docs/ufw',
    description: 'Uncomplicated Firewall setup and rules',
  },
  {
    title: 'WSL2',
    url: '/docs/wsl',
    description: 'Windows Subsystem for Linux guide',
  },
  {
    title: 'Telegram Bot',
    url: '/docs/telegram',
    description: 'Telegram bot development basics',
  },
];

function ProfileSection() {
  return (
    <section className={styles.profileSection}>
      <div className="container">
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <Heading as="h1">{profile.name}</Heading>
            <p className={styles.profileTitle}>{profile.title}</p>
          </div>
          
          <div className={styles.socialLinks}>
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}>
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolsSection() {
  return (
    <section className={styles.toolsSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          My Tools
        </Heading>
        <div className={styles.toolsGrid}>
          {tools.map((tool, idx) => (
            <a
              key={idx}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.toolCard}>
              <h3>{tool.name}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocsSection() {
  return (
    <section className={styles.docsSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          DevOps Documentation
        </Heading>
        <div className={styles.docsGrid}>
          {devopsDocs.map((doc, idx) => (
            <Link key={idx} to={doc.url} className={styles.docCard}>
              <h3>{doc.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Personal DevOps Cheatsheet and Documentation">
      <main>
        <ProfileSection />
        <ToolsSection />
        <DocsSection />
      </main>
    </Layout>
  );
}
