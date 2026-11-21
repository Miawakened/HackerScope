
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import StoryList from "../../components/StoryList";
import {
  selectHistory,
  selectHistoryHydrated,
} from "../../lib/features/history/historySlice";
import styles from "../page.module.css";
import feedStyles from "../../components/CategoryFeed.module.css";

export default function HistoryPage() {
  const history = useSelector(selectHistory);
  const historyIsHydrated = useSelector(selectHistoryHydrated);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const historyIsReady = hasMounted && historyIsHydrated;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <span className={styles.logoMark} aria-hidden="true">
            {"</>"}
          </span>
          HackerScope
        </Link>

        <Link className={styles.tagline} href="/">
          ← Back to feed
        </Link>
      </header>

      <main className={styles.main}>
        <div className={feedStyles.heading}>
          <div>
            <h1>Reading history</h1>
            <p>Stories you’ve opened, with the most recent first.</p>
          </div>

          <span className={feedStyles.storyCount}>
            {historyIsReady ? `${history.length} visited` : ""}
          </span>
        </div>

        {!historyIsReady ? (
          <p className={feedStyles.emptyState}>Loading reading history…</p>
        ) : history.length > 0 ? (
          <StoryList stories={history} />
        ) : (
          <p className={feedStyles.emptyState}>
            No reading history yet. Open a story and it will appear here.
          </p>
        )}
      </main>
    </div>
  );
}