"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useReveal } from "@/hooks/useReveal";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import styles from "./Waitlist.module.css";

const WAITLIST_TABLE = "waitlist";

export default function Waitlist() {
  const ref = useReveal<HTMLElement>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);

  async function handleWaitlistSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSupabaseConfigured || !supabase) {
      toast.error("Contact form is not configured yet.");
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      toast.error("Please enter your name and email.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from(WAITLIST_TABLE).insert({
      name: trimmedName,
      email: trimmedEmail,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(
        error.code === "23505"
          ? "That email is already on the waitlist."
          : "Could not join the waitlist. Please try again."
      );
      return;
    }

    setJoined(true);
    setName("");
    setEmail("");
  }

  return (
    <section className={`reveal ${styles.section}`} ref={ref} id="waitlist">
      <div className="container">
        <div className={styles.panel}>
          <div className={styles.copy}>
            <p className={`${styles.eyebrow} mono`}>Early access</p>
            <h2>Help us build the future of language AI.</h2>
            <p>Be among the first to experience Polyflow.</p>
          </div>

          {joined ? (
            <div className={styles.success} role="status">
              <div className={styles.wave} aria-hidden>
                {Array.from({ length: 18 }).map((_, index) => (
                  <span key={index} style={{ animationDelay: `${index * 40}ms` }} />
                ))}
              </div>
              <h3>You&apos;re in. 🇭🇹</h3>
              <p>We&apos;ll let you know when Polyflow is ready for you.</p>
              <p className={`${styles.phrase} mono`}>N ap wè pita</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleWaitlistSubmit}>
              <label>
                <span className="sr-only">Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  disabled={isSubmitting}
                  autoComplete="name"
                />
              </label>
              <label>
                <span className="sr-only">Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Joining…" : "Join the waitlist →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
