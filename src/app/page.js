import CategoryFeed from "../components/CategoryFeed";
import { getAllCategoryStories } from "../lib/hackerNews";
import styles from "./page.module.css";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";

export default async function Home() {
  const stories = await getAllCategoryStories(8);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="/">
          <span className={styles.logoMark} aria-hidden="true">
            {"</>"}
          </span>
          HackerScope
        </a>

        <div className={styles.headerActions}>
        <p className={styles.tagline}>A modern Hacker News browser</p>

        <ThemeToggle />

        <Link className={styles.historyLink} href="/history">
          History
        </Link>

        <Link className={styles.bookmarksLink} href="/bookmarks">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 4.75h10A1.75 1.75 0 0 1 18.75 6.5V21L12 16.75 5.25 21V6.5A1.75 1.75 0 0 1 7 4.75Z" />
          </svg>
          Bookmarks
        </Link>
      </div>
    </header>

      <main className={styles.main}>
        <CategoryFeed stories={stories} />
      </main>
    </div>
  );
}