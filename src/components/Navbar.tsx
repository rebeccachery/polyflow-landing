"use client";

import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

const links = [
  { href: "/echo", label: "Product" },
  { href: "#why", label: "Why Polyflow" },
  { href: "#research", label: "Research" },
  { href: "#about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.brand} aria-label="Polyflow home">
          <span className={styles.mark} aria-hidden />
          Polyflow
        </a>

        <nav className={`${styles.nav} ${open ? styles.open : ""}`} aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a
            href="#waitlist"
            className={`btn btn-primary ${styles.cta}`}
            onClick={() => setOpen(false)}
          >
            Join the waitlist →
          </a>
        </nav>

        <button
          type="button"
          className={styles.menu}
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
