
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import StoryList from "../../components/StoryList";
import { selectBookmarks } from "../../lib/features/bookmarks/bookmarksSlice";
import styles from "../page.module.css";
import feedStyles from "../../components/CategoryFeed.module.css";

export default function BookmarksPage() {
  const bookmarks = useSelector(selectBookmarks);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
            <h1>Bookmarks</h1>
            <p>Stories you saved to read later.</p>
          </div>

          <span className={feedStyles.storyCount}>
            {hasMounted ? `${bookmarks.length} saved` : ""}
          </span>
        </div>

        {!hasMounted ? (
          <p className={feedStyles.emptyState}>Loading bookmarks…</p>
        ) : bookmarks.length > 0 ? (
          <StoryList stories={bookmarks} />
        ) : (
          <p className={feedStyles.emptyState}>
            No bookmarks yet. Use the bookmark button on a story to save it here.
          </p>
        )}
      </main>
    </div>
  );
}