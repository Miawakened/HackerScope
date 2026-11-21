
import StoryCard from "./StoryCard";
import styles from "./StoryList.module.css";

export default function StoryList({ stories }) {
  return (
    <section aria-label="Hacker News stories">
      <ul className={styles.list}>
        {stories.map((story) => (
          <li key={story.id}>
            <StoryCard story={story} />
          </li>
        ))}
      </ul>
    </section>
  );
}