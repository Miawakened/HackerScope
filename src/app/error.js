
"use client";

import Link from "next/link";
import styles from "./error.module.css";

export default function ErrorPage({ retry }) {
  return (
    <main className={styles.page} role="alert">
      <section className={styles.card}>
        <p className={styles.brand}>{"</>"} HackerScope</p>
        <h1>We couldn’t load this page</h1>
        <p>
          There was a problem loading Hacker News. Check your connection and try
          again.
        </p>

        <button
          className={styles.retryButton}
          type="button"
          onClick={() => retry()}
        >
          Try again
        </button>

        <Link className={styles.backLink} href="/">
          Back to the feed
        </Link>
      </section>
    </main>
  );
}