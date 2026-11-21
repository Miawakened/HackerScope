
import Link from "next/link";
import styles from "./error.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.brand}>{"</>"} HackerScope</p>
        <h1>Story not found</h1>
        <p>
          This story may no longer be available, or the link may be incorrect.
        </p>

        <Link className={styles.backLink} href="/">
          Back to the feed
        </Link>
      </section>
    </main>
  );
}