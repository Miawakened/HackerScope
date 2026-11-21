"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import StoryList from "./StoryList";
import { searchStories } from "../lib/algoliaSearch";
import {
  selectActiveCategory,
  selectSearchQuery,
  setActiveCategory,
  setSearchQuery,
} from "../lib/features/feed/feedSlice";
import styles from "./CategoryFeed.module.css";

const categories = [
  { id: "top", label: "Top", title: "Top Stories" },
  { id: "new", label: "New", title: "New Stories" },
  { id: "best", label: "Best", title: "Best Stories" },
  { id: "ask", label: "Ask HN", title: "Ask HN" },
  { id: "show", label: "Show HN", title: "Show HN" },
  { id: "jobs", label: "Jobs", title: "Jobs" },
];

export default function CategoryFeed({ stories }) {
  const dispatch = useDispatch();
  const activeCategory = useSelector(selectActiveCategory);
  const query = useSelector(selectSearchQuery);

  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("idle");
  const [sortOrder, setSortOrder] = useState("relevance");
  const [author, setAuthor] = useState("");
  const [timeRange, setTimeRange] = useState("all");
  const [minScore, setMinScore] = useState("");
  const [onlyWithComments, setOnlyWithComments] = useState(false);

  const selectedCategory = categories.find(
    (category) => category.id === activeCategory
  );
  const normalizedQuery = query.trim();

  useEffect(() => {
    let isCurrentSearch = true;

    if (!normalizedQuery) {
      setSearchResults([]);
      setSearchStatus("idle");

      return () => {
        isCurrentSearch = false;
      };
    }

    setSearchStatus("loading");

    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchStories(normalizedQuery, sortOrder, author, timeRange, minScore, onlyWithComments);

        if (isCurrentSearch) {
          setSearchResults(results);
          setSearchStatus("success");
        }
      } catch {
        if (isCurrentSearch) {
          setSearchStatus("error");
        }
      }
    }, 350);

    return () => {
      isCurrentSearch = false;
      clearTimeout(timeoutId);
    };
  }, [normalizedQuery, sortOrder, author, timeRange, minScore, onlyWithComments]);

  const displayedStories = normalizedQuery
    ? searchResults
    : stories.filter((story) => story.categories.includes(activeCategory));

  return (
    <div className={styles.feed}>
      <SearchBar
        query={query}
        onQueryChange={(value) => dispatch(setSearchQuery(value))}
      />

    {normalizedQuery && (
      <div className={styles.sortControl}>
        <label htmlFor="search-sort">Sort results</label>
        <select
          id="search-sort"
          className={styles.sortSelect}
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        >
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
        </select>

        <label htmlFor="search-author">Author</label>
        <input
          id="search-author"
          className={styles.authorInput}
          type="text"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="Hacker News username"
          autoComplete="off"
        />

          <label htmlFor="search-time-range">Time</label>
          <select
            id="search-time-range"
            className={styles.sortSelect}
            value={timeRange}
            onChange={(event) => setTimeRange(event.target.value)}
          >
            <option value="all">All time</option>
            <option value="day">Past 24 hours</option>
            <option value="week">Past 7 days</option>
            <option value="month">Past 30 days</option>
          </select>

          <label htmlFor="min-score">Min score</label>
          <input
            id="min-score"
            className={styles.scoreInput}
            type="number"
            min="0"
            step="1"
            value={minScore}
            onChange={(event) => setMinScore(event.target.value)}
            placeholder="Any"
            aria-label="Minimum story score"
          />

        <label className={styles.checkboxControl}>
          <input
            type="checkbox"
            checked={onlyWithComments}
            onChange={(event) => setOnlyWithComments(event.target.checked)}
          />
          Only stories with comments
        </label>
      </div>
    )}

      <nav className={styles.categories} aria-label="Story categories">
        {categories.map((category) => (
          <button
            className={
              category.id === activeCategory
                ? styles.activeCategory
                : styles.category
            }
            key={category.id}
            type="button"
            aria-pressed={category.id === activeCategory}
            onClick={() => dispatch(setActiveCategory(category.id))}
          >
            {category.label}
          </button>
        ))}
      </nav>

      <section>
        <div className={styles.heading}>
          <div>
            <h1>
              {normalizedQuery ? "Search Results" : selectedCategory.title}
            </h1>
            <p>
              {normalizedQuery
                ? `Hacker News stories matching “${normalizedQuery}”.`
                : "Browse Hacker News stories by category."}
            </p>
          </div>

          <span className={styles.storyCount}>
            {normalizedQuery && searchStatus === "loading"
              ? "Searching…"
              : `${displayedStories.length} stories`}
          </span>
        </div>

        {normalizedQuery && searchStatus === "loading" ? (
          <p className={styles.emptyState}>Searching Hacker News…</p>
        ) : normalizedQuery && searchStatus === "error" ? (
          <p className={styles.emptyState}>
            Search failed. Please try again.
          </p>
        ) : displayedStories.length > 0 ? (
          <StoryList stories={displayedStories} />
        ) : (
          <p className={styles.emptyState}>
            {normalizedQuery
              ? `No stories match “${normalizedQuery}”. Try another search.`
              : "There are no stories in this category yet."}
          </p>
        )}
      </section>
    </div>
  );
}