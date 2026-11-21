import { cacheLife } from "next/cache";
import sanitizeHtml from "sanitize-html";
const API_ROOT = "https://hacker-news.firebaseio.com/v0";

const STORY_ENDPOINTS = {
  top: "topstories",
  new: "newstories",
  best: "beststories",
  ask: "askstories",
  show: "showstories",
  jobs: "jobstories",
};

function formatTimeAgo(unixTime) {
  if (!unixTime) {
    return "time unknown";
  }

  const secondsAgo = Math.max(
    0,
    Math.floor(Date.now() / 1000) - unixTime
  );

  if (secondsAgo < 60) {
    return "just now";
  }

  const minutesAgo = Math.floor(secondsAgo / 60);

  if (minutesAgo < 60) {
    return `${minutesAgo}m ago`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);

  if (hoursAgo < 24) {
    return `${hoursAgo}h ago`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);

  if (daysAgo < 30) {
    return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  }

  if (daysAgo < 365) {
    const monthsAgo = Math.max(1, Math.floor(daysAgo / 30.4375));
    return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
  }

  const yearsAgo = Math.floor(daysAgo / 365);
  return `${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago`;
}

function getDomain(url) {
  if (!url) {
    return "news.ycombinator.com";
  }

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "news.ycombinator.com";
  }
}

function formatStory(item, category) {
  const url =
    item.url || `https://news.ycombinator.com/item?id=${item.id}`;

  return {
    id: item.id,
    title: item.title || "Untitled story",
    by: item.by || "unknown",
    timeAgo: formatTimeAgo(item.time),
    score: item.score || 0,
    commentCount: item.descendants || 0,
    domain: getDomain(item.url),
    url,
    categories: [category],
  };
}

async function fetchItem(id) {
  const response = await fetch(`${API_ROOT}/item/${id}.json`);

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function getStoryById(id) {
  const item = await fetchItem(id);

  if (!item || (item.type !== "story" && item.type !== "job")) {
    return null;
  }

  const category = item.type === "job" ? "jobs" : "top";
  return formatStory(item, category);
}

export async function getStoriesByCategory(category, limit = 8) {
  const endpoint = STORY_ENDPOINTS[category];

  if (!endpoint) {
    throw new Error(`Unknown Hacker News category: ${category}`);
  }

  const response = await fetch(`${API_ROOT}/${endpoint}.json`);

  if (!response.ok) {
    throw new Error(`Could not load Hacker News ${category} stories.`);
  }

  const storyIds = await response.json();
  const items = await Promise.all(
    storyIds.slice(0, limit).map((id) => fetchItem(id))
  );

  return items
    .filter((item) =>
      category === "jobs" ? item?.type === "job" : item?.type === "story"
    )
    .map((item) => formatStory(item, category));
}

export async function getTopStories(limit = 20) {
  return getStoriesByCategory("top", limit);
}

export async function getAllCategoryStories(limit = 8) {
  const categoryIds = Object.keys(STORY_ENDPOINTS);

  const storyGroups = await Promise.all(
    categoryIds.map((category) => getStoriesByCategory(category, limit))
  );

  const storiesById = new Map();

  storyGroups.forEach((stories, index) => {
    const category = categoryIds[index];

    stories.forEach((story) => {
      const existingStory = storiesById.get(story.id);

      if (existingStory) {
        existingStory.categories.push(category);
      } else {
        storiesById.set(story.id, story);
      }
    });
  });

  return Array.from(storiesById.values());
}

const COMMENT_SANITIZER_OPTIONS = {
  allowedTags: [
    "p",
    "a",
    "i",
    "em",
    "b",
    "strong",
    "u",
    "code",
    "pre",
    "ul",
    "ol",
    "li",
    "blockquote",
    "br",
    "hr",
    "sup",
    "sub",
  ],
  allowedAttributes: {
    a: ["href", "title"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

function sanitizeCommentHtml(html) {
  return sanitizeHtml(html || "", COMMENT_SANITIZER_OPTIONS);
}

async function fetchCommentTree(commentIds, depth = 0) {
  const limit = depth === 0 ? 10 : 2;
  const items = await Promise.all(
    commentIds.slice(0, limit).map((id) => fetchItem(id))
  );

  const visibleComments = items.filter(
    (item) => item && item.type === "comment" && !item.deleted && !item.dead
  );

  return Promise.all(
    visibleComments.map(async (item) => ({
      id: item.id,
      by: item.by || "unknown",
      timeAgo: formatTimeAgo(item.time),
      html: sanitizeCommentHtml(item.text),
      replies:
        depth === 0 && Array.isArray(item.kids)
          ? await fetchCommentTree(item.kids, depth + 1)
          : [],
    }))
  );
}

export async function getCommentsForStory(storyId) {
  const story = await fetchItem(storyId);

  if (!story || !Array.isArray(story.kids)) {
    return [];
  }

  return fetchCommentTree(story.kids);
}

export async function getUserProfile(username) {
  "use cache";
  cacheLife("hours");

  const response = await fetch(
    `${API_ROOT}/user/${encodeURIComponent(username)}.json`
  );

  if (!response.ok) {
    return null;
  }

  const user = await response.json();

  if (!user?.id) {
    return null;
  }

  const submittedIds = Array.isArray(user.submitted) ? user.submitted : [];

  const submittedItems = await Promise.all(
    submittedIds.slice(0, 40).map((id) => fetchItem(id))
  );

  const recentStories = submittedItems
    .filter(
      (item) =>
        item &&
        !item.deleted &&
        !item.dead &&
        (item.type === "story" || item.type === "job")
    )
    .sort((a, b) => (b.time || 0) - (a.time || 0))
    .slice(0, 8)
    .map((item) =>
      formatStory(item, item.type === "job" ? "jobs" : "top")
    );

  return {
    username: user.id,
    karma: user.karma ?? 0,
    createdAt: user.created ?? null,
    aboutHtml: sanitizeCommentHtml(user.about),
    recentStories,
    submittedCount: Array.isArray(user.submitted)
      ? user.submitted.length
      : 0,
  };
}