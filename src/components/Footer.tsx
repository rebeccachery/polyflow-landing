import styles from "./Footer.module.css";

const links = [
  { href: "/echo", label: "Product" },
  { href: "#research", label: "Research" },
  { href: "#about", label: "About" },
  { href: "mailto:hello@polyflow.ai", label: "Contact" },
  { href: "https://github.com", label: "GitHub", external: true },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <strong>Polyflow</strong>
          <p>Speech infrastructure for the world&apos;s under-resourced languages.</p>
        </div>
        <nav className={styles.links} aria-label="Footer">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : undefined)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className={styles.copy}>© {new Date().getFullYear()} Polyflow. All rights reserved.</p>
      </div>
    </footer>
  );
}
