
const ALGOLIA_API_ROOT = "https://hn.algolia.com/api/v1";

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

function formatSearchHit(hit) {
  const url =
    hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;

  return {
    id: hit.objectID,
    title: hit.title || "Untitled story",
    by: hit.author || "unknown",
    timeAgo: formatTimeAgo(hit.created_at_i),
    score: hit.points || 0,
    commentCount: hit.num_comments || 0,
    domain: getDomain(hit.url),
    url,
    categories: ["top"],
  };
}

export async function searchStories(query, sortOrder = "relevance", author = "", timeRange = "all", minScore = 0, onlyWithComments = false) {
    const trimmedQuery = query.trim();
    const trimmedAuthor = author.trim();

  if (!trimmedQuery) {
    return [];
  }

  const params = new URLSearchParams({
    query: trimmedQuery,
    tags: trimmedAuthor ? `story,author_${trimmedAuthor}` : "story",
    hitsPerPage: "20",
  });

  const secondsByRange = {
    day: 24 * 60 * 60,
    week: 7 * 24 * 60 * 60,
    month: 30 * 24 * 60 * 60,
  };
  
  const numericFilters = [];
  const rangeInSeconds = secondsByRange[timeRange];
  
  if (rangeInSeconds) {
    const createdAfter =
      Math.floor(Date.now() / 1000) - rangeInSeconds;
  
    numericFilters.push(`created_at_i>${createdAfter}`);
  }
  
  const scoreThreshold = Number(minScore);
  
  if (Number.isFinite(scoreThreshold) && scoreThreshold > 0) {
    numericFilters.push(`points>=${Math.floor(scoreThreshold)}`);
  }

  if (onlyWithComments) {
    numericFilters.push("num_comments>0");
  }
  
  if (numericFilters.length > 0) {
    params.set("numericFilters", numericFilters.join(","));
  }

  const endpoint =
  sortOrder === "newest" ? "search_by_date" : "search";

const response = await fetch(`${ALGOLIA_API_ROOT}/${endpoint}?${params}`);

  if (!response.ok) {
    throw new Error("Could not search Hacker News stories.");
  }

  const data = await response.json();

  return (data.hits || []).map(formatSearchHit);
}