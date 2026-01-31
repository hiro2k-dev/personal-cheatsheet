import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import Heading from '@theme/Heading';
import styles from './index.module.css';

// Thông tin cá nhân - TỰ ĐIỀN
const profile = {
  name: 'Hiro',
  title: 'Full-Stack Product Engineer',
  // description: 'Passionate about automation, cloud infrastructure, and continuous delivery. Building and maintaining scalable systems.',
  avatar: '/img/avatar.jpg', // Đặt ảnh của bạn vào static/img/
};

// Social Media Links - TỰ ĐIỀN
const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/hiro2k-dev',
    // icon: '💻',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/pham-huy-328b041b5',
    // icon: '💼',
  },
  // {
  //   name: 'Twitter',
  //   url: 'https://twitter.com/yourusername',
  //   icon: '🐦',
  // },
  {
    name: 'Email',
    url: 'mailto:huyp26102000@gmail.com',
    // icon: '📧',
  },
];

const tools = [
  {
    name: 'Docker',
    url: 'https://www.docker.com/',
    description: 'Containerization platform',
  },
  {
    name: 'Redis',
    url: 'https://redis.io/',
    description: 'In-memory data structure store',
  },
  {
    name: 'MongoDB',
    url: 'https://www.mongodb.com/',
    description: 'NoSQL database',
  },
  {
    name: 'Node.js',
    url: 'https://nodejs.org/',
    description: 'JavaScript runtime',
  },
  {
    name: 'Nginx',
    url: 'https://nginx.org/',
    description: 'Web server and reverse proxy',
  },
  {
    name: 'Git',
    url: 'https://git-scm.com/',
    description: 'Version control system',
  },
];

const devopsDocs = [
  {
    title: 'Docker Guide',
    url: '/docs/docker',
    description: 'Installation, Dockerfile, docker-compose basics',
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
