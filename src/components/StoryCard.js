"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBookmarks,
  toggleBookmark,
} from "../lib/features/bookmarks/bookmarksSlice";
import styles from "./StoryCard.module.css";

export default function StoryCard({ story }) {
  const dispatch = useDispatch();
  const bookmarks = useSelector(selectBookmarks);
  const [hasMounted, setHasMounted] = useState(false);

useEffect(() => {
  setHasMounted(true);
}, []);

const isBookmarked =
  hasMounted &&
  bookmarks.some((item) => String(item.id) === String(story.id));

  return (
    <article className={styles.card}>
      <div className={styles.score} aria-label={`${story.score} points`}>
        <span aria-hidden="true">▲</span>
        <span>{story.score}</span>
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>
          <Link href={`/stories/${story.id}`}>{story.title}</Link>
        </h2>

        <p className={styles.domain}>{story.domain}</p>

        <p className={styles.meta}>
        <span>
            by{" "}
            {story.by && story.by !== "unknown" ? (
              <Link
                className={styles.authorLink}
                href={`/users/${encodeURIComponent(story.by)}`}
              >
                {story.by}
              </Link>
            ) : (
              story.by
            )}
          </span>
          <span aria-hidden="true">·</span>
          <span>{story.timeAgo}</span>
          <span aria-hidden="true">·</span>
          <span>{story.commentCount} comments</span>
        </p>
      </div>

      <button
        className={
          isBookmarked ? styles.bookmarkButtonActive : styles.bookmarkButton
        }
        type="button"
        disabled={!hasMounted}
        aria-pressed={isBookmarked}
        aria-label={
          isBookmarked
            ? `Remove ${story.title} from bookmarks`
            : `Bookmark ${story.title}`
        }
        onClick={() => dispatch(toggleBookmark(story))}
      >
        <svg
          className={styles.bookmarkIcon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M7 4.75h10A1.75 1.75 0 0 1 18.75 6.5V21L12 16.75 5.25 21V6.5A1.75 1.75 0 0 1 7 4.75Z" />
        </svg>
      </button>
    </article>
  );
}