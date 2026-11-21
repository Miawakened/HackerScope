import Link from "next/link";
import { notFound } from "next/navigation";
import CommentList from "../../../components/CommentList";
import { mockCommentsByStory } from "../../../data/mockComments";
import { mockStories } from "../../../data/mockStories";
import {
  getCommentsForStory,
  getStoryById,
} from "../../../lib/hackerNews";
import StoryHistoryTracker from "../../../components/StoryHistoryTracker";
import styles from "./page.module.css";
import StoryBookmarkButton from "../../../components/StoryBookmarkButton";

export default async function StoryPage({ params }) {
  const { id } = await params;

  const liveStory = await getStoryById(id);
  const story =
    liveStory ?? mockStories.find((item) => String(item.id) === id);

  if (!story) {
    notFound();
  }

  const comments = liveStory
    ? await getCommentsForStory(id)
    : mockCommentsByStory[id] ?? [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <span className={styles.logoMark} aria-hidden="true">
            {"</>"}
          </span>
          HackerScope
        </Link>

        <Link className={styles.backLink} href="/">
          ← Back to Top Stories
        </Link>
      </header>

      <main className={styles.main}>
      <StoryHistoryTracker story={story} />
        <article className={styles.story}>
          <p className={styles.eyebrow}>HACKERSCOPE STORY</p>
          <div className={styles.titleRow}>
            <h1>{story.title}</h1>
            <StoryBookmarkButton story={story} />
          </div>

          <p className={styles.meta}>
          {story.domain} <span>·</span> by{" "}
          {story.by && story.by !== "unknown" ? (
            <Link   className={styles.authorLink}
            href={`/users/${encodeURIComponent(story.by)}`}>
              {story.by}
            </Link>
          ) : (
            story.by
          )}{" "}
          <span>·</span>{" "}
            {story.timeAgo} <span>·</span> {story.score} points
          </p>

          <a
            className={styles.articleLink}
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read original article ↗
          </a>
        </article>

        <CommentList
          comments={comments}
          commentCount={story.commentCount}
        />
      </main>
    </div>
  );
}