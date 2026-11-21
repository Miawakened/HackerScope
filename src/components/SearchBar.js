
import styles from "./SearchBar.module.css";

export default function SearchBar({ query, onQueryChange }) {
  return (
    <div className={styles.search}>
      <label className={styles.label} htmlFor="story-search">
        Search stories
      </label>

      <div className={styles.inputWrapper}>
        <span className={styles.searchIcon} aria-hidden="true">
          ⌕
        </span>

        <input
          id="story-search"
          className={styles.input}
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search titles, authors, or sites"
        />

        {query && (
          <button
            className={styles.clearButton}
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}