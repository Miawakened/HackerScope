import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserProfile } from "../../../lib/hackerNews";
import styles from "./page.module.css";
import StoryList from "../../../components/StoryList";

export default function UserProfilePage({ params }) {
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
          ← Back to feed
        </Link>
      </header>

      <main className={styles.main}>
        <Suspense
          fallback={
            <section className={styles.profile}>
              <p className={styles.eyebrow}>HACKER NEWS USER</p>
              <p className={styles.noAbout}>Loading profile…</p>
            </section>
          }
        >
          <UserProfileContent params={params} />
        </Suspense>
      </main>
    </div>
  );
}

async function UserProfileContent({ params }) {
  const { username } = await params;
  const profile = await getUserProfile(username);

  if (!profile) {
    notFound();
  }

  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <>
      <section className={styles.profile}>
        <p className={styles.eyebrow}>HACKER NEWS USER</p>

        <div className={styles.profileHeading}>
          <div className={styles.avatar} aria-hidden="true">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <h1>{profile.username}</h1>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>Karma</span>
            <strong>{profile.karma.toLocaleString()}</strong>
          </div>
          <div className={styles.stat}>
            <span>Joined</span>
            <strong>{joinedDate}</strong>
          </div>
          <div className={styles.stat}>
            <span>Submitted items</span>
            <strong>{profile.submittedCount.toLocaleString()}</strong>
          </div>
        </div>

        <section className={styles.aboutSection}>
          <h2>About</h2>
          {profile.aboutHtml ? (
            <div
              className={styles.about}
              dangerouslySetInnerHTML={{ __html: profile.aboutHtml }}
            />
          ) : (
            <p className={styles.noAbout}>This user has no public bio.</p>
          )}
        </section>
      </section>

      <section className={styles.submissionsSection}>
        <h2>Recent stories</h2>

        {profile.recentStories.length > 0 ? (
          <StoryList stories={profile.recentStories} />
        ) : (
          <p className={styles.noStories}>
            No recent story submissions found.
          </p>
        )}
      </section>
    </>
  );
}